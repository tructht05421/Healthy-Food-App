// === PHẦN 1: IMPORT ===
import moment from "moment";
// Import thư viện moment.js để xử lý date/time

// === PHẦN 2: FORMAT PRICE ===
export const formatPrice = (price) => {
  // Chuyển đổi input thành số nếu là string
  if (typeof price !== "number") price = parseFloat(price);
  // Kiểm tra nếu giá trị không hợp lệ
  if (isNaN(price)) return "Invalid price";

  // Sử dụng Intl.NumberFormat để format số theo định dạng tiền tệ
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Kiểu format là tiền tệ
    currency: "USD", // Đơn vị tiền tệ là USD
  }).format(price);
};
// Ví dụ:
// formatPrice(1000) => "$1,000.00"
// formatPrice("1000.50") => "$1,000.50"
// formatPrice("abc") => "Invalid price"

// === PHẦN 3: FORMAT DATE ===
export const formatDate = (date) => {
  // Chuyển đổi input thành moment object
  const momentDate = moment(date);
  // Kiểm tra tính hợp lệ của ngày
  if (!momentDate.isValid()) return "Invalid date";

  // Format ngày theo định dạng DD-MM-YYYY
  return momentDate.format("DD-MM-YYYY");
};
// Ví dụ:
// formatDate("2024-01-11") => "11-01-2024"
// formatDate("invalid") => "Invalid date"

// === PHẦN 4: FORMAT TIME ===
export const formatTime = (date) => {
  // Chuyển đổi input thành moment object
  const momentDate = moment(date);
  // Kiểm tra tính hợp lệ của thời gian
  if (!momentDate.isValid()) return "Invalid time";

  // Format thời gian theo định dạng mm-HH
  return momentDate.format("mm-HH");
};
// Ví dụ:
// formatTime("2024-01-11 14:30") => "30-14"
// formatTime("invalid") => "Invalid time"
