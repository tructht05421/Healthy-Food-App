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

import Ionicons from "../common/VectorIcons/Ionicons";

export const EditHealthModal = ({ visible, onClose, onSave }) => {
  const [healthData, setHealthData] = useState({
    height: "",
    weight: "",
    age: "",
    bmi: "",
    bloodType: "",
    allergies: "",
    medication: "",
    healthIssues: "",
    goal: "",
    dietRestrictions: "",
  });

  const handleSave = () => {
    onSave(healthData);
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Information</Text>
        </View>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.formGrid}>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.height}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, height: text })
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
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.age}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, age: text })
                    }
                    keyboardType="number-pad"
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
                <Text style={styles.label}>Weight</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.weight}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, weight: text })
                    }
                    keyboardType="decimal-pad"
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
                <Text style={styles.label}>BMI</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.bmi}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, bmi: text })
                    }
                    keyboardType="decimal-pad"
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
                <Text style={styles.label}>Blood Type</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.bloodType}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, bloodType: text })
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
                <Text style={styles.label}>Allergies</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.allergies}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, allergies: text })
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
                <Text style={styles.label}>Medication</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.medication}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, medication: text })
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
                <Text style={styles.label}>Health Issues</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.healthIssues}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, healthIssues: text })
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
                <Text style={styles.label}>Goal</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.goal}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, goal: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Diet Restrictions</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={healthData.dietRestrictions}
                    onChangeText={(text) =>
                      setHealthData({ ...healthData, dietRestrictions: text })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
