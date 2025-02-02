// PHẦN 1: IMPORTS
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// ↑ Import các function để tạo navigation từ React Navigation:
// - createStackNavigator: tạo navigation dạng chồng màn hình
// - createBottomTabNavigator: tạo navigation dạng tab ở bottom

import { ScreensMap } from "./ScreensMap";
// ↑ Import danh sách các màn hình cần hiển thị trong tab bar

import CustomTabBar from "../components/common/CustomTabBar";
import { Easing } from "react-native";
// ↑ Import component TabBar tùy chỉnh thay thế TabBar mặc định

// PHẦN 2: KHỞI TẠO NAVIGATORS
const Stack = createStackNavigator();
// ↑ Tạo Stack Navigator để quản lý navigation dạng chồng màn hình

const Tab = createBottomTabNavigator();
// ↑ Tạo Bottom Tab Navigator để quản lý các tab ở bottom

// PHẦN 3: TAB NAVIGATOR
const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      // ↑ Sử dụng CustomTabBar thay vì TabBar mặc định

      screenOptions={({ route }) => ({
        tabBarShowLabel: false, // Ẩn text label trong tab
        headerShown: false, // Ẩn header của screen
        animation: "shift",
        gestureEnabled: true, // Enable thao tác vuốt
        gestureDirection: "horizontal", // Hướng vuốt ngang
      })}
      backBehavior="history" // Quay lại theo lịch sử
    >
      {/* Render các màn hình từ ScreensMap */}
      {ScreensMap.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name} // Tên định danh màn hình
          component={item.component} // Component của màn hình
          options={item.options} // Cấu hình cho màn hình
        />
      ))}
    </Tab.Navigator>
  );
};

// PHẦN 4: STACK NAVIGATOR CHÍNH
const Navigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Màn hình chính chứa TabNavigator */}
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
