import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper";
import SearchBar from "../components/common/SearchBar";
import { ScreensName } from "../constants/ScreensName";
import DishedV1 from "../components/common/DishedV1";
import { getDishes } from "../services/dishes";
import CategoryCard from "../components/common/CategoryCard";
const HEIGHT = Dimensions.get("window").height;
function Home({ navigation }) {
  const [seasonalDishes, setSeasonalDishes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  // Category data
  const categories = [
    {
      id: 1,
      title: "Heavy Meals",
      image: require("../../assets/image/light-meals.png"),
    },
    {
      id: 2,
      title: "Light Meals",
      image: require("../../assets/image/light-meals.png"),
    },
    {
      id: 3,
      title: "Beverages",
      image: require("../../assets/image/light-meals.png"),
    },
    {
      id: 4,
      title: "Desserts",
      image: require("../../assets/image/light-meals.png"),
    },
  ];

  // Seasonal dishes data

  useEffect(() => {
    loadDishes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDishes();
    setRefreshing(false);
  };

  const loadDishes = async () => {
    const response = await getDishes();
    if (response.status === 200) {
      setSeasonalDishes(response.data?.data);
    }
  };

  const handleViewAll = () => {
    navigation.navigate(ScreensName.list);
  };

  return (
    <MainLayoutWrapper>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBar />
        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>

        {/* Seasonal Dishes Section */}
        <View style={styles.seasonalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seasonal Dishes</Text>
            <TouchableOpacity onPress={() => handleViewAll()}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {seasonalDishes.map((dish) => (
            <DishedV1 dish={dish} key={dish._id} />
          ))}
        </View>
      </ScrollView>
    </MainLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // marginBottom: HEIGHT * 0.08,
  },
  // Categories section
  categoriesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#38B2AC",
    fontWeight: "500",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  // Seasonal dishes section
  seasonalSection: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    color: "#38B2AC",
    fontSize: 14,
  },
});

export default Home;
