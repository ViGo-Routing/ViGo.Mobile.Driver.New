import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";

const SchedulerScreen = () => {
  const [items, setItems] = useState({});

  const loadItems = (day) => {
    // Simulating data fetching
    setTimeout(() => {
      const newItems = {};
      const dateString = day.dateString;
      newItems[dateString] = [
        { name: "Meeting 1", time: "10:00 AM" },
        { name: "Meeting 2", time: "2:00 PM" },
        { name: "Meeting 3", time: "4:00 PM" },
      ];
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    );
  };

  const theme = {
    // Customize the agenda styles
    agendaKnobColor: "blue",
    selectedDayBackgroundColor: "lightblue",
    dotColor: "red",
    todayTextColor: "green",
    agendaTodayColor: "purple",
    // Add more style customizations as needed
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
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
    marginTop: 17,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemTime: {
    fontSize: 14,
    color: "gray",
  },
};
export default SchedulerScreen;
