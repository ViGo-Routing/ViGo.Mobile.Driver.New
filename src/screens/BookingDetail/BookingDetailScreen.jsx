import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header/Header.jsx";
import { themeColors, vigoStyles } from "../../../assets/theme/index.jsx";
import Map from "../../components/Map/Map.jsx";
import { getRouteById } from "../../services/routeService.jsx";
import { pickBookingDetailById } from "../../services/bookingDetailService.jsx";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { CustomBottomSheet } from "../../components/BottomSheet/BottomSheet.jsx";
import {
  Box,
  Button,
  Center,
  HStack,
  Pressable,
  VStack,
  Text,
} from "native-base";
import {
  ArrowLeftIcon,
  ListBulletIcon,
  MinusIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils.js";

const BookingDetailScreen = () => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(true);

  // Move this block below the 'isBottomSheetVisible' state declaration
  const translateY = new Animated.Value(300);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: isBottomSheetVisible ? 0 : 300,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetVisible]);
  const toggleBottomSheet = () => {
    setBottomSheetVisible(!isBottomSheetVisible);
  };

  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { user } = route.params;
  console.log(item);

  const pickupPosition =
    item?.startStation?.latitude && item?.startStation?.longitude
      ? {
          geometry: {
            location: {
              lat: item.startStation.latitude,
              lng: item.startStation.longitude,
            },
          },
          name: item.startStation.name,
          formatted_address: item.startStation.formatted_address,
        }
      : null;

  const destinationPosition =
    item?.endStation?.latitude && item?.endStation?.longitude
      ? {
          geometry: {
            location: {
              lat: item.endStation.latitude,
              lng: item.endStation.longitude,
            },
          },
          name: item.endStation.name,
          formatted_address: item.endStation.formatted_address,
        }
      : null;

  const handleCustomerDetail = async () => {
    navigation.navigate("CustomerDetail");
  };
  const handlePickBooking = async () => {
    const bookingId = item.bookingId;
    try {
      const requestData = {
        bookingId: item.bookingId,
        driverId: user.id,
      };
      const response = await pickBookingDetailById(item.id);
      if (response && response.data) {
        Alert.alert("Xác nhận chuyến đi", `Bạn vừa nhận chuyến thành công!`, [
          {
            text: "OK",
            onPress: () => navigation.navigate("Schedule"),
          },
        ]);
      }
    } catch (error) {
      console.error("Driver Picking failed:", error);
      Alert.alert("Driver Picking", "Error: Picking failed!");
    }
  };

  // console.log("pickupPosition:", pickupPosition);
  // console.log("destinationPosition:", destinationPosition);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}><Header title="Thông tin lịch trình" /></View> */}
      <View style={styles.body}>
        {/* {routeData && (
          <Map
            pickupPosition={routeData.startStation}
            destinationPosition={routeData.endStation}
          />
        )} */}
        <Map
          pickupPosition={pickupPosition}
          destinationPosition={destinationPosition}
          sendRouteId={(routeId) => console.log("Received Route ID:", routeId)}
        />
        {!isBottomSheetVisible && (
          <Box
            position="absolute"
            bottom={5}
            alignSelf="center"
            alignItems="center"
            bgColor={themeColors.primary}
          >
            <Button
              backgroundColor={themeColors.primary}
              onPress={toggleBottomSheet}
            >
              Chi tiết
            </Button>
          </Box>
        )}

        {isBottomSheetVisible && (
          <Animated.View
            position="absolute"
            bottom="60%"
            width="100%"
            style={[styles.container, { transform: [{ translateY }] }]}
          >
            <View
              style={{
                position: "absolute",
                alignSelf: "center",
                top: "0%",
                width: "90%",
              }}
            >
              <View style={[styles.card, styles.shadowProp]}>
                <Center>
                  <TouchableOpacity
                    onPress={toggleBottomSheet}
                    style={styles.closeButton}
                  >
                    <MinusIcon size={20} color="#00A1A1" />
                  </TouchableOpacity>
                </Center>
                <HStack alignItems="center" justifyContent="center">
                  <Box style={[styles.cardInsideDateTime, styles.shadowProp]}>
                    <HStack alignItems="center">
                      <VStack alignItems="center" justifyContent="center">
                        <CalendarDaysIcon size={25} color="#00A1A1" />
                      </VStack>
                      <VStack paddingLeft="3">
                        <Text style={styles.title}>Ngày đón</Text>
                        <Text
                          style={{
                            // paddingLeft: 5,
                            paddingBottom: 1,
                            fontSize: 15,
                            fontWeight: "bold",
                          }}
                        >
                          {toVnDateString(
                            item.customerRouteRoutine.routineDate
                          )}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                  <Box style={[styles.cardInsideDateTime, styles.shadowProp]}>
                    <HStack alignItems="center">
                      <VStack alignItems="center" justifyContent="center">
                        {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
                        <ClockIcon size={25} color="#00A1A1" />
                      </VStack>

                      <VStack paddingLeft="3">
                        <Text style={styles.title}>Giờ đón</Text>

                        <Text
                          style={{
                            // paddingLeft: 5,
                            paddingBottom: 5,
                            fontSize: 15,
                            fontWeight: "bold",
                          }}
                        >
                          {toVnTimeString(item.customerRouteRoutine.pickupTime)}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </HStack>
                <HStack alignItems="center">
                  <Box style={[styles.cardInsideLocation, styles.shadowProp]}>
                    <HStack alignItems="center">
                      <VStack alignItems="center">
                        <MapPinIcon size={25} color="#00A1A1" />
                      </VStack>

                      <VStack paddingLeft="3">
                        <Text style={styles.title}>Điểm đón</Text>

                        <Text
                          style={{
                            // paddingLeft: 5,
                            paddingBottom: 5,
                            fontSize: 15,
                          }}
                          paddingRight="0.5"
                          isTruncated
                        >
                          {`${item.startStation.name}, ${item.startStation.address}`}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </HStack>
                <HStack alignItems="center">
                  <Box style={[styles.cardInsideLocation, styles.shadowProp]}>
                    <HStack alignItems="center">
                      <VStack alignItems="center">
                        <MapPinIcon size={25} color="#00A1A1" />
                      </VStack>

                      <VStack paddingLeft="3">
                        <Text style={styles.title}>Điểm đến</Text>
                        <Text
                          style={{
                            // paddingLeft: 5,
                            paddingBottom: 5,
                            fontSize: 15,
                          }}
                          paddingRight="0.5"
                          isTruncated
                        >
                          {`${item.endStation.name}, ${item.endStation.address}`}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </HStack>
                <HStack>
                  <View
                    style={[
                      styles.cardInsideLocation,
                      {
                        backgroundColor: themeColors.primary,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                      vigoStyles.buttonWhite,
                    ]}
                  >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <HStack alignItems="center">
                        <ArrowLeftIcon size={20} color={themeColors.primary} />
                        <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                          Quay lại
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.cardInsideLocation,
                      {
                        backgroundColor: themeColors.primary,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={() => navigation.navigate("CustomerDetail")}
                    >
                      <HStack alignItems="center">
                        <ListBulletIcon size={20} color={"white"} />
                        <Text
                          marginLeft={2}
                          style={{ color: "white", fontWeight: "bold" }}
                        >
                          Chi tiết
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  </View>
                </HStack>
                <HStack>
                  <View
                    style={[
                      styles.cardInsideLocation,
                      {
                        backgroundColor: themeColors.primary,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={handlePickBooking}
                    >
                      <HStack alignItems="center">
                        <PaperAirplaneIcon size={20} color={"white"} />
                        <Text
                          marginLeft={2}
                          style={{ color: "white", fontWeight: "bold" }}
                        >
                          Nhận chuyến
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  </View>
                </HStack>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.footer}>{/* <BottomNavigationBar /> */}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 20,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    margin: 5,
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    // paddingLeft: 10,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
});

export default BookingDetailScreen;
