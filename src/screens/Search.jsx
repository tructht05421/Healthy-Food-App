import React, { useEffect, useMemo, useState, useCallback } from "react"; // Import các hooks từ React
import {
  View, // Component để tạo khung layout
  Text, // Component để hiển thị text
  ScrollView, // Component cho phép cuộn nội dung
  TouchableOpacity, // Component tạo vùng có thể chạm/nhấn
  TextInput, // Component nhập liệu text
  StyleSheet, // API để tạo stylesheet
  Dimensions, // API để lấy kích thước màn hình
  ActivityIndicator, // Component hiển thị trạng thái đang tải
} from "react-native"; // Import các components từ React Native
import MaterialCommunityIcons from "../components/common/VectorIcons/MaterialCommunityIcons"; // Import icon từ thư viện Material Community
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper"; // Import component layout chính
import SearchBar from "../components/common/SearchBar"; // Import component thanh tìm kiếm
import DishedV2 from "../components/common/DishedV2"; // Import component hiển thị món ăn phiên bản 2
import CategoryCard from "../components/common/CategoryCard"; // Import component hiển thị danh mục
import { DishType } from "../constants/DishType"; // Import các loại món ăn từ constants
import ShowToast from "../components/common/CustomToast"; // Import component hiển thị thông báo
import { getSearchHistory } from "../utils/common"; // Import hàm lấy lịch sử tìm kiếm
import { useTheme } from "../contexts/ThemeContext"; // Import hook để sử dụng theme
import { ScreensName } from "../constants/ScreensName"; // Import tên các màn hình
import dishService from "../services/dishService"; // Import service để lấy dữ liệu món ăn

const WIDTH = Dimensions.get("window").width; // Lấy chiều rộng màn hình

const CategoryButton = ({ title, isActive = false, onclick }) => ( // Component nút danh mục với các props
  <TouchableOpacity
    style={[
      styles.categoryButton, // Style cơ bản
      { backgroundColor: isActive ? "#38B2AC" : "#F8E1D4" }, // Màu nền dựa vào trạng thái active
    ]}
    onPress={() => {
      onclick && onclick(); // Gọi hàm onclick nếu được truyền vào
    }}
  >
    <Text
      style={[
        styles.categoryButtonText, // Style cơ bản cho text
        { color: isActive ? "white" : "#FF6B00" }, // Màu chữ dựa vào trạng thái active
      ]}
    >
      {title} // Hiển thị tiêu đề
    </Text>
  </TouchableOpacity>
);

