import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { vigoStyles } from "../../../../assets/theme";
import { useState } from "react";
import { vndFormat } from "../../../utils/numberUtils";

const TopupAmountModal = ({
  modalVisible,
  setModalVisible,
  onModalConfirm,
  onModalRequestClose,
}) => {
  const [amount, setAmount] = useState(null);

  return (
    <Modal
      style={vigoStyles.modal}
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // onModalClose(amount);
        onModalRequestClose();
        setAmount(0);
        setModalVisible(!modalVisible);
      }}
      onDismiss={() => {
        // onModalClose(amount);
      }}
    >
      <View style={{ ...vigoStyles.modal, height: "50%" }}>
        <TextInput
          style={styles.amountInput}
          placeholder="Nhập số tiền muốn nạp"
          keyboardType="numeric"
          onChangeText={(newAmount) => setAmount(newAmount)}
          defaultValue={amount ? amount : null}
        />
        <View style={{ ...vigoStyles.row }}>
          <Text style={{ fontSize: 12 }}>Nạp ít nhất {vndFormat(1000)}</Text>
          <Text style={{ fontSize: 12 }}>Đơn vị: đồng</Text>
        </View>
        <TouchableOpacity
          style={{ ...vigoStyles.buttonPrimary, marginTop: 15 }}
          onPress={() => {
            onModalConfirm(amount);
            setModalVisible(!modalVisible);
          }}
          disabled={amount <= 1000}
          // activeOpacity={amount <= 1000 ? 1 : 0.7}
        >
          <Text style={vigoStyles.buttonPrimaryText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default TopupAmountModal;

const styles = StyleSheet.create({
  amountInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
