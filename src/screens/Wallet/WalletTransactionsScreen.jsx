import {
  // FlatList,
  SafeAreaView,
  // Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { getWalletTransactions } from "../../services/walletService";
import {
  renderTransacionType,
  renderTransactionStatus,
  renderTransactionTypeOperator,
} from "../../utils/enumUtils/walletEnumUtils";
import { useNavigation } from "@react-navigation/native";
import Divider from "../../components/Divider/Divider";
import { vndFormat } from "../../utils/numberUtils";
import { Text, FlatList, HStack, Box } from "native-base";

const WalletTransactionsScreen = ({ route }) => {
  const { walletId } = route.params;

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [onScroll, setOnScroll] = useState(false);

  const [walletTransacions, setWalletTransacions] = useState([]);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const pageSize = 10;

  const getTransacions = async (walletId) => {
    try {
      setLoading(true);

      const transactions = await getWalletTransactions(walletId, pageSize, 1);
      // console.log(transactions);
      setWalletTransacions(
        transactions.data.sort((a, b) => b.createdTime - a.createdTime)
      );

      if (transactions.hasNextPage == true) {
        setNextPageNumber(2);
      } else {
        setNextPageNumber(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const loadMoreTransactions = async () => {
    if (!onScroll) {
      return;
    }

    // console.log(nextPageNumber);

    if (nextPageNumber) {
      let moreTransactionsResponse = await getWalletTransactions(
        walletId,
        pageSize,
        nextPageNumber
      );

      const moreTransactions = [
        ...moreTransactionsResponse.data,
        ...walletTransacions,
      ].sort((a, b) => b.createdTime - a.createdTime);

      setWalletTransacions(moreTransactions);

      if (moreTransactionsResponse.hasNextPage == true) {
        setNextPageNumber(nextPageNumber + 1);
      } else {
        setNextPageNumber(null);
      }
    }
  };

  const renderTransactionListItem = (transaction) => {
    return (
      <HStack>
        <Box width={"10%"}>
          {renderTransactionStatus(transaction.status, "list")}
        </Box>
        <Box width={"60%"}>{renderTransacionType(transaction, "list")}</Box>
        <Box width={"30%"} paddingLeft={5}>
          <Text style={{ fontSize: 16 }}>
            {`${renderTransactionTypeOperator(transaction.type)}${vndFormat(
              transaction.amount
            )}`}
          </Text>
        </Box>
      </HStack>
    );
  };

  useEffect(() => {
    getTransacions(walletId);
  }, []);

  navigation.addListener("focus", () => {
    getTransacions(walletId);
  });

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Lịch sử giao dịch" />
      </View>

      <View style={vigoStyles.body}>
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
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={<Divider style={vigoStyles.listDivider} />}
          ListEmptyComponent={<Text>Chưa có giao dịch nào!</Text>}
          refreshing={loading}
          onRefresh={() => getTransacions(walletId)}
          onEndReached={loadMoreTransactions}
          onScroll={() => {
            setOnScroll(true);
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
};

export default WalletTransactionsScreen;
