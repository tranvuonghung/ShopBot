import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../Asset/img/logo.svg";
import "../../../Asset/Css/LoginAdmin.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(ev) {
    ev.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (!/^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="login-admin-page">
      <div className="login-admin-card">
        <div className="login-logo-box">
          <img src={logo} alt="ShopBot Logo" className="login-logo" />
        </div>

        <div className="login-header">
          <h2>Quên mật khẩu</h2>
          <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
        </div>

        {submitted ? (
          <div className="forgot-success">
            <p>
              Nếu email <strong>{email}</strong> tồn tại trong hệ thống, chúng tôi sẽ gửi
              hướng dẫn đặt lại mật khẩu trong vài phút.
            </p>
            <button className="btn-submit" onClick={() => navigate("/login")}>Quay lại đăng nhập</button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                type="email"
                placeholder="Nhập email của bạn"
              />
              {error && <div className="error">{error}</div>}
            </div>

            <button className="btn-submit" type="submit">
              Gửi liên kết đặt lại
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
