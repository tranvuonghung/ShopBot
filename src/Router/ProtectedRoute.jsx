import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/auth";

// Bọc quanh các route admin: nếu chưa có token -> đá về /login kèm thông báo
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ notice: "Bạn cần đăng nhập để tiếp tục." }}
      />
    );
  }

  return children;
}