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
import { getBookingDetailByDriverId } from "../../services/bookingDetailService";
import { UserContext } from "../../context/UserContext";
import { themeColors } from "../../../assets/theme";

const SchedulerScreen = () => {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await getBookingDetailByDriverId(user.id).then((result) => {
        const items = result.data.data
        const agendaItems = {};
        items.forEach((item) => {

          const { startStation, endStation, customerRouteRoutine } = item;
          const dateString = customerRouteRoutine.routineDate;
          if (!agendaItems[dateString]) {
            agendaItems[dateString] = [];
          }

          const itemData = {
            title: `${startStation.name} - ${endStation.name}`,
            time: `${customerRouteRoutine.pickupTime} - $uu{customerRouteRoutine.routineDate}`,
          };
          agendaItems[dateString].push(itemData);
          setItems(agendaItems)
        });
      });
    };
    fetchData();
  }, []);


  const loadItems = (day, items) => {
    // Simulating data fetching
    const events = {}; // This will store the events for each day

    // Filter the events that match the selected day
    items.forEach((item) => {
      const date = item.customerRouteRoutine.routineDate;
      const eventDate = new Date(date);
      const dateString = eventDate.toISOString().split('T')[0];

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
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.time}</Text>
      </View>
    );
  };
  const renderEmptyDate = () => {
    return (
      <View style={styles.itemContainer}>
        <Text> bạn không có chuyến xe vào hôm nay</Text>
      </View>
    );
  }
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
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}

        renderItem={(item) => renderItem(item)}
        renderEmptyDate={() => renderEmptyDate()}
        theme={theme} // Apply the custom theme
      />
    </View>
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
    fontWeight: 'bold'
  }
};
export default SchedulerScreen;
