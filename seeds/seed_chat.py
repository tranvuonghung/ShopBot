from models.chat import Chat

CONVERSATIONS = [
    ("Xin chào, quán còn mở cửa không?", "Quán mở cửa từ 7h00 đến 22h00."),
    ("Đơn hàng của tôi tới đâu rồi?", "Đơn hàng đang được giao."),
    ("Burger bò còn hàng không?", "Burger bò hiện đang còn hàng."),
    ("Có ship đến Thủ Đức không?", "Dạ có, quán ship toàn TP.HCM."),
    ("Cho mình hỏi combo gia đình có mấy món?", "Combo gia đình gồm gà rán, burger, nước ngọt và khoai tây chiên."),
    ("Thanh toán bằng Momo được không?", "Dạ được, quán hỗ trợ Momo và tiền mặt."),
    ("Mì cay bao giờ có hàng lại?", "Dự kiến 2 ngày nữa sẽ có hàng lại ạ."),
    ("Đặt trước cho 20 người được không?", "Dạ được, anh/chị vui lòng đặt trước ít nhất 2 tiếng."),
]

SENDER_CYCLE = ["guest", "bot"]


def seed_chat(db):

    if db.query(Chat).count() > 0:
        return

    chats = []
    guest_count = 25

    for i, (question, answer) in enumerate(CONVERSATIONS):
        guest_id = (i % guest_count) + 1
        chats.append(Chat(guest_id=guest_id, sender_type="guest", message=question))
        chats.append(Chat(guest_id=guest_id, sender_type="bot", message=answer))

    db.add_all(chats)
    db.commit()

    print(f"Seed Chat thành công ({len(chats)} tin nhắn)")