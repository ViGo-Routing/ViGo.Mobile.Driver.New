import { NativeEventEmitter } from "react-native";

export const eventNames = {
  SHOW_TOAST: "showToast",
};

export const handleError = (alertTitle: string, error: any) => {
  const eventEmitter = new NativeEventEmitter();

  eventEmitter.emit(eventNames.SHOW_TOAST, {
    title: alertTitle,
    description: error.response
      ? error.response.data
      : error.message
      ? error.message
      : error,
    status: "error",
    isDialog: true,
  });
};

export const handleWarning = (title: string, message: string) => {
  const eventEmitter = new NativeEventEmitter();

  eventEmitter.emit(eventNames.SHOW_TOAST, {
    title: title,
    description: message,
    status: "warning",
    isDialog: true,
  });
};
