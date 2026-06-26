import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Page/Admin/Dashboard/Dashboard";
import FoodManagement from "../Page/Admin/Menu/Menu";
import OrdersDashboardPage from "../Page/Admin/Order/Order";


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


]);
