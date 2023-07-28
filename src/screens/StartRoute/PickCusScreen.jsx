import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../../assets/theme";
// import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import StepIndicator from 'react-native-step-indicator';
import { updateStatusBookingDetail } from "../../services/bookingDetailService";

const data = [
    {
        label: "Bắt đầu chuyến đi",
        status: "Đang đến điểm đón",
        dateTime: new Date(),
    },
    {
        label: "Rước khách thành công",
        status: "Bạn hãy đưa khách đến điểm trả",
        dateTime: new Date(),
    },
    {
        label: "Đang di chuyển",
        status: "Bạn đang đưa khách đến điểm trả",
        dateTime: new Date(),
    },
    {
        label: "Đã đến điểm trả",
        status: "Xác nhận trả khách thành công",
        dateTime: new Date(),
    },
]
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: themeColors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: themeColors.primary,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: themeColors.primary,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: themeColors.primary,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: themeColors.primary,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: themeColors.primary
}

const PickCusScreen = () => {
    const route = useRoute();
    //const { s } = route.params;

    const handlArrivePickUp = async () => {

        try {

            const time = new Date();
            const status = currentPosition === 0 ? "ARRIVE_AT_PICKUP" : currentPosition === 1 ? "GOING_TO_DROPOFF," : " ARRIVE_AT_DROPOFF";
            const requestData = {
                bookingDetailId: "dcb2ae5e-bd5f-4399-86e1-381067157d6f",
                status: status,
                time: time
            };
            await updateStatusBookingDetail("dcb2ae5e-bd5f-4399-86e1-381067157d6f", requestData).then((s) => {
                if (s && s.data) {
                    Alert.alert(
                        "Xác nhận nhận chuyến đi",
                        `Bạn hãy đi đón khách đúng giờ nhé!`,
                        [
                            {
                                text: "OK",
                                onPress: () => setViewVisible(true),
                            },
                        ],
                    );
                } else {
                    Alert.alert("Xác nhận chuyến", "Lỗi: Không bắt đầu được chuyến!");
                }
            });

        } catch (error) {
            console.error("Tài xế bắt đầu chuyến đi", error);
            Alert.alert("Tài xế bắt đầu", "Bắt đầu không thành công");
        }
    };

    const navigation = useNavigation();
    const [stepIndicatorPosition, setStepIndicatorPosition] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const onStepPress = () => {
        console.log(currentPosition);
        if (currentPosition < 3) {
            handlArrivePickUp()
        } else {
            console.log("thành công");
        }
        setCurrentPosition(currentPosition + 1)
    }
    const onBackPress = () => {
        navigation.goBack();
    };

    console.disableYellowBox = true
    return (
        <View style={styles.container}>
            <View style={styles.indicatorContainer}>

                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={currentPosition}
                    labels={data.map(item => item.label)}
                    direction="vertical"
                    renderStep={(position, stepStatus) => {
                        return (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepLabel}>{data[position].label}</Text>
                                <Text style={styles.stepStatus}>{data[position].status}</Text>
                                <Text style={styles.stepDateTime}>{data[position].dateTime.toISOString()}</Text>
                            </View>
                        );
                    }}
                />
                <TouchableOpacity onPress={onStepPress}>
                    {currentPosition === 0 && <Text>Đã rước khách</Text>}
                    {currentPosition === 1 && <Text>Bắt đầu di chuyển</Text>}
                    {currentPosition === 2 && <Text>Đã đến điểm trả</Text>}
                    {currentPosition === 3 && <Text>Hoàn thành</Text>}
                </TouchableOpacity>


            </View >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.linear,
        padding: 20,
    },
    backButton: {
        paddingTop: 10,
        position: "absolute",
        left: 20,
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    stepLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'Black',
    },
    stepStatus: {
        fontSize: 14,
        color: '#666666',
    },
    stepDateTime: {
        fontSize: 12,
        color: '#999999',
    },
    indicatorContainer: {
        height: 500,
        padding: 20,
        margin: 15,
        elevation: 20,
        borderRadius: 20,
        backgroundColor: "white"
    }
});

export default PickCusScreen;
