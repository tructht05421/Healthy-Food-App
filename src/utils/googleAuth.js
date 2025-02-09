// auth.js
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Replace these with your Google OAuth credentials
const googleConfig = {
  androidClientId: "YOUR_ANDROID_CLIENT_ID",
  iosClientId: "YOUR_IOS_CLIENT_ID",
  expoClientId: "YOUR_EXPO_CLIENT_ID", // For Expo Go
  webClientId: "YOUR_WEB_CLIENT_ID",
};

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    expoClientId: googleConfig.expoClientId,
    webClientId: googleConfig.webClientId,
  });

  const getUserData = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const user = await response.json();
      return user;
    } catch (error) {
      throw new Error("Error fetching user data");
    }
  };

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await promptAsync();
      if (result?.type === "success") {
        const { authentication } = result;
        // Get user information
        const userData = await getUserData(authentication.accessToken);
        setUserInfo(userData);
        // Store authentication data
        await AsyncStorage.setItem("googleToken", authentication.accessToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("googleToken");
      await AsyncStorage.removeItem("userData");
      setUserInfo(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Check for existing session on mount
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

  return {
    signIn,
    signOut,
    userInfo,
    loading,
    error,
  };
};
