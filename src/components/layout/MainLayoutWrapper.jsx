import React from "react";
import { Dimensions, Text } from "react-native";
import SafeAreaWrapper from "./SafeAreaWrapper";
import Header from "./Header";
import { View } from "react-native-web";
import { LinearGradient } from "expo-linear-gradient";
import DecorationDot from "../common/DecorationDot";

// Lấy kích thước màn hình
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

function MainLayoutWrapper({ children }) {
  return (
    <SafeAreaWrapper headerStyle={{ backgroundColor: "transparent" }}>
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
      <DecorationDot
        size={HEIGHT * 0.25}
        top={-(HEIGHT * 0.2)}
        left={-(WIDTH * 0.4)}
        zIndex={1}
        backgroundColor={"#AEC687"}
      />
      <DecorationDot
        size={HEIGHT * 0.25}
        top={-(HEIGHT * 0.25)}
        left={-(WIDTH * 0.2)}
        opacity={0.4}
        zIndex={1}
      />
    </SafeAreaWrapper>
  );
}

export default MainLayoutWrapper;
