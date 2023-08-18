import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { Ionicons } from '@expo/vector-icons'
import { themeColors } from "../../../assets/theme/index";
import {
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  MapIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { Box, HStack, Pressable } from "native-base";

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState(route.name);
  // console.log(route.name);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setSelected(route.name);
    });
    return unsubscribe;
  });

  return (
    <Box
      bg="white"
      safeAreaTop
      width="100%"
      // alignSeft="center"
      // alignItems="center"
    >
      <HStack
        backgroundColor={themeColors.primary}
        alignItems="center"
        // justifyContent="center"
        justifyContent="space-between"
        safeAreaBottom
        height={"60"}
        px="10"
      >
        <Pressable
          opacity={selected === "Home" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("Home");
            navigation.navigate("Home");
          }}
        >
          <HomeIcon size={24} color="white" />
          {/* <Ionicons name="home" size={24} color="white" /> */}
        </Pressable>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Promotion')}>
            <Ionicons name="pricetags" size={24} color="white" />
          </TouchableOpacity> */}
        <Pressable
          opacity={selected === "Schedule" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("Schedule");
            navigation.navigate("Schedule");
          }}
        >
          <MapIcon size={24} color="white" />
          {/* <Ionicons name="git-branch" size={24} color="white" /> */}
        </Pressable>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Message")}>
            <ChatBubbleLeftRightIcon size={24} color="white" />
          </TouchableOpacity> */}
        <Pressable
          opacity={selected === "Profile" ? 1 : 0.75}
          py="3"
          // flex={1}
          onPress={() => {
            setSelected("Profile");
            navigation.navigate("Profile");
          }}
        >
          {/* <Ionicons name="person" size={24} color="white" /> */}
          <UserIcon size={24} color="white" />
        </Pressable>
      </HStack>
    </Box>
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
