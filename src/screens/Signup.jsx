import React, { useEffect, useState } from "react"; // Import React và các hooks cần thiết

import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  PixelRatio,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from "react-native"; // Import các thành phần từ React Native

import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient từ expo để tạo hiệu ứng gradient

import SafeAreaWrapper from "../components/layout/SafeAreaWrapper"; // Import component bọc SafeArea tùy chỉnh

import RippleButton from "../components/common/RippleButton"; // Import component button có hiệu ứng gợn sóng

import SplitLine from "../components/common/SplitLine"; // Import component đường phân cách

import backgroundImage from "../../assets/image/welcome_bg.png"; // Import hình nền cho màn hình đăng ký

import googleIcon from "../../assets/image/google_icon.png"; // Import biểu tượng Google cho đăng nhập bằng Google

import { ScreensName } from "../constants/ScreensName"; // Import danh sách tên màn hình

import { useGoogleAuth } from "../hooks/useGoogleAuth"; // Import hook xử lý đăng nhập bằng Google

import { signup, verifyAccount } from "../services/authService"; // Import các service xử lý đăng ký và xác thực tài khoản

import InputOtpModal from "../components/modal/InputOtpModal"; // Import modal nhập mã OTP

import { useDispatch, useSelector } from "react-redux"; // Import hooks của Redux để quản lý state

import { loginThunk } from "../redux/actions/userThunk"; // Import action thunk cho đăng nhập

import Toast from "react-native-toast-message"; // Import thư viện Toast để hiển thị thông báo
import ShowToast from "../components/common/CustomToast"; // Import component Toast tùy chỉnh
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Import component ScrollView hỗ trợ bàn phím
import { userSelector } from "../redux/selectors/selector"; // Import selector để lấy thông tin user từ Redux
import Checkbox from "expo-checkbox"; // Import component Checkbox từ expo

const WIDTH = Dimensions.get("window").width; // Lấy chiều rộng màn hình

const HEIGHT = Dimensions.get("window").height; // Lấy chiều cao màn hình

