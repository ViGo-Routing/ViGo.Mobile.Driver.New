import { useContext, useState } from "react";
import { Box, Center, HStack, Image, Text, VStack } from "native-base";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Animated, View } from "react-native";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  ListBulletIcon,
  MapIcon,
  MapPinIcon,
  MinusIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import { ClockIcon as ClockOutlineIcon } from "react-native-heroicons/outline";
import { themeColors, vigoStyles } from "../../../assets/theme";
import {
  calculateAge,
  toVnDateString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { pickBookingDetailById } from "../../services/bookingDetailService";
import { toPercent, vndFormat } from "../../utils/numberUtils";
import { UserContext } from "../../context/UserContext";
import ConfirmAlert from "../../components/Alert/ConfirmAlert";

const PickBookingDetailConfirmAlert = ({
  item,
  pickingFee,
  handleOkPress,
  confirmOpen,
  setConfirmOpen,
  // key,
}) => {
  const description = () => {
    return (
      <VStack>
        <Text>
          Với việc nhận chuyến xe, bạn sẽ phải trả trước một khoản phí nhận
          chuyến.
        </Text>
        <Text>
          Sau khi hoàn thành chuyến đi, bạn sẽ được trả toàn bộ số tiền của
          chuyến đi.
        </Text>
        <Text marginTop="2">
          Phí nhận chuyến: <Text bold>{vndFormat(pickingFee)}</Text>
        </Text>
      </VStack>
    );
  };

  return (
    <ConfirmAlert
      title="Nhận chuyến xe"
      description={description()}
      okButtonText="Xác nhận"
      cancelButtonText="Hủy"
      onOkPress={() => handleOkPress()}
      isOpen={confirmOpen}
      setIsOpen={setConfirmOpen}
      key={`confirm-booking-detail-alert`}
    />
  );
};

const BookingDetailPanel = ({
  item,
  handlePickBooking,
  customer,
  navigation,
  // toggleBottomSheet,
  duration,
  distance,
}) => {
  const { user } = useContext(UserContext);
  const translateY = new Animated.Value(300);
  // const [pan, setPat] = useState(new Animated.ValueXY({ x: 0, y: 400 }));
  // const [isOpen, setIsOpen] = useState(false);

  // const panResponder = PanResponder.create({
  //   onMoveShouldSetPanResponder: () => true,
  //   onPanResponderMove: Animated.event(
  //     [
  //       null,
  //       {
  //         dy: pan.y,
  //       },
  //     ],
  //     {
  //       useNativeDriver: false,
  //     }
  //   ),
  //   onPanResponderRelease: (e, gestureState) => {
  //     if (gestureState.dy > 0 && gestureState.vy > 0.7) {
  //       // Swipe down
  //       closePanel();
  //     } else if (gestureState.dy < 0 && gestureState.vy < -0.7) {
  //       // Swipe up
  //       openPanel();
  //     }
  //     // } else {
  //     //   // Reset position
  //     //   resetPanelPosition();
  //     // }
  //   },
  // });

  // const openPanel = () => {
  //   Animated.spring(pan, {
  //     toValue: {
  //       x: 0,
  //       y: 400,
  //     },
  //     useNativeDriver: false,
  //   }).start();
  //   setIsOpen(true);
  // };

  // const closePanel = () => {
  //   Animated.spring(pan, {
  //     toValue: { x: 0, y: 0 },
  //     useNativeDriver: false,
  //   }).start();
  //   setIsOpen(false);
  // };

  // const resetPanelPosition = () => {
  //   Animated.spring(pan, {
  //     toValue: { x: 0, y: 400 },
  //     useNativeDriver: false,
  //   }).start();
  // };

  return (
    <Box>
      <HStack alignItems="center" justifyContent="space-between">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center" justifyContent="center">
              <CalendarDaysIcon size={25} color="#00A1A1" />
            </VStack>
            <VStack paddingLeft="3">
              <Text style={styles.title}>Ngày đón</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 1,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {toVnDateString(item.customerRouteRoutine.routineDate)}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center" justifyContent="center">
              {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
              <ClockIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Giờ đón</Text>

              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {toVnTimeString(item.customerRouteRoutine.pickupTime)}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>

      <HStack alignItems="center">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center">
              <MapPinIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Điểm đón</Text>

              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                isTruncated
              >
                {`${item.startStation.name}, ${item.startStation.address}`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
      <HStack alignItems="center" width="100%">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center">
              <MapPinIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Điểm đến</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                isTruncated
              >
                {`${item.endStation.name}, ${item.endStation.address}`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>

      <HStack alignItems="center">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center">
              <MapIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Khoảng cách</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                isTruncated
              >
                {`${distance.toFixed(2)} km`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
      <HStack alignItems="center">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center">
              <ClockOutlineIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Thời gian di chuyển (dự kiến)</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                isTruncated
              >
                {`${Math.ceil(duration)} phút`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>

      <HStack marginTop={5}>
        <Image
          source={
            customer.avatarUrl
              ? { uri: customer.avatarUrl }
              : require("../../../assets/images/no-image.jpg")
          }
          // style={styles.image}
          alt="Ảnh đại diện"
          size={60}
          borderRadius={100}
        />
        <VStack paddingLeft={5}>
          <Text>
            Khách hàng <Text bold>{customer.name}</Text>
          </Text>
          <HStack>
            <Text>
              {`${customer.gender == true ? "Nam" : "Nữ"}${
                customer.dateOfBirth
                  ? ` | ${calculateAge(customer.dateOfBirth)} tuổi`
                  : ""
              }`}
            </Text>
          </HStack>
          <Text>Tỉ lệ hủy chuyến: {toPercent(customer.canceledTripRate)}</Text>
        </VStack>
      </HStack>
      <HStack justifyContent="flex-end" marginTop="3">
        <Box backgroundColor={themeColors.linear} p="4" rounded="xl">
          <Text fontSize="2xl" style={styles.titlePrice}>
            {vndFormat(item.price)}
          </Text>
        </Box>
      </HStack>
      {/* <Box p="4" rounded="xl">
        <Text bold fontSize="2xl" textAlign="right" color={themeColors.primary}>
          {vndFormat(item.price)}
        </Text>
      </Box> */}

      <HStack>
        <View
          style={[
            styles.cardInsideLocation,
            {
              backgroundColor: themeColors.primary,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            },
            vigoStyles.buttonWhite,
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HStack alignItems="center">
              <ArrowLeftIcon size={20} color={themeColors.primary} />
              <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                Quay lại
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.cardInsideLocation,
            {
              backgroundColor: themeColors.primary,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => handlePickBooking()}
          >
            <HStack alignItems="center">
              <PaperAirplaneIcon size={20} color={"white"} />
              <Text
                marginLeft={2}
                style={{ color: "white", fontWeight: "bold" }}
              >
                Nhận chuyến
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </HStack>
    </Box>
  );
};

const BookingDetailSmallPanel = ({ item, handlePickBooking, navigation }) => {
  const { user } = useContext(UserContext);
  // console.log(item);
  return (
    <Box>
      <HStack alignItems="center" justifyContent="space-between">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center" justifyContent="center">
              <CalendarDaysIcon size={25} color="#00A1A1" />
            </VStack>
            <VStack paddingLeft="3">
              <Text style={styles.title}>Ngày đón</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 1,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {toVnDateString(item.customerRouteRoutine.routineDate)}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center" justifyContent="center">
              {/* <Ionicons name="time-outline" size={25} color="#00A1A1" /> */}
              <ClockIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Giờ đón</Text>

              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {toVnTimeString(item.customerRouteRoutine.pickupTime)}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>

      <HStack alignItems="center">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center">
              <MapPinIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Điểm đón</Text>

              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                maxWidth="100%"
                paddingRight="0.5"
                isTruncated
              >
                {`${item.startStation.name}, ${item.startStation.address}`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
      <HStack alignItems="center" width="100%">
        <Box>
          <HStack alignItems="center">
            <VStack alignItems="center">
              <MapPinIcon size={25} color="#00A1A1" />
            </VStack>

            <VStack paddingLeft="3">
              <Text style={styles.title}>Điểm đến</Text>
              <Text
                style={{
                  // paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 15,
                }}
                width="100%"
                paddingRight="0.5"
                maxWidth="100%"
                isTruncated
              >
                {`${item.endStation.name}, ${item.endStation.address}`}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>

      <HStack>
        <View
          style={[
            styles.cardInsideLocation,
            {
              backgroundColor: themeColors.primary,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            },
            vigoStyles.buttonWhite,
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HStack alignItems="center">
              <ArrowLeftIcon size={20} color={themeColors.primary} />
              <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                Quay lại
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.cardInsideLocation,
            {
              backgroundColor: themeColors.primary,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => handlePickBooking()}
          >
            <HStack alignItems="center">
              <PaperAirplaneIcon size={20} color={"white"} />
              <Text
                marginLeft={2}
                style={{ color: "white", fontWeight: "bold" }}
              >
                Nhận chuyến
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </HStack>
    </Box>
  );
};
const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 20,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    margin: 5,
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    // paddingLeft: 10,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
  titlePrice: {
    // fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export { BookingDetailSmallPanel, PickBookingDetailConfirmAlert };
export default BookingDetailPanel;
