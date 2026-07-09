import random
from datetime import timedelta

from models.order import Order
from models.payment import Payment

METHODS = ["QR", "momo", "Cash"]
DONE_STATUSES = {"đã giao", "success"}
CANCELLED_STATUSES = {"đã huỷ"}


def seed_payment(db):

    if db.query(Payment).count() > 0:
        return

    random.seed(44)

    orders = db.query(Order).all()
    payments = []

    for order in orders:
        method = random.choice(METHODS)

        if order.status in DONE_STATUSES:
            status = "success"
            paid_at = order.created_at + timedelta(minutes=random.randint(5, 60))
        elif order.status in CANCELLED_STATUSES:
            status = "failed"
            paid_at = None
        else:
            status = "pending"
            paid_at = None

        payments.append(
            Payment(
                order_id=order.id,
                method=method,
                status=status,
                amount=order.total_price,
                paid_at=paid_at,
                transaction_id=f"TXN{order.id:04d}",
                momo_order_id=f"{order.id}-{random.randint(1000, 9999):x}" if method == "momo" else None
            )
        )

    db.add_all(payments)
    db.commit()

    print(f"Seed Payment thành công ({len(payments)} giao dịch)")