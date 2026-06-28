from models.payment import Payment

def seed_payment(db):

    if db.query(Payment).count() > 0:
        return

    payments = [

        Payment(
            order_id=1,
            method="QR",
            status="chờ xác nhận",
            amount=115000,
            transaction_id="TXN001"
        ),

        Payment(
            order_id=2,
            method="QR",
            status="xác nhận",
            amount=135000,
            transaction_id="TXN002"
        ),

        Payment(
            order_id=3,
            method="QR",
            status="Thất bại",
            amount=199000,
            transaction_id="TXN003"
        ),

        Payment(
            order_id=4,
            method="QR",
            status="xác nhận",
            amount=215000,
            transaction_id="TXN004"
        ),

        Payment(
            order_id=5,
            method="Cash",
            status="xác nhận",
            amount=99000,
            transaction_id="TXN005"
        )

    ]

    db.add_all(payments)
    db.commit()

    print("Seed Payment thành công")