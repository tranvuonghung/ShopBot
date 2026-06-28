from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.order import Order
from models.guest import Guest
from models.order_detail import OrderDetail
from models.product import Product

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
            "guest_name": guest.name,
            "phone": guest.phone,
            "address": guest.address,
            "status": order.status,
            "total_price": order.total_price,
            "note": order.note,
            "items": items
        })

    return result