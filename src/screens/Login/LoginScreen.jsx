import { React, useState, useRef, useContext } from "react";
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
import { themeColors } from "../../../assets/theme";

// IMPORT FIREBASE
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from "../../config/firebase";
import firebase from "firebase/compat/app";
import { UserContext } from "../../context/UserContext";
import { login } from "../../utils/apiManager";
import messaging from "@react-native-firebase/messaging";
import { updateUserFcmToken } from "../../services/userService";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [vertificationId, setVertificationId] = useState(null);
  const { setUser } = useContext(UserContext);
  // const recaptchaVerifier = useRef(null);

  const sendVerification = async () => {
    // const phoneProvider = new firebase.auth.PhoneAuthProvider();
    // phoneProvider
    //   .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
    //   .then(setVertificationId);
    // // .then.navigation.navigate('ConFirmCode');
    await login("phoneNumber", "token").then(async (response) => {
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
      navigation.navigate("Home");
      console.log("response.user", response.user);
    });
  };

  const confirmCode = () => {
    console.log("phoneNumber", phoneNumber);
    const credential = firebase.auth.PhoneAuthProvider.credential(
      vertificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            setCode("");
            user.getIdToken().then((token) => {
              login(phoneNumber, token);
            });
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
    Alert.alert(
      "Đăng nhập thành công! Hãy nhận chuyến xe đầu tiên của bạn nào",
      "",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]
    );
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/ViGo_logo.png")}
        style={styles.image}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.smallText}>Chào mừng bạn đến ViGo</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPhoneNumber}
          placeholder="+84"
          autoCompleteType="tel"
          keyboardType="phone-pad"
          // textContentType='telephoneNumber'
          // onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={true}
        /> */}
        <TextInput
          style={styles.input}
          placeholder="OTP Code"
          onChangeText={setCode}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={sendVerification}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={confirmCode}>
          <Text style={styles.buttonText}>Nhập OTP</Text>
        </TouchableOpacity>
        <Text style={styles.link}>Quên mật khẩu?</Text>

        {/* <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        /> */}

        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.link}>Đăng ký</Text>
          </TouchableOpacity>
        </Text>
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
  },
  smallText: {
    fontSize: 20,
    paddingBottom: 15,
  },
  input: {
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  button: {
    backgroundColor: themeColors.primary,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginBottom: 10,
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
