from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from database import Base

class Chat(Base):
    __tablename__ = "chat"

    id = Column(Integer, primary_key=True, index=True)

    guest_id = Column(
        Integer,
        ForeignKey("guest.id")
    )

    sender_type = Column(String(20))

    message = Column(Text)

    created_at = Column(
        DateTime,
        default=func.now()
    )