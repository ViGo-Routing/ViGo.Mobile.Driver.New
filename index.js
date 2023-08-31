/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

import messaging from "@react-native-firebase/messaging";

import PushNotification, { Importance } from "react-native-push-notification";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

PushNotification.createChannel(
  {
    channelId: "vigo-driver-channel",
    channelName: "ViGo Driver Channel",
    channelDescription: "ViGo Driver Channel for push notifications",
    playSound: false,
    soundName: "default",
    importance: Importance.HIGH,
    vibrate: false,
  },
  (created) => console.log(`Create Channel returned '${created}'`)
);

AppRegistry.registerComponent(appName, () => App);
