import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { getBookingDetailByDriverId } from "../../services/bookingDetailService";
import { UserContext } from "../../context/UserContext";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import InfoAlert from "../../components/Alert/InfoAlert";
import { Box, HStack, ScrollView, Text } from "native-base";
import moment from "moment";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { getErrorMessage } from "../../utils/alertUtils";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";

LocaleConfig.locales["vn"] = {
  monthNames: [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
  ],
  monthNamesShort: [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T6"],
  today: "Hôm nay",
};

LocaleConfig.defaultLocale = "vn";

const SchedulerScreen = () => {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState({});
  const [tripId, setId] = useState("");
  // const [markedDates, setMarkedDates] = useState([]);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setErrorMessage, setIsError, errorMessage } =
    useErrorHandlingHook();

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    // console.log(user.id);
    try {
      const currentDate = new Date();

      // Get the previous date
      const previousDate = new Date();
      previousDate.setDate(currentDate.getDate() - 1);
      const formattedPreviousDate = `${previousDate.getFullYear()}-${(
        previousDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${previousDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      const tripsResponse = await getBookingDetailByDriverId(
        user.id /*, formattedPreviousDate*/
      );
      const responseItems = tripsResponse.data.data;
      const agendaItems = {};

      // const itemMarkedDates = {};

      responseItems.forEach((item) => {
        const { startStation, endStation, customerRouteRoutine } = item;
        const dateString = customerRouteRoutine.routineDate;
        if (!agendaItems[dateString]) {
          agendaItems[dateString] = [];
        }

        const itemData = {
          title: `${startStation.name} - ${endStation.name}`,
          time: `${toVnTimeString(
            customerRouteRoutine.pickupTime
          )} - ${toVnDateString(customerRouteRoutine.routineDate)}`,
          item: item,
        };
        agendaItems[dateString].push(itemData);
      });

      setItems(agendaItems);

      // console.log(agendaItems);
      // console.log(items);
      // const dates = items
      //   .map((item) => new moment(item.date).format("YYYY-MM-DD"))
      //   .filter((value, index, array) => array.indexOf(value) === index);
      // dates.forEach((date) => {
      //   itemMarkedDates[`${date}`] = {
      //     marked: true,
      //   };
      // });
      // setMarkedDates(itemMarkedDates);
      // console.log(itemMarkedDates);
    } catch (error) {
      console.log(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, []);

  const handelStartRoute = (item) => {
    navigation.navigate("StartRoute", { item });
  };

  const loadItems = (day, items) => {
    // Simulating data fetching
    const events = {}; // This will store the events for each day

    // Filter the events that match the selected day
    items.forEach((item) => {
      const date = item.customerRouteRoutine.routineDate;
      const eventDate = new Date(date);
      const dateString = eventDate.toISOString().split("T")[0];

      if (!events[dateString]) {
        events[dateString] = [];
      }
      events[dateString].push(item);
    });

    // Return the events for the selected day
    const selectedDay = day.dateString;
    return events[selectedDay] || [];
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => handelStartRoute(item.item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      // <View style={styles.itemContainer}>
      //   <Text> bạn không có chuyến xe vào hôm nay</Text>
      // </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchData()}
          />
        }
      >
        <Box marginTop="2">
          <InfoAlert message="Bạn không có chuyến xe nào vào hôm nay" />
        </Box>
      </ScrollView>
    );
  };

  const theme = {
    // Customize the agenda styles
    agendaKnobColor: themeColors.primary,
    selectedDayBackgroundColor: themeColors.primary,
    dotColor: "red",
    todayTextColor: "green",
    agendaTodayColor: themeColors.primary,
    // Add more style customizations as needed
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Header title="Lịch trình của tôi" />
      </View>

      {/* <Text>Phong</Text> */}
      {/* <ViGoSpinner isLoading={isLoading} /> */}
      <ErrorAlert isError={isError} errorMessage={errorMessage}>
        <Agenda
          items={items}
          // selected={new moment().format("YYYY-MM-DD")}
          renderItem={(item) => renderItem(item)}
          // renderEmptyDate={() => renderEmptyDate()}
          renderEmptyData={() => renderEmptyDate()}
          theme={theme} // Apply the custom theme
          showOnlySelectedDayItems
          onRefresh={() => {
            // console.log("Reloading Agenda...");
            fetchData();
          }}
          refreshing={isLoading}
          // markedDates={markedDates}
          // refreshControl={<ViGoSpinner isLoading={isLoading} />}
        />
      </ErrorAlert>
      {/* <Agenda
          items={items}
          renderItem={(item) => renderItem(item)}
          renderEmptyDate={() => renderEmptyDate()}
          theme={theme} // Apply the custom theme
        /> */}
    </SafeAreaView>
  );
};

const styles = {
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemTime: {
    fontSize: 14,
    color: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
};
export default SchedulerScreen;
