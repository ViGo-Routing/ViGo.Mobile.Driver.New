import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useContext } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationOnClickHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { UserContext } from "../context/UserContext";
import { isValidToken } from "../utils/tokenUtils";

export const useOnNotificationClickHook = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  const [initialScreen, setInitialScreen] = useState("");
  const [initialParams, setInitialParams] = useState(undefined);

  const handleInitialScreen = async () => {
    const isValid = await isValidToken();
    if (isValid) {
      if (user && user.status == "PENDING") {
        setInitialScreen("NewDriverUpdateProfile");
      } else {
        setInitialScreen("Schedule");
      }
    } else {
      setInitialScreen("Login");
    }
  };

  useEffect(() => {
    handleInitialScreen();
    // App is opened from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.data.action == "payment") {
        paymentNotificationOnClickHandlers(remoteMessage.data, navigation);
      }
    });

    // App is opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          setInitialScreen("WalletTransactionDetail");
          setInitialParams({ walletTransactionId: data.walletTransactionId });
        }
      });
  }, []);

  return { initialScreen, initialParams };
};
