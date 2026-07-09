from typing import List, Optional
from pydantic import BaseModel, Field

class OrderResponse(BaseModel):
    id: int
    order_code: Optional[str] = None
    guest_name: str
    phone: str
    total_price: float
    status: str
    note: str

class OrderStatusUpdateRequest(BaseModel):
    status: str

class Config:
    from_attributes = True

class OrderItemInput(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreateRequest(BaseModel):
    guest_id: int
    note: Optional[str] = None
    items: List[OrderItemInput]
