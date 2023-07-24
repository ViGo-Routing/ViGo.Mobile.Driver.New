import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header/Header";
import { vigoStyles } from "../../../assets/theme";
import {
  renderTransacionType,
  renderTransactionDetail,
  renderTransactionStatus,
  renderTransactionTypeOperator,
} from "../../utils/enumUtils/walletEnumUtils";

import { useEffect, useState } from "react";
import { getWalletTransactionDetail } from "../../services/walletService";
import { vndFormat } from "../../utils/numberUtils";
import { renderPaymentMethod } from "../../utils/enumUtils/paymentMethodEnumUtils";
import { toVnDateTimeString } from "../../utils/datetimeUtils";
import Divider from "../../components/Divider/Divider";

const WalletTransactionDetailScreen = ({ route }) => {
  // console.log(route);
  const { walletTransactionId } = route.params;
  // console.log(walletTransactionId);

  const [details, setDetails] = useState(null);

  const getDetails = async () => {
    const transactionDetails = await getWalletTransactionDetail(
      walletTransactionId
    );
    // console.log(transactionDetails);
    setDetails(transactionDetails);
  };

  const renderTransactionDetail = (transactionDetail) => {
    if (transactionDetail) {
      return (
        <View>
          <View style={vigoStyles.row}>
            {renderTransacionType(transactionDetail, "details")}
          </View>
          <View
            style={{
              // ...vigoStyles.row,
              ...styles.transactionDetailsAmountContainer,
            }}
          >
            <Text
              style={{ ...styles.transactionDetailsAmount }}
            >{`${renderTransactionTypeOperator(
              transactionDetail.type
            )}${vndFormat(transactionDetail.amount)}`}</Text>
          </View>
          <View style={{ marginTop: 15 }}>
            <View style={vigoStyles.row}>
              <Text>Phương thức thanh toán</Text>
              <Text>
                {renderPaymentMethod(transactionDetail.paymentMethod)}
              </Text>
            </View>
            <View style={vigoStyles.row}>
              <Text>Trạng thái</Text>
              {renderTransactionStatus(transactionDetail.status, "details")}
            </View>
            <View style={vigoStyles.row}>
              <Text>Thời gian</Text>
              <Text>{toVnDateTimeString(transactionDetail.createdTime)}</Text>
            </View>
          </View>
          <Divider style={{ marginTop: 10 }} />
          <View style={{ marginTop: 15 }}>
            <View style={vigoStyles.column}>
              <Text>Mã giao dịch</Text>
              <Text style={{ textAlign: "right" }}>{transactionDetail.id}</Text>
            </View>
            {transactionDetail.bookingDetailId && (
              <View style={vigoStyles.column}>
                <Text>Mã chuyến đi</Text>
                <Text style={{ textAlign: "right" }}>
                  {transactionDetail.bookingDetailId}
                </Text>
              </View>
            )}
            {transactionDetail.bookingId && (
              <View style={vigoStyles.column}>
                <Text>Mã hành trình</Text>
                <Text>{transactionDetail.bookingId}</Text>
              </View>
            )}
          </View>
        </View>
      );
    }
    return <></>;
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Chi tiết giao dịch" />
      </View>
      <View style={vigoStyles.body}>{renderTransactionDetail(details)}</View>
    </SafeAreaView>
  );
};

export default WalletTransactionDetailScreen;

const styles = StyleSheet.create({
  transactionNameDetail: {
    fontSize: 20,
  },
  transactionDetailsAmountContainer: {
    // backgroundColor: "white",
  },
  transactionDetailsAmount: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
});
