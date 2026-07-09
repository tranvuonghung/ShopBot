import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../api/axiosConfig";
import { buildVietQrUrl } from "../../../config/bankConfig";
import ChatWidget from "../../../Compoment/ChatWidget/ChatWidget";

const BRAND_RED = "#c0392b";

const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "success",   // khớp Payment.status == "success" bên BE
  FAILED: "failed",
};

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const pollTimerRef = useRef(null);
  const pollDeadlineRef = useRef(null);
  const [retryTick, setRetryTick] = useState(0);

  const [momoPayUrl, setMomoPayUrl] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo") || "null");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("userCart")) || [];
    setCart(savedCart);
  }, []);

  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  }

  function increaseQuantity(id) {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(newCart);
  }

  function decreaseQuantity(id) {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    saveCart(newCart);
  }

  function removeItem(id) {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
  }

  function clearCart() {
    saveCart([]);
  }

  useEffect(() => {
    if (!successOrder?.id) return;

    setPaymentStatus(PAYMENT_STATUS.PENDING);
    pollDeadlineRef.current = Date.now() + POLL_TIMEOUT_MS;

    async function checkStatus() {
      try {
        const res = await api.get(`/orders/${successOrder.id}`);
        const latestStatus = res.data?.payment_status;

        if (latestStatus === PAYMENT_STATUS.PAID) {
          setPaymentStatus(PAYMENT_STATUS.PAID);
          stopPolling();
        } else if (latestStatus === PAYMENT_STATUS.FAILED) {
          setPaymentStatus(PAYMENT_STATUS.FAILED);
          stopPolling();
        } else if (Date.now() >= pollDeadlineRef.current) {
          stopPolling();
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", err);
      }
    }

    function stopPolling() {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    }

    checkStatus();
    pollTimerRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [successOrder?.id, retryTick]);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    setError("");

    if (!guestInfo?.id) {
      setError("Không tìm thấy thông tin khách hàng. Vui lòng đăng ký/đăng nhập lại.");
      return;
    }

    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const res = await api.post("/orders/", {
        guest_id: guestInfo.id,
        note: note.trim() || null,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      setSuccessOrder(res.data.order);

      // Gọi BE tạo giao dịch Momo, lấy QR/link thanh toán động
      const momoRes = await api.post(`/payments/momo/create/${res.data.order.id}`);
      setMomoPayUrl(momoRes.data.qr_code_url || momoRes.data.pay_url);

      clearCart();
      setNote("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Đặt hàng thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleContinueOrder() {
    if (!successOrder?.id) {
      navigate("/user/menu");
      return;
    }
    setConfirming(true);
    try {
      await api.patch(`/orders/${successOrder.id}/status`, { status: "success" });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
    } finally {
      setConfirming(false);
      setSuccessOrder(null);
      navigate("/user/menu");
    }
  }

  // Màn hình đặt hàng thành công
  if (successOrder) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", background: "#f7f3f1", padding: 16 }}
      >
        <style>{`
          .spin-icon { animation: cart-spin 1s linear infinite; }
          @keyframes cart-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
       `}</style>
        <div
          className="card border-0 shadow-sm text-center"
          style={{ width: 420, borderRadius: 16 }}
        >
          <div className="card-body p-4">
            <CheckCircle2 size={48} color={BRAND_RED} className="mb-2" />
            <h4 className="fw-bold mb-1">Đặt hàng thành công!</h4>
            <p className="text-secondary mb-3">
              Mã đơn <b>#{successOrder.id}</b> đã được gửi tới nhà bếp.
            </p>

            <div className="mb-3">
              <img
                src={buildVietQrUrl(successOrder.total_price, successOrder.id)}
                alt="Mã QR thanh toán"
                style={{ width: "100%", maxWidth: 240, margin: "0 auto" }}
                className="d-block border rounded"
              />
              <p className="text-secondary small text-center mt-2 mb-0">
                Quét mã bằng app ngân hàng để thanh toán{" "}
                <b>{formatPrice(successOrder.total_price)}</b>
              </p>
            </div>

            {paymentStatus === PAYMENT_STATUS.PAID ? (
              <>
                <CheckCircle2 size={48} color="#16a34a" className="mb-2" />
                <h4 className="fw-bold mb-1">Thanh toán thành công!</h4>
                <p className="text-secondary mb-3">
                  Đơn <b>#{successOrder.id}</b> đã được xác nhận và gửi tới nhà bếp.
                </p>
              </>
            ) : paymentStatus === PAYMENT_STATUS.FAILED ? (
              <>
                <XCircle size={48} color="#dc2626" className="mb-2" />
                <h4 className="fw-bold mb-1">Thanh toán thất bại</h4>
                <p className="text-secondary mb-3">
                  Giao dịch cho đơn <b>#{successOrder.id}</b> không thành công.
                </p>
              </>
            ) : (
              <>
                <Loader2 size={40} color={BRAND_RED} className="mb-2 spin-icon" />
                <h4 className="fw-bold mb-1">Đặt hàng thành công!</h4>
                <p className="text-secondary mb-3">
                  Mã đơn <b>#{successOrder.id}</b> đang chờ thanh toán được xác nhận.
                </p>
              </>
            )}

            {paymentStatus !== PAYMENT_STATUS.PAID && momoPayUrl && (
              <div className="mb-3">
                <img
                  src={momoPayUrl}
                  alt="Mã QR thanh toán Momo"
                  style={{ width: "100%", maxWidth: 240, margin: "0 auto" }}
                  className="d-block border rounded"
                />
                <p className="text-secondary small text-center mt-2 mb-0">
                  Quét mã Momo để thanh toán <b>{formatPrice(successOrder.total_price)}</b>
                </p>
                {paymentStatus === PAYMENT_STATUS.PENDING && (
                  <p className="text-center small mt-2 mb-0" style={{ color: "#92400e" }}>
                    Đang tự động kiểm tra kết quả thanh toán...
                  </p>
                )}
                {paymentStatus === PAYMENT_STATUS.FAILED && (
                  <button
                    type="button"
                    className="btn btn-sm w-100 mt-2"
                    style={{ background: BRAND_RED, color: "#fff", border: "none" }}
                    onClick={() => setRetryTick((n) => n + 1)}
                  >
                    Thử kiểm tra lại
                  </button>
                )}
              </div>
            )}

            <div
              className="text-start p-3 mb-3"
              style={{ background: "#f7f3f1", borderRadius: 10 }}
            >
              {successOrder.items.map((it, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between small mb-1"
                >
                  <span>
                    {it.product_name} x{it.quantity}
                  </span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Tổng cộng</span>
                <span style={{ color: BRAND_RED }}>
                  {formatPrice(successOrder.total_price)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn w-100"
              style={{ background: BRAND_RED, color: "#fff", border: "none" }}
              disabled={confirming}
              onClick={handleContinueOrder}
            >
              {confirming ? "Đang xác nhận..." : "Tiếp tục đặt món"}
            </button>
          </div>
        </div>
        <ChatWidget />
      </div >
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f3f1" }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND_RED}, #8a1c1c)`,
          padding: "24px 16px",
          color: "#fff",
        }}
      >
        <div className="container" style={{ maxWidth: 900 }}>
          <button
            type="button"
            className="btn btn-sm mb-3 d-flex align-items-center gap-1"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            onClick={() => navigate("/user/menu")}
          >
            <ArrowLeft size={16} />
            Quay lại menu
          </button>
          <h2 className="fw-bold mb-0">Giỏ hàng của bạn</h2>
          <p className="mb-0" style={{ opacity: 0.9 }}>
            Danh sách món ăn bạn đã chọn
          </p>
        </div>
      </div>

      <div className="container py-4" style={{ maxWidth: 900 }}>
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <ShoppingBag size={56} className="text-secondary mb-3" />
            <h4>Giỏ hàng đang trống</h4>
            <p className="text-secondary">Hãy quay lại menu để chọn món ăn.</p>
            <button
              type="button"
              className="btn"
              style={{ background: BRAND_RED, color: "#fff", border: "none" }}
              onClick={() => navigate("/user/menu")}
            >
              Xem menu
            </button>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-md-7">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="card border-0 shadow-sm mb-3"
                  style={{ borderRadius: 12 }}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{item.name}</h6>
                      <span style={{ color: BRAND_RED }} className="fw-bold">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: 20, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div
                      className="fw-bold text-end"
                      style={{ minWidth: 90 }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={clearCart}
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>

            <div className="col-md-5">
              <div
                className="card border-0 shadow-sm p-3"
                style={{ borderRadius: 14, position: "sticky", top: 16 }}
              >
                <h5 className="fw-bold mb-3">Tóm tắt đơn hàng</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Số lượng món</span>
                  <b>{totalQuantity}</b>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary">Tổng tiền</span>
                  <b style={{ color: BRAND_RED, fontSize: 18 }}>
                    {formatPrice(totalPrice)}
                  </b>
                </div>

                <textarea
                  className="form-control mb-3"
                  rows={2}
                  placeholder="Ghi chú cho nhà bếp (không bắt buộc)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <button
                  type="button"
                  className="btn w-100 fw-semibold"
                  style={{
                    background: BRAND_RED,
                    color: "#fff",
                    border: "none",
                  }}
                  disabled={submitting}
                  onClick={handleCheckout}
                >
                  {submitting ? "Đang đặt hàng..." : "Đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}