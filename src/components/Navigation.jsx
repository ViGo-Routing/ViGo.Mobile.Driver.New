import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import SchedulerScreen from "../screens/Scheduler/SchedulerScreen";
import ProfileSreen from "../screens/Profile/ProfileScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import RoutineScreen from "../screens/Routine/RoutineScreen";
import RoutineGenerator from "../screens/Routine/RoutineScreen";
import Mapbox from "../screens/Mapbox";
import { UserProvider } from "../context/UserContext";
import BookingDetailScreen from "../screens/BookingDetail/BookingDetailScreen";
import { useNotificationHook } from "../hooks/useNotificationHook";
import { useOnNotificationClickHook } from "../hooks/useOnNotificationClickHook";
import WalletScreen from "../screens/Wallet/WalletScreen";
import WalletTransactionDetailScreen from "../screens/Wallet/WalletTransactionDetailScreen";
import WalletTransactionsScreen from "../screens/Wallet/WalletTransactionsScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  useNotificationHook();

  const { initialScreen, initialParams } = useOnNotificationClickHook();
  return (
    // <UserProvider>
    //     <NavigationContainer>
    <Stack.Navigator initialRouteName={initialScreen}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
      <Stack.Screen name="Schedule" component={SchedulerScreen} />
      <Stack.Screen name="Profile" component={ProfileSreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      {/* <Stack.Screen name="Routine" component={RoutineGenerator} /> */}
      {/* <Stack.Screen name="Mapbox" component={Mapbox} /> */}
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen
        name="Wallet"
        options={{ headerShown: false }}
        component={WalletScreen}
      />
      <Stack.Screen
        name="WalletTransactionDetail"
        options={{ headerShown: false }}
        component={WalletTransactionDetailScreen}
        initialParams={
          initialScreen == "WalletTransactionDetail" ? initialParams : undefined
        }
      />
      {/* <Stack.Screen
        name="Topup"
        options={{ headerShown: false }}
        component={TopupScreen}
      /> */}
      {/* <Stack.Screen
            name="TopupAmount"
            options={{ headerShown: false }}
            component={TopupAmountScreen}
          /> */}
      <Stack.Screen
        name="WalletTransactions"
        options={{ headerShown: false }}
        component={WalletTransactionsScreen}
      />
    </Stack.Navigator>
    //     </NavigationContainer>
    // </UserProvider>
  );
};
export default Navigation;
