import axiosInstance from "./axiosInstance";

const HomeService = {
  // Lấy danh sách nguyên liệu nhóm theo loại
  getIngredientsGroupedByType: async () => {
    try {
      const response = await axiosInstance.get("/Home/ingredients/type");
      return response.data;
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      throw error;
    }
  },

  getIngredientsByType: async (type) => {
    try {
      const response = await axiosInstance.get(`/Home/ingredients/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ingredients for type ${type}:`, error);
      throw error;
    }
  },

  // Lấy nguyên liệu theo ID
  getIngredientById: async (ingredientId) => {
    try {
      const response = await axiosInstance.get(`/ingredients/${ingredientId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ingredient with ID ${ingredientId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getDishesGroupedByType: async () => {
    try {
      const response = await axiosInstance.get("/Home/dishes/type");
      return response.data;
    } catch (error) {
      console.error("Error fetching dishes:", error);
      throw error;
    }
  },

  getDishesByType: async (type) => {
    try {
      const response = await axiosInstance.get(`/Home/dishes/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dishes for type ${type}:`, error);
      throw error;
    }
  },

  getDishesBySeason: async (season, pageNum, limit) => {
    try {
      const response = await axiosInstance.get(`/dishes/by-season`, {
        params: {
          season,
          pageNum,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching dishes for type ${season}:`, error);
      throw error;
    }
  },

  // 🔹 Lấy tất cả món ăn với phân trang
  getAllDishes: async (page, limit, search = "") => {
    try {
      const response = await axiosInstance.get("/dishes", {
        params: {
          page,
          limit,
          search, // Thêm tham số tìm kiếm
        },
      });
      console.log("🔍 Danh sách món ăn từ API:", response.data);
      return {
        success: true,
        data: {
          items: response.data.data.items || [],
          total: response.data.data.total || 0,
          currentPage: response.data.data.currentPage || page,
          totalPages: response.data.data.totalPages || 1,
        },
      };
    } catch (error) {
      console.error("❌ Lỗi khi lấy món ăn:", error.response?.data || error.message);
      return { success: false, message: "Lỗi khi tải danh sách món ăn" };
    }
  },

  getDishById: async (dishId) => {
    try {
      const response = await axiosInstance.get(`/dishes/${dishId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dish with ID ${dishId}:`, error);
      throw error;
    }
  },

  getRecipeByRecipeId: async (dishId, recipeId) => {
    try {
      const response = await axiosInstance.get(`/recipes/${dishId}/${recipeId}`);
      return {
        success: true,
        data: response.data?.data || response.data || {},
      };
    } catch (error) {
      console.error("Error fetching recipe:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load recipe.",
      };
    }
  },

  getFavoriteDishes: async (userId) => {
    try {
      const response = await axiosInstance.get(`/favoriteDishes/${userId}`);
      console.log("UserId", userId);
      if (response.data.status === "success") {
        return response.data.data
          .filter((item) => item.isLike)
          .map((item) => ({
            dishId: item.dishId._id,
            isLike: item.isLike,
          }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching favorite dishes:", error);
      return [];
    }
  },

  toggleFavoriteDish: async (userId, dishId, isLiked) => {
    try {
      if (isLiked) {
        await axiosInstance.delete(`/favoriteDishes`, {
          data: { userId, dishId },
        });
      } else {
        await axiosInstance.post(`/favoriteDishes`, { userId, dishId });
      }
      return !isLiked;
    } catch (error) {
      console.error("Error toggling favorite dish:", error);
      return isLiked;
    }
  },
};

export default HomeService;
