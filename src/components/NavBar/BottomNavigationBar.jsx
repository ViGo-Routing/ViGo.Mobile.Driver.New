import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from '@expo/vector-icons'
import { themeColors } from "../../../assets/theme/index";
import {
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  MapIcon,
  UserIcon,
} from "react-native-heroicons/solid";

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <HomeIcon size={24} color="white" />
        {/* <Ionicons name="home" size={24} color="white" /> */}
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Promotion')}>
        <Ionicons name="pricetags" size={24} color="white" />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => navigation.navigate("Schedule")}>
        <MapIcon size={24} color="white" />
        {/* <Ionicons name="git-branch" size={24} color="white" /> */}
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Message")}>
        <ChatBubbleLeftRightIcon size={24} color="white" />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        {/* <Ionicons name="person" size={24} color="white" /> */}
        <UserIcon size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: themeColors.primary,
  },
});

export default BottomNavigationBar;
