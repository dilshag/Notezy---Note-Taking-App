import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Setup permissions
export const setupNotifications = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  }
  return false;
};

// Show immediate notification
export const showNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
};

// Schedule notification (reminder)
export const scheduleNotification = async (title: string, body: string, date: Date) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      date,
    } as Notifications.DateTriggerInput,
  });
};
