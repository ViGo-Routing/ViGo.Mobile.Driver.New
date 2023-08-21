import { useContext, useState } from "react";
import {
  Badge,
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
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
import {
  TripBasicInformation,
  TripFullInformation,
} from "../../components/TripInformation/TripInformation";

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
  handlePickBooking = undefined,
  customer,
  navigation,
  // toggleBottomSheet,
  duration,
  distance,
  displayButtons = true,
}) => {
  const { user } = useContext(UserContext);
  // const translateY = new Animated.Value(300);
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
      <TripFullInformation
        item={item}
        distance={distance}
        duration={duration}
        customer={customer}
      />
      {displayButtons && (
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
      )}
    </Box>
  );
};

const BookingDetailSmallPanel = ({ item, handlePickBooking, navigation }) => {
  const { user } = useContext(UserContext);
  // console.log(item);
  return (
    <Box>
      <TripBasicInformation item={item} />
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
