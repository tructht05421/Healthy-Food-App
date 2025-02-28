import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CategoryTag from "./CategoryTag";
import { useDispatch, useSelector } from "react-redux";
import { favorSelector } from "../../redux/selectors/selector";
import { toggleFavorite } from "../../redux/actions/favoriteThunk";
const WIDTH = Dimensions.get("window").width;

const DishedV2 = ({ item, onPress, onFavoritePress }) => {
  const dispatch = useDispatch();
  const favorite = useSelector(favorSelector);

  const isFavorite = (id) => {
    return favorite.favoriteList.includes(id);
  };

  const handleOnSavePress = (dish) => {
    dispatch(toggleFavorite({ id: dish._id }));
    onFavoritePress && onFavoritePress();
  };

  return (
    <TouchableOpacity
      key={item._id}
      style={[
        styles.resultCard,
        { backgroundColor: item.bgColor ?? "#FFEBE6" },
      ]}
      onPress={onPress}
    >
      <View style={styles.resultInfo}>
        <View style={styles.resultTitleContainer}>
          <Text style={styles.resultTitle}>{item.name}</Text>
          <CategoryTag name={item.type} color="#FF6B00" />
        </View>

        <Text style={styles.resultDescription}>{item.description}</Text>
      </View>
      <Image source={{ uri: item.image_url }} style={styles.resultImage} />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleOnSavePress(item)}
      >
        {favorite.isLoading ? (
          <ActivityIndicator size={22} color="#FC8019" />
        ) : (
          <MaterialCommunityIcons
            name={isFavorite(item._id) ? "heart" : "heart-outline"}
            size={22}
            color="#FF9500"
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 28,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: "center",
  },
  resultTitleContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    width: "35%",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultDescription: {
    width: "80%",
    fontSize: 12,
    color: "#999",
  },
  resultImage: {
    position: "absolute",
    width: WIDTH * 0.23,
    height: WIDTH * 0.23,
    right: 0,
    borderRadius: 150,
    marginRight: 36,
    transform: [{ translateY: -WIDTH * 0.1 }],
  },
  favoriteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});

export default DishedV2;
