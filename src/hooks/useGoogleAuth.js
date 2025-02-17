// Import các thư viện cần thiết
import * as WebBrowser from "expo-web-browser"; // Thư viện xử lý web browser trong Expo
import * as Google from "expo-auth-session/providers/google"; // Provider xác thực Google
import AsyncStorage from "@react-native-async-storage/async-storage"; // Lưu trữ local
import { useState, useEffect } from "react";
import { Platform, Modal, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview"; // Component hiển thị web

// Khởi tạo phiên xác thực web
WebBrowser.maybeCompleteAuthSession();

// Cấu hình Google Auth
const googleConfig = {
  // Client ID cho Android
  androidClientId:
    "155145337295-8k2hph51rqh94qmi1lpp93ro72vg1kva.apps.googleusercontent.com",
  // Client ID cho iOS
  iosClientId:
    "155145337295-voo79g6h7n379738rce0ipoo4qoj1dom.apps.googleusercontent.com",
  scopes: ["openid", "profile", "email"], // Các quyền yêu cầu
};

// Custom hook xử lý xác thực Google
export const useGoogleAuth = () => {
  // Khởi tạo các state
  const [userInfo, setUserInfo] = useState(null); // Thông tin người dùng
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Thông tin lỗi
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
  const [authUrl, setAuthUrl] = useState(""); // URL xác thực

  // Hook xử lý yêu cầu xác thực
  const [request, response, promptAsync] = Google.useAuthRequest({
    ...googleConfig,
    selectAccount: true, // Cho phép chọn tài khoản
    usePKCE: true, // Sử dụng PKCE để bảo mật
    responseType: "code", // Loại response
    redirectUri: "com.tructht.HealthyFoodApp://", // URI callback
  });

  // Xử lý kết quả xác thực
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleSuccessfulLogin(authentication.accessToken);
      setShowModal(false);
    } else if (response?.type === "error") {
      setError(response.error?.message || "Authentication failed");
      setShowModal(false);
    }
  }, [response]);

  // Xử lý đăng nhập thành công
  const handleSuccessfulLogin = async (accessToken) => {
    try {
      // Lấy thông tin người dùng từ Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const userData = await userInfoResponse.json();

      // Lưu thông tin vào AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("googleToken", accessToken);

      setUserInfo(userData);
    } catch (err) {
      setError("Failed to fetch user info");
      console.error(err);
    }
  };

  // Xử lý thay đổi trạng thái navigation trong WebView
  const handleNavigationStateChange = (navState) => {
    // Kiểm tra URL có chứa access token
    if (navState.url.includes("access_token=")) {
      const accessToken = navState.url.split("access_token=")[1].split("&")[0];
      handleSuccessfulLogin(accessToken);
      setShowModal(false);
    }
    // Xử lý khi hủy xác thực
    if (navState.url.includes("error=")) {
      setShowModal(false);
      setError("Authentication cancelled");
    }
  };

  // Hàm xử lý đăng nhập
  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy URL xác thực nhưng chưa chuyển hướng
      const authUrlResult = await promptAsync({
        useProxy: false,
        showInRecents: false,
        returnUrl: false,
      });

      if (authUrlResult?.url) {
        setAuthUrl(authUrlResult.url);
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng xuất
  const signOut = async () => {
    try {
      // Xóa dữ liệu khỏi AsyncStorage
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("googleToken");
      setUserInfo(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Component Modal chứa WebView
  const AuthModal = () => (
    <Modal
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <WebView
            source={{ uri: authUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            style={styles.webview}
            incognito={true} // Chế độ ẩn danh
            sharedCookiesEnabled={false} // Không chia sẻ cookies
          />
        </View>
      </View>
    </Modal>
  );

  // Kiểm tra phiên đăng nhập đã tồn tại
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          setUserInfo(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
      }
    };
    checkExistingSession();
  }, []);

  // Trả về các hàm và state cần thiết
  return {
    signIn,
    signOut,
    userInfo,
    loading,
    error,
    AuthModal, // Export component modal
  };
};

// Định nghĩa styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, // Chiếm toàn màn hình
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%", // Chiều rộng modal
    height: "80%", // Chiều cao modal
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  webview: {
    flex: 1, // WebView chiếm hết không gian
  },
});
