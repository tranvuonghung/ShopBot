import random

from models.cart import Cart
from models.guest import Guest
from models.product import Product


def seed_cart(db):

    if db.query(Cart).count() > 0:
        return

    random.seed(45)

    guest_ids = [g.id for g in db.query(Guest).all()][:8]
    product_ids = [p.id for p in db.query(Product).all()]

    carts = []
    for guest_id in guest_ids:
        for product_id in random.sample(product_ids, k=random.randint(1, 3)):
            carts.append(
                Cart(
                    guest_id=guest_id,
                    product_id=product_id,
                    quantity=random.randint(1, 3)
                )
            )

    db.add_all(carts)
    db.commit()

    print(f"Seed Cart thành công ({len(carts)} dòng)")