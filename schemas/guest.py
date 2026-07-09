from typing import Optional

from pydantic import BaseModel, Field


class GuestRegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=8, max_length=20)
    address: Optional[str] = Field(default=None, max_length=255)


class GuestLoginRequest(BaseModel):
    phone: str = Field(min_length=8, max_length=20)