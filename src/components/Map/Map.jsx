import React, { useState, useEffect } from "react";
import { StyleSheet, View, PermissionsAndroid } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import MapViewDirections from "react-native-maps-directions";
import { createRoute } from "../../services/routeService";
import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";

const Map = ({ pickupPosition, destinationPosition, sendRouteId }) => {
  const { latitude, longitude } = pickupPosition?.geometry?.location || {};
  const pickupPositionCoords =
    latitude && longitude ? { latitude, longitude } : null;

  const { latitude: destLat, longitude: destLng } =
    destinationPosition?.geometry?.location || {};
  const destinationPositionCoords =
    destLat && destLng ? { latitude: destLat, longitude: destLng } : null;

  const initialRegion = {
    latitude: pickupPositionCoords?.latitude || 10.762622,
    longitude: pickupPositionCoords?.longitude || 106.660172,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialRegion);

  useEffect(() => {
    if (pickupPositionCoords) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: pickupPositionCoords.latitude,
        longitude: pickupPositionCoords.longitude,
      }));
    }
  }, [pickupPositionCoords]);

  useEffect(() => {
    if (destinationPositionCoords) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: destinationPositionCoords.latitude,
        longitude: destinationPositionCoords.longitude,
      }));
    }
  }, [destinationPositionCoords]);

  const handleDirectionsReady = async (result) => {
    const requestData = {
      // Request body data
      name: `${pickupPosition.name} - ${destinationPosition.name}`,
      distance: result.distance,
      duration: result.duration,
      status: "ACTIVE",
      routineType: "RANDOMLY",
      routeType: "SPECIFIC_ROUTE_SPECIFIC_TIME",
      startStation: {
        longtitude: pickupPosition.geometry.location.lng,
        latitude: pickupPosition.geometry.location.lat,
        name: pickupPosition.name,
        address: pickupPosition.formatted_address,
      },
      endStation: {
        longtitude: destinationPosition.geometry.location.lng,
        latitude: destinationPosition.geometry.location.lat,
        name: destinationPosition.name,
        address: destinationPosition.formatted_address,
      },
    };
    // try {
    //   const response = await createRoute(requestData);
    //   console.log("response", response.data.id);
    //   sendRouteId(response.data.id);
    // } catch (error) {
    //   console.log("Create Route Error ", error);
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pickupPosition.geometry.location.lat,
          longitude: pickupPosition.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {pickupPosition && (
          <Marker
            coordinate={{
              latitude: pickupPosition.geometry.location.lat,
              longitude: pickupPosition.geometry.location.lng,
            }}
            // icon={require("../../../assets/icons/maps-pickup-location-icon-3x.png")}
          />
        )}
        {destinationPosition && (
          <Marker
            coordinate={{
              latitude: destinationPosition.geometry.location.lat,
              longitude: destinationPosition.geometry.location.lng,
            }}
            // image={require("../../../assets/icons/maps-dropoff-location-icon-3x.png")}
          />
        )}
        {pickupPosition && destinationPosition && (
          <MapViewDirections
            origin={{
              latitude: pickupPosition.geometry.location.lat,
              longitude: pickupPosition.geometry.location.lng,
            }}
            destination={{
              latitude: destinationPosition.geometry.location.lat,
              longitude: destinationPosition.geometry.location.lng,
            }}
            apikey="AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc"
            strokeWidth={3}
            strokeColor="#00A1A1"
            mode="DRIVING"
            onReady={handleDirectionsReady}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
