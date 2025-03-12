import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from "react-native";

export const EditMealPlanModal = ({ visible, onClose, onSave }) => {
  const [mealPlan, setMealPlan] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });

  const handleSave = () => {
    onSave(mealPlan);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meal Planning</Text>
        </View>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.formGrid}>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Breakfast</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={mealPlan.breakfast}
                    onChangeText={(text) =>
                      setMealPlan({ ...mealPlan, breakfast: text })
                    }
                  />
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#3592E7"
                    style={styles.inputIcon}
                  />
                </View>
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Lunch</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={mealPlan.lunch}
                    onChangeText={(text) =>
                      setMealPlan({ ...mealPlan, lunch: text })
                    }
                  />
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#3592E7"
                    style={styles.inputIcon}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Dinner</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={mealPlan.dinner}
                    onChangeText={(text) =>
                      setMealPlan({ ...mealPlan, dinner: text })
                    }
                  />
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#3592E7"
                    style={styles.inputIcon}
                  />
                </View>
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Snacks</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={mealPlan.snacks}
                    onChangeText={(text) =>
                      setMealPlan({ ...mealPlan, snacks: text })
                    }
                  />
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#3592E7"
                    style={styles.inputIcon}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* Decorative corners */}
        <View style={styles.topLeftCorner} />
        <View style={styles.bottomRightCorner} />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
    zIndex: 999,
    bottom: "10%",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formGrid: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formItem: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  inputIcon: {
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#3592E7",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
