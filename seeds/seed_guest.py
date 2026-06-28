from models.guest import Guest

def seed_guest(db):

    if db.query(Guest).count() > 0:
        return

    guests = [

        Guest(
            guest_code="Guest_1001",
            name="Nguyễn Văn A",
            phone="0901111111",
            address="Quận 1"
        ),

        Guest(
            guest_code="Guest_1002",
            name="Trần Văn B",
            phone="0902222222",
            address="Quận 7"
        ),

        Guest(
            guest_code="Guest_1003",
            name="Lê Văn C",
            phone="0903333333",
            address="Thủ Đức"
        )

    ]

    db.add_all(guests)
    db.commit()

    print("Seed Guest thành công")