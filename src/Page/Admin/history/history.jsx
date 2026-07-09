import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../../Compoment/Sidebar/Sidebar";

const statusMeta = {
  ["pending".normalize("NFC")]: {
    label: "Đang xử lý",
    color: "#92400e",
    bg: "#fef3c7",
  },
  ["success".normalize("NFC")]: {
    label: "Hoàn thành",
    color: "#166534",
    bg: "#dcfce7",
  },
  ["failed".normalize("NFC")]: {
    label: "Thất bại",
    color: "#b91c1c",
    bg: "#fee2e2",
  },
};

// Biến CSS cho dark mode — chỉ áp dụng khi <body> có class "theme-dark"
// (class này được set ở trang Cài đặt và giữ nguyên khi chuyển trang trong SPA)
const darkThemeVars = `
  body.theme-dark {
    --page-bg-start: #0f172a;
    --page-bg-end: #111827;
    --card-bg: #0f172a;
    --text-color: #e2e8f0;
    --subtitle-color: #94a3b8;

    --filter-border: #334155;
    --filter-bg: #1e293b;
    --filter-text: #cbd5e1;
    --filter-active-bg: #3b82f6;
    --filter-active-color: #ffffff;

    --date-row-bg: #1e293b;
    --input-bg: #0f172a;
    --input-border: #334155;
    --input-text: #e2e8f0;

    --table-border: #334155;
    --table-bg: #0f172a;
    --table-heading-bg: #111827;
    --table-heading-color: #cbd5e1;
    --tr-border: #1e293b;
    --amount-color: #f1f5f9;
  }

  body.theme-dark input[type="date"] {
    color-scheme: dark;
  }
`;

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/payments/history")
      .then((res) => {
        console.log("API:", res.data.data);
        setTransactions(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (activeFilter !== "all") {
      result = result.filter(
        (item) => item.status?.trim().normalize("NFC") === activeFilter
      );
    }

    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter((item) => new Date(item.created_at) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((item) => new Date(item.created_at) <= to);
    }

    return result;
  }, [transactions, activeFilter, fromDate, toDate]);

  const handleResetDate = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Inject biến CSS cho dark mode */}
      <style>{darkThemeVars}</style>

      <Sidebar />

      <main className="flex-grow-1 p-4">
        <div style={styles.page}>
          <div style={styles.container}>
            <div style={styles.headerRow}>
              <div>
                <h2 style={styles.title}>Lịch sử giao dịch</h2>
                <p style={styles.subtitle}>
                  Theo dõi các đơn hàng và trạng thái thanh toán.
                </p>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Tổng giao dịch</div>
                <div style={styles.summaryValue}>
                  {filteredTransactions.length}
                </div>
              </div>
            </div>

            <div style={styles.filterRow}>
              {[
                { key: "all", label: "Tất cả" },
                { key: "success".normalize("NFC"), label: "Hoàn thành" },
                { key: "pending".normalize("NFC"), label: "Đang xử lý" },
                { key: "failed".normalize("NFC"), label: "Thất bại" },
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

            <div style={styles.dateFilterRow}>
              <div style={styles.dateField}>
                <label style={styles.dateLabel}>Từ ngày</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={styles.dateInput}
                />
              </div>

              <div style={styles.dateField}>
                <label style={styles.dateLabel}>Đến ngày</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={styles.dateInput}
                />
              </div>

              {(fromDate || toDate) && (
                <button onClick={handleResetDate} style={styles.resetButton}>
                  Xóa lọc ngày
                </button>
              )}
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
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={styles.emptyState}>
                        Không có giao dịch nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((item) => {
                      const status = statusMeta[
                        item.status?.trim().normalize("NFC")
                      ] || {
                        label: item.status,
                        color: "#374151",
                        bg: "#E5E7EB",
                      };

                      return (
                        <tr key={item.id} style={styles.tr}>
                          <td style={styles.td}>{item.transaction_id}</td>

                          <td style={styles.td}>
                            {item.customer_name || `KH #${item.customer_id}`}
                          </td>

                          <td style={styles.td}>
                            {new Date(item.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>

                          <td style={styles.td}>{item.method}</td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                background: status.bg,
                                color: status.color,
                              }}
                            >
                              {status.label}
                            </span>
                          </td>

                          <td
                            style={{
                              ...styles.td,
                              ...styles.amountCell,
                            }}
                          >
                            {Number(item.amount).toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                      );
                    })
                  )}
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
  dateFilterRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "14px",
    marginBottom: "20px",
    flexWrap: "wrap",
    background: "var(--date-row-bg, #f8fafc)",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid var(--table-border, #e2e8f0)",
  },
  dateField: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  dateLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--subtitle-color, #64748b)",
  },
  dateInput: {
    border: "1px solid var(--input-border, #cbd5e1)",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "14px",
    color: "var(--input-text, #0f172a)",
    background: "var(--input-bg, #fff)",
  },
  resetButton: {
    border: "1px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    height: "38px",
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
  emptyState: {
    textAlign: "center",
    padding: "24px 14px",
    color: "var(--subtitle-color, #64748b)",
  },
};