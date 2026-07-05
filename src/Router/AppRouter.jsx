import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Page/Admin/Dashboard/Dashboard";
import FoodManagement from "../Page/Admin/Menu/Menu";
import OrdersDashboardPage from "../Page/Admin/Order/Order";
import PaymentPage from "../client/payment/payment";
import HistoryPage from "../Page/Admin/history/history";
import SettingPage from "../Page/Admin/Setting/setting";
import LoginAdmin from "../Page/Admin/Login/LoginAdmin";
import ForgotPassword from "../Page/Admin/ForgotPassword/ForgotPassword";
import UserMenu from "../Page/User/Menu/UserMenu";
import ShoppingCart from "../Page/User/Shopping_Cart/ShoppingCart";

export const router = createBrowserRouter([
  // Admin
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "/menu",
    element: <FoodManagement />,
  },
  {
    path: "/orders",
    element: <OrdersDashboardPage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/history",
    element: <HistoryPage />,
  },
  {
    path: "/setting",
    element: <SettingPage />,
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
    path: "/user/menu",
    element: <UserMenu />,
  },
  {
    path: "/user/cart",
    element: <ShoppingCart />,
  },
]);
