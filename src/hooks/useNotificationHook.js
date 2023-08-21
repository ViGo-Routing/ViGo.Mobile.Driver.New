import { useEffect, useContext } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

export const useNotificationHook = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log(remoteMessage);
      if (remoteMessage.data.action == "payment") {
        // paymentNotificationHandlers(remoteMessage.data, navigation);
      } else if (remoteMessage.data.action == "login") {
        // console.log("Recieved Message for login navigation");
        // setUser(null, (s) => {
        //   navigation.navigate("Login");
        //   console.log("Navigate to login");
        // });
        // ;
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, []);
};
