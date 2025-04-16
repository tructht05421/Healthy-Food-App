import React, { useEffect, useMemo, useState, useCallback } from "react"; // Import các hooks từ React
import {
  View, // Component để tạo khung layout
  Text, // Component để hiển thị text
  ScrollView, // Component cho phép cuộn nội dung
  TouchableOpacity, // Component tạo vùng có thể chạm/nhấn
  StyleSheet, // API để tạo stylesheet
  RefreshControl, // Component hiển thị animation khi kéo để làm mới
  ActivityIndicator, // Component hiển thị trạng thái đang tải
} from "react-native"; // Import các components từ React Native
import MaterialCommunityIcons from "../components/common/VectorIcons/MaterialCommunityIcons"; // Import icon từ thư viện Material Community
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper"; // Import component layout chính
import DishedV1 from "../components/common/DishedV1"; // Import component hiển thị món ăn
import dishesService from "../services/dishService"; // Import service để lấy dữ liệu món ăn
import { useTheme } from "../contexts/ThemeContext"; // Import hook để sử dụng theme
import { useSelector } from "react-redux"; // Import hook để lấy state từ Redux store
import { userSelector } from "../redux/selectors/selector"; // Import selector để lấy thông tin user từ Redux
import quizService from "../services/quizService"; // Import service liên quan đến quiz

const ForYou = ({ navigation }) => { // Định nghĩa component ForYou với tham số navigation
  const { theme } = useTheme(); // Lấy theme từ context
  const [dishes, setDishes] = useState([]); // State lưu danh sách món ăn
  const [sortType, setSortType] = useState(""); // State lưu loại sắp xếp
  const [refreshing, setRefreshing] = useState(false); // State kiểm soát trạng thái refresh
  const [loading, setLoading] = useState({ initial: true, more: false }); // State kiểm soát trạng thái loading
  const [page, setPage] = useState(1); // State lưu số trang hiện tại
  const [hasMore, setHasMore] = useState(true); // State kiểm tra còn trang tiếp theo không
  const limit = 10; // Số lượng món ăn tối đa trên mỗi trang
  const user = useSelector(userSelector); // Lấy thông tin user từ Redux store
  const userId = user?._id; // Lấy id của user, sử dụng optional chaining để tránh lỗi

  const loadForYouDishes = useCallback(
    async (pageNum, isRefresh = false) => { // Hàm tải danh sách món ăn được gợi ý
      try {
        const response = await quizService.getForyou(userId, pageNum, limit); // Gọi API để lấy dữ liệu
        if (response.success) { // Kiểm tra nếu API trả về thành công
          const newDishes = response.dishes || []; // Lấy danh sách món ăn mới, nếu không có thì là mảng rỗng
          // Loại bỏ các món ăn trùng lặp dựa trên _id
          setDishes((prev) => {
            const existingIds = isRefresh ? new Set() : new Set(prev.map((dish) => dish._id)); // Tạo Set chứa id của các món ăn hiện có
            const filteredNewDishes = newDishes.filter((dish) => !existingIds.has(dish._id)); // Lọc các món ăn không trùng lặp
            const updatedDishes = isRefresh ? newDishes : [...prev, ...filteredNewDishes]; // Nếu refresh thì thay thế hoàn toàn, không thì thêm vào
            return updatedDishes; // Trả về danh sách món ăn đã cập nhật
          });
          setPage(pageNum); // Cập nhật số trang hiện tại
          setHasMore(pageNum < response.pagination.totalPages); // Kiểm tra còn trang tiếp theo không
        } else {
          console.error("Failed to load for you dishes:", response?.message); // Log lỗi nếu API không thành công
          setHasMore(false); // Đánh dấu không còn trang tiếp theo
        }
      } catch (error) {
        console.error("Error loading for you dishes:", error.message); // Log lỗi nếu có exception
        setHasMore(false); // Đánh dấu không còn trang tiếp theo
      }
    },
    [userId] // useCallback dependency, chỉ tạo lại hàm khi userId thay đổi
  );

  useEffect(() => {
    loadForYouDishes(1, true).then(() => { // Tải dữ liệu lần đầu khi component mount
      setLoading((prev) => ({ ...prev, initial: false })); // Đánh dấu đã tải xong dữ liệu ban đầu
    });
  }, [loadForYouDishes]); // useEffect dependency, chạy lại khi loadForYouDishes thay đổi

  const loadMoreDishes = useCallback(async () => { // Hàm tải thêm món ăn khi cuộn đến cuối
    if (!hasMore || loading.more) return; // Nếu không còn món ăn hoặc đang tải thì không làm gì
    setLoading((prev) => ({ ...prev, more: true })); // Đánh dấu đang tải thêm
    await loadForYouDishes(page + 1); // Tải dữ liệu trang tiếp theo
    setLoading((prev) => ({ ...prev, more: false })); // Đánh dấu đã tải xong
  }, [hasMore, loading.more, page, loadForYouDishes]); // useCallback dependency

  const onRefresh = useCallback(async () => { // Hàm xử lý khi người dùng kéo để làm mới
    setRefreshing(true); // Đánh dấu đang làm mới
    setPage(1); // Reset về trang đầu tiên
    setHasMore(true); // Đặt lại trạng thái còn trang tiếp theo
    await loadForYouDishes(1, true); // Tải lại dữ liệu từ trang đầu
    setRefreshing(false); // Đánh dấu đã làm mới xong
  }, [loadForYouDishes]); // useCallback dependency

  const toggleSort = useCallback(() => { // Hàm chuyển đổi kiểu sắp xếp
    setSortType((prev) => (prev === "asc" ? "desc" : "asc")); // Đổi giữa tăng dần và giảm dần
  }, []); // useCallback dependency, không có dependency

  const sortedDishes = useMemo(() => { // Tính toán danh sách món ăn đã sắp xếp
    const sorted = [...dishes]; // Tạo bản sao của danh sách món ăn
    if (sortType === "asc") { // Nếu sắp xếp tăng dần
      return sorted.sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên từ A-Z
    } else if (sortType === "desc") { // Nếu sắp xếp giảm dần
      return sorted.sort((a, b) => b.name.localeCompare(a.name)); // Sắp xếp theo tên từ Z-A
    }
    return sorted; // Trả về danh sách gốc nếu không có sắp xếp
  }, [dishes, sortType]); // useMemo dependency, tính toán lại khi dishes hoặc sortType thay đổi

  const handleScroll = useCallback(
    ({ nativeEvent }) => { // Hàm xử lý sự kiện cuộn
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent; // Lấy thông tin về vị trí cuộn
      const paddingToBottom = 20; // Khoảng cách từ đáy để bắt đầu tải thêm
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) { // Nếu cuộn gần đến cuối
        loadMoreDishes(); // Tải thêm món ăn
      }
    },
    [loadMoreDishes] // useCallback dependency
  );

  return (
    <MainLayoutWrapper> // Bao bọc bởi layout chính
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}> // Container chính với màu nền từ theme
        <View style={styles.sortHeader}> // Header chứa tiêu đề và nút sắp xếp
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>For You Dishes</Text> // Tiêu đề với màu chữ từ theme
          <TouchableOpacity style={styles.sortButton} onPress={toggleSort}> // Nút sắp xếp có thể nhấn
            <Text style={[styles.sortText, { color: theme.textColor }]}>
              Sort ({sortType || "none"}) // Hiển thị kiểu sắp xếp hiện tại
            </Text>
            <MaterialCommunityIcons name="sort" size={20} color={theme.textColor} /> // Icon sắp xếp
          </TouchableOpacity>
        </View>

        {loading.initial ? ( // Kiểm tra nếu đang tải dữ liệu ban đầu
          <View style={styles.loadingContainer}> // Container hiển thị loading
            <ActivityIndicator size="large" color={theme.primary} /> // Indicator hiển thị đang tải
          </View>
        ) : ( // Nếu không phải đang tải ban đầu
          <ScrollView
            style={styles.scrollView} // Style cho ScrollView
            showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
            onScroll={handleScroll} // Gắn hàm xử lý sự kiện cuộn
            scrollEventThrottle={16} // Tần suất gọi sự kiện cuộn (16ms ~ 60fps)
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Thêm control để kéo làm mới
          >
            {sortedDishes.length > 0 ? ( // Kiểm tra nếu có món ăn
              sortedDishes.map((dish, index) => (
                <DishedV1 dish={dish} key={`${dish._id}-${index}`} /> // Render từng món ăn bằng component DishedV1
              ))
            ) : ( // Nếu không có món ăn nào
              <Text style={[styles.noResultsText, { color: theme.textColor }]}>
                No recommended dishes found // Hiển thị thông báo không tìm thấy món ăn
              </Text>
            )}
            {loading.more && ( // Nếu đang tải thêm món ăn
              <ActivityIndicator size="large" color={theme.primary} style={styles.loadingMore} /> // Hiển thị indicator đang tải ở cuối danh sách
            )}
          </ScrollView>
        )}
      </View>
    </MainLayoutWrapper>
  );
};

