import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Page/Dashboard/Dashboard";
import FoodManagement from "../Page/Menu/Menu";
import OrdersDashboardPage from "../Page/Order/Order";


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
