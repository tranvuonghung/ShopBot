import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../../api/axiosConfig"; // chỉnh lại đường dẫn nếu khác
import logo from "../../../Asset/img/logo.svg";
import "../../../Asset/Css/LoginAdmin.css";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.notice;

  const [email, setEmail] = useState(
    localStorage.getItem("adminEmail") || ""
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(
    !!localStorage.getItem("adminEmail")
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};

    if (!email) {
      e.email = "Vui lòng nhập email.";
    } else if (!/^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/.test(email)) {
      e.email = "Email không hợp lệ.";
    }

    if (!password) {
      e.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      e.password = "Mật khẩu ít nhất 6 ký tự.";
    }

    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const e = validate();
    setErrors(e);

    if (Object.keys(e).length > 0) return;

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Lưu token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("adminLoggedIn", "true");

      // Ghi nhớ email
      if (remember) {
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("adminEmail");
      }

      navigate("/dashboard");
    } catch (err) {
      setErrors({
        login:
          err.response?.data?.detail ||
          "Đăng nhập thất bại. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-admin-page">
      <div className="login-admin-card">
        <div className="login-logo-box">
          <img src={logo} alt="ShopBot Logo" className="login-logo" />
        </div>

        <div className="login-header">
          <h2>Sign in</h2>
          <p>Đăng nhập vào trang quản trị</p>
        </div>
        {notice && (
          <div className="alert alert-warning" role="alert">
            {notice}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>

            <input
              className="form-input"
              type="email"
              placeholder="Nhập email admin"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
            />

            {errors.email && (
              <div className="error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>

            <div className="input-row">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <div className="error">{errors.password}</div>
            )}
          </div>

          <div className="login-options">
            <label className="remember-password">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <Link className="forgot-link" to="/forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          {errors.login && (
            <div className="error-box">{errors.login}</div>
          )}

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}