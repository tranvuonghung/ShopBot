from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from database import get_db
from models.order import Order
from models.product import Product
from models.guest import Guest
from models.payment import Payment

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


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
        .filter(Product.status == "available")
        .count()
    )

    total_customers = db.query(Guest).count()

    pending_orders = (
        db.query(Order)
        .filter(Order.status == "pending")
        .count()
    )

    completed_orders = (
        db.query(Order)
        .filter(Order.status == "completed")
        .count()
    )

    successful_payments = (
        db.query(Payment)
        .filter(Payment.status == "success")
        .count()
    )

    avg_order_value = (
        db.query(func.avg(Order.total_price))
        .scalar()
    ) or 0

    return {
        "revenue_today": revenue_today,
        "total_orders": total_orders,
        "total_products": total_products,
        "total_customers": total_customers,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "successful_payments": successful_payments,
        "avg_order_value": round(avg_order_value, 2)
    }