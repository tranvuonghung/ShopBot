import { Navigate } from "react-router-dom";

// Bọc quanh route phía khách hàng: nếu chưa có guestInfo -> đá về /user/register
export default function UserProtectedRoute({ children }) {
  const guestInfo = localStorage.getItem("guestInfo");

  if (!guestInfo) {
    return (
      <Navigate
        to="/user/register"
        replace
        state={{ notice: "Vui lòng nhập thông tin để bắt đầu đặt món." }}
      />
    );
  }

  return children;
}