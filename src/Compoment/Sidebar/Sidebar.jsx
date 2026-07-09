import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, Settings, Utensils, History, MessageCircle } from "lucide-react";
import { logout } from "../../utils/auth";

import logo from "../../Asset/img/logo.svg";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      logout(navigate);
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/dashboard" },
    { icon: Utensils, label: "Menu", path: "/menu" },
    { icon: ClipboardList, label: "Đơn hàng", path: "/orders" },
    { icon: MessageCircle, label: "Tin nhắn", path: "/chat" },
    { icon: History, label: "Lịch sử giao dịch", path: "/history" },
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
                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${active ? "active" : "text-secondary"
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
        <button
          type="button"
          onClick={() => navigate("/setting")}
          className="btn btn-light d-flex align-items-center gap-2"
        >
          <Settings size={20} />
          <span>Cai dat</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
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
