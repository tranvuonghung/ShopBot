from database import SessionLocal

from seeds.seed_category import seed_category
from seeds.seed_product import seed_product
from seeds.seed_guest import seed_guest
from seeds.seed_cart import seed_cart
from seeds.seed_order import seed_order
from seeds.seed_order_detail import seed_order_detail
from seeds.seed_payment import seed_payment
from seeds.seed_chat import seed_chat

db = SessionLocal()

seed_category(db)
seed_product(db)
seed_guest(db)
seed_cart(db)
seed_order(db)
seed_order_detail(db)
seed_payment(db)
seed_chat(db)

db.close()

print("Hoàn thành seed dữ liệu")