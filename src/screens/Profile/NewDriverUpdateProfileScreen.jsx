import { SafeAreaView, View, Image, StyleSheet } from "react-native";
import Header from "../../components/Header/Header";
import { vigoStyles } from "../../../assets/theme";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

const NewDriverUpdateProfileScreen = () => {
  const { user } = useContext(UserContext);

  const [avatarSource, setAvatarSource] = useState(
    user.avatarUrl ?? require("../../../assets/images/no-image.jpg")
  );

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Tạo hồ sơ tài xế" isBackButtonShown={false} />
      </View>
      <View style={vigoStyles.body}>
        <View style={{ alignItems: "center" }}>
          <Image source={avatarSource} style={styles.image} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewDriverUpdateProfileScreen;

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
