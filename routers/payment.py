from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import hmac
import hashlib
import uuid
import requests
from datetime import datetime
from database import get_db
from models.payment import Payment
from models.order import Order
from models.guest import Guest

router = APIRouter(
    prefix="/payments",
    tags=["Payment"]
)

from config import (
    MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY,
    MOMO_ENDPOINT, MOMO_IPN_URL, MOMO_REDIRECT_URL,
)

@router.get("/history")
def get_payment_history(db: Session = Depends(get_db)):
    payments = (
        db.query(Payment, Order, Guest)
        .join(Order, Payment.order_id == Order.id)
        .outerjoin(Guest, Order.guest_id == Guest.id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    result = []

    for payment, order, guest in payments:
        result.append({
            "id": payment.id,
            "transaction_id": payment.transaction_id,
            "order_id": order.id,
            "customer_id": order.guest_id,
            "customer_name": guest.name if guest else None,
            "customer_phone": guest.phone if guest else None,
            "method": payment.method,
            "status": payment.status,
            "amount": payment.amount,
            "paid_at": payment.paid_at,
            "created_at": payment.created_at
        })

    return {
        "success": True,
        "data": result
    }

@router.post("/momo/create/{order_id}")
def create_momo_payment(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    momo_order_id = f"{order.id}-{uuid.uuid4().hex[:8]}"  # duy nhất mỗi lần gọi
    request_id = str(uuid.uuid4())
    amount = str(int(order.total_price))
    order_info = f"Thanh toan don hang {order.id}"
    request_type = "captureWallet"
    extra_data = ""

    raw_signature = (
        f"accessKey={MOMO_ACCESS_KEY}&amount={amount}&extraData={extra_data}"
        f"&ipnUrl={MOMO_IPN_URL}&orderId={momo_order_id}&orderInfo={order_info}"
        f"&partnerCode={MOMO_PARTNER_CODE}&redirectUrl={MOMO_REDIRECT_URL}"
        f"&requestId={request_id}&requestType={request_type}"
    )
    signature = hmac.new(
        MOMO_SECRET_KEY.encode(), raw_signature.encode(), hashlib.sha256
    ).hexdigest()

    payload = {
        "partnerCode": MOMO_PARTNER_CODE,
        "requestId": request_id,
        "amount": amount,
        "orderId": momo_order_id,
        "orderInfo": order_info,
        "redirectUrl": MOMO_REDIRECT_URL,
        "ipnUrl": MOMO_IPN_URL,
        "extraData": extra_data,
        "requestType": request_type,
        "signature": signature,
        "lang": "vi",
    }

    momo_res = requests.post(MOMO_ENDPOINT, json=payload, timeout=15).json()

    # Lưu lại 1 bản ghi Payment ở trạng thái pending để đối chiếu lúc IPN gọi về
    payment = Payment(
        order_id=order.id,
        method="momo",
        status="pending",
        amount=order.total_price,
        transaction_id=momo_order_id,# tạm lưu momo_order_id, cập nhật transId thật khi IPN về
        momo_order_id=momo_order_id,  # mã gửi cho Momo, dùng để đối chiếu lúc IPN gọi về
        qr_code=momo_res.get("qrCodeUrl"),
    )
    db.add(payment)
    db.commit()

    return {
        "pay_url": momo_res.get("payUrl"),
        "qr_code_url": momo_res.get("qrCodeUrl"),
        "deeplink": momo_res.get("deeplink"),
    }


@router.post("/momo/ipn")
async def momo_ipn(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # Bước A: verify chữ ký — không tin bất kỳ request nào chưa verify được
    raw_signature = (
        f"accessKey={MOMO_ACCESS_KEY}&amount={data.get('amount')}&extraData={data.get('extraData')}"
        f"&message={data.get('message')}&orderId={data.get('orderId')}&orderInfo={data.get('orderInfo')}"
        f"&orderType={data.get('orderType')}&partnerCode={data.get('partnerCode')}"
        f"&payType={data.get('payType')}&requestId={data.get('requestId')}"
        f"&responseTime={data.get('responseTime')}&resultCode={data.get('resultCode')}"
        f"&transId={data.get('transId')}"
    )
    expected_sig = hmac.new(
        MOMO_SECRET_KEY.encode(), raw_signature.encode(), hashlib.sha256
    ).hexdigest()

    if expected_sig != data.get("signature"):
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Bước B: tìm payment theo momo_order_id đã lưu ở bước tạo giao dịch
    payment = db.query(Payment).filter(Payment.transaction_id == data.get("orderId")).first()
    payment = db.query(Payment).filter(Payment.momo_order_id == data.get("orderId")).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Bước C: idempotency — Momo có thể gọi lặp lại
    if payment.status == "success":
        return {"message": "Already processed"}

    # Bước D: đối chiếu số tiền, chống gian lận
    if int(float(data.get("amount", 0))) != int(payment.amount):
        raise HTTPException(status_code=400, detail="Amount mismatch")

    order = db.query(Order).filter(Order.id == payment.order_id).first()

    # Bước E: cập nhật theo resultCode (0 = thành công)
    if data.get("resultCode") == 0:
        payment.status = "success"          # đổi "paid" -> "success" cho khớp dashboard.py
        payment.paid_at = datetime.now()
        payment.transaction_id = str(data.get("transId"))
        # KHÔNG set order.status ở đây nữa — để order.status lo việc bếp/giao hàng
    else:
        payment.status = "failed"

    db.commit()
    return {"message": "Confirm Success"}