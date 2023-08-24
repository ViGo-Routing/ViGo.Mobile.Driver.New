import React, { useEffect, useRef, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Animated,
  NativeEventEmitter,
  TouchableOpacity,
} from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { themeColors, vigoStyles } from "../../../assets/theme/index";
import Map from "../../components/Map/Map";
import { Box, Button, ScrollView, HStack, Text } from "native-base";
import BookingDetailPanel, {
  BookingDetailSmallPanel,
  PickBookingDetailConfirmAlert,
} from "./BookingDetailPanel";
import { SwipeablePanel } from "../../components/SwipeablePanel/Panel";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { getBookingDetailCustomer } from "../../services/userService";
import {
  eventNames,
  getErrorMessage,
  handleError,
} from "../../utils/alertUtils";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import {
  getBookingDetail,
  getBookingDetailPickFee,
  getDriverSchedulesForPickingTrip,
  pickBookingDetailById,
} from "../../services/bookingDetailService";
import { generateMapPoint } from "../../utils/mapUtils";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
import { UserContext } from "../../context/UserContext";
// import { SwipeablePanel } from "react-native-swipe-up-panel";

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { user } = useContext(UserContext);

  const [isBottomSheetVisible, setBottomSheetVisible] = useState(true);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const [isLoading, setIsLoading] = useState(false);
  // Move this block below the 'isBottomSheetVisible' state declaration
  const translateY = new Animated.Value(400);

  const [customer, setCustomer] = useState({});

  const [duration, setDuration] = useState({});
  const [distance, setDistance] = useState({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [previousTrip, setPreviousTrip] = useState(null);
  const [nextTrip, setNextTrip] = useState(null);

  const [directions, setDirections] = useState(null);

  const [pickingFee, setPickingFee] = useState(0);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  const panelRef = useRef(null);

  const getBookingDetailData = async () => {
    setIsLoading(true);
    try {
      const bookingDetailId = item.id;
      // console.log(bookingDetailId);
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      // console.log(bookingDetailResponse);
      setBookingDetail(bookingDetailResponse);

      setPickupPosition(
        bookingDetailResponse?.startStation?.latitude &&
          bookingDetailResponse?.startStation?.longitude
          ? generateMapPoint(bookingDetailResponse.startStation)
          : null
      );

      setDestinationPosition(
        bookingDetailResponse?.endStation?.latitude &&
          bookingDetailResponse?.endStation?.longitude
          ? generateMapPoint(bookingDetailResponse.endStation)
          : null
      );

      const customerResponse = await getBookingDetailCustomer(bookingDetailId);
      setCustomer(customerResponse);

      const schedules = await getDriverSchedulesForPickingTrip(bookingDetailId);
      setPreviousTrip(schedules.previousTrip);
      setNextTrip(schedules.nextTrip);
      // console.log(schedules);

      let driverSchedules = [];
      if (schedules.previousTrip) {
        driverSchedules.push({
          firstPosition: generateMapPoint(schedules.previousTrip.startStation),
          secondPosition: generateMapPoint(schedules.previousTrip.endStation),
          // strokeColor: "#00A1A1",
          // strokeWidth: 3,
          bookingDetailId: schedules.previousTrip.id,
        });
        // console.log("Previous Trip");
      } else {
        driverSchedules.push(null);
      }
      // console.log(driverSchedules);
      driverSchedules.push({
        firstPosition: generateMapPoint(bookingDetailResponse.startStation),
        secondPosition: generateMapPoint(bookingDetailResponse.endStation),
        // strokeColor: "#00A1A1",
        // strokeWidth: 3,
        bookingDetailId: bookingDetailResponse.id,
      });
      // console.log(driverSchedules);
      if (schedules.nextTrip) {
        // console.log("Next Trip");
        driverSchedules.push({
          firstPosition: generateMapPoint(schedules.nextTrip.startStation),
          secondPosition: generateMapPoint(schedules.nextTrip.endStation),
          // strokeColor: "#00A1A1",
          // strokeWidth: 3,
          bookingDetailId: schedules.nextTrip.id,
        });
      } else {
        driverSchedules.push(null);
      }
      // console.log(driverSchedules);

      setDirections(driverSchedules);
    } catch (error) {
      // console.error(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   getBookingDetailData();

  //   Animated.spring(translateY, {
  //     toValue: isBottomSheetVisible ? 0 : 400,
  //     useNativeDriver: true,
  //   }).start();
  // }, [isBottomSheetVisible]);
  useEffect(() => {
    getBookingDetailData();
  }, []);

  // useEffect(() => {

  // }, [bookingDetail]);

  // const toggleBottomSheet = () => {
  //   setBottomSheetVisible(!isBottomSheetVisible);
  // };

  // const pickupPosition =
  //   bookingDetail?.startStation?.latitude &&
  //   bookingDetail?.startStation?.longitude
  //     ? {
  //         geometry: {
  //           location: {
  //             lat: bookingDetail.startStation.latitude,
  //             lng: bookingDetail.startStation.longitude,
  //           },
  //         },
  //         name: bookingDetail.startStation.name,
  //         formatted_address: bookingDetail.startStation.formatted_address,
  //       }
  //     : null;

  // const destinationPosition =
  //   bookingDetail?.endStation?.latitude && bookingDetail?.endStation?.longitude
  //     ? {
  //         geometry: {
  //           location: {
  //             lat: bookingDetail.endStation.latitude,
  //             lng: bookingDetail.endStation.longitude,
  //           },
  //         },
  //         name: bookingDetail.endStation.name,
  //         formatted_address: bookingDetail.endStation.formatted_address,
  //       }
  //     : null;

  const handleCustomerDetail = async () => {
    navigation.navigate("CustomerDetail");
  };

  const openConfirmPickBooking = async () => {
    try {
      setIsLoading(true);
      const bookingDetailId = bookingDetail.id;
      const pickingFee = await getBookingDetailPickFee(bookingDetailId);
      setPickingFee(pickingFee);
      setIsConfirmOpen(true);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const eventEmitter = new NativeEventEmitter();

  // const
  const handleConfirmPickBooking = async () => {
    const bookingId = bookingDetail.bookingId;
    // const { user } = useContext(UserContext);

    try {
      setIsLoading(true);
      const requestData = {
        bookingId: bookingDetail.bookingId,
        driverId: user.id,
      };
      const response = await pickBookingDetailById(bookingDetail.id);
      if (response && response.data) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: "Xác nhận chuyến đi",
          description: "Bạn vừa nhận chuyến thành công!",
          status: "success",
          // placement: "top",
          isDialog: true,
        });
        navigation.navigate("Schedule");
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("pickupPosition:", pickupPosition);
  // console.log("destinationPosition:", destinationPosition);

  const renderActionButton = () => {
    return (
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
          onPress={() => openConfirmPickBooking()}
        >
          <HStack alignItems="center">
            <PaperAirplaneIcon size={20} color={"white"} />
            <Text marginLeft={2} style={{ color: "white", fontWeight: "bold" }}>
              Nhận chuyến
            </Text>
          </HStack>
        </TouchableOpacity>
      </View>
    );
  };

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
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          {pickupPosition && destinationPosition && directions && (
            <Map
              // pickupPosition={pickupPosition}
              // destinationPosition={destinationPosition}
              // sendRouteId={(routeId) =>
              //   console.log("Received Route ID:", routeId)
              // }
              directions={directions}
              setDistance={setDistance}
              distance={distance}
              duration={duration}
              setDuration={setDuration}
              isPickingSchedules={true}
              onCurrentTripPress={() => {
                panelRef.current.openLargePanel();
                // console.log("Current PRessed!");
              }}
              setIsLoading={setIsLoading}
            />
          )}
          {/* {!isBottomSheetVisible && (
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
          )} */}
          {/* <BookingDetailPanel
            item={bookingDetail}
            navigation={navigation}
            toggleBottomSheet={toggleBottomSheet}
          /> */}
          {/* <SwipeUpDown
            itemMini={(show) => (
              <BookingDetailPanel
                item={bookingDetail}
                navigation={navigation}
                toggleBottomSheet={toggleBottomSheet}
              />
            )}
            itemFull={(hide) => (
              <BookingDetailPanel
                item={bookingDetail}
                navigation={navigation}
                toggleBottomSheet={toggleBottomSheet}
              />
            )}
            animation="easeInEaseOut"
            style={{ backgroundColor: "white" }}
            iconColor={themeColors.primary}
            iconSize={30}
          /> */}
          {/* {isBottomSheetVisible && ( */}
          {bookingDetail && (
            <SwipeablePanel
              isActive={true}
              fullWidth={true}
              noBackgroundOpacity
              // showCloseButton
              allowTouchOutside
              smallPanelItem={
                <Box px="6">
                  <BookingDetailSmallPanel
                    item={bookingDetail}
                    navigation={navigation}
                    actionButton={renderActionButton()}
                    // handlePickBooking={openConfirmPickBooking}
                  />
                </Box>
              }
              smallPanelHeight={360}
              // openLarge={openLargePanel}
              ref={panelRef}
              // largePanelHeight={680}
            >
              <Box px="6">
                <BookingDetailPanel
                  customer={customer}
                  item={bookingDetail}
                  navigation={navigation}
                  // toggleBottomSheet={toggleBottomSheet}
                  duration={duration}
                  distance={distance}
                  // handlePickBooking={openConfirmPickBooking}
                  actionButton={renderActionButton()}
                />
              </Box>
            </SwipeablePanel>
          )}
          {/* )} */}
        </ErrorAlert>
      </View>

      <PickBookingDetailConfirmAlert
        key={"detail-screen"}
        confirmOpen={isConfirmOpen}
        setConfirmOpen={setIsConfirmOpen}
        item={bookingDetail}
        handleOkPress={handleConfirmPickBooking}
        pickingFee={pickingFee}
      />

      <View style={styles.footer}>{/* <BottomNavigationBar /> */}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  // card: {
  //   flexGrow: 1,
  //   backgroundColor: "white",
  //   borderRadius: 8,
  //   paddingVertical: 5,
  //   paddingHorizontal: 15,
  //   width: "100%",
  //   marginVertical: 10,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  // cardInsideDateTime: {
  //   flexGrow: 1,
  //   backgroundColor: "white",
  //   borderRadius: 8,

  //   paddingHorizontal: 15,
  //   width: "40%",
  //   marginVertical: 10,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  //   flexDirection: "row",
  //   flexGrow: 1,
  //   margin: 5,
  // },
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
  // title: {
  //   color: themeColors.primary,
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   paddingTop: 10,
  //   // paddingLeft: 10,
  // },
  // list: {
  //   paddingTop: 10,
  //   fontSize: 20,
  // },
});

export default BookingDetailScreen;
