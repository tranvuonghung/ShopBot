import random

from models.order import Order
from models.order_detail import OrderDetail
from models.product import Product


def seed_order_detail(db):

    if db.query(OrderDetail).count() > 0:
        return

    random.seed(43)

    products = db.query(Product).all()
    orders = db.query(Order).all()

    details = []

    for order in orders:
        item_count = random.randint(1, 4)
        chosen_products = random.sample(products, k=min(item_count, len(products)))

        order_total = 0
        for product in chosen_products:
            quantity = random.randint(1, 3)
            details.append(
                OrderDetail(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=quantity,
                    price=product.price
                )
            )
            order_total += quantity * product.price

        order.total_price = order_total

    db.add_all(details)
    db.commit()

    print(f"Seed OrderDetail thành công ({len(details)} dòng chi tiết)")