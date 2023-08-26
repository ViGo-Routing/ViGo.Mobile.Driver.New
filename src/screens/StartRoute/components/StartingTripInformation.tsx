import moment from "moment";
import { Badge, Box, HStack, Text, VStack, View } from "native-base";
import {
  getBookingDetailStatusColor,
  getBookingDetailStatusLongString,
} from "../../../utils/enumUtils/bookingEnumUtils";
import {
  ClockIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import CustomerInformationCard from "../../../components/Card/CustomerInformationCard";
import { TouchableOpacity } from "react-native";
import { themeColors, vigoStyles } from "../../../../assets/theme";
import StepIndicator from "react-native-step-indicator";
import { toVnDateTimeString } from "../../../utils/datetimeUtils";

const renderActionButton = (
  item: any,
  handleActionButtonClick?: () => void
) => {
  const actionButtonText = () => {
    switch (item.status) {
      case "GOING_TO_PICKUP":
        return "Đã đến điểm đón";
      case "ARRIVE_AT_PICKUP":
        return "Đã đón khách";
      case "GOING_TO_DROPOFF":
        return "Đã đến nơi";
      default:
        return "";
    }
  };

  return (
    <HStack justifyContent="flex-end" paddingTop="2">
      <TouchableOpacity
        style={{ ...vigoStyles.buttonPrimary }}
        onPress={() => {
          // openConfirmPicking();
          handleActionButtonClick && handleActionButtonClick();
        }}
      >
        <HStack alignItems="center">
          <PaperAirplaneIcon size={20} color={"white"} />
          <Text marginLeft={2} style={{ ...vigoStyles.buttonPrimaryText }}>
            {actionButtonText()}
          </Text>
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
};

interface StartingTripInformationProps {
  trip: any;
  duration: number;
  distance: number;
  currentStep: number;
  isInFull?: boolean;
  handleActionButtonClick?: () => void;
}

const StartingTripBasicInformation = ({
  trip,
  duration,
  distance,
  currentStep,
  isInFull,
  handleActionButtonClick,
}: StartingTripInformationProps) => {
  const renderInformation = () => {
    let estimatedArriveTime;

    switch (trip.status) {
      case "ASSIGNED":
        return <></>;
      case "GOING_TO_PICKUP":
        estimatedArriveTime = moment()
          .add(duration, "minutes")
          .format("HH:mm")
          .toString();
        return (
          <>
            <HStack>
              <VStack alignItems="center">
                <MapPinIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Địa chỉ</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {`${trip.startStation.name}, ${trip.endStation.address}`}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="center">
              <VStack alignItems="center">
                <ClockIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Thời gian đến (dự kiến)</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {estimatedArriveTime}
                </Text>
              </VStack>
            </HStack>
            {!isInFull && renderActionButton(trip, handleActionButtonClick)}
          </>
        );
      case "ARRIVE_AT_PICKUP":
        return (
          <>
            <HStack>
              <VStack alignItems="center">
                <MapPinIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Địa chỉ</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  width="95%"
                  paddingRight="0.5"
                  maxWidth="95%"
                >
                  {`${trip.startStation.name}, ${trip.startStation.address}`}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="center">
              <VStack alignItems="center">
                <ClockIcon size={24} color="#00A1A1" />
              </VStack>

              <VStack paddingLeft="3">
                <Text bold>Thời gian ghi nhận</Text>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: 15,
                  }}
                  // width="95%"
                  paddingRight="0.5"
                  // maxWidth="95%"
                >
                  {toVnDateTimeString(new Date(trip.arriveAtPickupTime))}
                </Text>
              </VStack>
            </HStack>
            {!isInFull && renderActionButton(trip, handleActionButtonClick)}
          </>
        );
      case "GOING_TO_DROPOFF":
        return <></>;
      case "ARRIVE_AT_DROPOFF":
        return <></>;
      default:
        return <></>;
    }
  };

  return <>{renderInformation()}</>;
};

interface StartingTripFullInformationProps {
  trip: any;
  duration: number;
  distance: number;
  customer: any;
  currentStep: number;
  handleActionButtonClick: () => void;
}

const StartingTripFullInformation = ({
  trip,
  duration,
  distance,
  customer,
  currentStep,
  handleActionButtonClick,
}: StartingTripFullInformationProps) => {
  return (
    <Box>
      <StartingTripBasicInformation
        trip={trip}
        duration={duration}
        distance={distance}
        currentStep={currentStep}
        isInFull={true}
      />
      <HStack mt="3">
        <VStack alignItems="center">
          <MapPinIcon size={24} color="#00A1A1" />
        </VStack>

        <VStack paddingLeft="3">
          <Text bold>Điểm trả khách</Text>
          <Text
            style={{
              paddingBottom: 5,
              fontSize: 15,
            }}
            width="95%"
            paddingRight="0.5"
            maxWidth="95%"
          >
            {`${trip.endStation.name}, ${trip.endStation.address}`}
          </Text>
        </VStack>
      </HStack>
      <Box mt="5">
        <CustomerInformationCard
          customer={customer}
          displayCustomerText
          displayCall
        />
      </Box>
      {renderActionButton(trip, handleActionButtonClick)}
    </Box>
  );
};

export { StartingTripBasicInformation, StartingTripFullInformation };
