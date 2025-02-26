import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper";
import DishedFavor from "../components/common/DishedFavor";
import useFavorites from "../hooks/useFavorites";
import { getDishes } from "../services/dishes";

function FavorList() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [dishes, setDishes] = useState([]);
  const { favoriteList, isFavorite, onChangeFavorite, isLoading } =
    useFavorites();
  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    const response = await getDishes();

    if (response.status === 200) {
      setDishes(response.data?.data || []);
    }
  };

  useEffect(() => {
    if (!isLoading && dishes.length > 0) {
      loadFavoriteItems();
    }
  }, [favoriteList, isLoading, dishes, isFavorite]);

  const loadFavoriteItems = () => {
    console.log(favoriteList);

    const filteredItems = dishes.filter((item) => isFavorite(item._id));
    setFavoriteItems(filteredItems);
  };

  return (
    <MainLayoutWrapper>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.gridContainer}>
            {favoriteItems.length === 0 ? (
              <Text>No favorite items found.</Text>
            ) : (
              favoriteItems.map((item) => (
                <View key={item._id} style={styles.gridItem}>
                  <DishedFavor
                    item={item}
                    refresh={loadFavoriteItems}
                    onChangeFavorite={() => onChangeFavorite(item._id)}
                  />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </MainLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
});

export default FavorList;
