import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { useNavigation } from "@react-navigation/native";

export const useNotificationHook = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log(remoteMessage);
      if (remoteMessage.data.action == "payment") {
        paymentNotificationHandlers(remoteMessage.data, navigation);
      }
    });

    return unsubscribe;
  }, []);
};
