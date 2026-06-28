from models.cart import Cart

def seed_cart(db):

    if db.query(Cart).count() > 0:
        return

    carts = [

        Cart(
            guest_id=1,
            product_id=1,
            quantity=2
        ),

        Cart(
            guest_id=1,
            product_id=5,
            quantity=1
        ),

        Cart(
            guest_id=2,
            product_id=3,
            quantity=2
        ),

        Cart(
            guest_id=3,
            product_id=7,
            quantity=1
        )

    ]

    db.add_all(carts)
    db.commit()

    print("Seed Cart thành công")