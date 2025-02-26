import axiosInstance from "./axiosInstance";

export const getDishes = async (dishid) => {
  try {
    const response = await axiosInstance.get(
      `api/v1/dishes${dishid ? `/${dishid}` : ""}`
    );
    return response;
  } catch (error) {
    console.log("getDishes in service/dishes error : ", error);
    return error;
  }
};

export const createDishes = async (dishid) => {
  try {
    const response = await axiosInstance.get(
      `api/v1/dishes${dishid ? `/${dishid}` : ""}`
    );
    return response;
  } catch (error) {
    console.log("getDishes in service/dishes error : ", error);
    return error;
  }
};

export const getRecipes = async (recipeId) => {
  try {
    const response = await axiosInstance.get(
      `api/v1/dishes/recipes${recipeId ? `/${recipeId}` : ""}`
    );
    return response;
  } catch (error) {
    console.log("getRecipes in service/dishes error : ", error);
    return error;
  }
};
