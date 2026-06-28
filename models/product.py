from sqlalchemy import Column, DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func


from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)

    price = Column(Float, nullable=False)

    description = Column(Text)

    image = Column(String(255))

    category_id = Column(
        Integer,
        ForeignKey("category.id")
    )

    quantity = Column(Integer, default=0)

    status = Column(String(50), default="available")

    created_at = Column(
        DateTime,
        default=func.now()
    )