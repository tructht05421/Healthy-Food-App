// PHẦN 1: IMPORTS
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StatusBar } from "react-native";

import { ScreensMap } from "./ScreensMap";
import CustomTabBar from "../components/common/CustomTabBar";
import { useTheme } from "../contexts/ThemeContext";

// PHẦN 2: KHỞI TẠO NAVIGATORS
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// PHẦN 3: STACK NAVIGATOR
function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // Note: We're not setting backgroundColor here as it's handled by ThemedLayoutWrapper
      }}
    >
      {ScreensMap.map((item, index) => (
        <Stack.Screen key={index} name={item.name} component={item.component} />
      ))}
    </Stack.Navigator>
  );
}
// PHẦN 4: TAB NAVIGATOR

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} theme={theme} />}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        animation: "shift",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // Apply theme colors
        tabBarStyle: {
          backgroundColor: theme.tabBarBackgroundColor,
          borderTopColor: theme.border,
        },
      })}
      backBehavior="history"
    >
      <Tab.Screen name={"Main"} component={HomeStack} />
    </Tab.Navigator>
  );
};

// PHẦN 4: STACK NAVIGATOR CHÍNH
const Navigator = () => {
  const { theme, themeMode } = useTheme();

  // Create a custom theme for NavigationContainer based on our theme
  const navigationTheme = {
    ...(themeMode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(themeMode === "dark" ? DarkTheme : DefaultTheme).colors,
      card: theme.cardBackground,
      text: theme.textColor,
      border: theme.border,
      primary: theme.primary,
      notification: theme.accent,
      // Don't set background color here - it's handled by ThemedLayoutWrapper
    },
  };

  return (
    <>
      <StatusBar
        barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer theme={navigationTheme}>
        {TabNavigator()}
      </NavigationContainer>
    </>
  );
};

export default Navigator;
