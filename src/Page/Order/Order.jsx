import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../Compoment/Sidebar/Sidebar";
import { CheckCircle2, Clock, ReceiptText, Search } from "lucide-react";

const orders = [
  { id: "DH001", table: "Ban 01", customer: "Khach le", total: 125000, status: "Dang xu ly", items: "Com ga, Ca phe sua" },
  { id: "DH002", table: "Ban 04", customer: "Anh Nam", total: 220000, status: "Da phuc vu", items: "Pho bo, Kem vani" },
  { id: "DH003", table: "Mang ve", customer: "Chi Lan", total: 75000, status: "Cho thanh toan", items: "Com ga" },
];

const statusClass = {
  "Dang xu ly": "text-bg-warning",
  "Da phuc vu": "text-bg-success",
  "Cho thanh toan": "text-bg-info",
};

function OrdersDashboardPage() {
  const [keyword, setKeyword] = useState("");

  const filteredOrders = useMemo(() => {
    const value = keyword.trim().toLowerCase();
    if (!value) return orders;

    return orders.filter((order) =>
      `${order.id} ${order.table} ${order.customer} ${order.items} ${order.status}`
        .toLowerCase()
        .includes(value)
    );
  }, [keyword]);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Don hang</h1>
            <p className="text-secondary mb-0">Xem nhanh cac don hang trong ngay.</p>
          </div>

          <div className="input-group" style={{ maxWidth: 320 }}>
            <span className="input-group-text bg-white">
              <Search size={18} />
            </span>
            <input
              className="form-control"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tim don hang"
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <ReceiptText className="text-primary" />
                <div>
                  <div className="text-secondary small">Tong don</div>
                  <div className="h4 fw-bold mb-0">{orders.length}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <Clock className="text-warning" />
                <div>
                  <div className="text-secondary small">Dang xu ly</div>
                  <div className="h4 fw-bold mb-0">1</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <CheckCircle2 className="text-success" />
                <div>
                  <div className="text-secondary small">Da phuc vu</div>
                  <div className="h4 fw-bold mb-0">1</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Ma don</th>
                  <th>Ban</th>
                  <th>Khach hang</th>
                  <th>Mon</th>
                  <th>Tong tien</th>
                  <th>Trang thai</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-bold">{order.id}</td>
                    <td>{order.table}</td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td>{order.total.toLocaleString("vi-VN")} VND</td>
                    <td>
                      <span className={`badge ${statusClass[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrdersDashboardPage;
