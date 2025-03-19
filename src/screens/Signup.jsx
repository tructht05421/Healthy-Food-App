// Import React và hooks cần thiết
import React, { useEffect, useState } from "react";
// Import các components cần thiết từ React Native
import {
  Text, // Component hiển thị văn bản
  View, // Component cơ bản để chứa các component khác
  StyleSheet, // API tạo stylesheet
  Image, // Component hiển thị hình ảnh
  Platform, // API để kiểm tra nền tảng (iOS/Android)
  Dimensions, // API để lấy kích thước màn hình
  PixelRatio, // API để làm việc với pixel density
  TextInput, // Component nhập liệu
  KeyboardAvoidingView, // Component giúp tránh che khuất nội dung bởi bàn phím
  Alert, // API hiển thị hộp thoại cảnh báo
} from "react-native";

// Import LinearGradient từ thư viện expo để tạo hiệu ứng gradient
import { LinearGradient } from "expo-linear-gradient";
// Import component SafeAreaWrapper tùy chỉnh từ local
import SafeAreaWrapper from "../components/layout/SafeAreaWrapper";
// Import component RippleButton tùy chỉnh từ local
import RippleButton from "../components/common/RippleButton";
// Import component SplitLine tùy chỉnh từ local
import SplitLine from "../components/common/SplitLine";

// Import ảnh nền từ thư mục assets
import backgroundImage from "../../assets/image/welcome_bg.png";
// Import biểu tượng Google từ thư mục assets
import googleIcon from "../../assets/image/google_icon.png";
// Import các hằng số tên màn hình từ constants
import { ScreensName } from "../constants/ScreensName";
// Import hook custom useGoogleAuth để xử lý đăng nhập Google
import { useGoogleAuth } from "../hooks/useGoogleAuth";
// Import các hàm dịch vụ xác thực từ authService
import { signup, verifyAccount } from "../services/authService";
// Import component InputOtpModal để nhập mã OTP
import InputOtpModal from "../components/modal/InputOtpModal";
// Import hook useDispatch từ react-redux để dispatch actions
import { useDispatch, useSelector } from "react-redux";
// Import action thunk đăng nhập từ redux actions
import { loginThunk } from "../redux/actions/userThunk";
// Import Toast từ react-native-toast-message để hiển thị thông báo
import Toast from "react-native-toast-message";
import ShowToast from "../components/common/CustomToast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { userSelector } from "../redux/selectors/selector";

// Lấy chiều rộng màn hình
const WIDTH = Dimensions.get("window").width;
// Lấy chiều cao màn hình
const HEIGHT = Dimensions.get("window").height;

