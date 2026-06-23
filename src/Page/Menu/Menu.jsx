import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../Compoment/Sidebar/Sidebar";
import { Coffee, IceCreamBowl, Search, Soup, Utensils } from "lucide-react";

const foods = [
  { id: 1, name: "Com ga", category: "Mon chinh", price: 45000, status: "Dang ban", icon: Utensils },
  { id: 2, name: "Pho bo", category: "Mon nuoc", price: 55000, status: "Dang ban", icon: Soup },
  { id: 3, name: "Ca phe sua", category: "Do uong", price: 25000, status: "Dang ban", icon: Coffee },
  { id: 4, name: "Kem vani", category: "Trang mieng", price: 30000, status: "Tam het", icon: IceCreamBowl },
];

function FoodManagement() {
  const [keyword, setKeyword] = useState("");

  const filteredFoods = useMemo(() => {
    const value = keyword.trim().toLowerCase();
    if (!value) return foods;

    return foods.filter((food) =>
      `${food.name} ${food.category} ${food.status}`.toLowerCase().includes(value)
    );
  }, [keyword]);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Menu</h1>
            <p className="text-secondary mb-0">Xem danh sach mon an hien co.</p>
          </div>

          <div className="input-group" style={{ maxWidth: 320 }}>
            <span className="input-group-text bg-white">
              <Search size={18} />
            </span>
            <input
              className="form-control"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tim mon an"
            />
          </div>
        </div>

        <div className="row g-3">
          {filteredFoods.map((food) => {
            const Icon = food.icon;

            return (
              <div className="col-12 col-md-6 col-xl-3" key={food.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="rounded bg-warning-subtle text-warning-emphasis p-2">
                        <Icon size={22} />
                      </div>
                      <span className={`badge ${food.status === "Dang ban" ? "text-bg-success" : "text-bg-secondary"}`}>
                        {food.status}
                      </span>
                    </div>
                    <h2 className="h5 fw-bold mb-1">{food.name}</h2>
                    <p className="text-secondary mb-3">{food.category}</p>
                    <div className="fw-bold text-danger">
                      {food.price.toLocaleString("vi-VN")} VND
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default FoodManagement;
