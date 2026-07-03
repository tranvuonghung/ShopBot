import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./src/Router/AppRouter";
import "./src/Asset/Css/main.css";

if (typeof window !== "undefined") {
  const storedTheme = localStorage.getItem("theme");
  document.body.classList.toggle("theme-dark", storedTheme === "dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