// Định nghĩa component Signup với tham số navigation từ React Navigation
function Signup({ navigation }) {
  // Khởi tạo state buttonWidth với giá trị ban đầu là chiều rộng màn hình
  const [buttonWidth, setButtonWidth] = useState(WIDTH);
  // Khởi tạo state formData để lưu trữ thông tin đăng ký
  const [formData, setFormData] = useState({
    fullName: "", // Tên đầy đủ
    email: "", // Địa chỉ email
    phoneNumber: "", // Số điện thoại
    password: "", // Mật khẩu
  });
  // Khởi tạo state isOpen để kiểm soát việc hiển thị modal
  const [isOpen, setIsOpen] = useState({ otpModal: false });
  // Sử dụng hook useGoogleAuth để lấy hàm signIn, thông tin người dùng và lỗi
  const { signIn, userInfo, error } = useGoogleAuth();
  // Sử dụng hook useDispatch để dispatch actions
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  // useEffect để xử lý khi userInfo thay đổi (sau khi đăng nhập Google)
  // useEffect(() => {
  //   if (userInfo) {
  //     // Cập nhật state formData với thông tin từ tài khoản Google
  //     setFormData((prev) => ({
  //       ...prev, // Giữ nguyên các giá trị hiện tại
  //       fullName: userInfo.name || "", // Cập nhật tên từ userInfo nếu có
  //       email: userInfo.email || "", // Cập nhật email từ userInfo nếu có
  //     }));

  //     // Hiển thị thông báo chào mừng
  //     ShowToast("success", `Chào mừng, ${userInfo.name}`);
  //   }
  // }, [userInfo]); // Chạy lại effect khi userInfo thay đổi

  // useEffect để xử lý khi có lỗi từ quá trình đăng nhập Google
  useEffect(() => {
    if (error) {
      // Hiển thị thông báo lỗi bằng Toast
      ShowToast("error", `Lỗi đăng nhập: ${error}`);
    }
  }, [error]); // Chạy lại effect khi error thay đổi

  // Hàm xử lý sự kiện thay đổi giá trị input
  const handleInputChange = (field, value) => {
    // Cập nhật state formData với giá trị mới cho trường tương ứng
    setFormData((prev) => ({
      ...prev, // Giữ nguyên các giá trị khác
      [field]: value, // Cập nhật giá trị cho trường được chỉ định
    }));
  };

  // Hàm xử lý sự kiện khi nhấn nút đăng nhập Google
  const onPressGoogleButton = async () => {
    // Gọi hàm signIn từ hook useGoogleAuth để đăng nhập Google
    await signIn();
  };

  // Hàm xử lý sự kiện khi nhấn nút đăng ký
  const onPressRegisterButton = async () => {
    // Gọi API đăng ký với thông tin từ formData
    const response = await signup({
      username: formData.fullName.trim(), // Loại bỏ khoảng trắng thừa
      email: formData.email.trim(), // Loại bỏ khoảng trắng thừa
      phoneNumber: formData.phoneNumber.trim(), // Loại bỏ khoảng trắng thừa
      password: formData.password.trim(), // Loại bỏ khoảng trắng thừa
      passwordConfirm: formData.password.trim(), // Xác nhận mật khẩu = mật khẩu
    });

    // Kiểm tra nếu đăng ký thành công (status 200)
    if (response.status === 200) {
      // Tạo đối tượng chứa thông tin đăng nhập
      const credentials = {
        email: formData.email, // Email từ formData
        password: formData.password, // Mật khẩu từ formData
      };
      try {
        // Thực hiện đăng nhập ngay sau khi đăng ký thành công
        const responseLogin = await dispatch(loginThunk(credentials));

        // Kiểm tra nếu đăng nhập thành công
        if (responseLogin.type.endsWith("fulfilled")) {
          // Hiển thị modal xác thực OTP
          setIsOpen({ ...isOpen, otpModal: true });
          // Hiển thị thông báo thành công
          ShowToast(
            "success",
            "Register successfully! Please check your email to verify your account."
          );
        }
      } catch (error) {
        // Ghi log lỗi nếu có
        // console.log(error?.response?.mé);
        // Hiển thị thông báo lỗi
        ShowToast("error", "Login fail after register.");
      }
    } else {
      // Hiển thị thông báo lỗi
      ShowToast("error", `${response?.response?.data?.error?.message}`);
    }
  };

  // Hàm tính toán chiều rộng của văn bản
  const getTextWidth = (text, fontSize, fontFamily) => {
    // Tính toán kích thước font thực tế dựa trên tỉ lệ pixel
    const scaledFontSize = fontSize * PixelRatio.getFontScale();
    // Thêm padding nếu cần (ở đây là 0)
    const extraPadding = 0;
    // Công thức ước lượng chiều rộng: chiều dài văn bản * kích thước font * 0.6 + padding
    return text.length * scaledFontSize * 0.6 + extraPadding;
  };

  // Hàm tính toán chiều rộng tối đa cho các nút
  const calculateMaxButtonWidth = () => {
    // Các văn bản trên nút
    const buttonTexts = ["Register", "Continue with Google"];

    // Tính chiều rộng cho mỗi văn bản
    const textWidths = buttonTexts.map((text) =>
      getTextWidth(text, 18, "Aleo_700Bold")
    );

    // Lấy giá trị nhỏ hơn giữa chiều rộng lớn nhất và 80% chiều rộng màn hình
    const maxWidth = Math.min(Math.max(...textWidths), WIDTH * 0.8);
    // Cập nhật state buttonWidth
    setButtonWidth(maxWidth);
  };

  // useEffect để tính toán chiều rộng nút khi component được mount
  useEffect(() => {
    calculateMaxButtonWidth();
  }, []); // Mảng dependencies rỗng nên chỉ chạy một lần khi mount

  // Hàm xử lý xác thực tài khoản bằng mã OTP
  const handleVerifyAccount = async (code) => {
    // Gọi API xác thực tài khoản với mã OTP
    const response = await verifyAccount({ otp: code });
    // Kiểm tra nếu xác thực thành công
    if (response.status === 200) {
      // Hiển thị thông báo thành công
      ShowToast("success", "Verify account successfully.");
      // Chuyển hướng đến màn hình home
      navigation.navigate(ScreensName.home);
    } else {
      // Hiển thị thông báo lỗi
      ShowToast("error", "Verify account fail. Please try again.");
      // Ghi log lỗi
      console.log("error");
    }
  };

  // Render component
  return (
    // Bọc tất cả trong SafeAreaWrapper để tránh các vùng không an toàn trên thiết bị
    <SafeAreaWrapper
      headerStyle={{ theme: "light", backgroundColor: "transparent" }}
    >
      {/* Hiển thị hình nền */}
      <Image source={backgroundImage} style={styles.backgroundImage} />

      {/* Tạo hiệu ứng gradient từ trong suốt đến màu chủ đạo */}
      <LinearGradient
        colors={[
          "transparent", // Bắt đầu từ trong suốt
          "rgba(64, 180, 145, 0.1)", // Dần dần tăng độ đậm
          "rgba(64, 180, 145, 0.2)",
          "rgba(64, 180, 145, 0.4)",
          "rgba(64, 180, 145, 0.7)",
          "rgba(64, 180, 145, 0.9)",
          "rgba(64, 180, 145, 1)", // Đến màu đậm nhất
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145,1)",
          "rgba(64, 180, 145,1)",
          "rgba(64, 180, 145, 1)",
          "rgba(64, 180, 145, 1)",
          "#40B491",
          "#40B491",
          "#40B491",
        ]}
        style={{
          position: "absolute", // Vị trí tuyệt đối
          top: 0, // Bắt đầu từ đỉnh
          bottom: Platform.OS === "ios" ? -35 : 0, // Điều chỉnh cho iOS
          left: 0, // Bắt đầu từ bên trái
          right: 0, // Kéo đến bên phải
        }}
      >
        {/* KeyboardAvoidingView để tránh bàn phím che khuất nội dung */}
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={Platform.OS === "ios" ? 20 : 40} // Hành vi khác nhau cho iOS và Android
          style={styles.view}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "flex-end", // Aligns content to the bottom
            alignItems: "center", // Centers content horizontally
          }}
        >
          {/* Tiêu đề cho màn hình đăng ký */}
          <Text style={styles.title}>REGISTER</Text>

          {/* Container chứa form đăng ký */}
          <View style={styles.formContainer}>
            {/* Input cho tên đầy đủ */}
            <TextInput
              style={styles.input} // Style cho input
              placeholder="Full name *" // Placeholder text
              placeholderTextColor="#666" // Màu của placeholder
              value={formData.fullName} // Giá trị từ state
              onChangeText={(text) => handleInputChange("fullName", text)} // Xử lý thay đổi
            />

            {/* Input cho email */}
            <TextInput
              style={styles.input}
              placeholder="Email *"
              placeholderTextColor="#666"
              keyboardType="email-address" // Bàn phím dành cho email
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />

            {/* Input cho số điện thoại */}
            <TextInput
              style={styles.input}
              placeholder="Phone number *"
              placeholderTextColor="#666"
              keyboardType="phone-pad" // Bàn phím số dành cho điện thoại
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
            />

            {/* Input cho mật khẩu */}
            <TextInput
              style={styles.input}
              placeholder="Password *"
              placeholderTextColor="#666"
              secureTextEntry // Ẩn text khi nhập mật khẩu
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
            />

            {/* Nút đăng ký */}
            <RippleButton
              buttonStyle={{
                ...styles.socialButtonStyle, // Kế thừa style cơ bản
                backgroundColor: "#191C32", // Ghi đè màu nền
                justifyContent: "center", // Căn giữa nội dung
              }}
              buttonText="Register" // Text hiển thị trên nút
              textStyle={{ ...styles.textStyle, color: "#ffffff" }} // Style cho text
              onPress={async () => await onPressRegisterButton()} // Xử lý sự kiện nhấn
              // onPress={() => {
              //   console.log(user);
              // }} // Xử lý sự kiện nhấn
            />

            {/* Dòng phân cách với text ở giữa */}
            <SplitLine
              text="or use social sign up" // Text hiển thị
              textStyle={styles.splitTextStyle} // Style cho text
              lineStyle={styles.splitLineStyle} // Style cho dòng
            />

            {/* Nút đăng nhập bằng Google */}
            <RippleButton
              buttonStyle={styles.socialButtonStyle} // Style cho nút
              leftButtonIcon={
                // Icon bên trái
                <Image
                  source={googleIcon} // Nguồn ảnh
                  style={{ width: 20, height: 20, ...styles.iconStyle }} // Style cho icon
                />
              }
              buttonText="Continue with Google" // Text hiển thị
              textStyle={styles.textStyle} // Style cho text
              contentContainerStyle={{
                // Style cho container chứa nội dung
                ...styles.buttonContainerStyle,
                width: buttonWidth, // Chiều rộng tính toán động
              }}
              onPress={onPressGoogleButton} // Xử lý sự kiện nhấn
              backgroundColor={"rgba(0, 0, 0, 0.2)"} // Màu nền khi nhấn (hiệu ứng ripple)
            />

            {/* Text "Đã có tài khoản? Đăng nhập" */}
            <Text style={styles.alreadyText}>
              Already have account?{" "}
              <Text
                style={{
                  textDecorationLine: "underline", // Gạch chân text
                  fontSize: 16, // Kích thước chữ
                  color: "white", // Màu chữ
                }}
                onPress={() => navigation.navigate(ScreensName.signin)} // Chuyển đến màn hình đăng nhập
              >
                Log In
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>

        {/* Modal nhập mã OTP */}
        <InputOtpModal
          isOpen={isOpen.otpModal} // Điều kiện hiển thị modal
          otpAmount={4} // Số lượng ô nhập OTP
          onClose={() => setIsOpen({ ...isOpen, otpModal: false })} // Xử lý đóng modal
          onVerify={(code) => {
            handleVerifyAccount(code); // Xử lý xác thực với mã OTP
          }}
        />
      </LinearGradient>

      {/* Component Toast để hiển thị thông báo */}
      <Toast />
    </SafeAreaWrapper>
  );
}

