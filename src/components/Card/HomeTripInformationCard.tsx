import { Badge, Box, HStack, Text, VStack } from "native-base";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { ForwardIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";
import {
  getBookingDetailStatusColor,
  getBookingDetailStatusString,
} from "../../utils/enumUtils/bookingEnumUtils";
import { NavigationProp } from "@react-navigation/native";

interface HomeTripInformationCardInterface {
  currentTrip: any;
  upcomingTrip: any;
  navigation: any;
}
const HomeTripInformationCard = ({
  currentTrip,
  upcomingTrip,
  navigation,
}: HomeTripInformationCardInterface) => {
  const getCurrentTripStatusSubtitle = (status: string, bookingDetail: any) => {
    switch (status) {
      case "GOING_TO_PICKUP":
        return `Giờ đón khách: ${toVnTimeString(
          upcomingTrip.customerDesiredPickupTime
        )}`;
      // break;
      case "ARRIVE_AT_PICKUP":
        return ``;
      // break;
      case "GOING_TO_DROPOFF":
        return ``;
      // break;
      case "ARRIVE_AT_DROPOFF":
        return ``;
      // break;
    }
  };
  // console.log(currentTrip);
  // console.log(upcomingTrip);
  return (
    // <Box justifyContent="flex-end">
    <Box
      backgroundColor="white"
      position={"absolute"}
      mx="3"
      rounded={"sm"}
      px="2"
      style={{ bottom: 65 }}
      shadow="5"
      // width="full"
      width="90%"
      alignSelf="center"
    >
      {currentTrip && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CurrentStartingTrip", {
              bookingDetailId: currentTrip.id,
            })
          }
        >
          <VStack>
            <Text
              opacity={0.5}
              color={getBookingDetailStatusColor(currentTrip.status)}
            >
              {getBookingDetailStatusString(currentTrip.status)}
            </Text>
            <Text fontSize={18} bold isTruncated>
              {currentTrip.startStation.name} - {currentTrip.endStation.name}
            </Text>
            <Text>
              {getCurrentTripStatusSubtitle(currentTrip.status, currentTrip)}
            </Text>
          </VStack>
        </TouchableOpacity>
      )}
      {upcomingTrip && !currentTrip && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("StartRoute", { item: upcomingTrip })
          }
        >
          <VStack>
            <Text opacity={0.5}>Sắp tới</Text>
            <Text fontSize={18} bold isTruncated width="95%">
              {upcomingTrip.startStation.name} - {upcomingTrip.endStation.name}
            </Text>
            <HStack justifyContent="space-between" width="95%">
              <Text>
                Giờ đón khách:{" "}
                {toVnTimeString(upcomingTrip.customerDesiredPickupTime)}
              </Text>
              <Text>{toVnDateString(upcomingTrip.date)}</Text>
            </HStack>
          </VStack>
        </TouchableOpacity>
      )}
      {/* <Badge
          colorScheme="green"
          rounded="full"
          // mb={-4}
          // mr={-4}
          zIndex={2}
          variant={"solid"}
          // alignSelf={"flex-end"}
          position={"absolute"}
          right={0}
          top={-10}
          // px={2}
        >
          <Text px={1}></Text>
          <ForwardIcon color="white" size={20} />
        </Badge> */}
    </Box>
    // </Box>
  );
};

export default HomeTripInformationCard;
