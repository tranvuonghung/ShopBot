from database import engine

try:
    connection = engine.connect()
    print("Kết nối MySQL thành công")
    connection.close()

except Exception as e:
    print("Lỗi:", e)