from sqlalchemy import Column, func
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from database import Base

class Payment(Base):
    __tablename__ = "payment"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    method = Column(String(50))

    status = Column(
        String(50),
        default="pending"
    )

    paid_at = Column(DateTime)

    qr_code = Column(String(500))

    transaction_id = Column(String(100))

    amount = Column(Float)

    created_at = Column(
        DateTime,
        default=func.now()
    )