import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { themeColors, vigoStyles } from "../../../assets/theme/index";
import Map from "../../components/Map/Map";
import { Box, Button } from "native-base";
import BookingDetailPanel, {
  BookingDetailSmallPanel,
} from "./BookingDetailPanel";
import { SwipeablePanel } from "../../components/SwipeablePanel/Panel";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { getBookingDetailCustomer } from "../../services/userService";
import { getErrorMessage } from "../../utils/alertUtils";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
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

  const getCustomer = async () => {
    setIsLoading(true);
    try {
      const customerResponse = await getBookingDetailCustomer(item.id);
      setCustomer(customerResponse);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCustomer();

    Animated.spring(translateY, {
      toValue: isBottomSheetVisible ? 0 : 400,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetVisible]);

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!isBottomSheetVisible);
  };

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
          <Map
            pickupPosition={pickupPosition}
            destinationPosition={destinationPosition}
            sendRouteId={(routeId) =>
              console.log("Received Route ID:", routeId)
            }
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
          {/* <BookingDetailPanel
            item={item}
            navigation={navigation}
            toggleBottomSheet={toggleBottomSheet}
          /> */}
          {/* <SwipeUpDown
            itemMini={(show) => (
              <BookingDetailPanel
                item={item}
                navigation={navigation}
                toggleBottomSheet={toggleBottomSheet}
              />
            )}
            itemFull={(hide) => (
              <BookingDetailPanel
                item={item}
                navigation={navigation}
                toggleBottomSheet={toggleBottomSheet}
              />
            )}
            animation="easeInEaseOut"
            style={{ backgroundColor: "white" }}
            iconColor={themeColors.primary}
            iconSize={30}
          /> */}
          {isBottomSheetVisible && (
            <SwipeablePanel
              isActive={true}
              fullWidth={true}
              noBackgroundOpacity
              // showCloseButton
              allowTouchOutside
              smallPanelItem={
                <Box px="6">
                  <BookingDetailSmallPanel
                    item={item}
                    navigation={navigation}
                  />
                </Box>
              }
              smallPanelHeight={360}
              largePanelHeight={510}
            >
              <Box px="6">
                <BookingDetailPanel
                  customer={customer}
                  item={item}
                  navigation={navigation}
                  toggleBottomSheet={toggleBottomSheet}
                />
              </Box>
            </SwipeablePanel>
          )}
        </ErrorAlert>
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
