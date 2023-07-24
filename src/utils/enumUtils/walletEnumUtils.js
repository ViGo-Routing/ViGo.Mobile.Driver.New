import { StyleSheet, Text, View } from "react-native";
import { renderPaymentMethod } from "./paymentMethodEnumUtils";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/solid";
import { vigoStyles } from "../../../assets/theme";
export const renderTransactionTypeOperator = (transactionType) => {
  switch (transactionType) {
    case "TOPUP":
      return "+";
    case "TRIP_INCOME":
      return "+";
    case "TRIP_PAID":
      return "-";
    case "CANCEL_FEE":
      return "-";
  }
};

export const renderTransacionType = (transaction, renderType) => {
  if (renderType == "list") {
    switch (transaction.type) {
      case "TOPUP":
        return (
          <>
            <Text style={styles.transactionNameListItem}>
              Nạp tiền vào tài khoản
            </Text>
            <Text style={styles.transactionSubtitle}>
              {renderPaymentMethod(transaction.paymentMethod)}
            </Text>
          </>
        );
      case "TRIP_INCOME":
        return (
          <>
            <Text style={styles.transactionNameListItem}>
              Tiền công Chuyến đi
            </Text>
            <Text style={styles.transactionSubtitle}>
              Chuyến đi: {transaction.bookingDetailId}
            </Text>
          </>
        );
      case "TRIP_PAID":
        return (
          <>
            <Text style={styles.transactionNameListItem}>
              Trả tiền Chuyến đi
            </Text>
            <Text style={styles.transactionSubtitle}>
              Chuyến đi: {transaction.bookingDetailId}
            </Text>
          </>
        );
      case "CANCEL_FEE":
        return (
          <>
            <Text style={styles.transactionNameListItem}>
              Phí hủy chuyến đi
            </Text>
            <Text style={styles.transactionSubtitle}>
              {transaction.bookingId
                ? `Hành trình: ${transaction.bookingId}`
                : `Chuyến đi: ${transaction.bookingDetailId}`}
            </Text>
          </>
        );
      default:
        return "Khác";
    }
  } else if (renderType == "details") {
    switch (transaction.type) {
      case "TOPUP":
        return (
          <>
            <Text style={styles.transactionNameDetail}>
              Nạp tiền vào tài khoản
            </Text>
          </>
        );
      case "TRIP_INCOME":
        return (
          <>
            <Text style={styles.transactionNameDetail}>
              Tiền công Chuyến đi
            </Text>
          </>
        );
      case "TRIP_PAID":
        return (
          <>
            <Text style={styles.transactionNameDetail}>Trả tiền Chuyến đi</Text>
          </>
        );
      case "CANCEL_FEE":
        return (
          <>
            <Text style={styles.transactionNameDetail}>Phí hủy chuyến đi</Text>
          </>
        );
      default:
        return (
          <>
            <Text style={styles.transactionNameDetail}>Khác</Text>
          </>
        );
    }
  }
};

export const renderTransactionStatus = (transactionStatus, renderType) => {
  if (renderType == "list") {
    switch (transactionStatus) {
      case "PENDING":
        return <ClockIcon size={22} color="orange"></ClockIcon>;
      case "SUCCESSFULL":
        return <CheckCircleIcon size={22} color="green"></CheckCircleIcon>;
      case "FAILED":
        return (
          <ExclamationCircleIcon size={22} color="red"></ExclamationCircleIcon>
        );
    }
  } else if (renderType == "details") {
    switch (transactionStatus) {
      case "PENDING":
        return (
          <View style={vigoStyles.badgePendingContainer}>
            <Text style={vigoStyles.badgePendingText}>Đang chờ</Text>
          </View>
        );
      case "SUCCESSFULL":
        return (
          <View style={vigoStyles.badgeSuccessContainer}>
            <Text style={vigoStyles.badgeSuccessText}>Thành công</Text>
          </View>
        );
      case "FAILED":
        return (
          <View style={vigoStyles.badgeErrorContainer}>
            <Text style={vigoStyles.badgeErrorText}>Thất bại</Text>
          </View>
        );
    }
  }
};

const styles = StyleSheet.create({
  transactionNameListItem: {
    fontSize: 16,
  },
  transactionNameDetail: {
    fontSize: 16,
    textTransform: "uppercase",
  },
  transactionSubtitle: {
    // marginLeft: 10,
    fontSize: 14,
    color: "#999",
  },
});
