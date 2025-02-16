import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

// ShowToast Component
const ShowToast = (type, message) => {
  // Custom Toast Component
  console.log(message);

  const CustomToast = ({ text1, text2, type }) => {
    let backgroundColor = "#28a745"; // Default for success
    let icon = "✓";

    if (type === "error") {
      backgroundColor = "#dc3545"; // Red for error
      icon = "❌";
    } else if (type === "info") {
      backgroundColor = "#17a2b8"; // Blue for info
      icon = "ℹ️";
    }

    return (
      <View style={[styles.toastContainer, { backgroundColor }]}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text1}>{text1}</Text>
          <Text style={styles.text2}>{text2}</Text>
        </View>
      </View>
    );
  };

  // Show the toast using Toast.show()
  Toast.show({
    type: type, // Success, error, or info
    position: "bottom", // Position of the toast
    text1: type.charAt(0).toUpperCase() + type.slice(1), // "Success", "Error", or "Info"
    text2: message, // The message we passed
    visibilityTime: 3000, // Duration
    // component: CustomToast, // Use the custom component
    props: {
      text1: type.charAt(0).toUpperCase() + type.slice(1),
      text2: message,
      type,
    }, // Pass properties to custom component
  });
};

// Styles for the custom toast component
const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    maxWidth: "80%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    color: "#fff",
  },
  textContainer: {
    justifyContent: "center",
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  text2: {
    fontSize: 14,
    color: "#fff",
  },
});

export default ShowToast;
