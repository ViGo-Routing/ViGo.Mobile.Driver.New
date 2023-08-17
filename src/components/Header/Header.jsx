import React from "react";
import { View, StyleSheet } from "react-native";
import { themeColors } from "../../../assets/theme";
// import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

const Header = ({ title, isBackButtonShown = true }) => {
  const navigation = useNavigation();
  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    // <View style={styles.container}>
    //   {isBackButtonShown && (
    //     <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
    //       <ArrowLeftIcon size={30} color="white" />
    //       {/* <Ionicons name="arrow-back" size={30} color="white" /> */}
    //     </TouchableOpacity>
    //   )}
    //   <Text bold fontSize={"2xl"} color={"white"}>
    //     {title}
    //   </Text>
    // </View>
    <Box
      backgroundColor={themeColors.primary}
      height={"60"}
      justifyContent={"center"}
    >
      <HStack alignItems={"center"} paddingLeft={3}>
        {isBackButtonShown && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <ArrowLeftIcon size={25} color="white" />
          </TouchableOpacity>
        )}
        <Text marginLeft={3} bold fontSize={"2xl"} color={"white"}>
          {title}
        </Text>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 0,
    height: 60,
    backgroundColor: themeColors.primary,
    // borderBottomLeftRadius:16,
    // borderBottomRightRadius:16,
  },
  backButton: {
    // paddingTop: 10,
    // position: "absolute",
    // left: 20,
  },
  // title: {
  //   fontSize: 25,
  //   color: "white",
  //   fontWeight: "bold",
  // },
});

export default Header;
