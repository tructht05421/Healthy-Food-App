import { createAsyncThunk } from "@reduxjs/toolkit";
// ↑ Import createSlice từ Redux Toolkit để tạo reducer và actions
// ↑ Import createAsyncThunk để xử lý các async actions
import AsyncStorage from "@react-native-async-storage/async-storage";
// ↑ Import AsyncStorage để tương tác với bộ nhớ local

// PHẦN 2: TẠO ASYNC THUNKS
// Thunk để load danh sách yêu thích
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (storageKey = "favorites", { rejectWithValue }) => {
    try {
      const storedFavorites = await AsyncStorage.getItem(storageKey);

      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
      return rejectWithValue("Không thể tải danh sách yêu thích");
    }
  }
);

// Thunk để thay đổi trạng thái yêu thích (thêm/xóa)
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async ({ id, storageKey = "favorites" }, { getState, rejectWithValue }) => {
    try {
      // Lưu ý cách truy cập state đúng tại đây:
      const favoriteList = getState().favorite.favoriteList;
      let newFavorites;

      if (favoriteList.includes(id)) {
        // Nếu id đã tồn tại, xóa khỏi danh sách
        newFavorites = favoriteList.filter((itemId) => itemId !== id);
      } else {
        // Nếu id chưa tồn tại, thêm vào danh sách
        newFavorites = [...favoriteList, id];
      }

      // Lưu vào AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(newFavorites));

      return newFavorites;
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
      return rejectWithValue("Không thể lưu danh sách yêu thích");
    }
  }
);
