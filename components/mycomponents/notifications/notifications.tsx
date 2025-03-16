import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Request Notification Permissions
export const requestNotificationPermission = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("❌ Notification permissions not granted");
  }
};

// ✅ Schedule a Custom Notification (with Time Picker Support)
export const scheduleCustomNotification = async (
  title: string,
  body: string,
  scheduledTime: Date
) => {
  if (!Device.isDevice) {
    console.warn("❌ Notifications only work on a physical device");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      type: "calendar", // ✅ Fix: Specify the type
      hour: scheduledTime.getHours(),
      minute: scheduledTime.getMinutes(),
      repeats: true, // ✅ Ensures it repeats daily at the chosen time
    } as Notifications.CalendarTriggerInput, // ✅ Explicitly define type
  });

  // ✅ Save Scheduled Notification
  const existingNotifications = JSON.parse(await AsyncStorage.getItem("customNotifications") || "[]");
  const newNotification = { id: Date.now(), title, body, time: scheduledTime };
  const updatedNotifications = [...existingNotifications, newNotification];
  await AsyncStorage.setItem("customNotifications", JSON.stringify(updatedNotifications));
};


// ✅ Delete a Scheduled Notification
export const deleteNotification = async (id: number) => {
  const existingNotifications = JSON.parse(await AsyncStorage.getItem("customNotifications") || "[]");
  const updatedNotifications = existingNotifications.filter((notif: any) => notif.id !== id);
  await AsyncStorage.setItem("customNotifications", JSON.stringify(updatedNotifications));
};


// ✅ Fix: Explicitly specify type: "timeInterval"
export const scheduleNotification = async (title: string, body: string, delayInHours: number) => {
  if (!Device.isDevice) {
    console.warn("❌ Notifications only work on a physical device");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      seconds: delayInHours * 3600, // Convert hours to seconds
      repeats: false, // Ensures notification only triggers once
      type: "timeInterval", // ✅ Fix: Explicitly specify type
    } as Notifications.TimeIntervalTriggerInput, // ✅ Explicitly cast to correct type
  });
};