// Import các thư viện cần thiết từ React và React Native
import React, { use, useState } from "react";
import {
  StyleSheet, // Component để tạo các styles
  Text, // Component để hiển thị văn bản
  View, // Component container cơ bản
  Dimensions, // API để lấy kích thước màn hình
  Image, // Component để hiển thị hình ảnh
  Platform, // API để xác định nền tảng (iOS/Android)
  KeyboardAvoidingView, // Component để tránh bàn phím che phủ nội dung
} from "react-native";

// Import các components tùy chỉnh
import SafeAreaWrapper from "../components/layout/SafeAreaWrapper"; // Wrapper để tránh notch và home indicator
import SigninInputField from "../components/common/SigninInputField"; // Component input field tùy chỉnh
import Ionicons from "../components/common/VectorIcons/Ionicons"; // Thư viện icon Ionicons
import MaterialIcons from "../components/common/VectorIcons/MaterialIcons"; // Thư viện icon Material
import DecorationDot from "../components/common/DecorationDot"; // Component chấm trang trí
import { TouchableOpacity } from "react-native"; // Component có thể nhấn
import RippleButton from "../components/common/RippleButton"; // Button có hiệu ứng gợn sóng

// Import các hình ảnh và tài nguyên
import googleIcon from "../../assets/image/google_icon.png"; // Icon Google
import fbIcon from "../../assets/image/fb_round.png"; // Icon Facebook
import appleIcon from "../../assets/image/apple_logo.png"; // Icon Apple
import loginHeaderIcon from "../../assets/image/login_bg.png"; // Ảnh nền header
import { ScreensName } from "../constants/ScreensName"; // Constants chứa tên các màn hình
import Toast from "react-native-toast-message";
import ShowToast from "../components/common/CustomToast"; // Component hiển thị thông báo
import { loginThunk } from "../redux/actions/userThunk"; // Action redux để xử lý đăng nhập
import { useDispatch } from "react-redux"; // Hook để dispatch actions
import { useGoogleAuth } from "../hooks/useGoogleAuth";

// Lấy kích thước màn hình
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

function Signin({ navigation }) {
  // Khởi tạo state cho form đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); // Khởi tạo dispatch để gửi actions
  const { signIn, userInfo, error } = useGoogleAuth();

  // Cấu hình các phương thức đăng nhập bên thứ 3
  const loginMethod = [
    // {
    //   name: "Facebook",
    //   icon: fbIcon,
    //   color: "#3B5998",
    // },
    {
      name: "Google",
      icon: googleIcon,
      color: "#4285F4",
      onPress: async () => {
        await loginGoogle();
      },
    },
    // {
    //   name: "IOS",
    //   icon: appleIcon,
    //   color: "#000000",
    // },
  ];

  const loginGoogle = async () => {
    await signIn();
  };

  // Xử lý sự kiện đăng nhập
  const handlePress = async () => {
    const credentials = {
      email: email,
      password: password,
    };

    try {
      // Gọi action đăng nhập
      const responseLogin = await dispatch(loginThunk(credentials));
      // Kiểm tra kết quả đăng nhập
      ShowToast("success", "Đăng nhập thành công");

      if (
        responseLogin.type.endsWith("fulfilled") &&
        responseLogin?.payload?.data?.status
      ) {
        console.log(responseLogin?.payload?.data?.status);
        ShowToast("success", "Đăng nhập thành công");
      } else {
        ShowToast("error", "Đăng nhập thất bại");
      }
    } catch (error) {
      console.log(error);
      ShowToast("error", "Đã xảy ra lỗi không mong muốn");
    }
  };

  // Render các nút đăng nhập bên thứ 3
  const renderLoginMethod = () => {
    return loginMethod.map((item, index) => (
      <RippleButton
        key={index}
        buttonStyle={styles.loginMethod}
        backgroundColor={"rgab(0, 0, 0, 0.5)"}
        onPress={() => {
          item?.onPress ? item.onPress() : null;
        }}
      >
        <Image
          source={item.icon}
          style={{
            width: 32,
            height: 32,
            resizeMode: "contain",
          }}
        />
      </RippleButton>
    ));
  };

  // Render giao diện chính
  return (
    <SafeAreaWrapper headerStyle={{ backgroundColor: "transparent" }}>
      {/* Sử dụng KeyboardAvoidingView để tránh bàn phím che phủ form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Phần header với ảnh nền */}
        <Image source={loginHeaderIcon} style={styles.backgroundImage} />
        <Text style={styles.title}>Sign in with email</Text>

        {/* Container chứa form đăng nhập */}
        <View style={styles.formContainer}>
          {/* Input trường email */}
          <SigninInputField
            state={email}
            setState={setEmail}
            icon={<Ionicons name="mail-outline" size={20} color="#5FC88F" />}
            iconBackgroundcolor="#DEF5E9"
            placeholder="Email"
            inputType="email-address"
            keyboardType="email-address"
          />
          {/* Input trường mật khẩu */}
          <SigninInputField
            state={password}
            setState={setPassword}
            icon={<MaterialIcons name="lock-open" size={20} color="#9F9DF3" />}
            iconBackgroundcolor="#EBECFF"
            placeholder="Password"
            secureTextEntry
          />
          {/* Link quên mật khẩu */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ScreensName.verifyEmail);
            }}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          {/* Nút đăng nhập chính */}
          <RippleButton
            onPress={handlePress}
            buttonText="Sign in"
            buttonStyle={styles.signinButton}
            textStyle={styles.signinButtonText}
          />
        </View>

        {/* Container chứa các nút đăng nhập bên thứ 3 */}
        <View style={styles.loginMethodContainer}>{renderLoginMethod()}</View>

        {/* Các chấm trang trí ở 4 góc màn hình */}
        <>
          <DecorationDot
            size={HEIGHT * 0.25}
            top={-(HEIGHT * 0.1)}
            left={-(WIDTH * 0.4)}
            zIndex={1}
            backgroundColor={"#AEC687"}
          />
          <DecorationDot
            size={HEIGHT * 0.25}
            top={-(HEIGHT * 0.2)}
            left={-(WIDTH * 0.2)}
            opacity={0.4}
            zIndex={1}
          />

          <DecorationDot
            size={HEIGHT * 0.25}
            top={HEIGHT - HEIGHT * 0.15}
            left={WIDTH - WIDTH * 0.4}
            zIndex={1}
            backgroundColor={"#AEC687"}
          />
          <DecorationDot
            size={HEIGHT * 0.25}
            top={HEIGHT - HEIGHT * 0.3}
            left={WIDTH - WIDTH * 0.6}
            opacity={0.4}
            zIndex={1}
            transform={[{ translateX: 200 }, { translateY: 50 }]}
          />
        </>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaWrapper>
  );
}

