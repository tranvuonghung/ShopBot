from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from database import get_db
from models.order import Order
from models.order_detail import OrderDetail
from models.product import Product
from models.guest import Guest
from models.payment import Payment

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

DONE_STATUSES = ["đã giao", "success"]
IN_PROGRESS_STATUSES = ["chờ xác nhận", "xác nhận", "đang giao"]
CANCELLED_STATUSES = ["đã huỷ", "huỷ", "failed"]


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):

    today = date.today()

    revenue_today = (
        db.query(func.sum(Order.total_price))
        .filter(func.date(Order.created_at) == today)
        .scalar()
    ) or 0

    total_orders = db.query(Order).count()

    total_products = (
        db.query(Product)
        .filter(Product.status != "Hết hàng")
        .count()
    )

    total_customers = db.query(Guest).count()

    pending_orders = (
        db.query(Order)
        .filter(Order.status.in_(IN_PROGRESS_STATUSES))
        .count()
    )

    completed_orders = (
        db.query(Order)
        .filter(Order.status.in_(DONE_STATUSES))
        .count()
    )

    cancelled_orders = (
        db.query(Order)
        .filter(Order.status.in_(CANCELLED_STATUSES))
        .count()
    )

    successful_payments = (
        db.query(Payment)
        .filter(Payment.status == "success")
        .count()
    )

    avg_order_value = (
        db.query(func.avg(Order.total_price)).scalar()
    ) or 0

    # Doanh thu 7 ngày gần nhất
    revenue_last_7_days = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        total = (
            db.query(func.sum(Order.total_price))
            .filter(func.date(Order.created_at) == day)
            .scalar()
        ) or 0
        revenue_last_7_days.append({
            "date": day.strftime("%d/%m"),
            "revenue": total
        })

    # Phân bố trạng thái đơn hàng
    status_counts = (
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    status_breakdown = [
        {"status": status, "count": count} for status, count in status_counts
    ]

    # 5 đơn hàng gần nhất
    recent_orders_query = (
        db.query(Order, Guest)
        .join(Guest, Guest.id == Order.guest_id)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )
    recent_orders = [
        {
            "order_code": order.order_code,
            "guest_name": guest.name,
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at.strftime("%d/%m/%Y %H:%M") if order.created_at else None,
        }
        for order, guest in recent_orders_query
    ]

    # Top 5 món bán chạy
    top_products_query = (
        db.query(Product.name, func.sum(OrderDetail.quantity).label("sold"))
        .join(OrderDetail, OrderDetail.product_id == Product.id)
        .group_by(Product.name)
        .order_by(func.sum(OrderDetail.quantity).desc())
        .limit(5)
        .all()
    )
    top_products = [
        {"name": name, "sold": int(sold)} for name, sold in top_products_query
    ]

    return {
        "revenue_today": revenue_today,
        "total_orders": total_orders,
        "total_products": total_products,
        "total_customers": total_customers,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "cancelled_orders": cancelled_orders,
        "successful_payments": successful_payments,
        "avg_order_value": round(avg_order_value, 2),
        "revenue_last_7_days": revenue_last_7_days,
        "status_breakdown": status_breakdown,
        "recent_orders": recent_orders,
        "top_products": top_products,
    }
