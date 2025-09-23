import { scheduleNotification, showNotification } from "@/services/notificationService";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

export default function ReminderTest() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());

  // Android picker
  const showAndroidPicker = () => {
  // Step 1: pick date
  DateTimePickerAndroid.open({
    value: date,
    mode: "date",
    is24Hour: true,
    onChange: (event, selectedDate) => {
      if (selectedDate) {
        const pickedDate = selectedDate;

        // Step 2: pick time
        DateTimePickerAndroid.open({
          value: pickedDate,
          mode: "time",
          is24Hour: true,
          onChange: (event, selectedTime) => {
            if (selectedTime) {
              // Combine date + time
              const finalDate = new Date(
                pickedDate.getFullYear(),
                pickedDate.getMonth(),
                pickedDate.getDate(),
                selectedTime.getHours(),
                selectedTime.getMinutes()
              );
              setDate(finalDate);
            }
          },
        });
      }
    },
  });
};


  // Schedule reminder
  const handleSchedule = async () => {
    try {
      await scheduleNotification("Reminder Set!", "This is your scheduled notification.", date);
      Alert.alert("✅ Reminder scheduled!", `Notification will fire at: ${date.toLocaleString()}`);
      router.back();
    } catch (err) {
      console.error("Failed to schedule notification:", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Pick a time for your reminder</Text>

      {Platform.OS === "ios" ? (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
          }}
        />
      ) : (
        <Button title="Pick Date & Time" onPress={showAndroidPicker} />
      )}

      <View style={{ marginVertical: 20 }}>
        <Button title="Schedule Reminder" onPress={handleSchedule} />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button title="Test Instant Notification" onPress={() => showNotification("Hello!", "This shows instantly")} />
      </View>
    </View>
  );
}
