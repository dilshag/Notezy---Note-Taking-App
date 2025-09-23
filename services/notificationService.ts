import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
// 🛠 Configure global notification handler
Notifications.setNotificationHandler({
 handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // 👈 New
    shouldShowList: true,   // 👈 New
  }),
});
// 🔑 Setup permissions
export const setupNotifications = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.warn("⚠️ Must use physical device for notifications");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

// 📢 Show immediate notification
export const showNotification = async (title: string, body: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // null = show immediately
    });
  } catch (error) {
    console.error("❌ Failed to show notification:", error);
  }
};

// ⏰ Schedule notification (returns notificationId)
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date
): Promise<string | null> => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { date } as Notifications.DateTriggerInput,
    });
    console.log("✅ Scheduled notification with ID:", id);
    return id;
  } catch (error) {
    console.error("❌ Failed to schedule notification:", error);
    return null;
  }
};

// ❌ Cancel single notification
export const cancelNotification = async (id: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log(`✅ Canceled notification with ID: ${id}`);
  } catch (error) {
    console.error("❌ Failed to cancel notification:", error);
  }
};

// 🧹 Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("🧹 All notifications canceled");
  } catch (error) {
    console.error("❌ Failed to cancel all notifications:", error);
  }
};