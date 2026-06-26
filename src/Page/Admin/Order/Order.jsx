import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../../Compoment/Sidebar/Sidebar";
import { CheckCircle2, Clock, ReceiptText, Search } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";


function OrdersDashboardPage() {
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    axios.get("http://127.0.0.1:8000/orders/")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredOrders = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    if (!value) return orders;

    return orders.filter((order) =>
      `${order.id} ${order.guest_name} ${order.status} ${order.note}`
        .toLowerCase()
        .includes(value)
    );
  }, [orders, keyword]);

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

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">Danh sách đơn hàng</h5>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-center text-white" style={{ backgroundColor: "#0569ff" }}>Mã đơn</th>
                  <th className="text-white" style={{ backgroundColor: "#0569ff" }}>Khách hàng</th>
                  <th className="text-white" style={{ backgroundColor: "#0569ff" }}>Tổng tiền</th>
                  <th className="text-center text-white" style={{ backgroundColor: "#0569ff" }}>Trạng thái</th>
                  <th className="text-white" style={{ backgroundColor: "#0569ff" }}>Món ăn</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-center">
                      <span className="fw-bold text-primary ">
                        #{String(order.id).padStart(3, "0")}
                      </span>
                    </td>

                    <td>
                      <div className="fw-semibold">{order.guest_name}</div>
                    </td>

                    <td className="text-success fw-bold">
                      {order.total_price.toLocaleString("vi-VN")} VNĐ
                    </td>

                    <td className="text-center">
                      <span
                        className={`badge rounded-1 py-2 text-center ${order.status === "đã giao"
                          ? "bg-success"
                          : order.status === "đang giao"
                            ? "bg-primary"
                            : order.status === "xác nhận"
                              ? "bg-info"
                              : "bg-warning text-dark"
                          }`}
                        style={{
                          width: "140px",
                          display: "inline-block"
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <ul className="list-unstyled mb-0">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            • {item.product_name}
                            <span className="badge bg-secondary ms-2">
                              x{item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
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
