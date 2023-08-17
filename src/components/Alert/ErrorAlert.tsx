import { Alert, Box, Center, Text, VStack } from "native-base";
import { PropsWithChildren } from "react";

interface ErrorAlertProps {
  isError: boolean;
  errorMessage: string;
}

const ErrorAlert = ({
  isError,
  errorMessage,
  children,
}: PropsWithChildren<ErrorAlertProps>) => {
  return (
    <Box marginTop="2">
      {isError && (
        <Center marginBottom={"2"}>
          {/* <Text>Hồ sơ của bạn đã được gửi đến ViGo!</Text> */}
          <Alert status="error" colorScheme={"error"}>
            <VStack space={1} flexShrink={1} w="100%" alignItems="center">
              <Alert.Icon size="md" />
              <Text
                fontSize="md"
                fontWeight="medium"
                _dark={{
                  color: "coolGray.800",
                }}
              >
                Không thể truy vấn thông tin
              </Text>

              <Box
                _text={{
                  textAlign: "center",
                }}
                _dark={{
                  _text: {
                    color: "coolGray.600",
                  },
                }}
              >
                <Text>{errorMessage}</Text>
              </Box>
            </VStack>
          </Alert>
        </Center>
      )}
      {!isError && <>{children}</>}
    </Box>
  );
};

export default ErrorAlert;
