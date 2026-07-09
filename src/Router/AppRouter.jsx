import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Page/Admin/Dashboard/Dashboard";
import FoodManagement from "../Page/Admin/Menu/Menu";
import OrdersDashboardPage from "../Page/Admin/Order/Order";
import HistoryPage from "../Page/Admin/History/History";
import SettingPage from "../Page/Admin/Setting/Setting";
import LoginAdmin from "../Page/Admin/Login/LoginAdmin";
import ForgotPassword from "../Page/Admin/ForgotPassword/ForgotPassword";
import UserMenu from "../Page/User/Menu/UserMenu";
import ShoppingCart from "../Page/User/Shopping_Cart/ShoppingCart";
import UserRegister from "../Page/User/Register/UserRegister";
import ProtectedRoute from "./ProtectedRoute";
import UserProtectedRoute from "./UserProtectedRoute";
import AdminChat from "../Page/Admin/Chat/Chat";

export const router = createBrowserRouter([
  // Admin
  {
    path: "/chrome",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/menu",
    element: (
      <ProtectedRoute>
        <FoodManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <OrdersDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <AdminChat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/setting",
    element: (
      <ProtectedRoute>
        <SettingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginAdmin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  //User
  {
    path: "/user/register",
    element: <UserRegister />,
  },
  {
    path: "/user/menu",
    element: (
      <UserProtectedRoute>
        <UserMenu />
      </UserProtectedRoute>
    ),
  },
  {
    path: "/user/cart",
    element: (
      <UserProtectedRoute>
        <ShoppingCart />
      </UserProtectedRoute>
    ),
  },
]);
