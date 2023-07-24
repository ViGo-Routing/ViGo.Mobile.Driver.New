import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

import { vndFormat } from "../../utils/numberUtils";
import Divider from "../../components/Divider/Divider";
import { ArrowRightCircleIcon } from "react-native-heroicons/outline";
// import {
//   CheckCircleIcon,
//   ClockIcon,
//   ExclamationCircleIcon,
// } from "react-native-heroicons/solid";
import {
  renderTransacionType,
  // renderTransacionType,
  renderTransactionListItem,
  renderTransactionStatus,
  renderTransactionTypeOperator,
  // renderTransactionStatus,
} from "../../utils/enumUtils/walletEnumUtils";
import { PlusCircleIcon, PlusSmallIcon } from "react-native-heroicons/solid";
import {
  getWalletByUserId,
  getWalletTransactions,
} from "../../services/walletService";
import { useNavigation } from "@react-navigation/native";

const WalletScreen = () => {
  const navigation = useNavigation();
  const [walletBalance, setWalletBalance] = useState(0);
  const [wallet, setWallet] = useState(null);

  const [walletTransacions, setWalletTransacions] = useState([]);

  const { user } = useContext(UserContext);

  const getWallet = async () => {
    // console.log(user);
    const userWallet = await getWalletByUserId(user.id);
    // console.log(wallet);
    setWallet(userWallet);
    setWalletBalance(userWallet.balance);

    // console.log(wallet);
    await getTransacions(userWallet.id);
  };

  const getTransacions = async (walletId) => {
    const transactions = await getWalletTransactions(walletId, 3, 1);
    // console.log(transactions);
    setWalletTransacions(
      transactions.data.sort((a, b) => b.createdTime - a.createdTime)
    );
  };

  const renderTransactionListItem = (transaction) => {
    return (
      <View style={vigoStyles.row}>
        <View style={{ ...vigoStyles.column, width: "10%" }}>
          {renderTransactionStatus(transaction.status, "list")}
        </View>
        <View style={{ ...vigoStyles.column, width: "60%" }}>
          {renderTransacionType(transaction, "list")}
        </View>
        <View style={{ ...vigoStyles.column, width: "30%", paddingLeft: 10 }}>
          <Text style={{ fontSize: 16 }}>
            {`${renderTransactionTypeOperator(transaction.type)}${vndFormat(
              transaction.amount
            )}`}
          </Text>
        </View>
      </View>
    );
  };

  // useEffect(() => {
  //   getWallet();
  // }, []);

  navigation.addListener("focus", () => {
    getWallet();
  });

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Ví của tôi" />
      </View>

      {/* <ScrollView style={vigoStyles.body}> */}
      <View style={vigoStyles.body}>
        <View style={styles.balanceContainer}>
          <View style={vigoStyles.textContainer}>
            <Text style={styles.balance}>
              Số dư: {vndFormat(walletBalance)}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row-reverse", marginTop: 10 }}>
          <TouchableOpacity
            style={vigoStyles.buttonWhite}
            onPress={() => navigation.navigate("Topup")}
          >
            <View style={{ ...vigoStyles.row, marginTop: 0 }}>
              <PlusCircleIcon
                style={{ ...vigoStyles.buttonWhiteText, marginRight: 5 }}
                size={15}
              />
              <Text style={vigoStyles.buttonWhiteText}>Nạp tiền</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Divider style={vigoStyles.sectionDivider} />

        <View>
          <View style={vigoStyles.heading}>
            <Text style={vigoStyles.h1}>Lịch sử giao dịch</Text>
            {/* <EvilIcons name="arrow-right" size={30} color="black" /> */}
            <Pressable
              onPress={() =>
                navigation.navigate("WalletTransactions", {
                  walletId: wallet.id,
                })
              }
            >
              <ArrowRightCircleIcon size={30} color="black" />
            </Pressable>
          </View>
          <FlatList
            style={vigoStyles.list}
            data={walletTransacions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("WalletTransactionDetail", {
                      walletTransactionId: item.id,
                    })
                  }
                >
                  {renderTransactionListItem(item)}
                  <Divider style={vigoStyles.listDivider} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: themeColors.linear,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  balance: {
    fontSize: 18,
    fontWeight: "bold",
  },

  transactionNameListItem: {
    fontSize: 16,
  },
  transactionSubtitle: {
    // marginLeft: 10,
    fontSize: 14,
    color: "#999",
  },
});

export default WalletScreen;
