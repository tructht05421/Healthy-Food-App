import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Ionicons from "../components/common/VectorIcons/Ionicons";
import PaddingScrollViewBottom from "../components/common/PaddingScrollViewBottom";
import { useDispatch, useSelector } from "react-redux";
import { favorSelector } from "../redux/selectors/selector";
import { toggleFavorite } from "../redux/actions/favoriteThunk";
import MaterialCommunityIcons from "../components/common/VectorIcons/MaterialCommunityIcons";
const HEIGHT = Dimensions.get("window").height;
function FavorAndSuggest({ route }) {
  const dispatch = useDispatch();
  const favorite = useSelector(favorSelector);

  const dish = useMemo(() => {
    return route.params.dish;
  }, [route.params.dish]);

  const recipe = useMemo(() => {
    return dish?.recipe_id;
  }, [dish]);

  const calories = useMemo(() => {
    if (recipe?.ingredients?.length > 0) {
      let totalCalories = 0;
      recipe?.ingredients.forEach((ingredient) => {
        totalCalories += ingredient?.ingredient_id?.calories;
      });
      return totalCalories;
    } else {
      return 0;
    }
  }, [dish]);

  const carbs = useMemo(() => {
    if (recipe?.ingredients?.length > 0) {
      let totalCarbs = 0;
      recipe?.ingredients.forEach((ingredient) => {
        totalCarbs += ingredient?.ingredient_id?.carbs;
      });
      return totalCarbs;
    } else {
      return 0;
    }
  }, [dish]);

  const proteins = useMemo(() => {
    if (recipe?.ingredients?.length > 0) {
      let totalProteins = 0;
      recipe?.ingredients.forEach((ingredient) => {
        totalProteins += ingredient?.ingredient_id?.protein;
      });
      return totalProteins;
    } else {
      return 0;
    }
  }, [dish]);

  const fats = useMemo(() => {
    if (recipe?.ingredients?.length > 0) {
      let totalFats = 0;
      recipe?.ingredients.forEach((ingredient) => {
        totalFats += ingredient?.ingredient_id?.fat;
      });
      return totalFats;
    } else {
      return 0;
    }
  }, [dish]);

  const isFavorite = (id) => {
    return favorite.favoriteList.includes(id);
  };

  const handleOnSavePress = (dish) => {
    dispatch(toggleFavorite({ id: dish._id }));
  };

  const layout = useWindowDimensions();

  const renderRecipeCard = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: "ingredient", title: "Ingredient" },
      { key: "instructions", title: "Instructions" },
    ]);

    const IngredientsRoute = () => (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>
          {recipe?.ingredients.length} Ingredients
        </Text>
        {recipe?.ingredients.map((ingredient, idx) => (
          <View key={idx} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>
              {ingredient?.ingredient_id.name}
            </Text>
            <Text style={styles.ingredientQuantity}>
              {ingredient?.quantity} {ingredient?.unit}
            </Text>
          </View>
        ))}
        <PaddingScrollViewBottom />
      </ScrollView>
    );

    const InstructionsRoute = () => (
      <ScrollView style={styles.tabContent}>
        {/* {recipe.instructions.map((instruction, idx) => (
          <Text key={idx} style={styles.instructionText}>
            • {instruction}
          </Text>
        ))} */}
        <PaddingScrollViewBottom />
      </ScrollView>
    );

    const renderScene = SceneMap({
      ingredient: IngredientsRoute,
      instructions: InstructionsRoute,
    });

    const renderTabBar = (props) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#4CAF50" }}
        style={{ backgroundColor: "white" }}
        labelStyle={{ color: "#455A64", fontSize: 14, textTransform: "none" }}
        activeColor="#4CAF50"
        inactiveColor="#455A64"
        pressColor="rgba(76, 175, 80, 0.1)"
      />
    );

    return (
      <View key={dish._id} style={styles.recipeCard}>
        <Image source={{ uri: dish?.image_url }} style={styles.recipeImage} />
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => handleOnSavePress(dish)}
        >
          {favorite.isLoading ? (
            <ActivityIndicator size={24} color="#FC8019" />
          ) : isFavorite(dish._id) ? (
            <MaterialCommunityIcons
              name="heart-multiple"
              size={24}
              color="#FF8A65"
            />
          ) : (
            <Ionicons name="heart-outline" size={24} color="#FF8A65" />
          )}
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.recipeName}>{dish.name}</Text>
          <Text style={styles.recipeDescription}>{dish.description}</Text>

          <View style={styles.nutritionInfo}>
            <View style={styles.nutritionItem}>
              <Ionicons name="restaurant-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>{carbs} carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="fitness-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>{proteins} proteins</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="flame-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>{calories} Kcal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="water-outline" size={16} color="#78909C" />
              <Text style={styles.nutritionText}>{fats} fats</Text>
            </View>
          </View>

          <View style={styles.tabViewContainer}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width - 32 }}
              renderTabBar={renderTabBar}
              style={styles.tabView}
            />
          </View>
        </View>

        {/* <View style={styles.avatarContainer}>
          <Image
            source={require("../assets/avatar.png")} // Add this to your assets
            style={styles.avatar}
          />
        </View> */}
      </View>
    );
  };

  return (
    <MainLayoutWrapper>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderRecipeCard(dish)}
        </ScrollView>
      </View>
    </MainLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#455A64",
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  heartIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
  cardContent: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRigghtRadius: 12,
    // transform: [{ translateY: -5 }],
    // backgroundColor: "white",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#263238",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#546E7A",
    marginBottom: 16,
  },
  nutritionInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  nutritionText: {
    fontSize: 12,
    color: "#78909C",
    marginLeft: 4,
  },
  tabViewContainer: {
    height: HEIGHT * 0.5, // Set a fixed height for the tab view
    paddingHorizontal: 16,
  },
  tabView: {
    marginTop: 8,
  },
  tabContent: {
    paddingTop: 16,
    // marginBottom: HEIGHT * 0.08,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#37474F",
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEFF1",
  },
  ingredientName: {
    color: "#455A64",
  },
  ingredientQuantity: {
    fontWeight: "bold",
    color: "#263238",
  },
  instructionText: {
    fontSize: 14,
    color: "#455A64",
    marginBottom: 8,
    lineHeight: 20,
  },
  avatarContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F2F1",
    borderWidth: 2,
    borderColor: "#B2DFDB",
  },
});

export default FavorAndSuggest;