function Signup({ navigation }) {
  const [buttonWidth, setButtonWidth] = useState(WIDTH); // State lưu chiều rộng của button

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    termAgree: false,
    loginError: "",
  }); // State lưu trữ dữ liệu form đăng ký

  const [isOpen, setIsOpen] = useState({ otpModal: false }); // State quản lý trạng thái hiển thị modal OTP

  const { signIn, userInfo, error } = useGoogleAuth(); // Lấy các hàm và dữ liệu từ hook đăng nhập Google

  const dispatch = useDispatch(); // Khởi tạo dispatch để gọi action Redux
  const user = useSelector(userSelector); // Lấy thông tin user từ Redux store

  useEffect(() => {
    if (error) {
      ShowToast("error", `Lỗi đăng nhập: ${error}`); // Hiển thị thông báo lỗi nếu đăng nhập Google thất bại
    }
  }, [error]); // Chạy khi error thay đổi

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    })); // Hàm cập nhật giá trị của từng trường trong form
  };

  const onPressGoogleButton = async () => {
    await signIn(); // Gọi hàm đăng nhập bằng Google khi nhấn nút
  };

  const onPressRegisterButton = async () => {
    const { email, fullName, password, phoneNumber, termAgree } = formData; // Lấy dữ liệu từ form

    // Kiểm tra định dạng email
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email.trim()) {
      return ShowToast("error", "Email is required."); // Hiển thị lỗi nếu không có email
    }
    if (!isValidEmail(email.trim())) {
      return ShowToast("error", "Please enter a valid email address."); // Hiển thị lỗi nếu email không hợp lệ
    }

    // Kiểm tra họ tên
    if (!fullName.trim()) {
      return ShowToast("error", "Full name is required."); // Hiển thị lỗi nếu không có họ tên
    }

    // Kiểm tra mật khẩu với yêu cầu mạnh - phải có chữ hoa, chữ thường, số và ký tự đặc biệt
    const isValidPassword = (password) =>
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
        password
      );

    if (!password.trim()) {
      return ShowToast("error", "Password is required."); // Hiển thị lỗi nếu không có mật khẩu
    }
    if (!isValidPassword(password.trim())) {
      return ShowToast(
        "error",
        "Password is too weak. Must be at least 8 characters with upper, lower, number & special char." // Hiển thị lỗi nếu mật khẩu quá yếu
      );
    }

    // Kiểm tra số điện thoại
    if (!phoneNumber.trim()) {
      return ShowToast("error", "Phone number is required."); // Hiển thị lỗi nếu không có số điện thoại
    }

    // Kiểm tra đồng ý điều khoản
    if (!termAgree) {
      setFormData((prev) => ({ ...prev, loginError: "termAgreeError" })); // Đặt lỗi cho điều khoản
      return ShowToast("error", "Agree with our term to regis."); // Hiển thị lỗi nếu chưa đồng ý điều khoản
    }

    try {
      const response = await signup({
        username: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
        passwordConfirm: password.trim(),
      }); // Gọi API đăng ký

      if (response.status === 200) {
        // navigation.navigate(ScreensName.signin); // Chuyển đến màn hình đăng nhập nếu đăng ký thành công
        // Đoạn code bị comment lại:
        const credentials = {
          email,
          password,
        };
        const responseLogin = await dispatch(loginThunk(credentials));
        if (responseLogin.type.endsWith("fulfilled")) {
          setIsOpen({ ...isOpen, otpModal: true });
          ShowToast(
            "success",
            "Register successfully! Please check your email to verify your account."
          );
        } else {
          ShowToast("error", "Login failed after registration.");
        }
      } else {
        ShowToast(
          "error",
          response?.response?.data?.message || "Registration failed." // Hiển thị lỗi từ server hoặc thông báo mặc định
        );
      }
    } catch (error) {
      ShowToast("error", "An error occurred during registration."); // Hiển thị lỗi nếu có lỗi trong quá trình đăng ký
    }
  };

  const getTextWidth = (text, fontSize, fontFamily) => {
    const scaledFontSize = fontSize * PixelRatio.getFontScale(); // Tính kích thước font đã được scale

    const extraPadding = 0; // Padding thêm

    return text.length * scaledFontSize * 0.6 + extraPadding; // Tính toán chiều rộng văn bản
  };

  const calculateMaxButtonWidth = () => {
    const buttonTexts = ["Register", "Continue with Google"]; // Danh sách text trên các nút

    const textWidths = buttonTexts.map(
      (text) => getTextWidth(text, 18, "Aleo_700Bold") // Tính chiều rộng của từng text
    );

    const maxWidth = Math.min(Math.max(...textWidths), WIDTH * 0.8); // Lấy giá trị lớn nhất trong các chiều rộng, nhưng không quá 80% chiều rộng màn hình

    setButtonWidth(maxWidth); // Cập nhật state chiều rộng button
  };

  useEffect(() => {
    calculateMaxButtonWidth(); // Tính toán chiều rộng button khi component mount
  }, []);

  const handleVerifyAccount = async (code) => {
    const response = await verifyAccount({ otp: code }); // Gọi API xác thực tài khoản với mã OTP

    if (response.status === 200) {
      ShowToast("success", "Verify account successfully."); // Hiển thị thông báo thành công

      navigation.navigate(ScreensName.home); // Chuyển đến màn hình trang chủ
    } else {
      ShowToast("error", "Verify account fail. Please try again."); // Hiển thị thông báo lỗi

      console.log("error"); // In lỗi ra console
    }
  };

  return (
    <SafeAreaWrapper
      headerStyle={{ theme: "light", backgroundColor: "transparent" }} // Thiết lập style cho header
    >
      <Image source={backgroundImage} style={styles.backgroundImage} />{" "}
      {/* Hình nền */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(64, 180, 145, 0.1)",
          "rgba(64, 180, 145, 0.2)",
          "rgba(64, 180, 145, 0.4)",
          "rgba(64, 180, 145, 0.7)",
          "rgba(64, 180, 145, 0.9)",
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145,1)",
          "rgba(64, 180, 145,1)",
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145, 1)",
          "#40B491",
          "#40B491",
          "#40B491",
        ]} // Mảng các màu gradient từ trong suốt đến màu chủ đạo
        style={{
          position: "absolute",
          top: 0,
          bottom: Platform.OS === "ios" ? -35 : 0, // Điều chỉnh bottom dựa vào nền tảng
          left: 0,
          right: 0,
        }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid // Bật tính năng cho Android
          extraScrollHeight={Platform.OS === "ios" ? 20 : 40} // Chiều cao thêm khi scroll
          keyboardShouldPersistTaps="handled" // Giữ bàn phím khi nhấn
        >
          <ScrollView
            style={styles.view}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "flex-end", // Căn nội dung ở dưới cùng
              alignItems: "center", // Căn giữa theo chiều ngang
            }}
          >
            <Text style={styles.title}>REGISTER</Text> {/* Tiêu đề đăng ký */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full name *" // Trường nhập họ tên
                placeholderTextColor="#666" // Màu của placeholder
                value={formData.fullName} // Giá trị từ state
                onChangeText={(text) => handleInputChange("fullName", text)} // Xử lý khi text thay đổi
              />

              <TextInput
                style={styles.input}
                placeholder="Email *" // Trường nhập email
                placeholderTextColor="#666"
                keyboardType="email-address" // Bàn phím kiểu email
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
              <View style={styles.checkbox}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "left",
                    transform: [{ translateY: -10 }], // Dịch chuyển lên trên 10 đơn vị
                  }}
                >
                  * Impotant information{" "}
                  {/* Chú thích về thông tin quan trọng (có lỗi chính tả "Important") */}
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Phone number *" // Trường nhập số điện thoại
                placeholderTextColor="#666"
                keyboardType="phone-pad" // Bàn phím kiểu số điện thoại
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Password *" // Trường nhập mật khẩu
                placeholderTextColor="#666"
                secureTextEntry // Ẩn ký tự mật khẩu
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
              <View style={styles.checkbox}>
                <Checkbox
                  value={formData.termAgree} // Giá trị của checkbox
                  onValueChange={(selection) => {
                    setFormData((prev) => ({ ...prev, termAgree: selection })); // Cập nhật trạng thái đồng ý
                  }}
                />
                <Text
                  style={{
                    ...styles.checkboxText,
                    textDecorationLine:
                      formData.loginError === "termAgreeError"
                        ? "underline" // Gạch chân khi có lỗi
                        : "none",
                  }}
                >
                  Agree to terms {/* Text đồng ý điều khoản */}
                </Text>
              </View>

              <RippleButton
                buttonStyle={{
                  ...styles.socialButtonStyle,
                  backgroundColor: "#191C32", // Màu nền nút đăng ký
                  justifyContent: "center",
                }}
                buttonText="Register" // Text trên nút
                textStyle={{ ...styles.textStyle, color: "#ffffff" }} // Style cho text (màu trắng)
                onPress={async () => await onPressRegisterButton()} // Xử lý khi nhấn nút đăng ký
              />

              <SplitLine
                text="or use social sign up" // Text cho đường phân cách
                textStyle={styles.splitTextStyle} // Style cho text
                lineStyle={styles.splitLineStyle} // Style cho đường kẻ
              />

              <RippleButton
                buttonStyle={styles.socialButtonStyle} // Style cho nút đăng nhập Google
                leftButtonIcon={
                  <Image
                    source={googleIcon} // Icon Google
                    style={{ width: 20, height: 20, ...styles.iconStyle }}
                  />
                }
                buttonText="Continue with Google" // Text cho nút
                textStyle={styles.textStyle} // Style cho text
                contentContainerStyle={{
                  ...styles.buttonContainerStyle,
                  width: buttonWidth, // Áp dụng chiều rộng đã tính toán
                }}
                onPress={onPressGoogleButton} // Xử lý khi nhấn nút Google
                backgroundColor={"rgba(0, 0, 0, 0.2)"} // Màu nền với độ trong suốt
              />

              <Text style={styles.alreadyText}>
                Already have account? {/* Text hỏi đã có tài khoản chưa */}
                <Text
                  style={{
                    textDecorationLine: "underline", // Gạch chân
                    fontSize: 16,
                    color: "white",
                  }}
                  onPress={() => navigation.navigate(ScreensName.signin)} // Chuyển đến màn hình đăng nhập khi nhấn
                >
                  Log In {/* Link đăng nhập */}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>

        <InputOtpModal
          isOpen={isOpen.otpModal} // Trạng thái hiển thị modal
          otpAmount={4} // Số lượng ô nhập OTP
          onClose={() => setIsOpen({ ...isOpen, otpModal: false })} // Xử lý khi đóng modal
          onVerify={(code) => {
            handleVerifyAccount(code); // Xử lý khi xác thực OTP
          }}
        />
      </LinearGradient>
      <Toast /> {/* Component Toast để hiển thị thông báo */}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: -HEIGHT * 0.08, // Vị trí top dựa vào chiều cao màn hình
    width: "100%",
    height: "65%", // Chiều cao bằng 65% màn hình
    resizeMode: "cover", // Chế độ hiển thị ảnh
    borderRadius: 20, // Bo góc 20px
    transform: [{ translateY: Platform.OS === "ios" ? -15 : -10 }], // Dịch chuyển lên trên tùy thuộc nền tảng
  },
  view: {
    flex: 1,
    paddingBottom: 50, // Padding dưới 50px
  },
  title: {
    fontSize: 24, // Cỡ chữ 24px
    color: "#FFFFFF", // Màu trắng
    fontFamily: "Aleo_700Bold", // Font chữ Aleo Bold
    marginBottom: 20, // Margin dưới 20px
  },
  formContainer: {
    width: "80%", // Chiều rộng 80%
    alignItems: "center", // Căn giữa theo chiều ngang
  },
  input: {
    width: "100%", // Chiều rộng 100%
    height: 60, // Chiều cao 60px
    backgroundColor: "rgba(256, 256, 256, 0.1)", // Màu nền trắng với độ trong suốt
    color: "#FFFFFF", // Màu chữ trắng
    borderRadius: 6, // Bo góc 6px
    borderWidth: 1, // Độ rộng viền 1px
    borderColor: "#FFFFFF", // Màu viền trắng
    paddingHorizontal: 15, // Padding ngang 15px
    marginBottom: 15, // Margin dưới 15px
    fontSize: 16, // Cỡ chữ 16px
    fontFamily: "Aleo_400Regular", // Font chữ Aleo Regular
  },
  checkbox: {
    flexDirection: "row", // Sắp xếp theo hàng ngang
    alignItems: "center", // Căn giữa theo chiều dọc
    width: "100%", // Chiều rộng 100%
    gap: 12, // Khoảng cách giữa các phần tử 12px
  },
  checkboxText: {
    color: "white", // Màu chữ trắng
  },
  socialButtonStyle: {
    flexDirection: "row", // Sắp xếp theo hàng ngang
    width: "100%", // Chiều rộng 100%
    justifyContent: "center", // Căn giữa theo chiều ngang
    padding: 18, // Padding 18px
    paddingHorizontal: 32, // Padding ngang 32px
    marginTop: 16, // Margin trên 16px
    borderRadius: 16, // Bo góc 16px
    backgroundColor: "#ffffff", // Màu nền trắng
    shadowColor: "#000", // Màu bóng đen
    shadowOffset: { width: 0, height: 5 }, // Độ dịch chuyển bóng
    shadowOpacity: 0.05, // Độ trong suốt của bóng
    shadowRadius: 4.65, // Bán kính bóng
    elevation: 6, // Độ nổi (cho Android)
  },
  textStyle: {
    fontSize: 18, // Cỡ chữ 18px
    fontFamily: "Aleo_700Bold", // Font chữ Aleo Bold
    color: "#000", // Màu chữ đen
    marginLeft: 10, // Margin trái 10px
  },
  iconStyle: {
    height: 24, // Chiều cao 24px
    width: 24, // Chiều rộng 24px
    resizeMode: "contain", // Chế độ hiển thị ảnh
  },
  buttonContainerStyle: {
    width: "80%", // Chiều rộng 80%
    justifyContent: "flex-start", // Căn trái theo chiều ngang
  },
  splitLineStyle: {
    width: WIDTH * 0.25, // Chiều rộng bằng 25% chiều rộng màn hình
    marginTop: 12, // Margin trên 12px
  },
  alreadyText: {
    marginHorizontal: 8, // Margin ngang 8px
    marginVertical: 24, // Margin dọc 24px
    fontSize: 16, // Cỡ chữ 16px
    color: "#FFFFFF", // Màu chữ trắng
    fontFamily: "Aleo_400Regular", // Font chữ Aleo Regular
  },
});

export default Signup; // Export component Signup