// Định nghĩa styles cho component
const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute", // Vị trí tuyệt đối
    top: -HEIGHT * 0.08, // Vị trí top (âm để tạo hiệu ứng)
    width: "100%", // Chiều rộng 100%
    height: "65%", // Chiều cao 65%
    resizeMode: "cover", // Chế độ resize để cover
    borderRadius: 20, // Bo tròn góc
    transform: [{ translateY: Platform.OS === "ios" ? -15 : -10 }], // Dịch chuyển Y khác nhau cho iOS và Android
  },
  view: {
    flex: 1, // Chiếm hết không gian có sẵn

    paddingBottom: 50, // Padding phía dưới
  },
  title: {
    fontSize: 24, // Kích thước chữ
    color: "#FFFFFF", // Màu chữ
    fontFamily: "Aleo_700Bold", // Font chữ
    marginBottom: 20, // Margin phía dưới
  },
  formContainer: {
    width: "80%", // Chiều rộng 80%
    alignItems: "center", // Căn giữa nội dung theo chiều ngang
  },
  input: {
    width: "100%", // Chiều rộng 100%
    height: 60, // Chiều cao
    backgroundColor: "rgba(256, 256, 256, 0.1)", // Màu nền (trắng mờ)
    color: "#FFFFFF", // Màu chữ
    borderRadius: 6, // Bo tròn góc
    borderWidth: 1, // Độ rộng viền
    borderColor: "#FFFFFF", // Màu viền
    paddingHorizontal: 15, // Padding ngang
    marginBottom: 15, // Margin dưới
    fontSize: 16, // Kích thước chữ
    fontFamily: "Aleo_400Regular", // Font chữ
  },
  socialButtonStyle: {
    flexDirection: "row", // Sắp xếp con theo hàng ngang
    width: "100%", // Chiều rộng 100%
    justifyContent: "center", // Căn giữa nội dung theo chiều ngang
    padding: 18, // Padding 4 phía
    paddingHorizontal: 32, // Padding ngang (ghi đè padding ở trên)
    marginTop: 16, // Margin trên
    borderRadius: 16, // Bo tròn góc
    backgroundColor: "#ffffff", // Màu nền
    shadowColor: "#000", // Màu bóng đổ
    shadowOffset: { width: 0, height: 5 }, // Vị trí bóng đổ
    shadowOpacity: 0.05, // Độ mờ bóng đổ
    shadowRadius: 4.65, // Bán kính bóng đổ
    elevation: 6, // Độ nổi (cho Android)
  },
  textStyle: {
    fontSize: 18, // Kích thước chữ
    fontFamily: "Aleo_700Bold", // Font chữ
    color: "#000", // Màu chữ
    marginLeft: 10, // Margin trái
  },
  iconStyle: {
    height: 24, // Chiều cao
    width: 24, // Chiều rộng
    resizeMode: "contain", // Chế độ resize để chứa đầy đủ
  },
  buttonContainerStyle: {
    width: "80%", // Chiều rộng 80%
    justifyContent: "flex-start", // Căn nội dung về phía đầu container
  },
  splitLineStyle: {
    width: WIDTH * 0.25, // Chiều rộng 25% chiều rộng màn hình
    marginTop: 12, // Margin trên
  },
  alreadyText: {
    marginHorizontal: 8, // Margin ngang
    marginVertical: 24, // Margin dọc
    fontSize: 16, // Kích thước chữ
    color: "#FFFFFF", // Màu chữ
    fontFamily: "Aleo_400Regular", // Font chữ
  },
});

// Export component Signup để sử dụng ở nơi khác
export default Signup;
