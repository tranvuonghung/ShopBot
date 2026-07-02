import { useMemo, useState } from "react";

const orderItems = [
  {
    id: 1,
    name: "Burger Deluxe",
    quantity: 2,
    price: 35000,
    note: "Áp chảo thơm ngon",
  },
  {
    id: 2,
    name: "Khoai tây chiên",
    quantity: 1,
    price: 25000,
    note: "Mứt tiêu đậm vị",
  },
  {
    id: 3,
    name: "Trà sữa matcha",
    quantity: 2,
    price: 30000,
    note: "Đá xay mịn",
  },
];

const paymentMethods = [
  {
    id: "cod",
    label: "Thanh toán bằng tiền mặt (COD)",
    description: "Thanh toán khi nhận hàng. An toàn và thuận tiện.",
  },
  {
    id: "qr",
    label: "Thanh toán bằng QR",
    description: "Quét mã QR để hoàn tất giao dịch ngay lập tức.",
  },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState("cod");

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    []
  );
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <p style={styles.eyebrow}>ShopBot • Thanh toán</p>
            <h2 style={styles.title}>Xác nhận đơn hàng</h2>
            <p style={styles.subtitle}>
              Kiểm tra lại chi tiết đơn hàng trước khi hoàn tất giao dịch.
            </p>
          </div>
          <div style={styles.statusBadge}>Đang chờ thanh toán</div>
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Danh sách sản phẩm</h3>
              <span style={styles.orderId}>Đơn hàng #2048</span>
            </div>

            {orderItems.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <div style={styles.itemMain}>
                  <div style={styles.itemIcon}>🍽️</div>
                  <div>
                    <strong style={styles.itemName}>{item.name}</strong>
                    <div style={styles.itemNote}>{item.note}</div>
                  </div>
                </div>
                <div style={styles.itemQty}>{item.quantity}x</div>
                <div style={styles.itemPrice}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </div>
              </div>
            ))}

            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Phí dịch vụ</span>
                <span>{deliveryFee.toLocaleString("vi-VN")}đ</span>
              </div>
              <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                <span>Tổng thanh toán</span>
                <strong>{total.toLocaleString("vi-VN")}đ</strong>
              </div>
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Phương thức thanh toán</h3>
            <div style={styles.methods}>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  style={{
                    ...styles.methodOption,
                    ...(selectedMethod === method.id
                      ? styles.methodOptionActive
                      : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    style={styles.radio}
                  />
                  <div>
                    <div style={styles.methodLabel}>{method.label}</div>
                    <div style={styles.methodDescription}>
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedMethod === "qr" ? (
              <div style={styles.qrBox}>
                <div style={styles.qrIcon}>QR</div>
                <p style={styles.qrText}>Quét mã QR để hoàn tất thanh toán</p>
                <div style={styles.qrPlaceholder} />
              </div>
            ) : (
              <div style={styles.noteBox}>
                <strong>Thanh toán khi nhận hàng</strong>
                <p style={styles.noteText}>
                  Nhân viên sẽ xác nhận đơn hàng và bạn chỉ cần thanh toán trực
                  tiếp khi nhận món.
                </p>
              </div>
            )}

            <div style={styles.actions}>
              <button style={styles.secondaryButton}>Quay lại</button>
              <button style={styles.primaryButton}>Xác nhận thanh toán</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "32px 16px",
    fontFamily: "Inter, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
    padding: "32px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "16px",
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
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
  },
  statusBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "24px",
  },
  card: {
    background: "#f8fafc",
    borderRadius: "20px",
    padding: "22px",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
  },
  cardTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "18px",
  },
  orderId: {
    color: "#64748b",
    fontWeight: 600,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #e2e8f0",
    gap: "12px",
  },
  itemMain: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },
  itemIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  itemName: {
    display: "block",
    color: "#0f172a",
  },
  itemNote: {
    color: "#64748b",
    fontSize: "13px",
    marginTop: "2px",
  },
  itemQty: {
    color: "#475569",
    fontWeight: 700,
    minWidth: "42px",
    textAlign: "center",
  },
  itemPrice: {
    color: "#111827",
    fontWeight: 700,
    minWidth: "90px",
    textAlign: "right",
  },
  summaryBox: {
    marginTop: "16px",
    background: "#fff",
    borderRadius: "14px",
    padding: "14px",
    border: "1px solid #e2e8f0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: "#475569",
  },
  summaryTotal: {
    marginTop: "8px",
    paddingTop: "10px",
    borderTop: "1px solid #e2e8f0",
    color: "#0f172a",
    fontSize: "16px",
  },
  methods: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  methodOption: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "#fff",
    border: "1px solid #dbeafe",
    borderRadius: "14px",
    padding: "12px 14px",
    cursor: "pointer",
  },
  methodOptionActive: {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
  },
  radio: {
    marginTop: "3px",
  },
  methodLabel: {
    fontWeight: 700,
    color: "#0f172a",
  },
  methodDescription: {
    marginTop: "3px",
    color: "#64748b",
    fontSize: "13px",
  },
  qrBox: {
    marginTop: "16px",
    textAlign: "center",
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    border: "1px dashed #60a5fa",
  },
  qrIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 10px",
    borderRadius: "16px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#1d4ed8",
    fontSize: "24px",
  },
  qrText: {
    margin: "0 0 10px",
    color: "#475569",
  },
  qrPlaceholder: {
    width: "120px",
    height: "120px",
    margin: "0 auto",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
  },
  noteBox: {
    marginTop: "16px",
    padding: "14px",
    background: "#fff7ed",
    borderRadius: "14px",
    color: "#9a2c00",
  },
  noteText: {
    margin: "6px 0 0",
    color: "#c2410c",
  },
  actions: {
    marginTop: "18px",
    display: "flex",
    gap: "12px",
  },
  secondaryButton: {
    flex: 1,
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    background: "#fff",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryButton: {
    flex: 1,
    padding: "12px 14px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
