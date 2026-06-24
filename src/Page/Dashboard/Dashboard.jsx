import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../Compoment/Sidebar/Sidebar";

function Dashboard() {

  const [dashboard, setDashboard] = useState({
    revenue_today: 0,
    total_orders: 0,
    total_products: 0,
    total_customers: 0,
    pending_orders: 0,
    completed_orders: 0,
    successful_payments: 0,
    avg_order_value: 0
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard/")
      .then((res) => {
        setDashboard(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-4">
        <h1 className="fw-bold">Tổng quan</h1>
        <p className="text-secondary mb-4">
          Xem nhanh tình hình của cửa hàng
        </p>

        <div className="row g-4">

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Doanh thu hôm nay
                </small>
                <h4 className="fw-bold">
                  {dashboard.revenue_today.toLocaleString()} VNĐ
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Tổng đơn hàng
                </small>
                <h4 className="fw-bold">
                  {dashboard.total_orders}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Món đang bán
                </small>
                <h4 className="fw-bold">
                  {dashboard.total_products}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Khách hàng
                </small>
                <h4 className="fw-bold">
                  {dashboard.total_customers}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Đơn chờ xử lý
                </small>
                <h4 className="fw-bold text-warning">
                  {dashboard.pending_orders}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Đơn hoàn thành
                </small>
                <h4 className="fw-bold text-success">
                  {dashboard.completed_orders}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Thanh toán thành công
                </small>
                <h4 className="fw-bold text-primary">
                  {dashboard.successful_payments}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <small className="text-secondary">
                  Giá trị đơn TB
                </small>
                <h4 className="fw-bold">
                  {dashboard.avg_order_value.toLocaleString()} VNĐ
                </h4>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;