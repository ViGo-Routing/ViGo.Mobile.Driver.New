import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  NativeEventEmitter,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import MapViewDirections from "react-native-maps-directions";
import { createRoute } from "../../services/routeService";
import { useNavigation } from "@react-navigation/native";
import {
  Badge,
  Box,
  HStack,
  Image,
  Popover,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { themeColors } from "../../../assets/theme";
import { googleMapsApi } from "../../utils/mapUtils";
import { eventNames, handleError } from "../../utils/alertUtils";
import { getBookingDetail } from "../../services/bookingDetailService";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { ClockIcon as ClockOutlineIcon } from "react-native-heroicons/outline";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { SwipeablePanel } from "../SwipeablePanel";
import BookingDetailPanel from "../../screens/BookingDetail/BookingDetailPanel";
import { getBookingDetailCustomer } from "../../services/userService";
import {
  TripFullInformation,
  TripTransition,
} from "../TripInformation/TripInformation";

interface MapDirections {
  firstPosition: any;
  secondPosition: any;
  bookingDetailId: string;
  // strokeColor: string;
  // strokeWidth: number;
}

interface MapProps {
  directions: Array<MapDirections>;
  setDistance: React.Dispatch<React.SetStateAction<{}>>;
  // distance: {};
  setDuration: React.Dispatch<React.SetStateAction<{}>>;
  // duration: {};
  isPickingSchedules: boolean | null;
  isViewToStartTrip: boolean | null;
  onCurrentTripPress: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const mapDirectionLine = {
  primary: {
    color: themeColors.primary,
    stroke: 5,
  },
  dashed: {
    // color: "#95B1B0",
    color: "#F97B22",
    stroke: 3.5,
  },
  secondary: {
    color: "#5DD8D8",
    stroke: 4,
  },
};

const Map = ({
  directions,
  setDistance,
  // distance,
  setDuration,
  // duration,
  isPickingSchedules = false,
  isViewToStartTrip = false,
  onCurrentTripPress = () => {},
  setIsLoading,
}: MapProps) => {
  const eventEmitter = new NativeEventEmitter();
  const navigation = useNavigation();

  // const { latitude, longitude } = pickupPosition?.geometry?.location || {};
  // const pickupPositionCoords =
  //   latitude && longitude ? { latitude, longitude } : null;

  // const { latitude: destLat, longitude: destLng } =
  //   destinationPosition?.geometry?.location || {};
  // const destinationPositionCoords =
  //   destLat && destLng ? { latitude: destLat, longitude: destLng } : null;
  const getRegion = () => {
    const currentPoint = isPickingSchedules ? directions[1] : directions[0];
    // const lastPoint = directions[-1];

    const { lat: currentLat, lng: currentLong } =
      currentPoint.firstPosition?.geometry?.location || {};
    // console.log(currentPoint.firstPosition?.geometry?.location);
    // const {latitude: lastLat, longitude: lastLong} = lastPoint.secondPosition?.geometry?.location || {};
    const currentCoords =
      currentLat && currentLong
        ? { latitude: currentLat, longitude: currentLong }
        : null;
    // const lastCoords = lastLat && lastLong ? {lastLat, lastLong} : null;

    return {
      latitude: currentCoords?.latitude || 10.762622,
      longitude: currentCoords?.longitude || 106.660172,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    } as Region;
  };

  const dashPattern = [5, 5];

  const initialRegion = getRegion();

  const [region, setRegion] = useState(initialRegion);

  const [distances, setDistances] = useState({});
  const [durations, setDurations] = useState({});
  var tempDistance = {},
    tempDuration = {};
  // const [trips, setTrips] = useState(null);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setRegion(getRegion());
  }, [directions]);

  // useEffect(() => {
  //   if (pickupPositionCoords) {
  //     setRegion((prevRegion) => ({
  //       ...prevRegion,
  //       latitude: pickupPositionCoords.latitude,
  //       longitude: pickupPositionCoords.longitude,
  //     }));
  //   }
  // }, [pickupPositionCoords]);

  // useEffect(() => {
  //   if (destinationPositionCoords) {
  //     setRegion((prevRegion) => ({
  //       ...prevRegion,
  //       latitude: destinationPositionCoords.latitude,
  //       longitude: destinationPositionCoords.longitude,
  //     }));
  //   }
  // }, [destinationPositionCoords]);

  const handleDirectionsReady = async (
    result: any,
    directionIndex: string | number
  ) => {
    // const requestData = {
    //   // Request body data
    //   name: `${pickupPosition.name} - ${destinationPosition.name}`,
    //   distance: result.distance,
    //   duration: result.duration,
    //   status: "ACTIVE",
    //   routineType: "RANDOMLY",
    //   routeType: "SPECIFIC_ROUTE_SPECIFIC_TIME",
    //   startStation: {
    //     longtitude: pickupPosition.geometry.location.lng,
    //     latitude: pickupPosition.geometry.location.lat,
    //     name: pickupPosition.name,
    //     address: pickupPosition.formatted_address,
    //   },
    //   endStation: {
    //     longtitude: destinationPosition.geometry.location.lng,
    //     latitude: destinationPosition.geometry.location.lat,
    //     name: destinationPosition.name,
    //     address: destinationPosition.formatted_address,
    //   },
    // };

    // console.log(result);

    if (directionIndex == "current") {
      setDistance(result.distance);
      setDuration(result.duration);
    } else {
      // let newDistances = {...distances};

      tempDistance[`${directionIndex}`] = result.distance;
      // console.log(distance);
      setDistances(tempDistance);

      tempDuration[`${directionIndex}`] = result.duration;
      // console.log(duration);
      setDurations(tempDuration);
    }

    // if (setDistance) {

    // }
    // if (setDuration) {

    // }

    // try {
    //   const response = await createRoute(requestData);
    //   console.log("response", response.data.id);
    //   sendRouteId(response.data.id);
    // } catch (error) {
    //   console.log("Create Route Error ", error);
    // }
  };

  const displayAddressDialog = (position: any) => {
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      // title: "Đăng nhập không thành công",
      description: `${position.name}, ${position.formatted_address}`,
      status: "info",
      // placement: "top-right",
      isDialog: true,
      primaryButtonText: "OK",
      displayCloseButton: false,
    });
  };

  const renderMarkers = (directions: Array<MapDirections>) => {
    let markerCount = 0;
    const directionsCount = directions.filter(
      (direction) => direction != null
    ).length;

    return directions.map((direction, index) => {
      return (
        direction && (
          <Box key={`markers-${index}`}>
            {direction.firstPosition && (
              <Marker
                coordinate={{
                  latitude: direction.firstPosition.geometry.location.lat,
                  longitude: direction.firstPosition.geometry.location.lng,
                }}
                key={`first-position-marker-${index}`}
                onPress={() => displayAddressDialog(direction.firstPosition)}
                // icon={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
              >
                {/* <HStack> */}
                <Image
                  size={"xs"}
                  resizeMode="contain"
                  alignSeft="center"
                  source={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                  alt={"Điểm đi"}
                />
                {directionsCount > 1 && (
                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    // mb={-4}
                    // mr={-4}
                    zIndex={1}
                    variant="solid"
                    // alignSelf="flex-end"
                    _text={{
                      fontSize: 15,
                    }}
                  >
                    {++markerCount}
                  </Badge>
                )}
                {/* <Text>{++markerCount}</Text> */}
                {/* </HStack> */}
              </Marker>
              // </Pressable>
            )}
            {direction.secondPosition && (
              <Marker
                coordinate={{
                  latitude: direction.secondPosition.geometry.location.lat,
                  longitude: direction.secondPosition.geometry.location.lng,
                }}
                // image={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                key={`second-position-marker-${index}`}
                onPress={() => displayAddressDialog(direction.secondPosition)}
              >
                <Image
                  size={"xs"}
                  resizeMode="contain"
                  alignSeft="center"
                  source={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                  alt={"Điểm đến"}
                />
                {directionsCount > 1 && (
                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    // mb={-4}
                    // mr={-4}
                    zIndex={1}
                    variant="solid"
                    // alignSelf="flex-end"
                    _text={{
                      fontSize: 15,
                    }}
                  >
                    {++markerCount}
                  </Badge>
                )}
              </Marker>
            )}
          </Box>
        )
      );
    });
  };

  const onDirectionPress = async (
    bookingDetailId: string,
    tripName: string = "",
    index: string | number
  ) => {
    setIsLoading(true);
    try {
      const bookingDetailResponse = await getBookingDetail(bookingDetailId);
      if (isPickingSchedules) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: tripName
            ? `Thông tin chuyến đi - ${tripName}`
            : "Thông tin chuyến đi",
          description: (
            <TripFullInformation
              item={bookingDetailResponse}
              distance={distances[`${index}`]}
              duration={durations[`${index}`]}
              customer={null}
            />
          ),
          status: "info",
          // placement: "top-right",
          isDialog: true,
          primaryButtonText: "OK",
          displayCloseButton: false,
          size: "xl",
        });
      } else {
        setSelectedIndex(index);
        setBookingDetail(bookingDetailResponse);
        const customer = await getBookingDetailCustomer(bookingDetailId);
        setCustomer(customer);
        setIsPanelActive(true);
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDashedPress = (
    firstPoint: any,
    secondPoint: any,
    index: string | number
  ) => {
    // console.log(durations);
    // console.log(durations[`${index}`]);
    // console.log(distances[`${index}`]);
    eventEmitter.emit(eventNames.SHOW_TOAST, {
      title: "Thông tin đường đi",
      description: (
        <TripTransition
          firstPoint={firstPoint}
          secondPoint={secondPoint}
          duration={durations[`${index}`]}
          distance={distances[`${index}`]}
        />
      ),
      status: "info",
      // placement: "top-right",
      isDialog: true,
      primaryButtonText: "OK",
      displayCloseButton: false,
      size: "xl",
    });
  };

  const renderDirections = (
    directions: Array<MapDirections>,
    isPickingSchedules: boolean = false
  ) => {
    if (isPickingSchedules) {
      const previousTrip = directions[0];
      const currentTrip = directions[1];
      const nextTrip = directions[2];

      return (
        currentTrip &&
        currentTrip.firstPosition &&
        currentTrip.secondPosition && (
          <Box key={`directions-picking-bookingdetails`}>
            <MapViewDirections
              origin={{
                latitude: currentTrip.firstPosition.geometry.location.lat,
                longitude: currentTrip.firstPosition.geometry.location.lng,
              }}
              destination={{
                latitude: currentTrip.secondPosition.geometry.location.lat,
                longitude: currentTrip.secondPosition.geometry.location.lng,
              }}
              apikey={googleMapsApi}
              strokeWidth={mapDirectionLine.primary.stroke}
              strokeColor={mapDirectionLine.primary.color}
              mode="DRIVING"
              onReady={(result) => handleDirectionsReady(result, "current")}
              key={`maps-directions-curent`}
              // lineDashPattern={[5, 5, 5, 5, 5]}
              tappable={true}
              onPress={() => {
                onCurrentTripPress();
              }}
            />
            {previousTrip && (
              <>
                <MapViewDirections
                  origin={{
                    latitude: previousTrip.firstPosition.geometry.location.lat,
                    longitude: previousTrip.firstPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: previousTrip.secondPosition.geometry.location.lat,
                    longitude:
                      previousTrip.secondPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.secondary.stroke}
                  strokeColor={mapDirectionLine.secondary.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, "previous")
                  }
                  key={`maps-directions-previous`}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDirectionPress(
                      previousTrip.bookingDetailId,
                      "Chuyến đi trước đó",
                      "previous"
                    );
                  }}
                  // lineDashPattern={[5, 5, 5, 5, 5]}
                />
                <MapViewDirections
                  origin={{
                    latitude: previousTrip.secondPosition.geometry.location.lat,
                    longitude:
                      previousTrip.secondPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: currentTrip.firstPosition.geometry.location.lat,
                    longitude: currentTrip.firstPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.dashed.stroke}
                  strokeColor={mapDirectionLine.dashed.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, "previous-dashed")
                  }
                  key={`maps-directions-previous-dashed`}
                  lineDashPattern={dashPattern}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDashedPress(
                      previousTrip.secondPosition,
                      currentTrip.firstPosition,
                      "previous-dashed"
                    );
                  }}
                />
              </>
            )}
            {nextTrip && (
              <>
                <MapViewDirections
                  origin={{
                    latitude: nextTrip.firstPosition.geometry.location.lat,
                    longitude: nextTrip.firstPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: nextTrip.secondPosition.geometry.location.lat,
                    longitude: nextTrip.secondPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.secondary.stroke}
                  strokeColor={mapDirectionLine.secondary.color}
                  mode="DRIVING"
                  onReady={(result) => handleDirectionsReady(result, "next")}
                  key={`maps-directions-previous`}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDirectionPress(
                      nextTrip.bookingDetailId,
                      "Chuyến đi tiếp sau đó",
                      "next"
                    );
                  }}
                  // lineDashPattern={[5, 5, 5, 5, 5]}
                />
                <MapViewDirections
                  origin={{
                    latitude: currentTrip.secondPosition.geometry.location.lat,
                    longitude: currentTrip.secondPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: nextTrip.firstPosition.geometry.location.lat,
                    longitude: nextTrip.firstPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.dashed.stroke}
                  strokeColor={mapDirectionLine.dashed.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, "next-dashed")
                  }
                  key={`maps-directions-previous-dashed`}
                  lineDashPattern={dashPattern}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDashedPress(
                      currentTrip.secondPosition,
                      nextTrip.firstPosition,
                      "next-dashed"
                    );
                  }}
                />
              </>
            )}
          </Box>
        )
      );
    } else if (isViewToStartTrip) {
      const currentTrip = directions[0];
      return (
        currentTrip &&
        currentTrip.firstPosition &&
        currentTrip.secondPosition && (
          <Box key={`directions-view-bookingdetails`}>
            <MapViewDirections
              origin={{
                latitude: currentTrip.firstPosition.geometry.location.lat,
                longitude: currentTrip.firstPosition.geometry.location.lng,
              }}
              destination={{
                latitude: currentTrip.secondPosition.geometry.location.lat,
                longitude: currentTrip.secondPosition.geometry.location.lng,
              }}
              apikey={googleMapsApi}
              strokeWidth={mapDirectionLine.primary.stroke}
              strokeColor={mapDirectionLine.primary.color}
              mode="DRIVING"
              onReady={(result) => handleDirectionsReady(result, "current")}
              key={`maps-directions-curent`}
              // lineDashPattern={[5, 5, 5, 5, 5]}
              tappable={true}
              onPress={() => {
                onCurrentTripPress();
              }}
            />
          </Box>
        )
      );
    } else {
      return directions.map((direction, index, array) => {
        let previousTrip: MapDirections | null = null;

        if (index > 0) {
          // Has preivous trip
          previousTrip = array[index - 1];
        }

        return (
          direction &&
          direction.firstPosition &&
          direction.secondPosition && (
            <Box key={`directions-${index}`}>
              <MapViewDirections
                origin={{
                  latitude: direction.firstPosition.geometry.location.lat,
                  longitude: direction.firstPosition.geometry.location.lng,
                }}
                destination={{
                  latitude: direction.secondPosition.geometry.location.lat,
                  longitude: direction.secondPosition.geometry.location.lng,
                }}
                apikey={googleMapsApi}
                strokeWidth={mapDirectionLine.primary.stroke}
                strokeColor={mapDirectionLine.primary.color}
                mode="DRIVING"
                key={`maps-directions-${index}`}
                onReady={(result) => handleDirectionsReady(result, index)}
                tappable={true}
                onPress={() => {
                  onDirectionPress(direction.bookingDetailId, "", index);
                }}
                // lineDashPattern={[5, 5, 5, 5, 5]}
              />
              {previousTrip && (
                // <MapViewDirections
                //   origin={{
                //     latitude: previousTrip.firstPosition.geometry.location.lat,
                //     longitude: previousTrip.firstPosition.geometry.location.lng,
                //   }}
                //   destination={{
                //     latitude: direction.firstPosition.geometry.location.lat,
                //     longitude: direction.firstPosition.geometry.location.lng,
                //   }}
                //   apikey={googleMapsApi}
                //   strokeWidth={mapDirectionLine.dashed.stroke}
                //   strokeColor={mapDirectionLine.dashed.color}
                //   mode="DRIVING"
                //   // onReady={handleDirectionsReady}
                //   key={`maps-directions-previous-${index}`}
                //   lineDashPattern={[10, 15, 10, 10]}
                // />
                <MapViewDirections
                  origin={{
                    latitude: previousTrip.secondPosition.geometry.location.lat,
                    longitude:
                      previousTrip.secondPosition.geometry.location.lng,
                  }}
                  destination={{
                    latitude: direction.firstPosition.geometry.location.lat,
                    longitude: direction.firstPosition.geometry.location.lng,
                  }}
                  apikey={googleMapsApi}
                  strokeWidth={mapDirectionLine.dashed.stroke}
                  strokeColor={mapDirectionLine.dashed.color}
                  mode="DRIVING"
                  onReady={(result) =>
                    handleDirectionsReady(result, `previous-dashed-${index}`)
                  }
                  key={`maps-directions-previous-dashed-${index}`}
                  lineDashPattern={dashPattern}
                  tappable={true}
                  onPress={() => {
                    // console.log("Directions Press!");
                    onDashedPress(
                      previousTrip.secondPosition,
                      direction.firstPosition,
                      `previous-dashed-${index}`
                    );
                  }}
                />
              )}
            </Box>
          )
        );
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        {renderMarkers(directions)}
        {renderDirections(directions, isPickingSchedules)}
        {/* {directions.map((direction, index, directionsArray) => {
          return (
            direction && (
              <>
                {direction.firstPosition && (
                  <Marker
                    coordinate={{
                      latitude: direction.firstPosition.geometry.location.lat,
                      longitude: direction.firstPosition.geometry.location.lng,
                    }}
                    key={`first-position-marker-${index}`}
                    // icon={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                  >
                    <Image
                      size={"xs"}
                      resizeMode="contain"
                      alignSeft="center"
                      source={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
                      alt={"Điểm đi"}
                    />
                  </Marker>
                )}
                {direction.secondPosition && (
                  <Marker
                    coordinate={{
                      latitude: direction.secondPosition.geometry.location.lat,
                      longitude: direction.secondPosition.geometry.location.lng,
                    }}
                    // image={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                    key={`second-position-marker-${index}`}
                  >
                    <Image
                      size={"xs"}
                      resizeMode="contain"
                      alignSeft="center"
                      source={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
                      alt={"Điểm đến"}
                    />
                  </Marker>
                )}
                {direction.firstPosition && direction.secondPosition && (
                  <MapViewDirections
                    origin={{
                      latitude: direction.firstPosition.geometry.location.lat,
                      longitude: direction.firstPosition.geometry.location.lng,
                    }}
                    destination={{
                      latitude: direction.secondPosition.geometry.location.lat,
                      longitude: direction.secondPosition.geometry.location.lng,
                    }}
                    apikey="AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc"
                    strokeWidth={direction.strokeWidth}
                    strokeColor={direction.strokeColor}
                    mode="DRIVING"
                    onReady={handleDirectionsReady}
                    key={`maps-directions-${index}`}
                    // lineDashPattern={[5, 5, 5, 5, 5]}
                  />
                )}
              </>
            )
          );
        })} */}
      </MapView>
      {!isPickingSchedules && (
        <SwipeablePanel
          isActive={isPanelActive}
          fullWidth={true}
          noBackgroundOpacity
          showCloseButton
          allowTouchOutside
          smallPanelHeight={360}
          openLarge={true}
          // onlyLarge={true}
          // largePanelHeight={680}
          // closeOnTouchOutside={true}
          onClose={() => setIsPanelActive(false)}
        >
          <Box px="6">
            <BookingDetailPanel
              customer={customer}
              item={bookingDetail}
              navigation={navigation}
              // toggleBottomSheet={toggleBottomSheet}
              duration={durations[`${selectedIndex}`]}
              distance={distances[`${selectedIndex}`]}
              displayButtons={false}
            />
          </Box>
        </SwipeablePanel>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
