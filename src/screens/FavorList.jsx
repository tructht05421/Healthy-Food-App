import React from "react";
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

function FavorList() {
  // Sample data - replace with your actual data source
  const favoriteItems = [
    {
      id: 1,
      title: "Sunny Egg & Toast Avocado",
      imageUrl:
        "https://sakos.vn/wp-content/uploads/2023/10/pad_thai__1__f7bd4f4931604756939e6ee41ec228d8.jpg",
      hasVideo: true,
    },
    {
      id: 2,
      title: "Bowl of noodle with beef",
      imageUrl:
        "https://sakos.vn/wp-content/uploads/2023/10/pad_thai__1__f7bd4f4931604756939e6ee41ec228d8.jpg",
      hasVideo: true,
    },
    {
      id: 3,
      title: "Easy homemade beef burger",
      imageUrl:
        "https://sakos.vn/wp-content/uploads/2023/10/pad_thai__1__f7bd4f4931604756939e6ee41ec228d8.jpg",
      hasVideo: false,
    },
    {
      id: 4,
      title: "Half boiled egg sandwich",
      imageUrl:
        "https://sakos.vn/wp-content/uploads/2023/10/pad_thai__1__f7bd4f4931604756939e6ee41ec228d8.jpg",
      hasVideo: false,
    },
    {
      id: 5,
      title: "Sunny side up with avocado",
      imageUrl:
        "https://sakos.vn/wp-content/uploads/2023/10/pad_thai__1__f7bd4f4931604756939e6ee41ec228d8.jpg",
      hasVideo: false,
    },
    {
      id: 6,
      title: "Sandwich with strawberry jam",
      imageUrl:
        "https://sakos.vn/wp-content/uploads/2023/10/pad_thai__1__f7bd4f4931604756939e6ee41ec228d8.jpg",
      hasVideo: false,
    },
  ];

  return (
    <MainLayoutWrapper>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.gridContainer}>
            {favoriteItems.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <DishedFavor title={item.title} imageUrl={item.imageUrl} />
              </View>
            ))}
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
