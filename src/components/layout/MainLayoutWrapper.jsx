import React from "react";
import { Text } from "react-native";
import SafeAreaWrapper from "./SafeAreaWrapper";
import Header from "./Header";
import { View } from "react-native-web";
import { LinearGradient } from "expo-linear-gradient";

function MainLayoutWrapper({ children }) {
  return (
    <SafeAreaWrapper headerStyle={{ backgroundColor: "white" }}>
      <Header />
      <LinearGradient
        colors={["white", "white", "rgba(64,180,145,0.2)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
      {/* {children} */}
    </SafeAreaWrapper>
  );
}

export default MainLayoutWrapper;
