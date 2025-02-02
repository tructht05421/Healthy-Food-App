// Import các dependencies cần thiết
import React, { useState } from "react";
import {
  StyleSheet, // Để tạo stylesheet
  Text, // Component hiển thị text
  View, // Component container
  Dimensions, // API lấy kích thước màn hình
  Image,
  Platform,
  KeyboardAvoidingView, // Component hiển thị hình ảnh
} from "react-native";

// Import các components tùy chỉnh từ thư mục components
import SafeAreaWrapper from "../components/layout/SafeAreaWrapper"; // Wrapper an toàn cho notch/home indicator
import SigninInputField from "../components/common/SigninInputField"; // Component input tùy chỉnh
import Ionicons from "../components/common/VectorIcons/Ionicons"; // Icon từ Ionicons
import MaterialIcons from "../components/common/VectorIcons/MaterialIcons"; // Icon từ Material
import DecorationDot from "../components/common/DecorationDot"; // Component chấm trang trí
import { TouchableOpacity } from "react-native"; // Component có thể click
import RippleButton from "../components/common/RippleButton"; // Button có hiệu ứng gợn sóng

// Import các assets hình ảnh
import googleIcon from "../../assets/image/google_icon.png"; // Logo Google
import fbIcon from "../../assets/image/fb_round.png"; // Logo Facebook
import appleIcon from "../../assets/image/apple_logo.png"; // Logo Apple
import loginHeaderIcon from "../../assets/image/login_bg.png"; // Ảnh header

// Lấy chiều rộng màn hình
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

function Signin({ navigation }) {
  // State quản lý form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Cấu hình các phương thức đăng nhập
  const loginMethod = [
    {
      name: "Facebook",
      icon: fbIcon,
      color: "#3B5998",
    },
    {
      name: "Google",
      icon: googleIcon,
      color: "#4285F4",
    },
    {
      name: "IOS",
      icon: appleIcon,
      color: "#000000",
    },
  ];

  // Xử lý chuyển màn hình sang signup
  const handlePress = () => {
    navigation.navigate("signup");
  };

  // Render các nút đăng nhập bên thứ 3
  const renderLoginMethod = () => {
    return loginMethod.map((item, index) => (
      <RippleButton
        key={index}
        buttonStyle={styles.loginMethod}
        backgroundColor={"rgab(0, 0, 0, 0.5)"}
      >
        <Image
          source={item.icon}
          style={{
            // width: WIDTH * 0.08,
            // height: WIDTH * 0.08,
            width: 32,
            height: 32,
            resizeMode: "contain",
          }}
        />
      </RippleButton>
    ));
  };

  return (
    <SafeAreaWrapper headerStyle={{ backgroundColor: "transparent" }}>
      {/* Phần header với ảnh */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image source={loginHeaderIcon} style={styles.backgroundImage} />
        <Text style={styles.title}>Sign in with email</Text>

        {/* Form đăng nhập */}
        <View style={styles.formContainer}>
          {/* Input email */}
          <SigninInputField
            state={email}
            setState={setEmail}
            icon={<Ionicons name="mail-outline" size={20} color="#5FC88F" />}
            iconBackgroundcolor="#DEF5E9"
            placeholder="Email"
            inputType="email-address"
            keyboardType="email-address"
          />
          {/* Input password */}
          <SigninInputField
            state={password}
            setState={setPassword}
            icon={<MaterialIcons name="lock-open" size={20} color="#9F9DF3" />}
            iconBackgroundcolor="#EBECFF"
            placeholder="Password"
            secureTextEntry
          />
          {/* Link quên mật khẩu */}
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          {/* Nút đăng nhập */}
          <RippleButton
            onPress={handlePress}
            buttonText="Sign in"
            buttonStyle={styles.signinButton}
            textStyle={styles.signinButtonText}
          />
        </View>

        {/* Phần đăng nhập bằng dịch vụ thứ 3 */}
        <View style={styles.loginMethodContainer}>{renderLoginMethod()}</View>

        {/* Các chấm trang trí ở 4 góc màn hình */}
        <>
          <DecorationDot
            size={HEIGHT * 0.25}
            top={-(HEIGHT * 0.2)}
            left={-(WIDTH * 0.2)}
            opacity={0.4}
            zIndex={10}
          />
          <DecorationDot
            size={HEIGHT * 0.25}
            top={-(HEIGHT * 0.1)}
            left={-(WIDTH * 0.4)}
            zIndex={9}
            backgroundColor={"#AEC687"}
          />
          <DecorationDot
            size={HEIGHT * 0.25}
            top={HEIGHT - HEIGHT * 0.3}
            left={WIDTH - WIDTH * 0.6}
            opacity={0.4}
            zIndex={10}
            transform={[{ translateX: 200 }, { translateY: 50 }]}
          />
          <DecorationDot
            size={HEIGHT * 0.25}
            top={HEIGHT - HEIGHT * 0.15}
            left={WIDTH - WIDTH * 0.4}
            // bottom={0}
            // right={0}
            zIndex={9}
            backgroundColor={"#AEC687"}
            // animation={true}
            // transform={[{ translateX: -320 }, { translateY: 150 }]}
          />
        </>
      </KeyboardAvoidingView>
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
