import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated, NativeEventEmitter } from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { themeColors, vigoStyles } from "../../../assets/theme/index";
import Map from "../../components/Map/Map";
import { Box, Button } from "native-base";
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
  pickBookingDetailById,
} from "../../services/bookingDetailService";
// import { SwipeablePanel } from "react-native-swipe-up-panel";

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { user } = route.params;

  const [isBottomSheetVisible, setBottomSheetVisible] = useState(true);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const [isLoading, setIsLoading] = useState(false);
  // Move this block below the 'isBottomSheetVisible' state declaration
  const translateY = new Animated.Value(400);

  const [customer, setCustomer] = useState({});

  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [pickingFee, setPickingFee] = useState(0);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  const getBookingDetailData = async () => {
    setIsLoading(true);
    try {
      const bookingDetailId = item.id;
      console.log(bookingDetailId);
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      console.log(bookingDetailResponse);
      setBookingDetail(bookingDetailResponse);

      setPickupPosition(
        bookingDetailResponse?.startStation?.latitude &&
          bookingDetailResponse?.startStation?.longitude
          ? {
              geometry: {
                location: {
                  lat: bookingDetailResponse.startStation.latitude,
                  lng: bookingDetailResponse.startStation.longitude,
                },
              },
              name: bookingDetailResponse.startStation.name,
              formatted_address:
                bookingDetailResponse.startStation.formatted_address,
            }
          : null
      );

      setDestinationPosition(
        bookingDetailResponse?.endStation?.latitude &&
          bookingDetailResponse?.endStation?.longitude
          ? {
              geometry: {
                location: {
                  lat: bookingDetailResponse.endStation.latitude,
                  lng: bookingDetailResponse.endStation.longitude,
                },
              },
              name: bookingDetailResponse.endStation.name,
              formatted_address:
                bookingDetailResponse.endStation.formatted_address,
            }
          : null
      );

      const customerResponse = await getBookingDetailCustomer(bookingDetailId);
      setCustomer(customerResponse);
    } catch (error) {
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
          {pickupPosition && destinationPosition && (
            <Map
              pickupPosition={pickupPosition}
              destinationPosition={destinationPosition}
              sendRouteId={(routeId) =>
                console.log("Received Route ID:", routeId)
              }
              setDistance={setDistance}
              setDuration={setDuration}
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
                    handlePickBooking={openConfirmPickBooking}
                  />
                </Box>
              }
              smallPanelHeight={360}
              largePanelHeight={640}
            >
              <Box px="6">
                <BookingDetailPanel
                  customer={customer}
                  item={bookingDetail}
                  navigation={navigation}
                  // toggleBottomSheet={toggleBottomSheet}
                  duration={duration}
                  distance={distance}
                  handlePickBooking={openConfirmPickBooking}
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
