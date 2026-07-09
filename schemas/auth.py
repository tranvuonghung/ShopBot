from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6, description="Mật khẩu mới, tối thiểu 6 ký tự")