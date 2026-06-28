from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

from models.category import Category
from models.product import Product
from models.guest import Guest
from models.cart import Cart
from models.order import Order
from models.order_detail import OrderDetail
from models.payment import Payment
from models.chat import Chat
from routers.dashboard import router as dashboard_router
from routers.product import router as product_router
from routers.order import router as order_router



Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(product_router)
app.include_router(order_router)


@app.get("/")
def root():
    return {
        "message": "Food Order API Running"
    }

