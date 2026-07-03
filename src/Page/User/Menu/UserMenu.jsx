import React, { useEffect, useState } from "react";
import { ShoppingCart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../Asset/Css/UserMenu.css";

export default function UserMenu() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  const foods = [
    {
      id: 1,
      name: "Cơm gà xối mỡ",
      price: 35000,
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600",
    },
    {
      id: 2,
      name: "Bún bò Huế",
      price: 40000,
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    },
    {
      id: 3,
      name: "Phở bò",
      price: 45000,
      image:
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600",
    },
    {
      id: 4,
      name: "Mì cay hải sản",
      price: 55000,
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    },
    {
      id: 5,
      name: "Trà sữa trân châu",
      price: 30000,
      image:
        "https://images.unsplash.com/photo-1558857563-b371033873b8?w=600",
    },
    {
      id: 6,
      name: "Gà rán",
      price: 50000,
      image:
        "https://images.unsplash.com/photo-1562967914-608f82629710?w=600",
    },
    {
      id: 7,
      name: "Hamburger bò",
      price: 42000,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    },
    {
      id: 8,
      name: "Pizza phô mai",
      price: 75000,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    },
  ];

  useEffect(() => {
    updateCartCount();
  }, []);

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  }

  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
  }

  function handleAddToCart(food) {
    const cart = JSON.parse(localStorage.getItem("userCart")) || [];

    const existingItem = cart.find((item) => item.id === food.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...food,
        quantity: 1,
      });
    }

    localStorage.setItem("userCart", JSON.stringify(cart));
    updateCartCount();

    setMessage(`Đã thêm "${food.name}" vào giỏ hàng`);
    setTimeout(() => setMessage(""), 1600);
  }

  return (
    <div className="user-menu-page">
      <div className="user-menu-container">
        <div className="user-menu-header text-center">
          <h1>Menu</h1>
        </div>

        {message && <div className="cart-message">{message}</div>}

        <div className="food-grid">
          {foods.map((food) => (
            <div className="food-card" key={food.id}>
              <div className="food-image-box">
                <img src={food.image} alt={food.name} />
              </div>

              <div className="food-info">
                <h3>{food.name}</h3>

                <div className="food-bottom">
                  <span className="food-price">{formatPrice(food.price)}</span>

                  <button
                    type="button"
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(food)}
                  >
                    <Plus size={17} />
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="floating-cart-btn"
        onClick={() => navigate("/user/cart")}
      >
        <ShoppingCart size={28} />
        {cartCount > 0 && <span>{cartCount}</span>}
      </button>
    </div>
  );
}