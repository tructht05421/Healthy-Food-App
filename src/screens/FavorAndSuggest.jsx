import React, { useEffect, useState } from "react"; // Import React và các hooks
import {
  View, // Component để tạo container
  Text, // Component hiển thị văn bản
  StyleSheet, // API để tạo styles
  Image, // Component hiển thị hình ảnh
  ScrollView, // Component cho phép cuộn
  TouchableOpacity, // Component cho phép nhấn
  Dimensions, // API lấy kích thước màn hình
  ActivityIndicator, // Component hiển thị loading
  Linking, // API để mở link
  Alert, // API hiển thị thông báo
  TextInput, // Component nhập liệu
  Modal, // Component hiển thị modal
} from "react-native"; // Import từ thư viện React Native
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper"; // Import component layout chính
import { TabView, SceneMap, TabBar, TabBarItem } from "react-native-tab-view"; // Import component tab view
import Ionicons from "../components/common/VectorIcons/Ionicons"; // Import icons
import { useDispatch, useSelector } from "react-redux"; // Import hooks của Redux
import { favorSelector, userSelector } from "../redux/selectors/selector"; // Import các selectors
import { toggleFavorite } from "../redux/actions/favoriteThunk"; // Import action Redux
import MaterialCommunityIcons from "../components/common/VectorIcons/MaterialCommunityIcons"; // Import icons
import SpinnerLoading from "../components/common/SpinnerLoading"; // Import component loading
import Rating from "../components/common/Rating"; // Import component đánh giá
import { useTheme } from "../contexts/ThemeContext"; // Import hook theme
import YoutubePlayer from "react-native-youtube-iframe"; // Import component player YouTube
import HomeService from "../services/HomeService"; // Import service cho trang chủ
import { getIngredient } from "../services/ingredient"; // Import service lấy dữ liệu nguyên liệu
import commentService from "./../services/commentService"; // Import service bình luận
import { useNavigation } from "@react-navigation/native"; // Import hook navigation
import RatingModal from "../components/common/RatingModal"; // Import component modal đánh giá
import styles from "./../css/FavorAndSuggestCss"; // Import styles
import { Heart } from "lucide-react-native"; // Import icon trái tim
const HEIGHT = Dimensions.get("window").height; // Lấy chiều cao màn hình
const WIDTH = Dimensions.get("window").width; // Lấy chiều rộng màn hình

