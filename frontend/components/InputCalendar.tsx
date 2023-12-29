import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";

export default function InputCalendar({ selectedDate, setSelectedDate }: any) {
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  function handleChangeStartDate(propDate: string) {
    setSelectedDate(propDate);
  }

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  return (
    <KeyboardAvoidingView
      className="px-4"
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 24
      }}
    >
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "100%" }}>
          <View>
            <TouchableOpacity
              style={styles.inputBtn}
              onPress={handleOnPressStartDate}
            >
              <Text className="text-black">{selectedDate}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openStartDatePicker}
        >
          <View style={styles.centeredView}>

            <View style={styles.modalView} >
              <DatePicker
                mode="calendar"
                selected={selectedDate}
                onDateChange={handleChangeStartDate}
                onSelectedChange={(date) => setSelectedDate(date)}
                options={{
                  backgroundColor: "#ffffff",
                  textHeaderColor: "#469ab6",
                  textDefaultColor: "#406ea5",
                  selectedTextColor: "#FFF",
                  mainColor: "#469ab6",
                  textSecondaryColor: "#406ea5",
                }}
              />

              <TouchableOpacity onPress={handleOnPressStartDate}>
                <Text style={{ color: "#469ab6" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: "#111",
  },
  textSubHeader: {
    fontSize: 25,
    color: "#111",
  },
  inputBtn: {
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
  },
  submitBtn: {
    backgroundColor: "#342342",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
