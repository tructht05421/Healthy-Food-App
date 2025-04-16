import React, { useState } from "react"; // Import React và hook useState
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // Import các component cần thiết từ React Native

import SafeAreaWrapper from "../components/layout/SafeAreaWrapper"; // Import component bọc SafeArea tùy chỉnh
import RippleButton from "../components/common/RippleButton"; // Import component button có hiệu ứng gợn sóng
import proundCactusIcon from "../../assets/image/pround_cactus.png"; // Import hình ảnh cây xương rồng
import ShowToast from "../components/common/CustomToast"; // Import component Toast tùy chỉnh
import { changePassword, resetPassword } from "../services/authService"; // Import các hàm service xử lý đổi và reset mật khẩu
import { ScreensName } from "../constants/ScreensName"; // Import danh sách tên màn hình
import { useTheme } from "../contexts/ThemeContext"; // Import hook sử dụng theme

const WIDTH = Dimensions.get("window").width; // Lấy chiều rộng màn hình
const HEIGHT = Dimensions.get("window").height; // Lấy chiều cao màn hình

function ResetPassword({ navigation, route }) {
  const email = route.params?.email; // Lấy email từ tham số route (nếu có)
  const { theme } = useTheme(); // Lấy theme hiện tại từ context

  const [newPassword, setNewPassword] = useState(""); // State lưu mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(""); // State lưu mật khẩu xác nhận

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      ShowToast("error", "Vui lòng điền đầy đủ thông tin"); // Hiển thị thông báo lỗi nếu thiếu thông tin
      return;
    }

    if (newPassword !== confirmPassword) {
      ShowToast("error", "Mật khẩu không khớp"); // Hiển thị thông báo lỗi nếu mật khẩu không khớp
      return;
    }

    const response = await resetPassword({
      email: email.trim(), // Cắt khoảng trắng thừa của email
      password: newPassword,
      passwordConfirm: confirmPassword,
    }); // Gọi API đặt lại mật khẩu

    if (response.status === 200) {
      ShowToast("success", "Đổi mật khẩu thành công"); // Hiển thị thông báo thành công
      console.log("Password reset:", newPassword); // Ghi log mật khẩu đã reset (không nên làm điều này trong sản phẩm thực tế)
      navigation.navigate(ScreensName.signin); // Chuyển hướng đến màn hình đăng nhập
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={{
          ...styles.container,
          backgroundColor: theme.editModalbackgroundColor, // Sử dụng màu nền từ theme
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh hành vi dựa trên nền tảng
      >
        <View style={styles.card}>
          <Text style={{ ...styles.title, color: theme.textColor }}> {/* Tiêu đề với màu chữ từ theme */}
            Change New Password
          </Text>
          <Text style={{ ...styles.subtitle, color: theme.greyTextColor }}> {/* Phụ đề với màu chữ xám từ theme */}
            Enter a different password with{"\n"}the previous
          </Text>

          <View style={styles.inputContainer}>
            <Text style={{ ...styles.label, color: theme.greyTextColor }}> {/* Nhãn trường nhập liệu với màu chữ xám từ theme */}
              New Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••" // Placeholder hiển thị dấu chấm để biểu thị mật khẩu
              placeholderTextColor="#666" // Màu của placeholder
              value={newPassword} // Giá trị từ state
              onChangeText={setNewPassword} // Cập nhật state khi thay đổi text
              secureTextEntry // Ẩn ký tự mật khẩu
            />

            <Text style={{ ...styles.label, color: theme.greyTextColor }}> {/* Nhãn trường nhập liệu với màu chữ xám từ theme */}
              Confirm Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••" // Placeholder hiển thị dấu chấm để biểu thị mật khẩu
              placeholderTextColor="#666" // Màu của placeholder
              value={confirmPassword} // Giá trị từ state
              onChangeText={setConfirmPassword} // Cập nhật state khi thay đổi text
              secureTextEntry // Ẩn ký tự mật khẩu
            />
          </View>

          <View style={styles.illustrationContainer}> {/* Container cho phần minh họa */}
            <Image source={proundCactusIcon} style={styles.cactusIcon} /> {/* Hình ảnh cây xương rồng */}
            <View style={styles.decorations}> {/* Container cho các phần trang trí */}
              <View style={[styles.star, styles.starOrange]} /> {/* Ngôi sao màu cam */}
              <View style={[styles.star, styles.starYellow]} /> {/* Ngôi sao màu vàng */}
              <View style={[styles.dot]} /> {/* Chấm tròn */}
            </View>
          </View>

          <RippleButton
            buttonStyle={styles.submitButton} // Style cho nút
            buttonText="Reset Password" // Text trên nút
            textStyle={styles.buttonText} // Style cho text
            onPress={handleResetPassword} // Xử lý khi nhấn nút
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian
    backgroundColor: "#FFFFFF", // Màu nền trắng
    paddingHorizontal: WIDTH * 0.075, // Padding ngang bằng 7.5% chiều rộng màn hình
    paddingVertical: 30, // Padding dọc 30px
  },
  card: {
    width: "100%", // Chiều rộng 100%
    alignItems: "center", // Căn giữa theo chiều ngang
  },
  title: {
    fontSize: 24, // Cỡ chữ 24px
    fontFamily: "Aleo_700Bold", // Font chữ Aleo Bold
    color: "#191C32", // Màu chữ đen đậm
    marginBottom: 10, // Margin dưới 10px
    alignSelf: "flex-start", // Căn trái
  },
  subtitle: {
    fontSize: 16, // Cỡ chữ 16px
    fontFamily: "Aleo_400Regular", // Font chữ Aleo Regular
    color: "#666", // Màu chữ xám
    marginBottom: 30, // Margin dưới 30px
    lineHeight: 22, // Chiều cao dòng 22px
    alignSelf: "flex-start", // Căn trái
  },
  inputContainer: {
    width: "100%", // Chiều rộng 100%
    marginBottom: 20, // Margin dưới 20px
  },
  label: {
    fontSize: 16, // Cỡ chữ 16px
    fontFamily: "Aleo_400Regular", // Font chữ Aleo Regular
    color: "#666", // Màu chữ xám
    marginBottom: 8, // Margin dưới 8px
  },
  input: {
    width: "100%", // Chiều rộng 100%
    height: 50, // Chiều cao 50px
    backgroundColor: "#F5F5F5", // Màu nền xám nhạt
    borderRadius: 12, // Bo góc 12px
    paddingHorizontal: 15, // Padding ngang 15px
    fontSize: 16, // Cỡ chữ 16px
    fontFamily: "Aleo_400Regular", // Font chữ Aleo Regular
    marginBottom: 20, // Margin dưới 20px
  },
  illustrationContainer: {
    position: "relative", // Vị trí tương đối
    width: "100%", // Chiều rộng 100%
    height: HEIGHT * 0.25, // Chiều cao bằng 25% chiều cao màn hình
    marginBottom: 20, // Margin dưới 20px
  },
  cactusIcon: {
    width: "100%", // Chiều rộng 100%
    height: "100%", // Chiều cao 100%
    resizeMode: "contain", // Chế độ hiển thị ảnh giữ nguyên tỷ lệ và vừa với khung
  },
  decorations: {
    position: "absolute", // Vị trí tuyệt đối
    width: "100%", // Chiều rộng 100%
    height: "100%", // Chiều cao 100%
  },
  star: {
    position: "absolute", // Vị trí tuyệt đối
    width: 20, // Chiều rộng 20px
    height: 20, // Chiều cao 20px
    borderRadius: 4, // Bo góc 4px
    transform: [{ rotate: "45deg" }], // Xoay 45 độ để tạo hình ngôi sao
  },
  starOrange: {
    backgroundColor: "#FF8A65", // Màu cam
    right: "20%", // Cách phải 20%
    top: "10%", // Cách trên 10%
  },
  starYellow: {
    backgroundColor: "#FFD54F", // Màu vàng
    right: "35%", // Cách phải 35%
    top: "15%", // Cách trên 15%
  },
  dot: {
    position: "absolute", // Vị trí tuyệt đối
    width: 10, // Chiều rộng 10px
    height: 10, // Chiều cao 10px
    borderRadius: 5, // Bo góc 5px để tạo hình tròn
    backgroundColor: "#4CAF50", // Màu xanh lá
    right: "25%", // Cách phải 25%
    top: "25%", // Cách trên 25%
  },
  submitButton: {
    width: "100%", // Chiều rộng 100%
    backgroundColor: "#32B768", // Màu nền xanh lá
    padding: 15, // Padding 15px
    borderRadius: 12, // Bo góc 12px
    marginTop: 25, // Margin trên 25px
  },
  buttonText: {
    color: "#FFFFFF", // Màu chữ trắng
    fontSize: 18, // Cỡ chữ 18px
    fontFamily: "Aleo_700Bold", // Font chữ Aleo Bold
    textAlign: "center", // Căn giữa text
  },
});

export default ResetPassword; // Export component ResetPassword