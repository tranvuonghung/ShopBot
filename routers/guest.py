import time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.guest import Guest
from schemas.guest import GuestRegisterRequest, GuestLoginRequest

router = APIRouter(
    prefix="/guest",
    tags=["Guest"]
)


def _guest_to_dict(guest: Guest) -> dict:
    return {
        "id": guest.id,
        "guest_code": guest.guest_code,
        "name": guest.name,
        "phone": guest.phone,
        "address": guest.address,
    }


@router.post("/register")
def register_guest(data: GuestRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(Guest).filter(Guest.phone == data.phone).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Số điện thoại này đã đăng ký trước đó. Vui lòng dùng mục 'Đã có tài khoản' để tiếp tục.",
        )

    guest_code = f"Guest_{int(time.time())}"

    guest = Guest(
        guest_code=guest_code,
        name=data.name,
        phone=data.phone,
        address=data.address,
    )
    db.add(guest)
    db.commit()
    db.refresh(guest)

    return {"success": True, "guest": _guest_to_dict(guest)}


@router.post("/login")
def login_guest(data: GuestLoginRequest, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.phone == data.phone).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy tài khoản với số điện thoại này. Vui lòng đăng ký mới.",
        )

    return {"success": True, "guest": _guest_to_dict(guest)}