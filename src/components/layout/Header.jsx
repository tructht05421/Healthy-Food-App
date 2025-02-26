import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "../common/VectorIcons/Ionicons";
import { useNavigation } from "@react-navigation/native";

function Header() {
  const navigation = useNavigation();
  // console.log(navigation.canGoBack());

  return (
    <View style={styles.container}>
      {navigation.canGoBack() && (
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back" // Tên icon
            size={32} // Kích thước icon
            color={"#40B491"} // Màu sắc (active/inactive)
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity>
        <Image
          source={require("../../../assets/image/Profile.png")}
          resizeMode="cover"
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  backIcon: {
    position: "absolute",
    left: "5%",
  },
  profileImage: {
    height: 40,
    width: 40,
    // borderRadius: 100,
  },
});

export default Header;
