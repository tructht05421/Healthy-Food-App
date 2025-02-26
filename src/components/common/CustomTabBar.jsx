import React from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreensMap } from "../../router/ScreensMap";
import MaterialCommunityIcons from "./VectorIcons/MaterialCommunityIcons";
import { ScreensName } from "../../constants/ScreensName";

// Get screen dimensions
const HEIGHT = Dimensions.get("window").height;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  // The main tab screen is named "Main" and contains a stack navigator
  const mainRoute = state.routes[0];
  const mainRouteState = mainRoute?.state;

  // Get the current route index from the nested stack navigator
  const currentRouteIndex = mainRouteState?.index || 0;

  // Get the current screen name from the nested navigator state
  let currentScreenName = "Home"; // Default to Home if we can't determine

  if (
    mainRouteState &&
    mainRouteState.routes &&
    mainRouteState.routes.length > 0
  ) {
    currentScreenName = mainRouteState.routes[currentRouteIndex].name;
  }

  // Find the current screen in ScreensMap
  const currentScreen =
    ScreensMap.find((screen) => screen.name === currentScreenName) ||
    ScreensMap[0];

  // If current screen should hide tab bar, return null but maintain layout space
  if (currentScreen?.hiddenBottomTab) {
    return <View style={{ height: HEIGHT * 0.08 }} />;
  }

  // Find visible tabs to display in the tab bar
  const visibleTabs = ScreensMap.filter(
    (screen) =>
      !(
        screen.options?.tabBarButton &&
        typeof screen.options.tabBarButton === "function"
      ) && screen.options?.tabBarIcon
  );

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: HEIGHT * 0.08,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: "transparent", // Important to ensure visibility
        zIndex: 999, // Ensure it stays on top
      }}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={["white", "white"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Tab items container */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          height: "100%",
          alignItems: "center",
        }}
      >
        {visibleTabs.map((screen, index) => {
          // Check if this tab is the current screen
          const isFocused = currentScreenName === screen.name;

          // Handle tab press - Navigate to screen within the Main navigator
          const onPress = () => {
            if (!isFocused) {
              // Navigate through the stack in Main
              navigation.navigate("Main", {
                screen: screen.name,
              });
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={screen.name}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                ...(screen.options?.iconStyles || {}),
              }}
            >
              {screen.options?.tabBarIcon &&
                screen.options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused
                    ? screen.options?.activeColor || "#FF7400"
                    : screen.options?.inactiveColor || "#ABB7C2",
                  size: 28,
                })}
            </TouchableOpacity>
          );
        })}

        {/* Center Button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "-50%",
            left: "50%",
            transform: [{ translateX: -HEIGHT * 0.04 }],
            width: HEIGHT * 0.08,
            height: HEIGHT * 0.08,
            borderRadius: 50,
            backgroundColor: "#ff9900", // Adjust as needed
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("Main", {
              screen: ScreensName.home,
            });
          }}
          activeOpacity={0.9}
          // Add desired action for the central button
        >
          <LinearGradient
            colors={["#40B491", "#FFFFFF"]}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: 50,
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          >
            {/* <View style={styles.circleContainer}>
              <View style={styles.halfCircle} />
            </View> */}
          </LinearGradient>
          <MaterialCommunityIcons name="home" size={42} color="#F398C1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomTabBar;
