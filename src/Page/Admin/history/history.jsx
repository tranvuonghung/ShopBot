import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../../Compoment/Sidebar/Sidebar";

const transactions = [
  {
    id: "TXN-1001",
    customer: "Nguyễn Văn A",
    date: "02/07/2026",
    amount: 145000,
    status: "completed",
    role: "Thanh toán thành công",
    method: "COD",
  },
  {
    id: "TXN-1002",
    customer: "Trần Thị B",
    date: "01/07/2026",
    amount: 98000,
    status: "processing",
    role: "Đang xử lý",
    method: "QR",
  },
  {
    id: "TXN-1003",
    customer: "Lê Văn C",
    date: "30/06/2026",
    amount: 210000,
    status: "failed",
    role: "Thanh toán thất bại",
    method: "QR",
  },
  {
    id: "TXN-1004",
    customer: "Phạm Thị D",
    date: "29/06/2026",
    amount: 76000,
    status: "completed",
    role: "Thanh toán thành công",
    method: "COD",
  },
];

const statusMeta = {
  completed: { label: "Hoàn thành", color: "#166534", bg: "#dcfce7" },
  processing: { label: "Đang xử lý", color: "#92400e", bg: "#fef3c7" },
  failed: { label: "Thất bại", color: "#b91c1c", bg: "#fee2e2" },
};

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    if (activeFilter === "all") return transactions;
    return transactions.filter((item) => item.status === activeFilter);
  }, [activeFilter]);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-4">
        <div style={styles.page}>
          <div style={styles.container}>
            <div style={styles.headerRow}>
              <div>
             
                <h2 style={styles.title}>Lịch sử giao dịch</h2>
                <p style={styles.subtitle}>
                  Theo dõi các đơn hàng và trạng thái thanh toán của bạn.
                </p>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Tổng giao dịch</div>
                <div style={styles.summaryValue}>{transactions.length}</div>
              </div>
            </div>

            <div style={styles.filterRow}>
              {[
                { key: "all", label: "Tất cả" },
                { key: "completed", label: "Hoàn thành" },
                { key: "processing", label: "Đang xử lý" },
                { key: "failed", label: "Thất bại" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  style={{
                    ...styles.filterButton,
                    ...(activeFilter === filter.key
                      ? styles.filterButtonActive
                      : {}),
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Mã giao dịch</th>
                    <th style={styles.th}>Khách hàng</th>
                    <th style={styles.th}>Ngày</th>
                    <th style={styles.th}>Phương thức</th>
                    <th style={styles.th}>Trạng thái</th>
                    <th style={styles.th}>Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>{item.id}</td>
                      <td style={styles.td}>{item.customer}</td>
                      <td style={styles.td}>{item.date}</td>
                      <td style={styles.td}>{item.method}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: statusMeta[item.status].bg,
                            color: statusMeta[item.status].color,
                          }}
                        >
                          {statusMeta[item.status].label}
                        </span>
                      </td>
                      <td style={{ ...styles.td, ...styles.amountCell }}>
                        {item.amount.toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, var(--page-bg-start, #f8fafc) 0%, var(--page-bg-end, #eef2ff) 100%)",
    padding: "32px 16px",
    fontFamily: "Inter, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
    background: "var(--card-bg, #fff)",
    borderRadius: "28px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
    padding: "32px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    color: "#2563eb",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "12px",
  },
  title: {
    margin: "8px 0 6px",
    fontSize: "30px",
    color: "var(--text-color, #0f172a)",
  },
  subtitle: {
    margin: 0,
    color: "var(--subtitle-color, #64748b)",
  },
  summaryCard: {
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    color: "#fff",
    borderRadius: "16px",
    padding: "16px 20px",
    minWidth: "140px",
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: "13px",
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: 700,
    marginTop: "4px",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterButton: {
    border: "1px solid var(--filter-border, #cbd5e1)",
    background: "var(--filter-bg, #fff)",
    color: "var(--filter-text, #334155)",
    padding: "8px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 600,
  },
  filterButtonActive: {
    background: "var(--filter-active-bg, #2563eb)",
    borderColor: "var(--filter-active-bg, #2563eb)",
    color: "var(--filter-active-color, #fff)",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "16px",
    border: "1px solid var(--table-border, #e2e8f0)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "var(--table-bg, #fff)",
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    background: "var(--table-heading-bg, #f8fafc)",
    color: "var(--table-heading-color, #334155)",
    fontWeight: 700,
    borderBottom: "1px solid var(--table-border, #e2e8f0)",
  },
  tr: {
    borderBottom: "1px solid var(--tr-border, #f1f5f9)",
  },
  td: {
    padding: "12px 14px",
    color: "var(--text-color, #0f172a)",
  },
  amountCell: {
    fontWeight: 700,
    color: "var(--amount-color, #111827)",
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "13px",
    display: "inline-block",
  },
};
