// === PHẦN 1: IMPORTS ===
import axios from "axios";
// Import thư viện axios để thực hiện các HTTP requests

import AsyncStorage from "@react-native-async-storage/async-storage";
// Import AsyncStorage để lưu trữ và đọc dữ liệu locally trong React Native

// === PHẦN 2: KHỞI TẠO BIẾN ===
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
// Lấy API URL từ biến môi trường (environment variables)

// === PHẦN 3: TẠO AXIOS INSTANCE ===
const axiosInstance = axios.create({
  baseURL: apiUrl, // URL cơ sở cho mọi request
  headers: {
    "Content-Type": "application/json", // Set header mặc định
  },
  responseType: "json", // Kiểu response mặc định
  timeout: 30000, // setup timeout để trả về lỗi nếu call 1 api quá lâu
  validateStatus: (status) => status >= 200 && status < 300,
});
console.log(process.env.EXPO_PUBLIC_API_URL);

// === PHẦN 4: CẤU HÌNH INTERCEPTORS ===

// Request Interceptor
axiosInstance.interceptors.request.use(
  // Hàm xử lý trước khi gửi request
  async (config) => {
    // Lấy access token từ AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    // Nếu có access token, thêm vào header Authorization
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  // Hàm xử lý lỗi request
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (đang bị comment)
// axiosInstance.interceptors.response để config tất các response từ server trả về
// ví dụ :
//    chỉ muốn lấy data trên response, sử dụng response.data
// nói chung mỗi khi có response trả về đều đi qua đây
// axiosInstance.interceptors.response.use(
//   // Hàm xử lý response thành công
//   (response) => {
//     return response.data;
//   },
//   // Hàm xử lý response lỗi
//   (error) => {
//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
