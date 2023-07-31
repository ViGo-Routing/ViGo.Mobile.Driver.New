import apiManager from "../utils/apiManager";

export const getBookingDetailByUserId = async (driverId) => {
  try {
    const response = await apiManager.get(
      `/api/BookingDetail/Driver/Available/${driverId}?PageSize=-1`
    );
    return response;
  } catch (error) {
    console.error("Create Payment failed:", error);
  }
};

export const pickBookingDetailById = async (bookingDetailId) => {
  try {
    const response = await apiManager.post(
      `/api/BookingDetail/Driver/Pick/${bookingDetailId}`
    );
    return response;
  } catch (error) {
    console.error("Driver Pick Booking Detail By Id failed:", error);
    return null;
  }
};

export const getBookingDetailByDriverId = async (driverId) => {
  try {
    const response = await apiManager.get(
      `/api/BookingDetail/Driver/${driverId}`
    );
    return response;
  } catch (error) {
    console.error("Driver Pick Booking Detail By Id failed:", error);
    return null;
  }
};
export const updateStatusBookingDetail = async (bookingId, requestData) => {
  console.log(requestData)
  try {
    const response = await apiManager.put(
      `/api/BookingDetail/UpdateStatus/${bookingId}`, requestData
    );
    return response;
  } catch (error) {
    console.error("Driver Pick Booking Detail By Id failed:", error);
    return null;
  }
};
