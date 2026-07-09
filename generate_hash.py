import bcrypt

password = "123456".encode("utf-8")  # đổi mật khẩu bạn muốn
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed.decode("utf-8"))