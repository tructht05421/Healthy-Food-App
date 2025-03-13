import { createAsyncThunk } from "@reduxjs/toolkit";
// ↑ Import createSlice từ Redux Toolkit để tạo reducer và actions
// ↑ Import createAsyncThunk để xử lý các async actions
import {
  addDishFavorite,
  getFavoriteList,
  removeDishFavorite,
} from "../../services/favoriteService";
import ShowToast from "../../components/common/CustomToast";

// PHẦN 2: TẠO ASYNC THUNKS
// Thunk để load danh sách yêu thích
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await getFavoriteList(getState()?.user?.user?._id);
      if (response.status === 200) {
        const idxList = response?.data?.data.map((item) => {
          return item.dishId._id;
        });
        return idxList;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
      return rejectWithValue("Không thể tải danh sách yêu thích");
    }
  }
);

// Thunk để thay đổi trạng thái yêu thích (thêm/xóa)
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      if (!getState()?.user?.user) {
        ShowToast("error", "Please, login to use this feature");
        return [];
      }
      // Lưu ý cách truy cập state đúng tại đây:
      const favoriteList = getState().favorite.favoriteList;

      if (favoriteList?.includes(id)) {
        // Nếu id đã tồn tại, xóa khỏi danh sách
        const response = await removeDishFavorite(
          getState()?.user?.user?._id,
          id
        );
        if (response?.status === 200) {
          ShowToast("success", "Remove from favorite successfull");
          return favoriteList.filter((itemId) => itemId !== id);
        }
      } else {
        const response = await addDishFavorite(getState()?.user?.user?._id, id);
        // Nếu id chưa tồn tại, thêm vào danh sách
        if (response?.status === 201) {
          ShowToast("success", "Add to favorite successfull");
          return [...favoriteList, id];
        }
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
      return rejectWithValue("Không thể lưu danh sách yêu thích");
    }
  }
);
