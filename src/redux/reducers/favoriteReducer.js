// PHẦN 1: IMPORTS
import { createSlice } from "@reduxjs/toolkit";
import { loadFavorites, toggleFavorite } from "../actions/favoriteThunk";
// ↑ Import createSlice từ Redux Toolkit để tạo reducer và actions
// ↑ Import createAsyncThunk để xử lý các async actions

// PHẦN 2: KHỞI TẠO STATE
const initialState = {
  favoriteList: [], // Danh sách các ID yêu thích
  isLoading: false, // Trạng thái loading
  error: null, // Thông tin lỗi nếu có
};

// PHẦN 3: TẠO SLICE
const favoritesSlice = createSlice({
  name: "favorites", // Tên của slice, sẽ là prefix cho các action
  initialState, // State ban đầu

  // Các reducers thông thường - xử lý sync actions
  reducers: {
    // Reset lỗi
    clearError: (state) => {
      state.error = null;
    },
  },

  // Xử lý các async actions từ thunk
  extraReducers: (builder) => {
    builder
      // Xử lý thunk loadFavorites
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favoriteList = action.payload;
        state.isLoading = false;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      // Xử lý thunk toggleFavorite
      .addCase(toggleFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favoriteList = action.payload;
        state.isLoading = false;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

// PHẦN 4: EXPORTS
// Export actions
export const { clearError } = favoritesSlice.actions;

// Export reducer
export default favoritesSlice.reducer;
