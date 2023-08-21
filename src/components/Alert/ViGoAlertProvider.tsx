import {
  useToast,
  Alert,
  VStack,
  HStack,
  Text,
  AlertDialog,
  Button,
  IconButton,
  CloseIcon,
  Box,
  Toast,
} from "native-base";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import { eventNames } from "../../utils/alertUtils";
import { NativeEventEmitter, NativeModules } from "react-native";
import { ThemeComponentSizeType } from "native-base/lib/typescript/components/types";

interface ViGoAlertProps {
  title: ReactNode;
  description: ReactNode;
  status: "info" | (string & {}) | "error" | "success" | "warning";
  placement:
    | "bottom-right"
    | "bottom"
    | "top"
    | "top-right"
    | "top-left"
    | "bottom-left";
  isDialog: boolean;
  duration: number;
  avoidKeyboard: boolean;
  primaryButtonText: string;
  displayCloseButton: boolean;
  size: ThemeComponentSizeType<"AlertDialog">;
  // isCancelDisplayed: boolean;
  // cancelButtonText: string;
  // onCancelPress: () => void;
  // isOkDisplayed: boolean;
  // okButtonText: string;
  // onOkPress: () => void;
}

// const emitter = new EventEmitter();

const ViGoAlertProvider = (/*{
  title,
  description,
  status = "info",
  placement = "bottom",
  isDialog = false,
  duration = 5000,
  avoidKeyboard = true,
}: ViGoAlertProps*/) => {
  const [title, setTitle] = useState(null as ReactNode);
  const [description, setDescription] = useState(null as ReactNode);
  const [status, setStatus] = useState(
    "info" as "info" | (string & {}) | "error" | "success" | "warning"
  );
  const [placement, setPlacement] = useState(
    "bottom" as
      | "bottom-right"
      | "bottom"
      | "top"
      | "top-right"
      | "top-left"
      | "bottom-left"
  );
  const [isDialog, setIsDialog] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [avoidKeyboard, setAvoidKeyboard] = useState(true);
  // const [isCancelDisplayed, setIsCancelDisplayed] = useState(true);
  // const [cancelButtonText, setCancelButtonText] = useState("Hủy");
  // const [onCancelPress, setOnCancelPress] = useState(function () {

  // });
  // const [isOkDisplayed, setIsOkDisplayed] = useState(true);
  // const [okButtonText, setOkButtonText] = useState("OK");
  // const [onOkPress, setOnOkPress] = useState(() => {});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [primaryButtonText, setPrimaryButtonText] = useState("Đã hiểu");
  const [displayCloseButton, setDisplayCloseButton] = useState(true);
  const [size, setSize] = useState(
    "md" as ThemeComponentSizeType<"AlertDialog">
  );

  const cancelRef = useRef(null);

  // const toast = useToast();

  const showToast = ({
    title,
    description,
    status = "info",
    placement = "bottom",
    isDialog = false,
    duration = 5000,
    avoidKeyboard = true,
    primaryButtonText = "Đã hiểu",
    displayCloseButton = true,
    size = "md",
  }: //   isCancelDisplayed = true,
  // cancelButtonText = "Hủy",
  // onCancelPress = () => {},
  // isOkDisplayed = true,
  // okButtonText = "OK",
  // onOkPress = () => {}
  ViGoAlertProps) => {
    // console.log("Event Invoked");
    if (!isDialog) {
      // Toast
      Toast.show({
        render: ({ id }) => {
          return (
            <Alert
              alignSelf={"center"}
              flexDirection={"row"}
              status={status}
              variant={"subtle"}
              id={`${id}`}
            >
              <VStack space={1} flexShrink={1}>
                <HStack
                  flexShrink={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      flexShrink={1}
                      color={"darkText"}
                    >
                      {title}
                    </Text>
                  </HStack>
                  {displayCloseButton && (
                    <IconButton
                      variant={"unstyled"}
                      icon={<CloseIcon size="3" />}
                      _icon={{ color: "darkText" }}
                      onPress={() => Toast.close(id)}
                    />
                  )}
                </HStack>
                {description && (
                  <Text px="6" color={"darkText"}>
                    {description}
                  </Text>
                )}
              </VStack>
            </Alert>
          );
        },
        placement: placement,
        duration: duration,
        avoidKeyboard: avoidKeyboard,
      });
      // toast.show({
      //   title: title,
      //   placement: "top-right",
      // });
    } else {
      setTitle(title);
      setDescription(description);
      setStatus(status);
      setIsDialogOpen(true);
      setPrimaryButtonText(primaryButtonText);
      setDisplayCloseButton(displayCloseButton);
      setSize(size);
    }
  };
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();

    let showToastListener = eventEmitter.addListener(
      eventNames.SHOW_TOAST,
      showToast
    );

    return () => {
      showToastListener.remove();
    };
  }, []);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      size={size}
    >
      <AlertDialog.Content>
        {displayCloseButton && <AlertDialog.CloseButton />}
        {title && <AlertDialog.Header>{title}</AlertDialog.Header>}
        <AlertDialog.Body>
          {description}
          <Box alignItems={"flex-end"} marginTop={2}>
            <Button.Group space={2}>
              <Button
                colorScheme={status}
                onPress={() => {
                  setIsDialogOpen(false);
                }}
              >
                {primaryButtonText}
              </Button>
            </Button.Group>
          </Box>
        </AlertDialog.Body>

        {/* <AlertDialog.Footer></AlertDialog.Footer> */}
      </AlertDialog.Content>
    </AlertDialog>
  );
};

// export { ViGoAlertProps };
export default ViGoAlertProvider;
