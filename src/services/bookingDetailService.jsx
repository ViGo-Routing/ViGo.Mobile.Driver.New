import { Alert } from "react-native";
import apiManager from "../utils/apiManager";

export const getBookingDetailByUserId = async (
  driverId,
  pageSize,
  pageNumber
) => {
  // try {
  const response = await apiManager.get(
    `/api/BookingDetail/Driver/Available/${driverId}?
      pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response;
  // } catch (error) {
  //   console.error("Create Payment failed:", error);
  // }
};

export const pickBookingDetailById = async (bookingDetailId) => {
  console.log(bookingDetailId);
  try {
    const response = await apiManager.post(
      `/api/BookingDetail/Driver/Pick/${bookingDetailId}`
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      Alert.alert(errorDetails);
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};

export const getBookingDetailByDriverId = async (driverId) => {
  // try {
  const response = await apiManager.get(
    `/api/BookingDetail/Driver/${driverId}`
  );
  return response;
  // } catch (error) {
  //   if (error.response && error.response.data) {
  //     // Assuming the error response has a 'data' property containing error details
  //     const errorDetails = error.response.data;
  //     Alert.alert(errorDetails);
  //     return null;
  //   } else {
  //     console.log("Error response structure not recognized.");
  //     return null;
  //   }
  // }
};
export const updateStatusBookingDetail = async (bookingId, requestData) => {
  console.log(requestData);
  try {
    const response = await apiManager.put(
      `/api/BookingDetail/UpdateStatus/${bookingId}`,
      requestData
    );
    return response;
  } catch (error) {
    console.error("Driver Pick Booking Detail By Id failed:", error);
    return null;
  }
};

export const getBookingDetail = async (bookingDetailId) => {
  const response = await apiManager.get(`api/BookingDetail/${bookingDetailId}`);
  return response.data;
};

export const getBookingDetailPickFee = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/DriverFee/${bookingDetailId}`
  );
  return response.data;
};
