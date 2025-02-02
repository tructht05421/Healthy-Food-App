// PHẦN 1: IMPORT
import { createAsyncThunk } from "@reduxjs/toolkit";
// ↑ Import createAsyncThunk từ Redux Toolkit
// createAsyncThunk là một utility function giúp tạo action creators
// cho các tác vụ bất đồng bộ (async operations)

// import { login } from "../../services/auth.services";
// ↑ Import hàm login từ service (đang bị comment)
// Thường sẽ chứa logic gọi API đăng nhập

// PHẦN 2: TẠO ASYNC THUNK
export const loginThunk = createAsyncThunk(
  "user/login", // ↑ Action type prefix - định danh cho action
  // Khi thunk này chạy, nó sẽ tạo ra 3 action types:
  // - user/login/pending: khi bắt đầu
  // - user/login/fulfilled: khi thành công
  // - user/login/rejected: khi thất bại

  // Payload Creator Function
  async (credentials, { rejectWithValue }) => {
    // ↑ credentials: tham số truyền vào khi gọi thunk (email, password)
    // rejectWithValue: utility để xử lý lỗi một cách graceful

    try {
      // const response = await login(credentials);
      // return response;
      // ↑ Gọi API đăng nhập và trả về response (đang bị comment)
      // Response sẽ tự động trở thành payload của action fulfilled
    } catch (error) {
      // Xử lý lỗi
      return rejectWithValue(error.response?.data || "Something went wrong");
      // ↑ Trả về error message từ API hoặc message mặc định
      // Sẽ trở thành payload của action rejected
    }
  }
);
