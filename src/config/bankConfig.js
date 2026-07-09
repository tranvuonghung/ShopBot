// Thông tin tài khoản nhận thanh toán — dùng để tạo mã QR VietQR
// Đây là thông tin công khai (giống như đọc số tài khoản cho khách),
// không phải bí mật, nên để thẳng ở frontend là an toàn.

export const BANK_ID = "VCB"; // Mã ngân hàng VietQR (Vietcombank)
export const ACCOUNT_NO = "1934914315";
export const ACCOUNT_NAME = "TRAN VUONG HUNG";

export function buildVietQrUrl(amount, orderId) {
  const params = new URLSearchParams({
    amount: String(Math.round(amount)),
    addInfo: `Thanh toan don ${orderId}`,
    accountName: ACCOUNT_NAME,
  });

  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?${params.toString()}`;
}