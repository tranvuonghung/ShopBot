import random
from datetime import datetime, timedelta

from models.order import Order
from models.guest import Guest

STATUS_POOL = (
    ["chờ xác nhận"] * 3 +
    ["xác nhận"] * 4 +
    ["đang giao"] * 4 +
    ["đã giao"] * 8 +
    ["success"] * 6 +
    ["đã huỷ"] * 2
)

NOTES = [
    "", "", "", "Ít cay", "Không hành", "Giao nhanh giúp mình",
    "Thêm tương ớt", "Không đá", "Giao trước 12h", "Gọi trước khi giao"
]


def seed_order(db):

    if db.query(Order).count() > 0:
        return

    random.seed(42)

    guest_ids = [g.id for g in db.query(Guest).all()]
    now = datetime.now()

    orders = []
    for _ in range(80):
        random_time = now - timedelta(
            days=random.randint(0, 13),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )

        orders.append(
            Order(
                guest_id=random.choice(guest_ids),
                total_price=0,  # sẽ được cập nhật lại ở seed_order_detail
                status=random.choice(STATUS_POOL),
                note=random.choice(NOTES),
                created_at=random_time
            )
        )

    db.add_all(orders)
    db.flush()

    for order in orders:
        order.order_code = f"DH{order.id:06d}"

    db.commit()

    print(f"Seed Order thành công ({len(orders)} đơn hàng)")