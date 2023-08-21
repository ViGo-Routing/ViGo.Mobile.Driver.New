import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";

// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'

// import { Ionicons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import { themeColors } from "../../../assets/theme/index";
import Map from "../../components/Map/Map";
import { getRouteById } from "../../services/routeService";
import {
  pickBookingDetailById,
  updateStatusBookingDetail,
} from "../../services/bookingDetailService";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import { UserContext } from "../../context/UserContext";

const StartRouteScreen = () => {
  const navigation = useNavigation();
  const [isViewVisible, setViewVisible] = useState(false);

  const route = useRoute();
  const { item } = route.params;
  const { user } = useContext(UserContext);
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

  const handleStartRoute = async () => {
    try {
      const time = new Date();

      const requestData = {
        bookingDetailId: item.id,
        status: "GOING_TO_PICKUP",
        time: time.toISOString(),
      };
      await updateStatusBookingDetail(item.id, requestData).then((response) => {
        if (response && response.data) {
          Alert.alert(
            "Xác nhận nhận chuyến đi",
            `Bạn hãy đi đón khách đúng giờ nhé!`,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("PickCus", { response });
                },
              },
            ]
          );
        } else {
          Alert.alert("Xác nhận chuyến", "Lỗi: Không bắt đầu được chuyến!");
        }
      });
    } catch (error) {
      console.error("Tài xế bắt đầu chuyến đi", error);
      Alert.alert("Tài xế bắt đầu", "Bắt đầu không thành công");
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
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "0%",
            width: "90%",
          }}
        >
          <View style={[styles.card, styles.shadowProp]}>
            <View
              style={{
                flexDirection: "row",
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              <View style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <View
                  style={{
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    {/* <Ionicons
                      name="calendar-outline"
                      size={25}
                      color="#00A1A1"
                    /> */}
                    <CalendarDaysIcon size={25} color="#00A1A1" />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.title}>Ngày đón</Text>
                    <Text
                      style={{
                        paddingLeft: 10,
                        paddingBottom: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {item.date}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.cardInsideDateTime, styles.shadowProp]}>
                <View
                  style={{
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
                    <ClockIcon size={25} color="#00A1A1" />
                  </View>

                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.title}>Giờ đón</Text>

                    <Text
                      style={{
                        paddingLeft: 10,
                        paddingBottom: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {item.customerDesiredPickupTime}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              <View style={[styles.cardInsideLocation, styles.shadowProp]}>
                <View
                  style={{
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    {/* <Ionicons name="locate-outline" size={25} color="#00A1A1" /> */}
                    <MapPinIcon size={25} color="#00A1A1" />
                  </View>

                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={styles.title}>Điểm đón</Text>

                    <Text
                      style={{
                        paddingLeft: 10,
                        paddingBottom: 10,
                        fontSize: 15,
                      }}
                    >
                      {item.startStation.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              <View style={[styles.cardInsideLocation, styles.shadowProp]}>
                <View
                  style={{
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    {/* <Ionicons
                      name="location-outline"
                      size={25}
                      color="#00A1A1"
                    /> */}
                    <MapPinIcon size={25} color="#00A1A1" />
                  </View>

                  <View
                    style={{
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={styles.title}>Điểm đến</Text>

                    <Text
                      style={{
                        paddingLeft: 10,
                        paddingBottom: 10,
                        fontSize: 15,
                      }}
                    >
                      {item.endStation.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={[
                  styles.cardInsideLocation,
                  styles.shadowProp,
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
                  onPress={handleStartRoute}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Bắt đầu chuyến đi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    flexDirection: "row",
    flexGrow: 1,
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
    paddingLeft: 10,
  },
  list: {
    paddingTop: 20,
    fontSize: 20,
  },
});

export default StartRouteScreen;
