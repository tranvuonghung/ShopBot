from models.order import Order

def seed_order(db):

    if db.query(Order).count() > 0:
        return

    orders = [

        Order(
            guest_id=1,
            total_price=115000,
            status="chờ xác nhận",
            note="Ít cay"
        ),

        Order(
            guest_id=2,
            total_price=135000,
            status="xác nhận",
            note="Không hành"
        ),

        Order(
            guest_id=3,
            total_price=199000,
            status="chờ xác nhận",
            note=""
        ),

        Order(
            guest_id=1,
            total_price=215000,
            status="đang giao",
            note="Giao nhanh"
        ),

        Order(
            guest_id=2,
            total_price=99000,
            status="đã giao",
            note=""
        )

    ]

    db.add_all(orders)
    db.commit()

    print("Seed Order thành công")