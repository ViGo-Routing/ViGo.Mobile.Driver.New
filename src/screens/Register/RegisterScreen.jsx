import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { themeColors, vigoStyles } from "../../../assets/theme";
import Header from "../../components/Header/Header";
import { useNavigation } from "@react-navigation/native";
import EnterOtpCodeModal from "../../components/Modal/EnterOtpCodeModal";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import auth from "@react-native-firebase/auth";

import { login, register } from "../../utils/apiManager";
import { UserContext } from "../../context/UserContext";
import { updateUserFcmToken } from "../../services/userService";
import messaging from "@react-native-firebase/messaging";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [enterOtpModalVisible, setEnterOtpModalVisible] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState("");

  const [firebaseToken, setFirebaseToken] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);

  const [name, setName] = useState("");
  const { setUser } = useContext(UserContext);

  // Handle Login by Firebase
  const onAuthStateChanged = (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setCode("");
        // setPhoneNumber(user.phoneNumber);
        setFirebaseToken(token);
        setEnterOtpModalVisible(false);
        setFirebaseUid(user.uid);
        // console.log(user.firebaseUid);
        // console.log(user);
        // console.log(token);
      });
    }
  };

  useEffect(() => {
    // console.log(firebaseToken);
    auth().settings.appVerificationDisabledForTesting = true;
    // auth().settings.forceRecaptchaFlowForTesting = true;
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;
  }, []);

  // Handle Send OTP
  const sendOtp = async () => {
    if (phoneNumber) {
      setIsLoading(true);
      try {
        // const phoneProvider = new auth.PhoneAuthProvider();
        // phoneProvider.
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);

        setEnterOtpModalVisible(true);
      } catch (err) {
        console.error(err);
        Alert.alert("Có lỗi xảy ra khi gửi mã OTP", "Chi tiết: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const otpConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await confirm.confirm(code);
      console.log(result);
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code
      );

      auth()
        .signInWithCredential(credential)
        .then(() => {
          // console.log(user);
          auth().onAuthStateChanged(onAuthStateChanged);
        });

      // let userData = await auth().currentUser.linkWithCredential(credential);
      // console.log(userData);
    } catch (err) {
      if (err.code == "auth/invalid-verification-code") {
        Alert.alert("Mã OTP không chính xác", "Vui lòng kiểm tra lại mã OTP!");
      } else {
        Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderAfterOtpConfirm = () => {
    if (firebaseToken) {
      return (
        <View>
          <Text>Họ và tên</Text>
          <View
            style={{
              ...vigoStyles.row,
              ...{
                justifyContent: "center",
                marginBottom: 10,
              },
            }}
          >
            <TextInput
              style={{ ...styles.input, ...{ flex: 1 } }}
              onChangeText={setName}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              keyboardType="default"
              textContentType="name"
            />
          </View>
        </View>
      );
    } else {
      return <></>;
    }
  };

  const onRegister = async () => {
    setIsLoading(true);
    try {
      const newUserData = await register(name, phoneNumber, firebaseUid);
      if (newUserData) {
        Alert.alert(
          "Đăng ký tài khoản thành công!",
          "Hãy tiến hành cập nhật hồ sơ để có thể sử dụng ViGo bạn nhé"
        );

        login(phoneNumber, firebaseToken).then(async (response) => {
          setUser(response.user);
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                title: "Cho phép ViGo gửi thông báo đến bạn",
                message: `Nhận thông báo về trạng thái giao dịch, nhắc nhở chuyến đi 
                    trong ngày và hơn thế nữa`,
                buttonNeutral: "Hỏi lại sau",
                buttonNegative: "Từ chối",
                buttonPositive: "Đồng ý",
              }
            );

            console.log(granted);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              await messaging().registerDeviceForRemoteMessages();
              const fcmToken = await messaging().getToken();
              await updateUserFcmToken(response.user.id, fcmToken);
            }
          } catch (err) {
            console.warn(err);
          }

          if (response.user.status == "PENDING") {
            navigation.navigate("NewDriverUpdateProfile");
          } else {
            navigation.navigate("Schedule");
          }
        });
      }
      // console.log(newUserData);
    } catch (err) {
      Alert.alert("Có lỗi xảy ra khi đăng ký", "Chi tiết: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ ...vigoStyles.container, ...styles.container }}>
      <ViGoSpinner isLoading={isLoading} />
      <Image
        source={require("../../../assets/images/ViGo_logo.png")}
        style={styles.image}
      />
      <View style={styles.card}>
        <Text style={{ ...vigoStyles.title, ...{ color: "black" } }}>
          Đăng ký
        </Text>
        <Text style={{ ...vigoStyles.smallText, ...{ color: "black" } }}>
          Trở thành tài xế ViGo ngay hôm nay!
        </Text>

        <Text>Số điện thoại</Text>
        <View
          style={{
            ...vigoStyles.row,
            ...{
              justifyContent: "center",
              marginBottom: 10,
            },
          }}
        >
          <TextInput
            style={{ ...styles.input, ...{ flex: 1 } }}
            onChangeText={setPhoneNumber}
            editable={firebaseToken ? false : true}
            placeholder="+84 123 456 789"
            autoComplete="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            // onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View>
        {renderAfterOtpConfirm()}

        {/* <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={true}
        /> */}
        {/* <TextInput
          style={styles.input}
          placeholder="OTP Code"
          // onChangeText={setCode}
          keyboardType="phone-pad"
        /> */}
        <TouchableOpacity
          style={vigoStyles.buttonPrimary}
          onPress={() => (firebaseToken ? onRegister() : sendOtp())}
        >
          <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
        </TouchableOpacity>

        <View
          style={{ ...vigoStyles.row, ...{ justifyContent: "flex-start" } }}
        >
          <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={vigoStyles.link}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <EnterOtpCodeModal
        modalVisible={enterOtpModalVisible}
        setModalVisible={setEnterOtpModalVisible}
        onModalRequestClose={() => {}}
        onModalConfirm={() => otpConfirm()}
        phoneNumber={phoneNumber}
        setCode={setCode}
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.linear,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 80,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    marginTop: 40,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 20,
    // marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  loginText: {
    fontSize: 16,
  },
});
