import { HStack, Image, Text, VStack } from "native-base";
import { calculateAge } from "../../utils/datetimeUtils";
import { toPercent } from "../../utils/numberUtils";
import { ColorType } from "native-base/lib/typescript/components/types";

interface CustomerInformationCardProps {
  customer: any;
  displayCustomerText: boolean | undefined;
}

const CustomerInformationCard = ({
  customer,
  displayCustomerText = true,
}: CustomerInformationCardProps) => {
  const getCancelRateTextColor = (rate: number): ColorType => {
    if (rate <= 0.25) {
      return "green.500";
    } else if (rate <= 0.5) {
      return "orange.500";
    } else {
      return "red.500";
    }
  };

  return (
    <>
      {customer && (
        <HStack>
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
            {displayCustomerText && (
              <Text>
                Khách hàng <Text bold>{customer.name}</Text>
              </Text>
            )}
            {!displayCustomerText && <Text bold>{customer.name}</Text>}
            <HStack>
              <Text>
                {`${customer.gender == true ? "Nam" : "Nữ"}${
                  customer.dateOfBirth
                    ? ` | ${calculateAge(customer.dateOfBirth)} tuổi`
                    : ""
                }`}
              </Text>
            </HStack>
            <Text>
              Tỉ lệ hủy chuyến:{" "}
              <Text color={getCancelRateTextColor(customer.canceledTripRate)}>
                {toPercent(customer.canceledTripRate)}
              </Text>
            </Text>
          </VStack>
        </HStack>
      )}
    </>
  );
};

export default CustomerInformationCard;
