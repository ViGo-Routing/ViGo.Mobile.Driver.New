import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { UserContext } from "../../context/UserContext";
import { getBookingDetailByUserId } from "../../services/bookingDetailService";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavigationBar from "../../components/NavBar/BottomNavigationBar";
import WelcomeDriverHeader from "../../components/Header/WelcomeDriverHeader";
import { getProfile } from "../../services/userService";
import {
  Center,
  Image,
  VStack,
  Text,
  Heading,
  Box,
  FlatList,
} from "native-base";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage } from "../../utils/alertUtils";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { vndFormat } from "../../utils/numberUtils";
import InfoAlert from "../../components/Alert/InfoAlert";
import BookingDetailCard from "../../components/Card/BookingDetailCard";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [bookingDetailAvailable, setListBookingDetailAvailable] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const pageSize = 10;

  const fetchRouteData = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const detailsResponse = await getBookingDetailByUserId(
        user.id,
        pageSize,
        1
      );
      const details = detailsResponse.data.data;

      setListBookingDetailAvailable(details);
      console.log(details.length);

      if (detailsResponse.data.hasNextPage == true) {
        setNextPageNumber(2);
      } else {
        setNextPageNumber(null);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      let moreDataResponse = await getBookingDetailByUserId(
        user.id,
        pageSize,
        nextPageNumber
      );

      const moreData = [
        ...bookingDetailAvailable,
        ...moreDataResponse.data.data,
      ];

      setListBookingDetailAvailable(moreData);

      if (moreDataResponse.data.hasNextPage == true) {
        setNextPageNumber(nextPageNumber + 1);
      } else {
        setNextPageNumber(null);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchRouteData();
    });

    return unsubscribe;
  }, []);

  handelSendData = (item) => {
    navigation.navigate("BookingDetail", { item, user });
    console.log(item);
  };

  // const [response, setResponse] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const profileId = "5f94dd86-37b2-43a3-962b-036a3c03d3c9";
  //       const response = await getProfile(profileId);
  //       setResponse(response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, []);

  const renderListItem = (item, index) => {
    // return (
    //   <TouchableOpacity
    //     style={[styles.card, styles.shadowProp]}
    //     onPress={() => handelSendData(item)}
    //   >
    //     <View style={{ flexDirection: "row", alignItems: "center" }}>
    //       <VStack>
    //         <Center>
    //           <Image
    //             p="1"
    //             size={"xs"}
    //             resizeMode="cover"
    //             source={require("../../../assets/icons/vigobike.png")}
    //             alt="Loại phương tiện"
    //           />
    //         </Center>
    //         <View style={{ width: "100%", paddingRight: 15 }}>
    //           <View
    //             style={{
    //               fontWeight: "bold",
    //               fontSize: 15,
    //             }}
    //           >
    //             <Text style={{ fontWeight: "bold" }}>Giờ đón</Text>
    //             <Text>
    //               {toVnTimeString(item.customerRouteRoutine.pickupTime)}
    //             </Text>
    //           </View>
    //         </View>
    //       </VStack>

    //       <View
    //         style={{
    //           width: "80%",
    //           borderLeftWidth: 1,
    //           borderRightColor: "#000",
    //           paddingLeft: 5,
    //         }}
    //       >
    //         <View style={{ flexDirection: "row", alignItems: "center" }}>
    //           <Text style={styles.cardHeader}>
    //             {toVnDateString(item.customerRouteRoutine.routineDate)}
    //           </Text>
    //         </View>

    //         <View
    //           style={{
    //             flexDirection: "row",
    //             alignItems: "center",
    //             paddingRight: 20,
    //           }}
    //         >
    //           <View
    //             style={{
    //               flexDirection: "column",
    //               alignItems: "flex-start",
    //               marginVertical: 10,
    //               marginLeft: 10,
    //             }}
    //           >
    //             <View
    //               style={{
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 width: 147,
    //               }}
    //             >
    //               <Text
    //                 style={{
    //                   fontWeight: "bold",
    //                   color: "grey",
    //                   paddingLeft: 10,
    //                 }}
    //               >
    //                 Điểm đón:{" "}
    //               </Text>
    //               <Text numberOfLines={1} ellipsizeMode="tail">
    //                 {item.startStation.name}
    //               </Text>
    //             </View>
    //             <View
    //               style={{
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 width: 147,
    //               }}
    //             >
    //               <Text
    //                 style={{
    //                   fontWeight: "bold",
    //                   color: "grey",
    //                   paddingLeft: 10,
    //                 }}
    //               >
    //                 Điểm đến:{" "}
    //               </Text>
    //               <Text numberOfLines={1} ellipsizeMode="tail">
    //                 {item.endStation.name}
    //               </Text>
    //             </View>
    //           </View>
    //         </View>
    //         <View
    //           style={{
    //             flexDirection: "column",
    //             alignItems: "flex-end",
    //           }}
    //         >
    //           <Text paddingTop={5} style={styles.priceCart}>
    //             {vndFormat(item.price)}
    //           </Text>
    //         </View>
    //       </View>
    //     </View>
    //   </TouchableOpacity>
    // );
    return (
      <BookingDetailCard
        element={item}
        handleBookingDetailClick={handelSendData}
      />
    );
  };

  return (
    <SafeAreaView style={vigoStyles.container}>
      {/* <ViGoSpinner isLoading={isLoading} /> */}
      {/* <View style={styles.header}><Header title="Thông tin tài khoản" /></View> */}
      <WelcomeDriverHeader
        title={`Chào mừng ${user && user.name ? user.name : ""}`}
        // subtitle="..."
        onBack={() => navigation.goBack()}
      />
      <View style={vigoStyles.body}>
        <Heading fontSize="2xl" marginTop="0" marginLeft="0">
          Các chuyến đi còn trống
        </Heading>
        {/* <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <Box marginTop="4"> */}
        <FlatList
          // style={vigoStyles.list}
          marginTop="3"
          // paddingBottom="5"
          // px="3"
          data={bookingDetailAvailable}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return <>{renderListItem(item, index)}</>;
          }}
          ListEmptyComponent={
            <InfoAlert message="Không có chuyến đi nào trống" />
          }
          refreshing={isLoading}
          onRefresh={() => fetchRouteData()}
          onEndReached={loadMoreData}
          onScroll={() => {
            setOnScroll(true);
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{
            // paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        />
      </View>
      {/* </Box>
        </ErrorAlert> */}

      <View>
        <BottomNavigationBar />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
    marginVertical: 10,
  },
  cardHeader: {
    flex: 1,
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 5,
  },
  priceCart: {
    flex: 1,
    color: themeColors.primary,
    fontWeight: "bold",
    fontSize: 25,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  body: {
    backgroundColor: themeColors.linear,
    // padding: 20,
    flex: 1,
  },
  title: {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 20,
  },
  lastListItem: {
    paddingBottom: 40,
  },
});

export default HomeScreen;