const SearchScreen = ({ route, navigation }) => { // Component màn hình tìm kiếm với các props
  const [searchResults, setSearchResults] = useState([]); // State lưu kết quả tìm kiếm
  const [searchMode, setSearchMode] = useState("initial"); // State lưu chế độ tìm kiếm (ban đầu hoặc đã có kết quả)
  const [searchQuery, setSearchQuery] = useState(""); // State lưu chuỗi tìm kiếm
  const [history, setHistory] = useState([]); // State lưu lịch sử tìm kiếm
  const [sortType, setSortType] = useState(""); // State lưu loại sắp xếp
  const [page, setPage] = useState(1); // State lưu số trang hiện tại
  const [hasMore, setHasMore] = useState(true); // State kiểm tra còn trang tiếp theo không
  const [loading, setLoading] = useState({ initial: false, more: false }); // State kiểm soát trạng thái loading
  const [searchType, setSearchType] = useState("name"); // State lưu loại tìm kiếm (theo tên hoặc danh mục)
  const [category, setCategory] = useState(""); // State lưu danh mục đang tìm kiếm
  const limit = 10; // Số lượng món ăn tối đa trên mỗi trang
  const { theme } = useTheme(); // Lấy theme từ context

  const loadHistory = async () => { // Hàm tải lịch sử tìm kiếm
    const savedHistory = await getSearchHistory(); // Gọi hàm lấy lịch sử từ storage
    setHistory(savedHistory); // Cập nhật state lịch sử
  };

  useEffect(() => { // Effect chạy khi có thay đổi từ tham số truyền vào route
    if (route.params?.category || route.params?.searchQuery) { // Kiểm tra nếu có tham số danh mục hoặc chuỗi tìm kiếm
      if (route.params?.category) { // Nếu có tham số danh mục
        setSearchQuery(route.params.category.name); // Cập nhật chuỗi tìm kiếm là tên danh mục
        handleSearchByCategory(route.params.category.name, 1, true); // Gọi hàm tìm kiếm theo danh mục
      }

      if (route.params?.searchQuery) { // Nếu có tham số chuỗi tìm kiếm
        setSearchQuery(route.params.searchQuery); // Cập nhật chuỗi tìm kiếm
        handleSearch(route.params.searchQuery, 1, true); // Gọi hàm tìm kiếm theo chuỗi
      }
    } else { // Nếu không có tham số
      loadHistory(); // Tải lịch sử tìm kiếm
    }
  }, [route.params?.category, route.params?.searchQuery]); // Chạy lại khi tham số thay đổi

  useEffect(() => { // Effect chạy khi kết quả tìm kiếm thay đổi
    if (searchResults.length > 0) { // Nếu có kết quả tìm kiếm
      setSearchMode("results"); // Chuyển sang chế độ hiển thị kết quả
    } else if (searchMode === "results" && !loading.initial) { // Nếu đang ở chế độ kết quả nhưng không có kết quả và không đang tải
      ShowToast("error", "No results found"); // Hiển thị thông báo không tìm thấy kết quả
    }
  }, [searchResults, searchMode, loading.initial]); // Chạy lại khi các state thay đổi

  const handleSearch = async (searchString, pageNum = 1, isRefresh = false) => { // Hàm xử lý tìm kiếm theo tên
    setLoading((prev) => ({ ...prev, initial: isRefresh })); // Cập nhật trạng thái loading
    setSearchType("name"); // Đặt loại tìm kiếm là theo tên

    try {
      const params = { // Tạo tham số cho API
        name: searchString, // Tên cần tìm
        page: pageNum, // Số trang
        limit, // Giới hạn số lượng
        sort: "createdAt", // Sắp xếp theo ngày tạo
        order: "desc", // Thứ tự giảm dần
      };
      setSearchQuery(params.name); // Cập nhật chuỗi tìm kiếm
      const response = await dishService.searchDishByName(params); // Gọi API tìm kiếm món ăn theo tên

      if (response.status === "success") { // Nếu API trả về thành công
        const newDishes = response.data.items; // Lấy danh sách món ăn mới

        setSearchResults((prev) => { // Cập nhật kết quả tìm kiếm
          const existingIds = new Set(
            isRefresh ? [] : prev.map((dish) => dish._id) // Nếu làm mới thì tạo Set rỗng, không thì lấy ID của các món ăn hiện có
          );
          const filteredNewDishes = newDishes.filter(
            (dish) => !existingIds.has(dish._id) // Lọc các món ăn không trùng lặp
          );
          return isRefresh
            ? filteredNewDishes // Nếu làm mới thì thay thế hoàn toàn
            : [...prev, ...filteredNewDishes]; // Không thì thêm vào danh sách hiện có
        });

        setPage(pageNum); // Cập nhật số trang hiện tại
        setHasMore(pageNum < response.data.totalPages); // Kiểm tra còn trang tiếp theo không
      } else { // Nếu API không thành công
        ShowToast("error", response.message || "Something went wrong"); // Hiển thị thông báo lỗi
        setHasMore(false); // Đánh dấu không còn trang tiếp theo
      }
    } catch (error) { // Bắt lỗi nếu có
      ShowToast("error", error.message || "Something went wrong"); // Hiển thị thông báo lỗi
      setHasMore(false); // Đánh dấu không còn trang tiếp theo
    } finally { // Luôn thực hiện dù có lỗi hay không
      setLoading((prev) => ({ ...prev, initial: false })); // Cập nhật trạng thái không còn loading
    }

    loadHistory(); // Tải lại lịch sử tìm kiếm
  };

  const handleSearchByCategory = async (
    typeName, // Tên loại món ăn
    pageNum = 1, // Số trang, mặc định là 1
    isRefresh = false // Có phải làm mới không, mặc định là false
  ) => { // Hàm xử lý tìm kiếm theo danh mục
    setLoading((prev) => ({ ...prev, initial: isRefresh })); // Cập nhật trạng thái loading
    setSearchType("category"); // Đặt loại tìm kiếm là theo danh mục
    setCategory(typeName); // Cập nhật danh mục đang tìm kiếm
    setSearchQuery(typeName); // Cập nhật chuỗi tìm kiếm là tên danh mục
    try {
      const params = { // Tạo tham số cho API
        page: pageNum, // Số trang
        limit, // Giới hạn số lượng
        sort: "createdAt", // Sắp xếp theo ngày tạo
        order: "desc", // Thứ tự giảm dần
      };
      const response = await dishService.getDishByType(typeName, params); // Gọi API lấy món ăn theo loại

      if (response.status === "success") { // Nếu API trả về thành công
        const newDishes = response.data.items; // Lấy danh sách món ăn mới

        setSearchResults((prev) => { // Cập nhật kết quả tìm kiếm
          const existingIds = new Set(
            isRefresh ? [] : prev.map((dish) => dish._id) // Nếu làm mới thì tạo Set rỗng, không thì lấy ID của các món ăn hiện có
          );
          const filteredNewDishes = newDishes.filter(
            (dish) => !existingIds.has(dish._id) // Lọc các món ăn không trùng lặp
          );
          return isRefresh
            ? filteredNewDishes // Nếu làm mới thì thay thế hoàn toàn
            : [...prev, ...filteredNewDishes]; // Không thì thêm vào danh sách hiện có
        });

        setPage(pageNum); // Cập nhật số trang hiện tại
        setHasMore(pageNum < response.data.totalPages); // Kiểm tra còn trang tiếp theo không
      } else { // Nếu API không thành công
        ShowToast("error", response.message || "No results found"); // Hiển thị thông báo lỗi
        setHasMore(false); // Đánh dấu không còn trang tiếp theo
      }
    } catch (error) { // Bắt lỗi nếu có
      ShowToast("error", error.message || "Failed to fetch dishes by type"); // Hiển thị thông báo lỗi
      setHasMore(false); // Đánh dấu không còn trang tiếp theo
    } finally { // Luôn thực hiện dù có lỗi hay không
      setLoading((prev) => ({ ...prev, initial: false })); // Cập nhật trạng thái không còn loading
    }

    loadHistory(); // Tải lại lịch sử tìm kiếm
  };

  const loadMoreResults = async () => { // Hàm tải thêm kết quả khi cuộn đến cuối
    if (!hasMore || loading.more) return; // Nếu không còn trang tiếp theo hoặc đang tải thì dừng
    setLoading((prev) => ({ ...prev, more: true })); // Cập nhật trạng thái đang tải thêm

    if (searchType === "name") { // Nếu đang tìm kiếm theo tên
      await handleSearch(searchQuery, page + 1); // Gọi hàm tìm kiếm theo tên với trang tiếp theo
    } else if (searchType === "category") { // Nếu đang tìm kiếm theo danh mục
      await handleSearchByCategory(category, page + 1); // Gọi hàm tìm kiếm theo danh mục với trang tiếp theo
    }

    setLoading((prev) => ({ ...prev, more: false })); // Cập nhật trạng thái không còn đang tải thêm
  };

  const handleClear = () => { // Hàm xử lý khi xóa tìm kiếm
    setSearchQuery(""); // Xóa chuỗi tìm kiếm
    setSearchResults([]); // Xóa kết quả tìm kiếm
    setSearchMode("initial"); // Về chế độ ban đầu
    setPage(1); // Reset về trang đầu tiên
    setHasMore(true); // Đặt lại trạng thái còn trang tiếp theo
    setSearchType("name"); // Reset loại tìm kiếm về theo tên
    setCategory(""); // Xóa danh mục đang tìm kiếm
  };

  const toggleSort = () => { // Hàm chuyển đổi kiểu sắp xếp
    setSortType((prev) => (prev !== "asc" ? "asc" : "desc")); // Đổi giữa tăng dần và giảm dần
  };

  const filterResult = useMemo(() => { // Tính toán kết quả tìm kiếm đã sắp xếp
    const filteredResult = [...searchResults]; // Tạo bản sao của kết quả tìm kiếm

    if (sortType === "asc") { // Nếu sắp xếp tăng dần
      filteredResult.sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên từ A-Z
    } else if (sortType === "desc") { // Nếu sắp xếp giảm dần
      filteredResult.sort((a, b) => b.name.localeCompare(a.name)); // Sắp xếp theo tên từ Z-A
    }

    return filteredResult; // Trả về kết quả đã sắp xếp
  }, [searchResults, sortType]); // Tính toán lại khi kết quả tìm kiếm hoặc kiểu sắp xếp thay đổi

  const handleScroll = useCallback(
    ({ nativeEvent }) => { // Hàm xử lý sự kiện cuộn
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent; // Lấy thông tin về vị trí cuộn
      const paddingToBottom = 20; // Khoảng cách từ đáy để bắt đầu tải thêm
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom // Nếu cuộn gần đến cuối
      ) {
        loadMoreResults(); // Tải thêm kết quả
      }
    },
    [hasMore, loading.more, page, searchType, searchQuery, category] // Các dependency
  );

  const renderInitialContent = () => ( // Hàm render nội dung ban đầu
    <>
      {history.length > 0 && ( // Nếu có lịch sử tìm kiếm
        <View style={styles.historySection}> // Container cho phần lịch sử
          <Text style={styles.sectionTitle}>Your search history</Text> // Tiêu đề phần lịch sử
          <View style={styles.categoryButtonsRow}> // Container cho các nút danh mục theo hàng
            {history.map((item, key) => ( // Lặp qua từng mục trong lịch sử
              <CategoryButton
                title={item} // Tiêu đề là mục trong lịch sử
                key={key} // Key để React nhận dạng
                onclick={() => { // Hàm được gọi khi nhấn nút
                  setSearchQuery(item); // Đặt chuỗi tìm kiếm là mục trong lịch sử
                  handleSearch(item, 1, true); // Tìm kiếm với mục trong lịch sử
                }}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.browseSection}> // Container cho phần duyệt theo danh mục
        <Text style={styles.sectionTitle}>Browse by category</Text> // Tiêu đề phần duyệt
        <View style={styles.categoriesGrid}> // Container cho lưới danh mục
          {Object.values(DishType).map((category, key) => ( // Lặp qua từng loại món ăn
            <CategoryCard
              key={key} // Key để React nhận dạng
              onPress={() => handleSearchByCategory(category.name, 1, true)} // Hàm được gọi khi nhấn vào danh mục
              category={{ // Thông tin danh mục
                id: key, // ID là index
                ...category, // Thêm các thuộc tính khác của danh mục
              }}
            />
          ))}
        </View>
      </View>
    </>
  );

  const renderResultsContent = () => ( // Hàm render nội dung kết quả tìm kiếm
    <View style={styles.resultsContainer}> // Container cho kết quả tìm kiếm
      <View style={styles.sortHeader}> // Header chứa nút sắp xếp
        <View /> // View rỗng để tạo khoảng trống
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}> // Nút sắp xếp
          <Text style={styles.sortText}>Sort ({sortType || "none"})</Text> // Text hiển thị kiểu sắp xếp
          <MaterialCommunityIcons name="sort" size={20} color="#333" /> // Icon sắp xếp
        </TouchableOpacity>
      </View>

      {loading.initial ? ( // Nếu đang tải ban đầu
        <ActivityIndicator
          size="large" // Kích thước lớn
          color="#38B2AC" // Màu xanh
          style={styles.loading} // Style cho loading
        />
      ) : filterResult.length > 0 ? ( // Nếu có kết quả
        filterResult.map((item) => ( // Lặp qua từng món ăn
          <DishedV2
            key={item._id} // Key để React nhận dạng
            item={item} // Thông tin món ăn
            onPress={() => // Hàm được gọi khi nhấn vào món ăn
              navigation.navigate(ScreensName.favorAndSuggest, { dish: item }) // Chuyển đến màn hình chi tiết
            }
          />
        ))
      ) : ( // Nếu không có kết quả
        <Text style={styles.noResultsText}>No results found</Text> // Hiển thị thông báo không tìm thấy
      )}

      {loading.more && ( // Nếu đang tải thêm
        <ActivityIndicator
          size="large" // Kích thước lớn
          color="#38B2AC" // Màu xanh
          style={styles.loadingMore} // Style cho loading thêm
        />
      )}
    </View>
  );

  return (
    <MainLayoutWrapper> // Bao bọc bởi layout chính
      <View style={styles.container}> // Container chính
        <SearchBar
          placeholder="What do you need?" // Placeholder cho ô tìm kiếm
          value={searchQuery} // Giá trị hiện tại
          onChangeText={setSearchQuery} // Hàm xử lý khi text thay đổi
          onSubmit={() => handleSearch(searchQuery, 1, true)} // Hàm xử lý khi nhấn submit
          onClear={handleClear} // Hàm xử lý khi xóa
        />
        <ScrollView
          style={styles.scrollView} // Style cho ScrollView
          showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
          onScroll={handleScroll} // Gắn hàm xử lý sự kiện cuộn
          scrollEventThrottle={16} // Tần suất gọi sự kiện cuộn (16ms ~ 60fps)
        >
          {searchMode === "initial" // Nếu đang ở chế độ ban đầu
            ? renderInitialContent() // Render nội dung ban đầu
            : renderResultsContent()} // Nếu không thì render nội dung kết quả
        </ScrollView>
      </View>
    </MainLayoutWrapper>
  );
};

const styles = StyleSheet.create({ // Định nghĩa stylesheet cho component
  container: { // Style cho container chính
    flex: 1, // Chiếm toàn bộ không gian có sẵn
    paddingHorizontal: 16, // Padding hai bên trái phải
  },
  scrollView: { // Style cho ScrollView
    flex: 1, // Chiếm toàn bộ không gian có sẵn
  },
  historySection: { // Style cho phần lịch sử tìm kiếm
    marginTop: 16, // Margin trên
  },
  sectionTitle: { // Style cho tiêu đề phần
    fontSize: 16, // Kích thước chữ
    color: "#38B2AC", // Màu chữ xanh
    marginBottom: 12, // Margin dưới
  },
  categoryButtonsRow: { // Style cho hàng các nút danh mục
    flexDirection: "row", // Sắp xếp theo hàng ngang
    flexWrap: "wrap", // Cho phép xuống dòng khi không đủ chỗ
    gap: 10, // Khoảng cách giữa các nút
  },
  categoryButton: { // Style cho nút danh mục
    paddingHorizontal: 12, // Padding hai bên trái phải
    paddingVertical: 6, // Padding trên dưới
    borderRadius: 16, // Bo tròn góc
    marginRight: 8, // Margin phải
  },
  categoryButtonText: { // Style cho text trong nút danh mục
    fontSize: 14, // Kích thước chữ
  },
  browseSection: { // Style cho phần duyệt theo danh mục
    marginTop: 24, // Margin trên
  },
  categoriesGrid: { // Style cho lưới danh mục
    flexDirection: "row", // Sắp xếp theo hàng ngang
    flexWrap: "wrap", // Cho phép xuống dòng khi không đủ chỗ
    justifyContent: "space-around", // Căn đều không gian xung quanh các phần tử
  },
  resultsContainer: { // Style cho container kết quả tìm kiếm
    paddingHorizontal: 16, // Padding hai bên trái phải
    paddingVertical: 8, // Padding trên dưới
  },
  sortHeader: { // Style cho header sắp xếp
    flexDirection: "row", // Sắp xếp theo hàng ngang
    justifyContent: "space-between", // Căn đều không gian giữa các phần tử
    alignItems: "center", // Căn giữa theo chiều dọc
    marginBottom: 16, // Margin dưới
  },
  sortButton: { // Style cho nút sắp xếp
    flexDirection: "row", // Sắp xếp theo hàng ngang
    alignItems: "center", // Căn giữa theo chiều dọc
    padding: 4, // Padding xung quanh
    borderRadius: 8, // Bo góc
    backgroundColor: "white", // Màu nền trắng
    shadowColor: "#343C41", // Màu đổ bóng
    shadowOffset: { // Độ dịch chuyển của bóng
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Độ trong suốt của bóng
    shadowRadius: 3.84, // Bán kính mờ của bóng
    elevation: 5, // Độ nổi trên Android
  },
  sortText: { // Style cho text trong nút sắp xếp
    marginRight: 5, // Margin bên phải
    fontSize: 14, // Kích thước chữ
  },
  noResultsText: { // Style cho text thông báo không có kết quả
    width: "100%", // Chiều rộng 100%
    textAlign: "center", // Căn giữa text
    fontSize: 20, // Kích thước chữ
  },
  loading: { // Style cho loading
    marginVertical: 20, // Margin trên dưới
  },
  loadingMore: { // Style cho loading thêm
    marginVertical: 20, // Margin trên dưới
  },
});

export default SearchScreen; // Export component để sử dụng ở nơi khác