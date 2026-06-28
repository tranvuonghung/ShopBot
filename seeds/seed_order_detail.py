from models.order_detail import OrderDetail

def seed_order_detail(db):

    if db.query(OrderDetail).count() > 0:
        return

    details = [

        OrderDetail(
            order_id=1,
            product_id=1,
            quantity=2,
            price=50000
        ),

        OrderDetail(
            order_id=1,
            product_id=5,
            quantity=1,
            price=15000
        ),

        OrderDetail(
            order_id=2,
            product_id=3,
            quantity=2,
            price=55000
        ),

        OrderDetail(
            order_id=3,
            product_id=7,
            quantity=1,
            price=199000
        ),

        OrderDetail(
            order_id=4,
            product_id=2,
            quantity=3,
            price=65000
        ),

        OrderDetail(
            order_id=5,
            product_id=1,
            quantity=1,
            price=50000
        )

    ]

    db.add_all(details)
    db.commit()

    print("Seed OrderDetail thành công")