from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from database import Base

class Guest(Base):
    __tablename__ = "guest"

    id = Column(Integer, primary_key=True, index=True)

    guest_code = Column(
        String(50),
        unique=True,
        nullable=False
    )

    name = Column(String(100))

    phone = Column(String(20))

    address = Column(String(255))

    created_at = Column(
        DateTime,
        default=func.now()
    )