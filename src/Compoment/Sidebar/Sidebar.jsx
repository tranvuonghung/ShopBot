import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, Settings, Utensils } from "lucide-react";
import logo from "../../Asset/img/logo.svg";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Tong quan", path: "/dashboard" },
    { icon: Utensils, label: "Menu", path: "/menu" },
    { icon: ClipboardList, label: "Don hang", path: "/orders" },
  ];

  return (
    <aside
      className="bg-white border-end p-3 d-flex flex-column"
      style={{ width: 260, minHeight: "100vh" }}
    >
      <div className="d-flex align-items-center gap-2 mb-4">
        <img src={logo} alt="ShopBot" width="40" height="40" />
        <span className="fw-bold fs-4">ShopBot</span>
      </div>

      <ul className="nav nav-pills flex-column gap-2 mb-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <li key={item.path} className="nav-item">
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${
                  active ? "active" : "text-secondary"
                }`}
              >
                <Icon size={20} />
                <span className="fw-semibold">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-top pt-3 d-flex flex-column gap-2">
        <button type="button" className="btn btn-light d-flex align-items-center gap-2">
          <Settings size={20} />
          <span>Cai dat</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn btn-outline-danger d-flex align-items-center gap-2"
        >
          <LogOut size={20} />
          <span>Dang xuat</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
