// Các hàm tiện ích liên quan tới đăng nhập / đăng xuất admin

// Xoá toàn bộ thông tin phiên đăng nhập khỏi localStorage
export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("adminLoggedIn");
  // Không xoá "adminEmail" vì đó là email được nhớ cho lần đăng nhập sau
}

// Đăng xuất: xoá session rồi điều hướng về trang login
export function logout(navigate) {
  clearAuthSession();

  if (navigate) {
    navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
}

// Kiểm tra nhanh xem admin có đang đăng nhập hay không (dùng cho route bảo vệ sau này)
export function isAdminAuthenticated() {
  return !!localStorage.getItem("token");
}