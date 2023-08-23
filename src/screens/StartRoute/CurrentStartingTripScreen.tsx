import { useState, useEffect } from "react";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getBookingDetail } from "../../services/bookingDetailService";
import { getBookingDetailCustomer } from "../../services/userService";
import { getErrorMessage } from "../../utils/alertUtils";
import { generateMapPoint } from "../../utils/mapUtils";
import { useRoute } from "@react-navigation/native";
import { View } from "native-base";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import Map from "../../components/Map/Map";
import { StyleSheet } from "react-native";

interface CurrentStartingTripScreenProps {
  bookingDetailId: string;
}

const CurrentStartingTripScreen = () => {
  const route = useRoute();
  const { bookingDetailId } = route.params as any;

  const [bookingDetail, setBookingDetail] = useState(null as any);
  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const [customer, setCustomer] = useState(null as any);

  const [duration, setDuration] = useState({});
  const [distance, setDistance] = useState({});

  const [directions, setDirections] = useState(null as any);

  const [pickupPosition, setPickupPosition] = useState(null as any);
  const [destinationPosition, setDestinationPosition] = useState(null as any);

  const [activeStep, setActiveStep] = useState("");

  const getBookingDetailData = async () => {
    setIsLoading(true);
    try {
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      // console.log(bookingDetailResponse);
      setBookingDetail(bookingDetailResponse);

      const customerResponse = await getBookingDetailCustomer(bookingDetailId);
      setCustomer(customerResponse);

      setActiveStep(bookingDetailResponse.status);
      // console.log(bookingDetailResponse.status);

      switch (bookingDetailResponse.status) {
        case "ASSIGNED":
          setPickupPosition(
            generateMapPoint(bookingDetailResponse.startStation)
          );
          setDestinationPosition(
            generateMapPoint(bookingDetailResponse.endStation)
          );
          break;
        case "GOING_TO_PICKUP":
          setPickupPosition(
            generateMapPoint(bookingDetailResponse.startStation)
          );
          setDestinationPosition(
            generateMapPoint(bookingDetailResponse.endStation)
          );
          break;
        case "ARRIVE_AT_PICKUP":
          break;
        case "GOING_TO_DROPOFF":
          break;
        case "ARRIVE_AT_DROPOFF":
          break;
        default:
          throw new Error("Trạng thái chuyến đi không hợp lệ");
      }
    } catch (error) {
      // console.error(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pickupPosition && destinationPosition) {
      let driverSchedules = [
        {
          firstPosition: pickupPosition,
          secondPosition: destinationPosition,
          bookingDetailId: bookingDetailId,
        },
      ];

      setDirections(driverSchedules);
    }
  }, [pickupPosition, destinationPosition]);
  useEffect(() => {
    getBookingDetailData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
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
              // distance={distance}
              // duration={duration}
              setDuration={setDuration}
              isPickingSchedules={false}
              onCurrentTripPress={() => {
                // panelRef.current.openLargePanel();
                // console.log("Current PRessed!");
              }}
              setIsLoading={setIsLoading}
              isViewToStartTrip={true}
            />
          )}
        </ErrorAlert>
      </View>
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

export default CurrentStartingTripScreen;
