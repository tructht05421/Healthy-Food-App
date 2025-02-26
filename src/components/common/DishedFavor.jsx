import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AntDesignIcon from "./VectorIcons/AntDesignIcon";
const HEIGHT = Dimensions.get("window").height;
// DishedFavor component for individual food items
const DishedFavor = ({ title, imageUrl, hasVideo = false }) => {
  return (
    <TouchableOpacity style={styles.dishedFavorContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../../../assets/image/blueberry-egg.png")
          }
          style={styles.dishImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.videoIndicator} activeOpacity={0.9}>
          {/* <Text style={styles.videoIcon}>▶</Text> */}
          <AntDesignIcon name="heart" size={24} color="#40B491" />
        </TouchableOpacity>
      </View>
      <Text style={styles.dishTitle}>{title}</Text>
      <TouchableOpacity style={styles.deleteButton}>
        <AntDesignIcon name="delete" size={24} color="#FF0000" />
        {/* <Text style={styles.deleteIcon}>🗑️</Text> */}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dishedFavorContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  imageContainer: {
    position: "relative",
  },
  dishImage: {
    width: "100%",
    height: HEIGHT * 0.12,
    borderRadius: 8,
  },
  videoIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  videoIcon: {
    fontSize: 12,
  },
  dishTitle: {
    minHeight: HEIGHT * 0.06,
    fontSize: 15,
    fontWeight: "bold",
    padding: 8,
  },
  deleteButton: {
    // position: "absolute",
    bottom: 8,
    alignSelf: "center",
  },
  deleteIcon: {
    color: "#FF0000",
    fontSize: 16,
  },
});

export default DishedFavor;
