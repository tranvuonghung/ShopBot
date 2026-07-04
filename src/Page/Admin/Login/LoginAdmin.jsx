import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../Asset/img/logo.svg";
import "../../../Asset/Css/LoginAdmin.css";

// admin@gmail.com
// 123456
export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

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

  function handleSubmit(ev) {
    ev.preventDefault();

    const e = validate();
    setErrors(e);

    if (Object.keys(e).length > 0) return;

    // Login demo, không hiển thị sẵn trên giao diện
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setErrors({
        login: "Email hoặc mật khẩu không đúng.",
      });
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

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              type="email"
              placeholder="Nhập email admin"
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>

            <div className="input-row">
              <input
                className="form-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && <div className="error">{errors.password}</div>}
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

          {errors.login && <div className="error-box">{errors.login}</div>}

          <button className="btn-submit" type="submit">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}