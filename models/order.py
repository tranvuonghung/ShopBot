from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    guest_id = Column(
        Integer,
        ForeignKey("guest.id")
    )

    total_price = Column(Float, default=0)

    status = Column(
        String(50),
        default="pending"
    )

    note = Column(String(500))

    created_at = Column(
        DateTime,
        default=func.now()
    )