import React, { useEffect, useState } from "react";
import { ShoppingCart, Plus, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../api/axiosConfig";
import ChatWidget from "../../../Compoment/ChatWidget/ChatWidget";

const BRAND_RED = "#c0392b";

export default function UserMenu() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo") || "null");

  useEffect(() => {
    updateCartCount();
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/products/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setLoadError("Không tải được menu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  }

  function isAvailable(status) {
    return status === "Còn hàng" || status === "Sắp hết hàng";
  }

  function handleAddToCart(product) {
    if (!isAvailable(product.status)) return;

    const cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("userCart", JSON.stringify(cart));
    updateCartCount();

    setMessage(`Đã thêm "${product.name}" vào giỏ hàng`);
    setTimeout(() => setMessage(""), 1600);
  }

  function handleSwitchAccount() {
    localStorage.removeItem("guestInfo");
    navigate("/user/register", { replace: true });
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

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
        <div
          className="container d-flex flex-wrap align-items-center justify-content-between gap-2"
          style={{ maxWidth: 960 }}
        >
          <div>
            <h2 className="fw-bold mb-0">🍜 Menu</h2>
            {guestInfo?.name && (
              <div style={{ opacity: 0.9, fontSize: 14 }}>
                Xin chào, {guestInfo.name}
              </div>
            )}
          </div>

          {guestInfo && (
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
              onClick={handleSwitchAccount}
            >
              Không phải bạn? Đổi tài khoản
            </button>
          )}
        </div>

        <div className="container mt-3" style={{ maxWidth: 960 }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-0">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Tìm món ăn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container py-4" style={{ maxWidth: 960 }}>
        {message && (
          <div
            className="alert py-2 text-center mb-3"
            style={{ background: BRAND_RED, color: "#fff", border: "none" }}
          >
            {message}
          </div>
        )}

        {loading && (
          <div className="text-center text-secondary py-5">Đang tải menu...</div>
        )}

        {!loading && loadError && (
          <div className="text-center py-5">
            <p className="text-danger mb-3">{loadError}</p>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={fetchProducts}
            >
              <RefreshCw size={16} className="me-1" />
              Thử lại
            </button>
          </div>
        )}

        {!loading && !loadError && filteredProducts.length === 0 && (
          <div className="text-center text-secondary py-5">
            Không tìm thấy món ăn nào.
          </div>
        )}

        {!loading && !loadError && filteredProducts.length > 0 && (
          <div className="row g-3">
            {filteredProducts.map((product) => {
              const available = isAvailable(product.status);
              return (
                <div className="col-6 col-md-4" key={product.id}>
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{ borderRadius: 14, overflow: "hidden" }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          opacity: available ? 1 : 0.45,
                        }}
                      />
                      {!available && (
                        <span
                          className="badge bg-dark"
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                          }}
                        >
                          Hết hàng
                        </span>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column p-3">
                      <h6
                        className="fw-semibold mb-1"
                        style={{ minHeight: 40 }}
                      >
                        {product.name}
                      </h6>

                      <div className="mt-auto d-flex align-items-center justify-content-between">
                        <span
                          className="fw-bold"
                          style={{ color: BRAND_RED }}
                        >
                          {formatPrice(product.price)}
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm d-flex align-items-center gap-1"
                          style={{
                            background: available ? BRAND_RED : "#ccc",
                            color: "#fff",
                            border: "none",
                          }}
                          disabled={!available}
                          onClick={() => handleAddToCart(product)}
                        >
                          <Plus size={15} />
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      <button
        type="button"
        onClick={() => navigate("/user/cart")}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: BRAND_RED,
          color: "#fff",
          border: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#fff",
              color: BRAND_RED,
              borderRadius: "50%",
              width: 22,
              height: 22,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cartCount}
          </span>
        )}
      </button>
      <ChatWidget />
    </div>
  );
}