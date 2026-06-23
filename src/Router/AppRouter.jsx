import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Page/Dashboard/Dashboard";
import FoodManagement from "../Page/Menu/Menu";
import OrdersDashboardPage from "../Page/Order/Order";


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
