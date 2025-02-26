import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Custom hook để quản lý danh sách yêu thích
 * @param {string} storageKey - Khóa để lưu trữ trong AsyncStorage
 * @returns {Object} - { favoriteList, onChangeFavorite, isLoading, error }
 */
const useFavorites = (storageKey = "favorites") => {
  const [favoriteList, setFavoriteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách yêu thích từ AsyncStorage khi khởi chạy
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const storedFavorites = await AsyncStorage.getItem(storageKey);

        if (storedFavorites) {
          setFavoriteList(JSON.parse(storedFavorites));
        }
      } catch (err) {
        setError("Không thể tải danh sách yêu thích");
        console.error("Lỗi khi tải danh sách yêu thích:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [storageKey]);

  // Lưu danh sách yêu thích vào AsyncStorage
  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newFavorites));
    } catch (err) {
      setError("Không thể lưu danh sách yêu thích");
      console.error("Lỗi khi lưu danh sách yêu thích:", err);
    }
  };

  // Hàm thay đổi trạng thái yêu thích (thêm/xóa)
  const onChangeFavorite = useCallback(
    async (id) => {
      let newFavorites;

      if (favoriteList.includes(id)) {
        // Nếu id đã tồn tại, xóa khỏi danh sách
        newFavorites = favoriteList.filter((itemId) => itemId !== id);
      } else {
        // Nếu id chưa tồn tại, thêm vào danh sách
        newFavorites = [...favoriteList, id];
      }

      // Cập nhật state
      setFavoriteList(newFavorites);

      // Lưu vào AsyncStorage
      await saveFavorites(newFavorites);
    },
    [favoriteList, storageKey]
  );

  // Kiểm tra xem một id có trong danh sách yêu thích không
  const isFavorite = useCallback(
    (id) => {
      return favoriteList.includes(id);
    },
    [favoriteList]
  );

  return {
    favoriteList,
    onChangeFavorite,
    isFavorite,
    isLoading,
    error,
  };
};

export default useFavorites;
