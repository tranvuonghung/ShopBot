from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.order import OrderCreateRequest, OrderStatusUpdateRequest
from datetime import datetime

from database import get_db
from models.order import Order
from models.guest import Guest
from models.order_detail import OrderDetail
from models.product import Product
from schemas.order import OrderCreateRequest
from models.payment import Payment 

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.get("/")
def get_orders(db: Session = Depends(get_db)):

    orders = db.query(Order).all()

    result = []

    for order in orders:

        guest = (
            db.query(Guest)
            .filter(Guest.id == order.guest_id)
            .first()
        )

        details = (
            db.query(OrderDetail, Product)
            .join(Product, Product.id == OrderDetail.product_id)
            .filter(OrderDetail.order_id == order.id)
            .all()
        )

        items = []

        for detail, product in details:
            items.append({
                "product_name": product.name,
                "quantity": detail.quantity,
                "price": detail.price
            })

        result.append({
            "id": order.id,
            "order_code": order.order_code,
            "guest_name": guest.name,
            "phone": guest.phone,
            "address": guest.address,
            "status": order.status,
            "total_price": order.total_price,
            "note": order.note,
            "items": items
        })

    return result

@router.post("/")
def create_order(data: OrderCreateRequest, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == data.guest_id).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy thông tin khách hàng. Vui lòng đăng ký/đăng nhập lại."
        )

    if not data.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng đang trống.")

    order = Order(
        guest_id=guest.id,
        total_price=0,
        status="pending",
        note=data.note,
    )
    db.add(order)
    db.flush()  # để có order.id trước khi commit, dùng cho order_detail
    order.order_code = f"DH{order.id:06d}"
    db.commit()
    db.refresh(order)


    total_price = 0
    order_items_result = []

    for item in data.items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            db.rollback()
            raise HTTPException(
                status_code=404,
                detail=f"Không tìm thấy sản phẩm id={item.product_id}."
            )

        if (product.quantity or 0) < item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Sản phẩm '{product.name}' chỉ còn {product.quantity or 0} phần, không đủ số lượng bạn đặt."
            )

        # Lấy giá hiện tại từ DB (không tin giá gửi từ client) để tránh gian lận giá
        line_price = product.price
        total_price += line_price * item.quantity

        detail = OrderDetail(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=line_price,
        )
        db.add(detail)

        # Trừ số lượng tồn kho, không cho xuống dưới 0
        product.quantity = max(0, (product.quantity or 0) - item.quantity)
        if product.quantity == 0:
            product.status = "Hết hàng"

        order_items_result.append({
            "product_name": product.name,
            "quantity": item.quantity,
            "price": line_price,
        })

    order.total_price = total_price
    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "order": {
            "id": order.id,
            "order_code": order.order_code,
            "guest_name": guest.name,
            "phone": guest.phone,
            "address": guest.address,
            "status": order.status,
            "total_price": order.total_price,
            "note": order.note,
            "items": order_items_result,
        }
    }

@router.get("/{order_id}")
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    guest = db.query(Guest).filter(Guest.id == order.guest_id).first()
    details = (
        db.query(OrderDetail, Product)
        .join(Product, Product.id == OrderDetail.product_id)
        .filter(OrderDetail.order_id == order.id)
        .all()
    )
    items = [
        {"product_name": p.name, "quantity": d.quantity, "price": d.price}
        for d, p in details
    ]

    latest_payment = (
        db.query(Payment)
        .filter(Payment.order_id == order.id)
        .order_by(Payment.created_at.desc())
        .first()
    )

    return {
        "id": order.id,
        "order_code": order.order_code,
        "guest_name": guest.name if guest else None,
        "status": order.status,                                   # trạng thái đơn hàng (pending/completed...)
        "payment_status": latest_payment.status if latest_payment else "pending",  # trạng thái thanh toán
        "total_price": order.total_price,
        "note": order.note,
        "items": items,
    }


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdateRequest,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    order.status = data.status

    if data.status == "success":
        latest_payment = (
            db.query(Payment)
            .filter(Payment.order_id == order.id)
            .order_by(Payment.created_at.desc())
            .first()
        )

        if latest_payment:
            # Đã có payment (VD Momo) -> cập nhật lại thành success
            latest_payment.status = "success"
            latest_payment.paid_at = datetime.now()
        else:
            # Chưa có payment nào (VD chưa gọi Momo, hoặc Momo lỗi) -> tạo mới
            new_payment = Payment(
                order_id=order.id,
                method="manual",
                status="success",
                amount=order.total_price,
                paid_at=datetime.now(),
            )
            db.add(new_payment)

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "order": {
            "id": order.id,
            "order_code": order.order_code,
            "status": order.status,
        }
    }