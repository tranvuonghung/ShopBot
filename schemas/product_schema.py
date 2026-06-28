from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    price: float
    description: str
    image: str
    category_id: int
    quantity: int
    status: str


class ProductUpdate(BaseModel):
    name: str
    price: float
    description: str
    image: str
    category_id: int
    quantity: int
    status: str