function FavorAndSuggest({ route }) {
  // Component chính
  const [dish, setDish] = useState(null); // State lưu trữ thông tin món ăn
  const [recipe, setRecipe] = useState(null); // State lưu trữ công thức
  const [ingredientDetails, setIngredientDetails] = useState([]); // State lưu trữ chi tiết nguyên liệu
  const [personalRate, setPersonalRate] = useState({}); // State lưu trữ đánh giá cá nhân
  const [loading, setLoading] = useState(true); // State kiểm tra trạng thái loading
  const [rating, setRating] = useState(0); // State lưu trữ điểm đánh giá
  const [averageRating, setAverageRating] = useState(0); // State lưu trữ điểm đánh giá trung bình
  const dispatch = useDispatch(); // Hook dispatch của Redux
  const favorite = useSelector(favorSelector); // Lấy trạng thái yêu thích từ Redux
  const user = useSelector(userSelector); // Lấy thông tin người dùng từ Redux
  const { theme } = useTheme(); // Lấy theme hiện tại
  const [ratingModalVisible, setRatingModalVisible] = useState(false); // State hiển thị modal đánh giá
  const [loginModalVisible, setLoginModalVisible] = useState(false); // State hiển thị modal đăng nhập
  const navigation = useNavigation(); // Hook điều hướng
  const [comment, setComment] = useState([]); // State lưu trữ bình luận hiện tại
  const [commentList, setCommentList] = useState([]); // State lưu trữ danh sách bình luận

  // Hook lấy dữ liệu món ăn từ tham số route
  useEffect(() => {
    if (route?.params?.dish) {
      setDish(route.params.dish);
    } else {
      setLoading(false);
      Alert.alert("Error", "Dish data is not available.");
    }
  }, [route?.params?.dish]);

  // Hàm gửi bình luận mới
  const submitComment = async (commentText) => {
    if (!user?._id) {
      // Kiểm tra người dùng đã đăng nhập chưa
      setLoginModalVisible(true);
      return;
    }

    try {
      const res = await commentService.addComment(
        // Gọi API thêm bình luận
        dish._id,
        commentText,
        user._id
      );
      if (!res.success) {
        Alert.alert("Error", res.message || "Failed to submit comment.");
        return;
      }
      const newComment = res.data;
      setCommentList((prev) => [newComment, ...prev]); // Cập nhật danh sách bình luận
      setComment(""); // Xóa nội dung bình luận hiện tại
      Alert.alert("Success", "Your comment has been submitted!");
    } catch (error) {
      console.error("Submit comment error:", error);
      Alert.alert("Error", "Failed to submit comment. Please try again.");
    }
  };

  // Hook lấy danh sách bình luận khi món ăn thay đổi
  useEffect(() => {
    const fetchComments = async () => {
      if (!dish?._id) return;

      setLoading(true);
      try {
        const res = await commentService.getCommentsByDishId(dish._id); // Gọi API lấy bình luận
        let cmtList = res?.data;

        if (Array.isArray(cmtList)) {
          cmtList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo thời gian mới nhất

          // Gán thêm isLiked cho mỗi comment
          const commentsWithIsLiked = cmtList.map((comment) => ({
            ...comment,
            isLiked: comment.likedBy?.includes(user?._id),
          }));

          setCommentList(commentsWithIsLiked);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách comment:", error);
      }

      setLoading(false);
    };

    fetchComments();
  }, [dish, user?._id]); // Chạy lại khi dish hoặc user thay đổi

  // Hàm xử lý thích bình luận
  const handleLike = async (commentId) => {
    try {
      if (!user?._id || !user) {
        // Kiểm tra người dùng đã đăng nhập chưa
        setLoginModalVisible(true);
        return;
      }

      const res = await commentService.toggleLikeComment(commentId, user._id); // Gọi API toggle like

      if (res.success) {
        const updatedComments = commentList.map((item) =>
          item._id === commentId
            ? {
                ...item,
                isLiked: !item.isLiked, // Đảo trạng thái like
                likeCount: item.isLiked
                  ? item.likeCount - 1 // Giảm số lượng like
                  : item.likeCount + 1, // Tăng số lượng like
              }
            : item
        );
        setCommentList(updatedComments); // Cập nhật danh sách bình luận
      } else {
        console.warn("Toggle like failed:", res.message);
      }
    } catch (error) {
      console.log("Like error", error);
    }
  };

  // Hàm lấy đánh giá của công thức
  const fetchRating = async () => {
    if (!recipe?._id || !user?._id) return;

    try {
      const response = await commentService.getRatingsByRecipe(recipe._id); // Gọi API lấy đánh giá
      const ratings = response?.data;
      if (ratings && Array.isArray(ratings)) {
        const myRating = ratings.find(
          // Tìm đánh giá của người dùng hiện tại
          (rating) =>
            rating.userId._id === user._id && rating.recipeId === recipe._id
        );
        const total = ratings.reduce((sum, r) => sum + r.star, 0); // Tính tổng điểm đánh giá
        const average = ratings.length > 0 ? total / ratings.length : 0; // Tính điểm trung bình
        setRating(myRating ?? null);
        setAverageRating(average.toFixed(1)); // Làm tròn đến 1 chữ số thập phân
        console.log("⭐️ My rating:", myRating);
      } else {
        console.warn("Không nhận được dữ liệu từ getRatingsByRecipe");
      }
    } catch (error) {
      console.error("Lỗi khi gọi getRatingsByRecipe:", error);
    }
  };

  // Hàm xử lý đánh giá công thức
  const handleRate = async (ratePoint) => {
    setRecipe((prev) => ({ ...prev, rate: ratePoint })); // Cập nhật điểm đánh giá trong state
    try {
      const res = await commentService.rateRecipe(
        // Gọi API đánh giá công thức
        dish.recipeId,
        user._id,
        ratePoint
      );

      console.log("⭐️ Đánh giá thành công:", res);

      await fetchRating(); // Cập nhật lại đánh giá
    } catch (err) {
      console.error("Lỗi khi gọi rateRecipe:", err);
    }
  };

  // Hook lấy đánh giá khi recipe hoặc user thay đổi
  useEffect(() => {
    fetchRating();
  }, [recipe, user]);

  // Hook tải công thức khi món ăn thay đổi
  useEffect(() => {
    if (!dish?._id || !dish?.recipeId) {
      setLoading(false);
      console.warn("Dish ID or Recipe ID is missing:", dish);
      return;
    }
    loadRecipe();
    loadRate();
  }, [dish]);

  // Hook tải chi tiết nguyên liệu khi công thức thay đổi
  useEffect(() => {
    const fetchIngredientDetails = async () => {
      if (!recipe?.ingredients?.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const detailsObj = [];

        const promises = recipe.ingredients.map(async (ingredient) => {
          console.log("Ingredient:", ingredient);
          console.log("Ingredient ID:", ingredient?.ingredientId);

          if (!ingredient?.ingredientId) return;

          const ingredientId =
            typeof ingredient.ingredientId === "object" &&
            ingredient.ingredientId?._id
              ? ingredient.ingredientId._id
              : ingredient.ingredientId;

          if (!ingredientId || typeof ingredientId !== "string") {
            console.warn("Invalid ingredientId:", ingredientId);
            return;
          }

          const response = await getIngredient(ingredientId); // Gọi API lấy chi tiết nguyên liệu
          if (response?.data?.data) {
            detailsObj.push({
              ...response.data.data,
              quantity: ingredient?.quantity, // Thêm số lượng
              unit: ingredient?.unit, // Thêm đơn vị
            });
          }
        });

        await Promise.all(promises); // Đợi tất cả các promises hoàn thành
        setIngredientDetails(detailsObj); // Cập nhật state chi tiết nguyên liệu
      } catch (error) {
        console.error("Error fetching ingredient details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientDetails();
  }, [recipe]);

  // Hàm tải đánh giá
  const loadRate = async () => {
    const response = await getRatingsByRecipeId(dish.recipeId); // Gọi API lấy đánh giá
    if (response?.status === 200) {
      const findRate = response?.data?.data?.find(
        // Tìm đánh giá của người dùng hiện tại
        (item) => item?.userId?._id === user?._id
      );
      if (findRate) {
        setPersonalRate(findRate); // Cập nhật đánh giá cá nhân
      }
    } else {
      console.log(response?.response?.data);
    }
  };

  // Hàm tải công thức
  const loadRecipe = async () => {
    setLoading(true);

    try {
      const response = await HomeService.getRecipeByRecipeId(
        // Gọi API lấy công thức
        dish._id,
        dish.recipeId
      );
      if (response.success) {
        setRecipe(response.data); // Cập nhật state công thức
      } else {
        Alert.alert("Error", response.message || "Failed to load recipe.");
      }
    } catch (error) {
      console.error("Error loading recipe:", error);
      Alert.alert("Error", "An error occurred while loading the recipe.");
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra món ăn có trong danh sách yêu thích không
  const isFavorite = (id) => {
    return favorite.favoriteList?.includes(id);
  };

  // Hàm xử lý khi nhấn nút lưu yêu thích
  const handleOnSavePress = async (dish) => {
    if (!user?._id) {
      Alert.alert("Error", "Please log in to save favorites.");
      return;
    }
    try {
      // const isLiked = isFavorite(dish._id);
      // await HomeService.toggleFavoriteDish(user.userId, dish._id, isLiked);
      dispatch(toggleFavorite({ id: dish._id })); // Dispatch action Redux để toggle yêu thích
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to toggle favorite.");
    }
  };

  // Hàm trích xuất ID video YouTube từ URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Hàm render card công thức
  const renderRecipeCard = () => {
    const [index, setIndex] = useState(0); // State lưu trữ tab hiện tại
    const [routes] = useState([
      // Danh sách các tab
      { key: "ingredient", title: "Ingredient" },
      { key: "instructions", title: "Instructions" },
      { key: "comments", title: "Comments" },
    ]);

    // Component hiển thị tab nguyên liệu
    const IngredientsRoute = () => (
      <ScrollView
        style={{ ...styles.tabContent }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <SpinnerLoading /> // Hiển thị loading
        ) : (
          <>
            <Text
              style={{ ...styles.sectionTitle, color: theme.greyTextColor }}
            >
              {ingredientDetails.length} Ingredients
            </Text>
            {ingredientDetails.length > 0 ? (
              ingredientDetails
                .map((ingredient, idx) => {
                  if (!ingredient || typeof ingredient !== "object") {
                    console.warn("Invalid ingredient data:", ingredient);
                    return null;
                  }
                  return (
                    <View key={idx} style={styles.ingredientRow}>
                      <Image
                        source={{ uri: ingredient.imageUrl }}
                        style={styles.ingredientImage}
                      />
                      <View style={styles.ingredientInfo}>
                        <Text
                          style={{
                            ...styles.ingredientName,
                            color: theme.greyTextColor,
                          }}
                        >
                          {ingredient.name || "Unknown Ingredient"}
                        </Text>
                        {ingredient.type && (
                          <Text
                            style={{
                              ...styles.ingredientDetail,
                              color: theme.greyTextColor,
                            }}
                          >
                            Type: {ingredient.type}
                          </Text>
                        )}
                        {ingredient.description && (
                          <Text
                            style={{
                              ...styles.ingredientDetail,
                              color: theme.greyTextColor,
                            }}
                          >
                            {ingredient.description}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={{
                          ...styles.ingredientQuantity,
                          color: theme.greyTextColor,
                        }}
                      >
                        {ingredient.quantity || "N/A"} {ingredient.unit || ""}
                      </Text>
                    </View>
                  );
                })
                .filter(Boolean) // Lọc bỏ các phần tử null
            ) : (
              <Text
                style={{ ...styles.noDataText, color: theme.greyTextColor }}
              >
                Failed to load ingredients. Please try again later.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    );

    // Component hiển thị tab hướng dẫn
    const InstructionsRoute = () => {
      const videoId = getYouTubeVideoId(dish?.videoUrl); // Lấy ID video YouTube

      return (
        <ScrollView
          style={styles.tabContent}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          {videoId ? (
            <View style={styles.videoContainer}>
              <YoutubePlayer // Component player YouTube
                height={200}
                play={false}
                videoId={videoId}
                onError={(error) =>
                  console.error("YouTube Player Error:", error)
                }
              />
            </View>
          ) : dish?.videoUrl ? (
            <TouchableOpacity
              style={styles.videoLink}
              onPress={() => Linking.openURL(dish.videoUrl)} // Mở URL video
            >
              <Text style={styles.videoLinkText}>Watch Video Tutorial</Text>
            </TouchableOpacity>
          ) : null}

          <Text
            style={{
              ...styles.sectionTitle,
              color: theme.greyTextColor,
              marginTop: 16,
            }}
          >
            Instructions
          </Text>
          {recipe?.instruction?.length > 0 ? (
            recipe.instruction.map((instruction, idx) => (
              <View key={idx} style={styles.instructionRow}>
                <Text
                  style={{
                    ...styles.instructionStep,
                    color: theme.greyTextColor,
                  }}
                >
                  Step {idx + 1}:
                </Text>
                <Text
                  style={{
                    ...styles.instructionText,
                    color: theme.greyTextColor,
                  }}
                >
                  {instruction?.description || "No description available."}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ ...styles.noDataText, color: theme.greyTextColor }}>
              No instructions available.
            </Text>
          )}
        </ScrollView>
      );
    };

    // Component hiển thị tab bình luận và đánh giá
    const CommentRatingRoute = () => (
      <ScrollView
        style={styles.tabContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ ...styles.sectionTitle, color: theme.greyTextColor }}>
          All Comments
        </Text>

        {/* Danh sách bình luận */}
        {commentList.length > 0 ? (
          commentList.map((comment, index) => (
            <View key={index} style={styles.commentBox}>
              {/* Avatar + tên người dùng + đánh giá sao */}
              <View style={styles.commentHeader}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...styles.commentUser,
                      color: theme.greyTextColor,
                    }}
                  >
                    {comment.userId.email || "Anonymous"}
                  </Text>
                  {comment.star !== undefined && (
                    <Text
                      style={{
                        ...styles.commentRating,
                        color: theme.greyTextColor,
                      }}
                    >
                      Rating: {comment.star} ★
                    </Text>
                  )}
                </View>
              </View>

              {/* Nội dung bình luận */}
              <Text
                style={{ ...styles.commentText, color: theme.greyTextColor }}
              >
                {comment.text}
              </Text>

              {/* Nút like + số lượt like */}
              <View style={styles.commentFooter}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLike(comment._id)} // Xử lý like bình luận
                >
                  <Heart
                    size={20}
                    color={comment.isLiked ? "red" : "gray"} // Thay đổi màu dựa trên trạng thái like
                    fill={comment.isLiked ? "red" : "none"} // Thay đổi fill dựa trên trạng thái like
                  />
                  <Text style={styles.likeCount}>{comment.likeCount || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ ...styles.noDataText, color: theme.greyTextColor }}>
            No comments yet. Be the first to share your thoughts!
          </Text>
        )}
      </ScrollView>
    );

    if (loading) {
      return <Text style={{ padding: 16 }}>Đang tải dữ liệu...</Text>;
    }

    // Map các routes với components tương ứng
    const renderScene = SceneMap({
      ingredient: IngredientsRoute,
      instructions: InstructionsRoute,
      comments: CommentRatingRoute,
    });

    // Tùy chỉnh thanh tab
    const renderTabBar = (props) => (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: "#4CAF50", // Màu nền của indicator
          height: "80%", // Chiều cao
          width: "28%", // Chiều rộng
          borderRadius: 8, // Bo góc
          marginHorizontal: "2.5%", // Margin ngang
          marginVertical: "10%", // Margin dọc
        }}
        style={{ backgroundColor: "#C4F9D7", borderRadius: 8, fontSize: 8 }} // Style của tabbar
        renderTabBarItem={({ key, ...props }) => (
          <TabBarItem
            key={key}
            {...props}
            labelStyle={{ fontSize: 12 }} // Set kích thước font
          />
        )}
        activeColor="#ffffff" // Màu chữ khi active
        inactiveColor="#000000" // Màu chữ khi không active
        pressColor="rgba(76, 175, 80, 0.1)" // Màu khi nhấn
      />
    );

    if (!dish?._id) {
      return (
        <View style={styles.container}>
          <Text
            style={{
              ...styles.noDataText,
              color: theme.greyTextColor,
              textAlign: "center",
            }}
          >
            Dish data is not available.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.recipeCard}>
        <Image source={{ uri: dish?.imageUrl }} style={styles.recipeImage} />
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => handleOnSavePress(dish)} // Xử lý khi nhấn nút yêu thích
        >
          {favorite.isLoading ? (
            <ActivityIndicator size={24} color="#FC8019" /> // Hiển thị loading khi đang xử lý
          ) : isFavorite(dish._id) ? (
            <MaterialCommunityIcons
              name="heart-multiple"
              size={24}
              color="#FF8A65"
            /> // Icon trái tim khi đã yêu thích
          ) : (
            <Ionicons name="heart-outline" size={24} color="#FF8A65" /> // Icon trái tim outline khi chưa yêu thích
          )}
        </TouchableOpacity>
        <View
          style={{
            ...styles.cardContent,
            backgroundColor: theme.cardBackgroundColor,
          }}
        >
          <View style={styles.recipeHeader}>
            <Text style={{ ...styles.recipeName, color: theme.greyTextColor }}>
              {dish.name}
            </Text>
            <View style={styles.recipeRate}>
              <Text
                style={{ fontSize: 14, marginBottom: 4 }}
                className="text-yellow-500 font-semibold"
              >
                Average Rating:
              </Text>
              <Rating rate={averageRating ?? 0} size={WIDTH * 0.06} disabled />{" "}
              {/* Component hiển thị số sao */}
              <TouchableOpacity
                onPress={() => {
                  if (!user?._id) {
                    setLoginModalVisible(true); // Hiển thị modal đăng nhập nếu chưa đăng nhập
                  } else {
                    setRatingModalVisible(true); // Hiển thị modal đánh giá nếu đã đăng nhập
                  }
                }}
                style={styles.openModal}
              >
                <Text style={{ fontSize: 14, color: "#40B491" }}>
                  Rating now
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal đăng nhập */}
            <Modal
              visible={loginModalVisible}
              animationType="fade"
              transparent
              onRequestClose={() => setLoginModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    You need to sign in to do this action.
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setLoginModalVisible(false);
                      navigation.navigate("signin"); // Chuyển đến màn hình đăng nhập
                    }}
                    style={styles.loginButton}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setLoginModalVisible(false)} // Đóng modal
                    style={{ marginTop: 10 }}
                  >
                    <Text style={{ color: "#888" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Modal đánh giá */}
            <RatingModal
              visible={ratingModalVisible}
              onClose={() => setRatingModalVisible(false)}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              handleRate={handleRate}
              submitComment={submitComment}
            />
          </View>
          <Text
            style={{ ...styles.recipeDescription, color: theme.greyTextColor }}
          >
            {dish.description}
          </Text>

          {/* Thông tin dinh dưỡng */}
          <View style={styles.nutritionInfo}>
            <View style={styles.nutritionItem}>
              <Ionicons name="restaurant-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>
                {recipe?.totalCarbs ?? 0} carbs {/* Hiển thị carb */}
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="fitness-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>
                {recipe?.totalProtein ?? 0} proteins {/* Hiển thị protein */}
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="flame-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>
                {recipe?.totalCalories ?? 0} Kcal {/* Hiển thị calories */}
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="water-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>
                {recipe?.totalFat ?? 0} fats {/* Hiển thị chất béo */}
              </Text>
            </View>
          </View>

          {/* Container cho TabView */}
          <View style={styles.tabViewContainer}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: WIDTH - 16 }} // Khởi tạo layout với chiều rộng
              renderTabBar={renderTabBar} // Render thanh tab tùy chỉnh
              style={styles.tabView} // Style cho TabView
            />
          </View>
        </View>
      </View>
    );
  };

  // Return component chính
  return (
    <MainLayoutWrapper>
      {" "}
      {/* Sử dụng layout wrapper chung */}
      <View style={styles.container}>
        {" "}
        {/* Container chính */}
        <ScrollView
          showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
          nestedScrollEnabled={true} // Cho phép cuộn lồng nhau
        >
          {renderRecipeCard()} {/* Render card công thức */}
        </ScrollView>
      </View>
    </MainLayoutWrapper>
  );
}

export default FavorAndSuggest; // Export component để sử dụng ở nơi khác
