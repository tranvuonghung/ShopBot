from pydantic import BaseModel

class OrderResponse(BaseModel):
    id: int
    guest_name: str
    phone: str
    total_price: float
    status: str
    note: str

    class Config:
        from_attributes = True