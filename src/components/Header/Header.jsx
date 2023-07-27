import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../../assets/theme";
// import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const Header = ({ title, isBackButtonShown = true }) => {
  const navigation = useNavigation();
  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {isBackButtonShown && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ArrowLeftIcon size={30} color="white" />
          {/* <Ionicons name="arrow-back" size={30} color="white" /> */}
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 0,
    height: 70,
    backgroundColor: themeColors.primary,
    // borderBottomLeftRadius:16,
    // borderBottomRightRadius:16,
  },
  backButton: {
    paddingTop: 10,
    position: "absolute",
    left: 20,
  },
  title: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
});

export default Header;
