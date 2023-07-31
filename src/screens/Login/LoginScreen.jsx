import { React, useState, useRef, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// IMPORT THEME
import { themeColors, vigoStyles } from "../../../assets/theme";

// IMPORT FIREBASE
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { auth as vigoAuth, firebaseConfig } from "../../config/firebase";
// import firebase from "firebase/compat/app";
import { UserContext } from "../../context/UserContext";
import { login } from "../../utils/apiManager";
import messaging from "@react-native-firebase/messaging";
import { updateUserFcmToken } from "../../services/userService";
import auth from "@react-native-firebase/auth";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { getString } from "../../utils/storageUtils";
import { determineDefaultScreen } from "../../utils/navigationUtils";
import EnterOtpCodeModal from "../../components/Modal/EnterOtpCodeModal";
// import { getAuth, signInWithPhoneNumber } from "firebase/auth";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [vertificationId, setVertificationId] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [enterOtpModalVisible, setEnterOtpModalVisible] = useState(false);

  // Handle Login by Firebase
  const onAuthStateChanged = (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setCode("");
        // setPhoneNumber(user.phoneNumber);
        setFirebaseToken(token);
        // setFirebaseUid(user.uid);
        // console.log(user.firebaseUid);
        // console.log(user);
        // console.log(token);
        setEnterOtpModalVisible(false);
      });
    }
  };

  useEffect(() => {
    // getString("token").then((result) => console.log(result));
    // console.log(firebaseToken);
    auth().settings.appVerificationDisabledForTesting = true;
    // auth().settings.forceRecaptchaFlowForTesting = true;
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;
    if (user) {
      navigation.navigate(determineDefaultScreen(user));
    }
  }, []);

  const handleLogin = async () => {
    // console.log(firebaseToken);
    setIsLoading(true);
    try {
      login(`+84${phoneNumber}`, firebaseToken).then(async (response) => {
        setUser(response.user);
        console.log("Token " + (await getString("token")));

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

          console.log(response.user);

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await messaging().registerDeviceForRemoteMessages();
            const fcmToken = await messaging().getToken();
            await updateUserFcmToken(response.user.id, fcmToken);
          }

          // Alert.alert(
          //   "Đăng nhập thành công! Hãy nhận chuyến xe đầu tiên của bạn nào",
          //   "",
          //   [
          //     {
          //       text: "OK",
          //       onPress: () => navigation.navigate("PickCus"),
          //     },
          //   ]
          // );

          if (response.user.status == "PENDING") {
            navigation.navigate("NewDriverUpdateProfile");
          } else {
            navigation.navigate("Home");
            navigation.navigate("Home");
          }
        } catch (err) {
          Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
          console.warn(err);
        }
      });
    } catch (err) {
      Alert.alert("Có lỗi xảy ra", "Chi tiết: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firebaseToken) {
      handleLogin();
    }
  }, [firebaseToken]);

  const sendVerification = async () => {
    // const phoneProvider = new firebase.auth.PhoneAuthProvider();
    // phoneProvider
    //   .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
    //   .then(setVertificationId);
    // // .then.navigation.navigate('ConFirmCode');
    // await login("phoneNumber", "token").then(async (response) => {
    //   setUser(response.user);
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    //       {
    //         title: "Cho phép ViGo gửi thông báo đến bạn",
    //         message: `Nhận thông báo về trạng thái giao dịch, nhắc nhở chuyến đi
    //             trong ngày và hơn thế nữa`,
    //         buttonNeutral: "Hỏi lại sau",
    //         buttonNegative: "Từ chối",
    //         buttonPositive: "Đồng ý",
    //       }
    //     );

    //     console.log(granted);

    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       await messaging().registerDeviceForRemoteMessages();
    //       const fcmToken = await messaging().getToken();
    //       await updateUserFcmToken(response.user.id, fcmToken);
    //     }
    //   } catch (err) {
    //     console.warn(err);
    //   }
    //   navigation.navigate("Schedule");
    //   console.log("response.user", response.user);
    // });
    if (phoneNumber) {
      // console.log(phoneNumber);
      setIsLoading(true);
      try {
        // const phoneProvider = new auth.PhoneAuthProvider();
        // phoneProvider.
        const confirmation = await auth().signInWithPhoneNumber(
          `+84${phoneNumber}`
        );
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

  const confirmCode = async () => {
    // console.log("phoneNumber", phoneNumber);
    // const credential = firebase.auth.PhoneAuthProvider.credential(
    //   vertificationId,
    //   code
    // );
    // firebase
    //   .auth()
    //   .signInWithCredential(credential)
    //   .then(() => {
    //     firebase.auth().onAuthStateChanged((user) => {
    //       if (user) {
    //         setCode("");
    //         user.getIdToken().then((token) => {
    //           login(phoneNumber, token);
    //         });
    //       }
    //     });
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
    // Alert.alert(
    //   "Đăng nhập thành công! Hãy nhận chuyến xe đầu tiên của bạn nào",
    //   "",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => navigation.navigate("Schedule"),
    //     },
    //   ]
    // );
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

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ViGoSpinner isLoading={isLoading} />

      <Image
        source={require("../../../assets/images/ViGo_logo.png")}
        style={styles.image}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.smallText}>Chào mừng bạn đến ViGo</Text>
        <View
          style={{
            ...vigoStyles.row,
            ...{
              justifyContent: "flex-start",
              marginBottom: 10,
            },
          }}
        >
          <Text style={{ marginRight: 10 }}>+84</Text>
          <TextInput
            style={{ ...styles.input, ...{ flex: 1 } }}
            onChangeText={setPhoneNumber}
            placeholder="123 456 789"
            autoCompleteType="tel"
            keyboardType="phone-pad"
            // textContentType='telephoneNumber'
            // onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={sendVerification}>
          <Text style={styles.buttonText}>Nhận OTP</Text>
        </TouchableOpacity>
        {/* <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={true}
        /> */}
        {/* <TextInput
          style={styles.input}
          placeholder="OTP Code"
          onChangeText={setCode}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={confirmCode}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity> */}

        <Text style={styles.link}>Quên mật khẩu?</Text>

        {/* <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        /> */}

        <View
          style={{ ...vigoStyles.row, ...{ justifyContent: "flex-start" } }}
        >
          <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <EnterOtpCodeModal
          modalVisible={enterOtpModalVisible}
          setModalVisible={setEnterOtpModalVisible}
          onModalRequestClose={() => {}}
          onModalConfirm={() => confirmCode()}
          phoneNumber={`+84${phoneNumber}`}
          setCode={setCode}
        />
      </View>
    </View>
  );
}

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
  title: {
    textAlign: "left",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  smallText: {
    fontSize: 20,
    paddingBottom: 15,
    color: "black",
  },
  input: {
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 20,
    // marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  button: {
    backgroundColor: themeColors.primary,
    marginTop: 0,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 16,
  },
  link: {
    // textAlign:'center',
    color: themeColors.primary,
    fontSize: 16,
    // textDecorationLine: 'underline',
  },
});
