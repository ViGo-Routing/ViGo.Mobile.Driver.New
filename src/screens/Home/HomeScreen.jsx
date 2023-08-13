import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { UserContext } from "../../context/UserContext";
import { getBookingDetailByUserId } from "../../services/bookingDetailService";
import { themeColors } from "../../../assets/theme";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavigationBar from "../../components/NavBar/BottomNavigationBar";
import WelcomeDriverHeader from "../../components/Header/WelcomeDriverHeader";
import { getProfile } from "../../services/userService";
import { Center, Image, VStack } from "native-base";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [bookingDetailAvailable, setListBookingDetailAvailable] = useState([]);
  useEffect(() => {
    const fetchRouteData = async () => {
      await getBookingDetailByUserId(user.id).then((result) => {
        setListBookingDetailAvailable(result.data.data);
      });
    };
    fetchRouteData();
  }, []);
  handelSendData = (item) => {
    navigation.navigate("BookingDetail", { item, user });
    console.log(item);
  };

  const [response, setResponse] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const profileId = "5f94dd86-37b2-43a3-962b-036a3c03d3c9";
        const response = await getProfile(profileId);
        setResponse(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}><Header title="Thông tin tài khoản" /></View> */}
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <WelcomeDriverHeader
            title={`Chào mừng ${
              response && response.name ? response.name : ""
            }`}
            subtitle="..."
            onBack={() => navigation.goBack()}
          />
        </View>
        <Text style={styles.title}>Lịch trình còn trống</Text>
        {bookingDetailAvailable.map((item, index) => (
          <View
            style={[
              styles.list,
              index === bookingDetailAvailable.length - 1 &&
                styles.lastListItem,
            ]}
            key={item.id}
          >
            <TouchableOpacity
              style={[styles.card, styles.shadowProp]}
              onPress={() => handelSendData(item)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <VStack>
                  <Center>
                    <Image
                      p="1"
                      size={"xs"}
                      resizeMode="cover"
                      source={require("../../../assets/icons/vigobike.png")}
                      alt="Alternate Text"
                    />
                  </Center>
                  <View style={{ width: "100%", paddingRight: 15 }}>
                    <View
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Giờ đón</Text>
                      <Text>{item.customerRouteRoutine.pickupTime}</Text>
                    </View>
                  </View>
                </VStack>

                <View
                  style={{
                    width: "80%",
                    borderLeftWidth: 1,
                    borderRightColor: "#000",
                    paddingLeft: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.cardHeader}>
                      {item.customerRouteRoutine.routineDate}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingRight: 20,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginVertical: 10,
                        marginLeft: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: 147,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "grey",
                            paddingLeft: 10,
                          }}
                        >
                          Điểm đón:{" "}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          {item.startStation.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: 147,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "grey",
                            paddingLeft: 10,
                          }}
                        >
                          Điểm đến:{" "}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          {item.endStation.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{ flexDirection: "column", alignItems: "flex-end" }}
                  >
                    <Text style={styles.priceCart}>Giá: {item.price} đ</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <BottomNavigationBar />
      </View>
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
