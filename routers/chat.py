from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.chat import Chat
from models.guest import Guest
from schemas.chat import ChatMessageCreate

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


def _chat_to_dict(chat: Chat) -> dict:
    return {
        "id": chat.id,
        "guest_id": chat.guest_id,
        "sender_type": chat.sender_type,
        "message": chat.message,
        "created_at": chat.created_at,
    }


@router.get("/conversations")
def get_conversations(db: Session = Depends(get_db)):
    """
    Danh sách hội thoại, mỗi khách 1 dòng, sắp theo tin nhắn mới nhất.
    Dùng để phân biệt từng khách đang nhắn bên Admin.
    """
    last_ids = (
        db.query(
            Chat.guest_id,
            func.max(Chat.id).label("last_id")
        )
        .group_by(Chat.guest_id)
        .subquery()
    )

    rows = (
        db.query(Chat, Guest)
        .join(last_ids, Chat.id == last_ids.c.last_id)
        .join(Guest, Guest.id == Chat.guest_id)
        .order_by(Chat.created_at.desc())
        .all()
    )

    result = []
    for chat, guest in rows:
        unread_count = (
            db.query(Chat)
            .filter(
                Chat.guest_id == guest.id,
                Chat.sender_type == "guest",
                Chat.is_read == False,
            )
            .count()
        )
        result.append({
            "guest_id": guest.id,
            "guest_name": guest.name,
            "guest_code": guest.guest_code,
            "last_message": chat.message,
            "last_sender_type": chat.sender_type,
            "last_time": chat.created_at,
            "unread_count": unread_count,
        })

    return result


@router.get("/{guest_id}")
def get_messages(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng.")

    messages = (
        db.query(Chat)
        .filter(Chat.guest_id == guest_id)
        .order_by(Chat.created_at.asc(), Chat.id.asc())
        .all()
    )

    # Admin mở hội thoại -> đánh dấu đã đọc tin từ khách
    db.query(Chat).filter(
        Chat.guest_id == guest_id,
        Chat.sender_type == "guest",
        Chat.is_read == False,
    ).update({"is_read": True})
    db.commit()

    return [_chat_to_dict(m) for m in messages]


@router.post("/{guest_id}/guest")
def send_message_as_guest(guest_id: int, data: ChatMessageCreate, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng.")

    chat = Chat(guest_id=guest_id, sender_type="guest", message=data.message, is_read=False)
    db.add(chat)
    db.commit()
    db.refresh(chat)

    return _chat_to_dict(chat)


@router.post("/{guest_id}/admin")
def send_message_as_admin(guest_id: int, data: ChatMessageCreate, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng.")

    chat = Chat(guest_id=guest_id, sender_type="admin", message=data.message, is_read=True)
    db.add(chat)
    db.commit()
    db.refresh(chat)

    return _chat_to_dict(chat)