// Import các thư viện và components cần thiết từ React và React Native
import React, { useEffect } from "react";
import {
  View, // Component container cơ bản
  Text, // Component hiển thị text
  StyleSheet, // Module để tạo styles
  StatusBar, // Component để tùy chỉnh thanh status bar
  Platform, // Module để check platform (iOS/Android)
  ImageBackground, // Component để set background image
  Dimensions, // Module để lấy kích thước màn hình
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Component để handle safe area
import { useFocusEffect } from "@react-navigation/native";

// Lấy chiều rộng và cao của màn hình device
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

// Component SafeAreaWrapper với các props mặc định
const SafeAreaWrapper = ({
  headerTitle = "", // Tiêu đề header, mặc định rỗng
  headerStyle = {
    backgroundColor: "transparent", // Màu nền header, mặc định trong suốt
    textColor: "#000000", // Màu chữ header, mặc định đen
    theme: "black", // Theme của status bar, mặc định đen
  },
  backgroundImage, // Props để truyền ảnh background
  backgroundStyle, // Style tùy chỉnh cho background
  children, // Components con bên trong
}) => {
  // Destructuring các giá trị từ headerStyle
  const { backgroundColor, textColor, theme } = headerStyle;

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(
        theme === "light" ? "light-content" : "dark-content",
        true
      );
    }, [])
  );

  return (
    // Container chính với SafeAreaView
    <SafeAreaView style={styles.container}>
      {/* Cấu hình StatusBar */}
      <StatusBar
        barStyle={theme === "light" ? "light-content" : "dark-content"} // Style của status bar dựa vào theme
        backgroundColor={backgroundColor} // Màu nền của status bar
        translucent={true} // Cho phép trong suốt
      />

      {/* Kiểm tra nếu có backgroundImage */}
      {backgroundImage ? (
        // Render ImageBackground nếu có backgroundImage
        <ImageBackground
          source={backgroundImage}
          style={[styles.background && backgroundStyle]} // Áp dụng style background và custom style
          imageStyle={{ resizeMode: "cover" }} // Style cho image
        >
          {/* Render header nếu có headerTitle */}
          {headerTitle ? (
            <View style={styles.header}>
              <Text style={[styles.headerText, { color: textColor }]}>
                {headerTitle}
              </Text>
            </View>
          ) : null}
          {/* Container cho content */}
          <View style={styles.content}>{children}</View>
        </ImageBackground>
      ) : (
        // Render view thông thường nếu không có backgroundImage
        <>
          {/* Render header nếu có headerTitle */}
          {headerTitle ? (
            <View style={[styles.header, { backgroundColor }]}>
              <Text style={[styles.headerText, { color: textColor }]}>
                {headerTitle}
              </Text>
            </View>
          ) : null}
          {/* Container cho content với background color */}
          <View style={[styles.content, { backgroundColor }]}>{children}</View>
        </>
      )}
    </SafeAreaView>
  );
};

// Định nghĩa styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian có sẵn
    width: WIDTH, // Chiều rộng bằng màn hình
    height: HEIGHT, // Chiều cao bằng màn hình
    position: "relative", // Position relative để có thể định vị các phần tử con
  },
  background: {
    flex: 1, // Chiếm toàn bộ không gian có sẵn
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 15 : 10, // Padding top khác nhau cho iOS và Android
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
    height: 60, // Chiều cao cố định cho header
    zIndex: 1, // Đảm bảo header hiển thị trên các phần tử khác
  },
  headerText: {
    fontSize: 18, // Kích thước chữ
    fontWeight: "bold", // Độ đậm của chữ
  },
  content: {
    flex: 1, // Chiếm phần không gian còn lại
    zIndex: 0, // Đặt z-index thấp hơn header
  },
});

// Export component để sử dụng ở nơi khác
export default SafeAreaWrapper;
