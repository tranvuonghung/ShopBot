import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../../Compoment/Sidebar/Sidebar";

export default function SettingPage() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });
  const [showChange, setShowChange] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.classList.toggle("theme-dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // language selector removed

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-4">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 className="fw-bold">Cài đặt</h1>
              <p className="text-secondary mb-0">
                Quản lý tùy chọn tài khoản và giao diện.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-xl-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h5 className="card-title mb-1">Đổi mật khẩu</h5>
                      <p className="text-secondary mb-0">
                        Thay đổi mật khẩu đăng nhập của bạn.
                      </p>
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline-primary w-100" onClick={() => setShowChange(true)}>
                    Mở đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h5 className="card-title mb-1">Chế độ sáng/tối</h5>
                      <p className="text-secondary mb-0">
                        Chuyển đổi giữa giao diện sáng và tối.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${darkMode ? "btn-dark" : "btn-outline-secondary"}`}
                    onClick={() => setDarkMode((prev) => !prev)}
                  >
                    {darkMode ? "Chế độ tối" : "Chế độ sáng"}
                  </button>
                </div>
              </div>
            </div>

            {/* language card removed */}
            {showChange && (
              <div className="change-password-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100, background: 'rgba(0,0,0,0.4)' }}>
                <div className="card" style={{ width: 520 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Đổi mật khẩu</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowChange(false); setErrors({}); }} />
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const err = {};
                      if (!currentPass) err.current = 'Vui lòng nhập mật khẩu cũ.';
                      if (!newPass) err.new = 'Vui lòng nhập mật khẩu mới.';
                      else if (newPass.length < 6) err.new = 'Mật khẩu mới ít nhất 6 ký tự.';
                      if (confirmPass !== newPass) err.confirm = 'Xác nhận mật khẩu chưa khớp.';
                      setErrors(err);
                      if (Object.keys(err).length === 0) {
                        // Demo: xử lý đổi mật khẩu (thay bằng API khi có)
                        alert('Đổi mật khẩu thành công');
                        setShowChange(false);
                        setCurrentPass(''); setNewPass(''); setConfirmPass(''); setErrors({});
                      }
                    }}>
                      <div className="mb-3">
                        <label className="form-label">Mật khẩu cũ</label>
                        <div className="input-group">
                          <input
                            type={showCurrent ? 'text' : 'password'}
                            className="form-control"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                          />
                          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCurrent(s => !s)}>
                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.current && <div className="text-danger small mt-1">{errors.current}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Mật khẩu mới</label>
                        <div className="input-group">
                          <input
                            type={showNew ? 'text' : 'password'}
                            className="form-control"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                          />
                          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNew(s => !s)}>
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.new && <div className="text-danger small mt-1">{errors.new}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Xác nhận mật khẩu mới</label>
                        <div className="input-group">
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            className="form-control"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                          />
                          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirm(s => !s)}>
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.confirm && <div className="text-danger small mt-1">{errors.confirm}</div>}
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <Link to="/forgot-password" className="btn btn-link">Quên mật khẩu?</Link>
                        </div>
                        <div>
                          <button type="button" className="btn btn-outline-secondary me-2" onClick={() => { setShowChange(false); setErrors({}); }}>Hủy</button>
                          <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
