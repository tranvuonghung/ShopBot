import React, { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../Asset/Css/ShoppingCart.css";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("userCart")) || [];
    setCart(savedCart);
  }, []);

  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
  }

  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
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

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="shopping-cart-page">
      <div className="shopping-cart-container">
        <div className="shopping-cart-header">
          <button
            type="button"
            className="back-menu-btn"
            onClick={() => navigate("/user/menu")}
          >
            <ArrowLeft size={19} />
            Quay lại menu
          </button>

          <div>
            <h1>Giỏ hàng của bạn</h1>
            <p>Danh sách món ăn bạn đã chọn</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={58} />
            <h2>Giỏ hàng đang trống</h2>
            <p>Hãy quay lại menu để chọn món ăn.</p>

            <button type="button" onClick={() => navigate("/user/menu")}>
              Xem menu
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)}</p>
                  </div>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Tóm tắt đơn hàng</h2>

              <div className="summary-row">
                <span>Số lượng món</span>
                <b>{totalQuantity}</b>
              </div>

              <div className="summary-row">
                <span>Tổng tiền</span>
                <b>{formatPrice(totalPrice)}</b>
              </div>

              <button type="button" className="checkout-btn">
                Thanh toán
              </button>

              <button
                type="button"
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Xóa giỏ hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}