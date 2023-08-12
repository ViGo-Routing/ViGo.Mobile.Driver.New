import {
  SafeAreaView,
  View,
  // Text,
  StyleSheet,
  // FlatList,
  TouchableOpacity,
  // Image,
  NativeEventEmitter,
  Linking,
  Alert,
} from "react-native";
import { vigoStyles } from "../../../../assets/theme";
import Header from "../../../components/Header/Header";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import { useContext, useState } from "react";
import TopupAmountModal from "./TopupAmountModal";
import { UserContext } from "../../../context/UserContext";
import { createTopupTransaction } from "../../../services/paymentService";

import { Text, FlatList, Image, Heading, HStack } from "native-base";
const TopupScreen = () => {
  const { user } = useContext(UserContext);

  const topupMethods = [
    {
      key: "VNPAY",
      title: "Ví VNPay",
      logo: require("../../../../assets/icons/vnpay.png"),
      alt: "Ví VNPay",
    },
  ];

  const [topupAmountModalVisible, setTopupAmountModalVisible] = useState(false);

  const [topUpMethod, setTopUpMethod] = useState(null);

  const handleTopupAmountEnter = async (amount) => {
    // console.log(amount);
    if (amount >= 1000 && topUpMethod) {
      const transactionObj = await createTopupTransaction(
        user.id,
        amount,
        topUpMethod
      );

      const paymentUrl = transactionObj.orderUrl;

      // console.log(paymentUrl);
      const supported = await Linking.canOpenURL(paymentUrl);
      console.log(supported);
      if (supported) {
        await Linking.openURL(paymentUrl);
      } else {
        Alert.alert("Có lỗi xảy ra khi mở trang thanh toán!");
      }
      // console.log(transactionObj);
    }
  };

  const renderTopupMethod = (method) => {
    return (
      <HStack justifyContent={"space-between"} alignItems="center">
        <HStack alignItems="center">
          <Image
            size={"xs"}
            resizeMode="contain"
            alignSeft="center"
            source={method.logo}
            alt={method.alt}
          />
          <Text marginLeft={3}>{method.title}</Text>
        </HStack>
        <ChevronRightIcon size={20} color={"#999"} />
      </HStack>
    );
  };

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Nạp tiền vào ví" />
      </View>
      <View style={vigoStyles.body}>
        {/* <View style={vigoStyles.heading}>
          <Text style={vigoStyles.h1}>Các phương thức nạp tiền</Text>
        </View> */}
        <Heading size={"lg"}>Các phương thức nạp tiền</Heading>

        <FlatList
          style={vigoStyles.list}
          data={topupMethods}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setTopUpMethod(item.key);
                  setTopupAmountModalVisible(true);
                }}
              >
                {renderTopupMethod(item)}
                <Divider style={vigoStyles.listDivider} />
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <TopupAmountModal
        modalVisible={topupAmountModalVisible}
        setModalVisible={setTopupAmountModalVisible}
        onModalRequestClose={() => setTopUpMethod(null)}
        onModalConfirm={handleTopupAmountEnter}
      />
    </SafeAreaView>
  );
};

export default TopupScreen;

const styles = StyleSheet.create({
  paymentMethodContainer: {
    // borderRadius: 20,
    // backgroundColor: "#999",
    width: 40,
    height: 40,
  },
  paymentMethodLogo: {
    resizeMode: "contain",
    alignSelf: "center",
    // height: undefined,
    width: "100%",
    height: "100%",
  },
});
