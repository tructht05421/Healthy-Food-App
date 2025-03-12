import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
export const EditModalHeader = ({ onCancel, title }) => {
  return (
    <LinearGradient
      colors={["#40B491", "#70CFB2", "rgba(112, 207, 178, 0.5)", "transparent"]}
    ></LinearGradient>
  );
};