const styles = StyleSheet.create({ // Định nghĩa stylesheet cho component
  container: { // Style cho container chính
    flex: 1, // Chiếm toàn bộ không gian có sẵn
    paddingHorizontal: 16, // Padding hai bên trái phải
    overflow: "visible", // Cho phép nội dung tràn ra ngoài
  },
  scrollView: { // Style cho ScrollView
    paddingHorizontal: 2, // Padding nhỏ hai bên trái phải
  },
  sortHeader: { // Style cho header chứa tiêu đề và nút sắp xếp
    flexDirection: "row", // Sắp xếp các phần tử theo hàng ngang
    justifyContent: "space-between", // Căn đều không gian giữa các phần tử
    alignItems: "center", // Căn giữa theo chiều dọc
    marginBottom: 12, // Margin bên dưới
  },
  headerTitle: { // Style cho tiêu đề
    fontSize: 18, // Kích thước chữ
    fontWeight: "bold", // Chữ đậm
  },
  sortButton: { // Style cho nút sắp xếp
    flexDirection: "row", // Sắp xếp các phần tử theo hàng ngang
    alignItems: "center", // Căn giữa theo chiều dọc
    padding: 4, // Padding xung quanh
    borderRadius: 8, // Bo góc
    backgroundColor: "white", // Màu nền trắng
    shadowColor: "#343C41", // Màu đổ bóng
    shadowOffset: { width: 0, height: 2 }, // Độ dịch chuyển của bóng
    shadowOpacity: 0.25, // Độ trong suốt của bóng
    shadowRadius: 3.84, // Bán kính mờ của bóng
    elevation: 5, // Độ nổi trên Android
  },
  sortText: { // Style cho text trong nút sắp xếp
    marginRight: 5, // Margin bên phải
    fontSize: 14, // Kích thước chữ
  },
  loadingContainer: { // Style cho container hiển thị loading
    flex: 1, // Chiếm toàn bộ không gian có sẵn
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
  },
  loadingMore: { // Style cho indicator tải thêm
    marginVertical: 20, // Margin trên dưới
  },
  noResultsText: { // Style cho text thông báo không có kết quả
    fontSize: 16, // Kích thước chữ
    textAlign: "center", // Căn giữa text
    marginTop: 20, // Margin trên
  },
});

export default ForYou; // Export component để sử dụng ở nơi khác