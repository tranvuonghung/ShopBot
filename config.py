import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY chưa được cấu hình trong .env")

MOMO_PARTNER_CODE = os.getenv("MOMO_PARTNER_CODE")
MOMO_ACCESS_KEY = os.getenv("MOMO_ACCESS_KEY")
MOMO_SECRET_KEY = os.getenv("MOMO_SECRET_KEY")
MOMO_ENDPOINT = os.getenv("MOMO_ENDPOINT")
MOMO_IPN_URL = os.getenv("MOMO_IPN_URL")
MOMO_REDIRECT_URL = os.getenv("MOMO_REDIRECT_URL")