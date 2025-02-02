// App.js
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, Text, View } from "react-native";
import store from "./src/redux/store";
import Navigator from "./src/router/Navigator";
import React from "react";

import {
  useFonts,
  Aleo_300Light,
  Aleo_300Light_Italic,
  Aleo_400Regular,
  Aleo_400Regular_Italic,
  Aleo_700Bold,
  Aleo_700Bold_Italic,
} from "@expo-google-fonts/aleo";

// Create a custom Text component wrapper
const DefaultText = Text.render;
const customTextRender = function (...args) {
  const originText = DefaultText.apply(this, args);
  return React.cloneElement(originText, {
    style: [{ fontFamily: "Aleo_400Regular" }, originText.props.style],
  });
};

Text.render = customTextRender;

export default function App() {
  let [fontsLoaded] = useFonts({
    Aleo_300Light,
    Aleo_300Light_Italic,
    Aleo_400Regular,
    Aleo_400Regular_Italic,
    Aleo_700Bold,
    Aleo_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  // Add a test text to verify font loading
  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </Provider>
    </View>
  );
}
