import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../../../Compoment/Sidebar/Sidebar";
import api from "../../../api/axiosConfig";

const BRAND_RED = "#e4393c";

const STATUS_COLORS = {
  "chờ xác nhận": "#f59e0b",
  "xác nhận": "#3b82f6",
  "đang giao": "#8b5cf6",
  "đã giao": "#22c55e",
  "success": "#16a34a",
  "đã huỷ": "#ef4444",
  "pending": "#f59e0b",
};

function formatVND(value) {
  return `${Math.round(value || 0).toLocaleString("vi-VN")} đ`;
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="col-md-3 col-sm-6">
      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
        <div className="card-body d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}1A`,
              color: color,
            }}
          >
            {icon}
          </div>
          <div>
            <small className="text-secondary d-block">{label}</small>
            <h5 className="fw-bold mb-0">{value}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="d-flex align-items-end justify-content-between" style={{ height: 200, gap: 8 }}>
      {data.map((d, i) => {
        const heightPct = Math.max((d.revenue / max) * 100, 3);
        return (
          <div
            key={i}
            className="d-flex flex-column align-items-center justify-content-end flex-fill"
            style={{ height: "100%" }}   // 👈 thêm dòng này
          >
            <div
              className="w-100 rounded-top"
              style={{
                height: `${heightPct}%`,
                background: `linear-gradient(180deg, ${BRAND_RED}, #ffb199)`,
                minHeight: 4,
                transition: "height .3s ease",
              }}
              title={formatVND(d.revenue)}
            />
            <small className="text-secondary mt-2">{d.date}</small>
          </div>
        );
      })}
    </div>
  );
}

function StatusBreakdown({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  return (
    <div className="d-flex flex-column gap-3">
      {data.map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        const color = STATUS_COLORS[d.status] || "#6b7280";
        return (
          <div key={i}>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-capitalize fw-medium">{d.status}</span>
              <span className="text-secondary">{d.count} ({pct}%)</span>
            </div>
            <div className="progress" style={{ height: 8, borderRadius: 6 }}>
              <div
                className="progress-bar"
                style={{ width: `${pct}%`, background: color, borderRadius: 6 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    revenue_today: 0,
    total_orders: 0,
    total_products: 0,
    total_customers: 0,
    pending_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0,
    successful_payments: 0,
    avg_order_value: 0,
    revenue_last_7_days: [],
    status_breakdown: [],
    recent_orders: [],
    top_products: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/")
      .then((res) => setDashboard((prev) => ({ ...prev, ...res.data })))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="d-flex min-vh-100" style={{ background: "#f7f7fb" }}>
      <Sidebar />

      <main className="flex-grow-1 p-4">
        <h1 className="fw-bold mb-0">Tổng quan</h1>
        <p className="text-secondary mb-4">Xem nhanh tình hình của cửa hàng</p>

        {loading ? (
          <div className="text-center text-secondary py-5">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="row g-3 mb-1">
              <StatCard icon={<DollarSign size={22} />} label="Doanh thu hôm nay"
                value={formatVND(dashboard.revenue_today)} color={BRAND_RED} />
              <StatCard icon={<ShoppingBag size={22} />} label="Tổng đơn hàng"
                value={dashboard.total_orders} color="#3b82f6" />
              <StatCard icon={<Users size={22} />} label="Khách hàng"
                value={dashboard.total_customers} color="#8b5cf6" />
              <StatCard icon={<TrendingUp size={22} />} label="Giá trị đơn TB"
                value={formatVND(dashboard.avg_order_value)} color="#f59e0b" />
            </div>

            <div className="row g-3 mt-1 mb-4">
              <StatCard icon={<Clock size={22} />} label="Đơn đang xử lý"
                value={dashboard.pending_orders} color="#f59e0b" />
              <StatCard icon={<CheckCircle2 size={22} />} label="Đơn hoàn thành"
                value={dashboard.completed_orders} color="#22c55e" />
              <StatCard icon={<XCircle size={22} />} label="Đơn đã huỷ"
                value={dashboard.cancelled_orders} color="#ef4444" />
              <StatCard icon={<CreditCard size={22} />} label="Thanh toán thành công"
                value={dashboard.successful_payments} color="#16a34a" />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Doanh thu 7 ngày gần nhất</h6>
                    <RevenueChart data={dashboard.revenue_last_7_days} />
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Phân bố trạng thái đơn hàng</h6>
                    <StatusBreakdown data={dashboard.status_breakdown} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Đơn hàng gần đây</h6>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr className="text-secondary small">
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thời gian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.recent_orders.map((o, i) => (
                            <tr key={i}>
                              <td className="fw-semibold">{o.order_code}</td>
                              <td>{o.guest_name}</td>
                              <td>{formatVND(o.total_price)}</td>
                              <td>
                                <span
                                  className="badge rounded-pill"
                                  style={{
                                    background: `${STATUS_COLORS[o.status] || "#6b7280"}1A`,
                                    color: STATUS_COLORS[o.status] || "#6b7280",
                                  }}
                                >
                                  {o.status}
                                </span>
                              </td>
                              <td className="text-secondary small">{o.created_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                      <Utensils size={18} /> Top món bán chạy
                    </h6>
                    <div className="d-flex flex-column gap-3">
                      {dashboard.top_products.map((p, i) => (
                        <div key={i} className="d-flex justify-content-between align-items-center">
                          <span>{i + 1}. {p.name}</span>
                          <span className="badge bg-light text-dark border">{p.sold} đã bán</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;