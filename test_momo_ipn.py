import hmac, hashlib, requests

SECRET_KEY = "xxxxxxxx"        # copy đúng MOMO_SECRET_KEY trong .env
ACCESS_KEY = "xxxxxxxx"        # copy đúng MOMO_ACCESS_KEY trong .env
MOMO_ORDER_ID = "1-a1b2c3d4"   # copy đúng transaction_id đang lưu trong bảng payment (xem qua /payments/history hoặc MySQL)
AMOUNT = "150000"              # phải khớp CHÍNH XÁC total_price của order đó

data = {
    "partnerCode": "MOMOxxxx",
    "orderId": MOMO_ORDER_ID,
    "requestId": "test-request-id",
    "amount": AMOUNT,
    "orderInfo": f"Thanh toan don hang test",
    "orderType": "momo_wallet",
    "transId": 999999999,
    "resultCode": 0,           # 0 = thành công. Đổi thành 1 để test trường hợp thất bại
    "message": "Successful.",
    "payType": "qr",
    "responseTime": 1234567890,
    "extraData": "",
}

raw_signature = (
    f"accessKey={ACCESS_KEY}&amount={data['amount']}&extraData={data['extraData']}"
    f"&message={data['message']}&orderId={data['orderId']}&orderInfo={data['orderInfo']}"
    f"&orderType={data['orderType']}&partnerCode={data['partnerCode']}"
    f"&payType={data['payType']}&requestId={data['requestId']}"
    f"&responseTime={data['responseTime']}&resultCode={data['resultCode']}"
    f"&transId={data['transId']}"
)
data["signature"] = hmac.new(SECRET_KEY.encode(), raw_signature.encode(), hashlib.sha256).hexdigest()

res = requests.post("http://localhost:8000/payments/momo/ipn", json=data)
print(res.status_code, res.json())