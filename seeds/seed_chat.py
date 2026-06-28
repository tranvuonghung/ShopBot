from models.chat import Chat

def seed_chat(db):

    if db.query(Chat).count() > 0:
        return

    chats = [

        Chat(
            guest_id=1,
            sender_type="guest",
            message="Xin chào, quán còn mở cửa không?"
        ),

        Chat(
            guest_id=1,
            sender_type="bot",
            message="Quán mở cửa từ 7h00 đến 22h00."
        ),

        Chat(
            guest_id=2,
            sender_type="guest",
            message="Đơn hàng của tôi tới đâu rồi?"
        ),

        Chat(
            guest_id=2,
            sender_type="admin",
            message="Đơn hàng đang được giao."
        ),

        Chat(
            guest_id=3,
            sender_type="guest",
            message="Burger bò còn hàng không?"
        ),

        Chat(
            guest_id=3,
            sender_type="bot",
            message="Burger bò hiện đang còn hàng."
        )

    ]

    db.add_all(chats)
    db.commit()

    print("Seed Chat thành công")