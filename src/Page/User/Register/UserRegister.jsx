import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../api/axiosConfig";
import registerBg from "../../../Asset/img/register-banner.jpg";

export default function UserRegister() {
  const navigate = useNavigate();

  // "register" = khách mới quét QR lần đầu | "login" = khách cũ nhập lại số điện thoại
  const [mode, setMode] = useState("register");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loginPhone, setLoginPhone] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function saveGuestAndGo(guest) {
    localStorage.setItem("guestInfo", JSON.stringify(guest));
    navigate("/user/menu", { replace: true });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/guest/register", {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim() || null,
      });
      saveGuestAndGo(res.data.guest);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!loginPhone.trim()) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/guest/login", { phone: loginPhone.trim() });
      saveGuestAndGo(res.data.guest);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không tìm thấy tài khoản. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundImage: `linear-gradient(rgba(20,0,0,0.75), rgba(40,0,0,0.85)), url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card border-0"
        style={{
          width: 420,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div className="card-body p-4">
          <h4 className="fw-bold text-center mb-1" style={{ color: "#8a1c1c" }}>
            Chào mừng bạn 👋
          </h4>
          <p className="text-secondary text-center mb-4">
            Nhập thông tin để bắt đầu đặt món
          </p>

          <div className="d-flex mb-4 border rounded overflow-hidden">
            <button
              type="button"
              className="btn flex-fill rounded-0"
              style={
                mode === "register"
                  ? { backgroundColor: "#c0392b", color: "#fff", border: "none" }
                  : { backgroundColor: "#f8f9fa", color: "#333", border: "none" }
              }
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Khách mới
            </button>
            <button
              type="button"
              className="btn flex-fill rounded-0"
              style={
                mode === "login"
                  ? { backgroundColor: "#c0392b", color: "#fff", border: "none" }
                  : { backgroundColor: "#f8f9fa", color: "#333", border: "none" }
              }
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Đã có tài khoản
            </button>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {mode === "register" ? (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ (không bắt buộc)</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, quận..."
                />
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: "#c0392b", color: "#fff", border: "none" }}
                disabled={submitting}
              >
                {submitting ? "Đang xử lý..." : "Bắt đầu đặt món"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Số điện thoại đã đăng ký</label>
                <input
                  type="tel"
                  className="form-control"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: "#c0392b", color: "#fff", border: "none" }}
                disabled={submitting}
              >
                {submitting ? "Đang kiểm tra..." : "Tiếp tục"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}