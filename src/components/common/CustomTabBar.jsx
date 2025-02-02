// Import các thư viện cần thiết
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreensMap } from "../../router/ScreensMap";

// Lấy kích thước màn hình
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

// Component CustomTabBar - Tạo custom bottom tab navigation
const CustomTabBar = ({ state, descriptors, navigation }) => {
  // Sử dụng useMemo để tối ưu việc lấy thông tin route hiện tại
  const routeItem = useMemo(() => {
    return ScreensMap[state.index];
  }, [state.index]);

  // Kiểm tra nếu screen hiện tại cần ẩn tabbar
  if (routeItem.hiddenBottomTab) return;

  return (
    // Container chính của TabBar
    <View
      style={{
        position: "absolute", // Định vị tuyệt đối
        bottom: 0, // Đặt ở bottom màn hình
        width: "100%", // Chiều rộng 100%
        height: HEIGHT * 0.08, // Chiều cao 8% màn hình
      }}
    >
      {/* Nền gradient của TabBar */}
      <LinearGradient
        colors={["#2CAD5E", "#2CAD5E"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Container các tab items */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* Map qua các routes để render từng tab */}
        {state.routes.map((route, index) => {
          // Lấy options của route hiện tại
          const { options } = descriptors[route.key];

          // Xác định label cho tab
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // Kiểm tra tab có được focus không
          const isFocused = state.index === index;

          // Xử lý khi nhấn tab
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Xử lý khi nhấn giữ tab
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Bỏ qua render nếu tab được cấu hình ẩn
          if (
            options.tabBarButton &&
            typeof options.tabBarButton === "function"
          ) {
            return null;
          }

          // Render từng tab item
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center", ...options.iconStyles }}
            >
              {/* Render icon của tab */}
              {options.tabBarIcon
                ? options.tabBarIcon({
                    focused: isFocused,
                    // Xác định màu icon dựa trên trạng thái focus
                    color: isFocused
                      ? options?.activeColor || "#75E00A"
                      : options?.inactiveColor || "#ffffff",
                    size: 32,
                  })
                : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
