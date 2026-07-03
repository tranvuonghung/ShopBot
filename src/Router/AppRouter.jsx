import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Page/Dashboard/Dashboard";
import FoodManagement from "../Page/Menu/Menu";
import OrdersDashboardPage from "../Page/Order/Order";
import PaymentPage from "../client/payment/payment";
import HistoryPage from "../Page/history/history";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
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
]);
