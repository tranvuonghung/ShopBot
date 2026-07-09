from models.guest import Guest

GUEST_DATA = [
    ("Nguyễn Văn A", "0901111111", "Quận 1"),
    ("Trần Thị B", "0902222222", "Quận 7"),
    ("Lê Văn C", "0903333333", "Thủ Đức"),
    ("Phạm Thị D", "0904444444", "Quận 3"),
    ("Hoàng Văn E", "0905555555", "Quận 10"),
    ("Vũ Thị F", "0906666666", "Bình Thạnh"),
    ("Đặng Văn G", "0907777777", "Gò Vấp"),
    ("Bùi Thị H", "0908888888", "Tân Bình"),
    ("Đỗ Văn I", "0909999999", "Phú Nhuận"),
    ("Ngô Thị K", "0910000001", "Quận 2"),
    ("Dương Văn L", "0910000002", "Quận 4"),
    ("Lý Thị M", "0910000003", "Quận 5"),
    ("Phan Văn N", "0910000004", "Quận 6"),
    ("Trịnh Thị O", "0910000005", "Quận 8"),
    ("Đinh Văn P", "0910000006", "Quận 9"),
    ("Tô Thị Q", "0910000007", "Quận 11"),
    ("Mai Văn R", "0910000008", "Quận 12"),
    ("Chu Thị S", "0910000009", "Bình Tân"),
    ("Lâm Văn T", "0910000010", "Nhà Bè"),
    ("Hà Thị U", "0910000011", "Củ Chi"),
    ("Kiều Văn V", "0910000012", "Hóc Môn"),
    ("Vương Thị X", "0910000013", "Cần Giờ"),
    ("Tăng Văn Y", "0910000014", "Thủ Đức"),
    ("Quách Thị Z", "0910000015", "Quận 1"),
    ("Từ Văn W", "0910000016", "Quận 7"),
]

def seed_guest(db):

    if db.query(Guest).count() > 0:
        return

    guests = [
        Guest(
            guest_code=f"Guest_{1000 + i + 1}",
            name=name,
            phone=phone,
            address=address
        )
        for i, (name, phone, address) in enumerate(GUEST_DATA)
    ]

    db.add_all(guests)
    db.commit()

    print(f"Seed Guest thành công ({len(guests)} khách)")