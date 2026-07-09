from pathlib import Path

from dotenv import set_key
from fastapi import APIRouter, Depends, HTTPException

import config
from schemas.auth import LoginRequest, ChangePasswordRequest
from security import (
    verify_password,
    create_access_token,
    hash_password,
    get_current_admin,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"


@router.post("/login")
def login(data: LoginRequest):

    if data.email != config.ADMIN_EMAIL or not verify_password(
        data.password, config.ADMIN_PASSWORD_HASH
    ):
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng."
        )

    token = create_access_token(data={"sub": data.email, "role": "admin"})

    return {
        "success": True,
        "token": token,
        "token_type": "bearer",
        "admin": {
            "email": config.ADMIN_EMAIL
        }
    }

@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_admin: dict = Depends(get_current_admin),
):
    # Dùng 400 (không phải 401) cho lỗi này, vì 401 được frontend
    # hiểu là "phiên đăng nhập hết hạn" và sẽ tự động đăng xuất.
    # Ở đây token vẫn hợp lệ, chỉ là gõ sai mật khẩu hiện tại.
    if not verify_password(data.current_password, config.ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=400,
            detail="Mật khẩu hiện tại không đúng."
        )

    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=400,
            detail="Mật khẩu mới phải khác mật khẩu hiện tại."
        )

    new_hash = hash_password(data.new_password)

    # Ghi mật khẩu mới xuống file .env để giữ nguyên sau khi restart server
    set_key(str(ENV_PATH), "ADMIN_PASSWORD_HASH", new_hash)

    # Cập nhật luôn giá trị đang chạy trong bộ nhớ, để lần đăng nhập
    # tiếp theo dùng mật khẩu mới ngay, không cần restart server.
    config.ADMIN_PASSWORD_HASH = new_hash

    return {
        "success": True,
        "message": "Đổi mật khẩu thành công."
    }