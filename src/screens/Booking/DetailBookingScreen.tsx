import { useState, useContext, useEffect } from "react";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors, vigoStyles } from "../../../assets/theme";
import {
  Box,
  Center,
  Checkbox,
  HStack,
  Heading,
  Text,
  VStack,
  View,
} from "native-base";
import Header from "../../components/Header/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getErrorMessage, handleError } from "../../utils/alertUtils";
import { getBooking } from "../../services/bookingService";
import { getAvailableBookingDetailsByBooking } from "../../services/bookingDetailService";
import { UserContext } from "../../context/UserContext";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import RefreshableScrollView from "../../components/List/RefreshableScrollView";
import CustomerInformationCard from "../../components/Card/CustomerInformationCard";
import {
  ArrowLongRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import Divider from "../../components/Divider/Divider";
import { vndFormat } from "../../utils/numberUtils";
import {
  getDayOfWeek,
  toVnDateString,
  toVnTimeString,
} from "../../utils/datetimeUtils";

const DetailBookingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const route = useRoute();
  const { bookingId } = route.params as any;
  // console.log(bookingId);
  const { user } = useContext(UserContext);

  const navigation = useNavigation() as any;

  const [booking, setBooking] = useState(null as any);
  const [availableDetails, setAvailableDetails] = useState([]);
  const [customer, setCustomer] = useState(null as any);

  const [selectedDetails, setSelectedDetails] = useState([]);

  const fetchBookingData = async () => {
    setIsLoading(true);
    try {
      const bookingResponse = await getBooking(bookingId);
      setBooking(bookingResponse);
      setCustomer(bookingResponse.customer);

      const detailsResponse = await getAvailableBookingDetailsByBooking(
        user.id,
        bookingId,
        -1,
        1
      );
      setAvailableDetails(detailsResponse.data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const renderDetailCard = (item: any) => {
    return (
      // <HStack alignItems="center" w="100" key={item.id}>
      <Checkbox
        // alignSelf="stretch"
        marginRight={2}
        aria-label="Chọn chuyến đi"
        value={item.id}
        key={item.id}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("BookingDetail", { item })}
        >
          <HStack
            justifyContent="space-between"
            style={[styles.cardInsideDateTime]}
            py={2}
            alignItems="center"
            // flex={"0"}
            // width="100%"
            alignSelf="stretch"
          >
            <HStack>
              <VStack>
                <HStack alignItems="center">
                  <ClockIcon size={20} color="#00A1A1" />
                  <Text marginLeft={2} bold color="gray.500">
                    Giờ đón
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <CalendarIcon size={20} color="#00A1A1" />
                  <Text marginLeft={2} bold color="gray.500">
                    Ngày đón
                  </Text>
                </HStack>
              </VStack>
              <VStack marginRight={2} marginLeft={2}>
                <Text bold color="black">
                  {toVnTimeString(item.customerDesiredPickupTime)}
                </Text>

                <Text bold color="black">
                  {`${getDayOfWeek(item.date)}, ${toVnDateString(item.date)}`}
                </Text>
              </VStack>
            </HStack>
            <Box
              // alignSelf="flex-end"
              backgroundColor={themeColors.linear}
              p="4"
              rounded="xl"
            >
              <Text style={styles.titlePrice}>{vndFormat(item.price)}</Text>
            </Box>
          </HStack>
        </TouchableOpacity>
      </Checkbox>
      // </HStack>
    );
  };

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Chi tiết hành trình" />

      <View style={vigoStyles.body}>
        {/* <ViGoSpinner isLoading={isLoading} /> */}
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <RefreshableScrollView
            refreshing={isLoading}
            onRefresh={fetchBookingData}
          >
            {booking && (
              <VStack>
                <Box
                  rounded="full"
                  bgColor={"white"}
                  borderColor="coolGray.200"
                  borderWidth="1"
                  // p={5}
                  px={5}
                  py={3}
                  mt={2}
                  mx={0.5}
                  borderRadius={20}
                  shadow={3}
                >
                  <HStack alignItems="center">
                    <VStack alignSelf="center">
                      <MapPinIcon size={25} color="#00A1A1" />
                    </VStack>

                    <VStack
                      // alignItems="center"
                      // justifyContent="center"
                      marginLeft="3"
                    >
                      <Text fontSize="sm" color={themeColors.primary} bold>
                        Điểm đón
                      </Text>

                      <Text
                        style={{
                          // paddingLeft: 5,
                          paddingBottom: 5,
                          fontSize: 15,
                        }}
                        bold
                        isTruncated
                        // width={"50%"}
                        // width="95%"
                      >
                        {`${booking.customerRoute.startStation.name}`}
                      </Text>
                    </VStack>
                  </HStack>
                  <Divider style={{}} />
                  <HStack marginTop="2" alignItems="center">
                    <VStack alignSelf="center">
                      <MapPinIcon size={25} color="#00A1A1" />
                    </VStack>

                    <VStack
                      // alignItems="center"
                      // justifyContent="center"
                      marginLeft="3"
                    >
                      <Text fontSize="sm" color={themeColors.primary} bold>
                        Điểm đến
                      </Text>

                      <Text
                        style={{
                          // paddingLeft: 5,
                          paddingBottom: 5,
                          fontSize: 15,
                        }}
                        bold
                        isTruncated
                        // width={"50%"}
                      >
                        {`${booking.customerRoute.endStation.name}`}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box marginTop="6">
                  <Heading fontSize="2xl" marginLeft="0">
                    Khách hàng
                  </Heading>
                  <Box
                    rounded="full"
                    bgColor={"white"}
                    borderColor="coolGray.200"
                    borderWidth="1"
                    // p={5}
                    px={5}
                    py={3}
                    mt={2}
                    borderRadius={20}
                    mx={0.5}
                    shadow={3}
                  >
                    <CustomerInformationCard
                      displayCustomerText={false}
                      customer={customer}
                    />
                  </Box>
                </Box>
                <Box marginTop="6">
                  <Heading fontSize="2xl" marginLeft="0">
                    Các chuyến đi còn trống
                  </Heading>
                  <Box
                    borderWidth="1"
                    borderColor={themeColors.primary}
                    p={2}
                    mt={2}
                    borderRadius={10}
                    alignSelf={"flex-end"}
                    mx={0.5}
                  >
                    <HStack>
                      <HStack alignItems="center">
                        <ArrowLongRightIcon size={25} color="black" />
                        <Text p={1} bold>
                          Một chiều
                        </Text>
                      </HStack>
                      <HStack marginLeft="5" alignItems="center">
                        <CalendarDaysIcon size={25} color="black" />
                        <Text p={1} bold>
                          Theo tháng
                        </Text>
                      </HStack>
                    </HStack>
                  </Box>

                  <HStack mx={0.5} marginTop="2" justifyContent="space-between">
                    <Checkbox
                      // alignSelf="stretch"
                      marginRight={2}
                      aria-label="Chọn chuyến đi"
                      value={"All"}
                      key={"select-all"}
                    >
                      Chọn tất cả
                    </Checkbox>
                    <Text>{`Đã chọn ${selectedDetails.length}/${availableDetails.length}`}</Text>
                  </HStack>
                  <Box mx={0.5}>
                    <Checkbox.Group
                      onChange={(values) => setSelectedDetails(values)}
                      value={selectedDetails}
                      accessibilityLabel="Chọn chuyến đi"
                    >
                      {availableDetails.map((item) => (
                        <>{renderDetailCard(item)}</>
                      ))}
                    </Checkbox.Group>
                  </Box>
                </Box>
              </VStack>
            )}
          </RefreshableScrollView>
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // card: {
  //   flexGrow: 1,
  //   backgroundColor: "white",
  //   borderRadius: 8,
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   width: "100%",
  //   marginVertical: 10,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  // container: {
  //   flexDirection: "column", // inner items will be added vertically
  //   flexGrow: 1, // all the available vertical space will be occupied by it
  //   justifyContent: "space-between", // will create the gutter between body and footer
  // },
  cardInsideDateTime: {
    // flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    // width: "100%",
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    // flexDirection: "row",
    // margin: 5,
  },
  // cardInsideLocation: {
  //   flexGrow: 1,
  //   backgroundColor: "white",
  //   borderRadius: 8,

  //   paddingHorizontal: 20,
  //   width: "40%",
  //   marginVertical: 10,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,

  //   margin: 5,
  // },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    paddingLeft: 10,
  },
  // list: {
  //   paddingTop: 10,
  //   fontSize: 20,
  // },
  titlePrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export default DetailBookingScreen;
