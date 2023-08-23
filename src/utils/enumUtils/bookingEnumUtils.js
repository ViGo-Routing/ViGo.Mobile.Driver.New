export const getBookingDetailStatusString = (inputStatus) => {
  if (inputStatus === "PENDING_ASSIGN") {
    return "Tài xế chưa nhận";
  } else if (inputStatus === "ASSIGNED") {
    return "Đang chờ tài xế bắt đầu chuyến đi";
  } else if (inputStatus === "GOING_TO_PICKUP") {
    return "Đang rước";
  } else if (inputStatus === "ARRIVE_AT_PICKUP") {
    return "Đã đến điểm rước";
  } else if (inputStatus === "GOING_TO_DROPOFF") {
    return "Đang di chuyển";
  } else if (inputStatus === "ARRIVE_AT_DROPOFF") {
    return "Đã trả khách";
  } else if (inputStatus === "CANCELLED") {
    return "Đã hủy";
  } else if (inputStatus === "COMPLETED") {
    return "Đã hoàn thành";
  } else {
    return "";
  }
};

export const getBookingDetailStatusColor = (inputStatus) => {
  switch (inputStatus) {
    case "PENDING_ASSIGN":
      return styles.pendingColor;
    case "ASSIGNED":
      return styles.assignedColor;
    case "GOING_TO_PICKUP":
      return styles.goingToPickupColor;
    case "ARRIVE_AT_PICKUP":
      return styles.arriveAtPickupColor;
    case "GOING_TO_DROPOFF":
      return styles.goingToDropoffColor;
    case "ARRIVE_AT_DROPOFF":
      return styles.arriveAtDropoffColor;
    case "CANCELLED":
      return styles.cancelledColor;
    case "COMPLETED":
      return styles.completedColor;
    default:
      return {}; // Default to an empty object if the status doesn't match any case
  }
};

const styles = {
  pendingColor: {
    color: "orange", // Change to the desired color for PENDING_ASSIGN
  },
  assignedColor: {
    color: "blue", // Change to the desired color for ASSIGNED
  },
  goingToPickupColor: {
    color: "blue", // Change to the desired color for GOING_TO_PICKUP
  },
  arriveAtPickupColor: {
    color: "blue", // Change to the desired color for ARRIVE_AT_PICKUP
  },
  goingToDropoffColor: {
    color: "blue", // Change to the desired color for GOING_TO_DROPOFF
  },
  arriveAtDropoffColor: {
    color: "blue", // Change to the desired color for ARRIVE_AT_DROPOFF
  },
  cancelledColor: {
    color: "red", // Change to the desired color for CANCELLED
  },
  completedColor: {
    color: "green", // Change to the desired color for COMPLETED
  },
};