// Định nghĩa styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  backgroundImage: {
    // width: "60%", // Chiếm 60% chiều rộng màn hình
    height: "40%", // Chiếm 35% chiều cao màn hình
    resizeMode: "contain", // Chế độ resize ảnh
    // marginHorizontal: "20%", // Căn lề 2 bên 20%
    // marginBottom: -HEIGHT * 0.005, // Margin bottom 30px
  },
  title: {
    fontSize: 30, // Cỡ chữ
    textAlign: "center", // Căn giữa text
    marginBottom: 20, // Margin bottom 40px
    color: "#191C32", // Màu nền
    fontFamily: "Aleo_700Bold",
  },
  formContainer: {
    width: WIDTH, // Chiều rộng bằng màn hình
    justifyContent: "space-around", // Căn đều các phần tử
    alignItems: "center", // Căn giữa theo chiều ngang
    gap: 20, // Khoảng cách giữa các phần tử
  },
  forgotPassword: {
    width: WIDTH * 0.85, // Chiều rộng 85% màn hình
    textAlign: "right", // Căn phải text
    fontWeight: "600", // Độ đậm chữ
    transform: [{ translateY: -10 }], // Dịch lên trên 10px
  },
  signinButton: {
    width: WIDTH * 0.85, // Chiều rộng 85% màn hình
    backgroundColor: "#191C32", // Màu nền
    padding: 18, // Padding 18px
    borderRadius: 50, // Bo tròn góc
    overflow: "hidden", // Ẩn phần tràn
  },
  signinButtonText: {
    textAlign: "center", // Căn giữa text
    color: "#fff", // Màu chữ trắng
    fontSize: 18, // Cỡ chữ
    // fontWeight: "bold", // Độ đậm chữ
    fontFamily: "Aleo_700Bold",
  },
  loginMethodContainer: {
    flexDirection: "row", // Sắp xếp theo hàng ngang
    gap: 20, // Khoảng cách giữa các nút
    justifyContent: "center", // Căn giữa theo chiều ngang
    alignItems: "center", // Căn giữa theo chiều dọc
    marginTop: 20, // Margin top 20px
  },
  loginMethod: {
    backgroundColor: "white", // Màu nền trắng
    borderRadius: 50, // Bo tròn góc
    padding: 20, // Padding 20px
    width: 80, // Chiều rộng 80px
    height: 80, // Chiều cao 80px
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
  },
});

export default Signin;
