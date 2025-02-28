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
import useCurrentSeason from "../hooks/useCurrentSeason";
import { DishType } from "../constants/DishType";
import { useDispatch, useSelector } from "react-redux";
import { loadFavorites } from "../redux/actions/favoriteThunk";
import { favorSelector } from "../redux/selectors/selector";
import SpinnerLoading from "../components/common/SpinnerLoading";
import PaddingScrollViewBottom from "../components/common/PaddingScrollViewBottom";
const HEIGHT = Dimensions.get("window").height;
function Home({ navigation }) {
  const [seasonalDishes, setSeasonalDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState({ loadDishes: true });
  const favor = useSelector(favorSelector);
  const dispatch = useDispatch();

  const season = useCurrentSeason();

  // Seasonal dishes data

  useEffect(() => {
    loadDishes();
  }, []);

  useEffect(() => {
    loadFavoritesData();
  }, [dispatch]);

  const loadFavoritesData = async () => {
    dispatch(loadFavorites());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDishes();
    setRefreshing(false);
  };

  const loadDishes = async () => {
    setLoading({ ...loading, loadDishes: true });
    const response = await getDishes();
    if (response.status === 200) {
      setSeasonalDishes(response.data?.data);
    }
    setLoading({ ...loading, loadDishes: false });
  };

  const handleSearch = async (searchString) => {
    navigation.navigate(ScreensName.search, { searchQuery: searchString });
  };

  const handleClear = () => {
    setSearchQuery("");
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
        <SearchBar
          placeholder="What do you need?"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={() => handleSearch(searchQuery)}
          onClear={handleClear}
        />
        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by category</Text>
          <View style={styles.categoriesGrid}>
            {Object.values(DishType).map((category, key) => (
              <CategoryCard
                key={key}
                category={{
                  id: key,
                  ...category,
                }}
                onPress={() =>
                  navigation.navigate(ScreensName.search, { category })
                }
              />
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

          {seasonalDishes.length > 0 ? (
            seasonalDishes
              .filter(
                (item) =>
                  item.season === season || item.season === "All Seasons"
              )
              .map((dish) => <DishedV1 dish={dish} key={dish._id} />)
          ) : (
            <Text style={styles.noResultsText}>No seasonal dishes found</Text>
          )}
          {loading.loadDishes && favor.isLoading && <SpinnerLoading />}
        </View>
        <PaddingScrollViewBottom />
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
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default Home;
