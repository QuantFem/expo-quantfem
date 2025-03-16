// src/components/mycomponents/notifications/homeNotifications.ts

import { scheduleCustomNotification } from "./notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/components/mycomponents/setup/localization/localization";
import { Alert } from "react-native";

interface ScheduleHomeReminderParams {
  action: string;
  formattedAction: string;
  reminderFrequency: number;
}

export const promptAndScheduleReminder = async ({ 
  action, 
  formattedAction, 
  reminderFrequency 
}: ScheduleHomeReminderParams): Promise<void> => {
  Alert.prompt(
    i18n.t("HOMEPAGE.NOTIFICATIONS.SET_REMINDER_TITLE"),
    i18n.t("HOMEPAGE.NOTIFICATIONS.SET_REMINDER_MESSAGE"),
    [
      { text: i18n.t("HOMEPAGE.NOTIFICATIONS.CANCEL_BUTTON"), style: "cancel" },
      {
        text: i18n.t("HOMEPAGE.NOTIFICATIONS.SET_REMINDER_BUTTON"),
        onPress: async (text) => {
          const days = parseInt(text || "0", 10);
          if (days > 0) {
            try {
              // Save the reminder duration
              await AsyncStorage.setItem(`reminderDuration_${action}`, days.toString());
              
              // Calculate and schedule the reminder
              const scheduledTime = new Date();
              scheduledTime.setHours(scheduledTime.getHours() + 24/reminderFrequency);
              
              await scheduleCustomNotification(
                i18n.t("HOMEPAGE.NOTIFICATIONS.REMINDER_TITLE"),
                i18n.t("HOMEPAGE.NOTIFICATIONS.REMINDER", {
                  action: formattedAction,
                }),
                scheduledTime
              );

              Alert.alert(
                i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_REMINDER_TITLE"),
                i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_REMINDER_MESSAGE", {
                  nextReminder: scheduledTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                }),
                [{ text: i18n.t("HOMEPAGE.NOTIFICATIONS.OK_BUTTON"), style: "default" }]
              );
            } catch (error) {
              console.error("❌ Error setting reminder:", error);
              Alert.alert(
                i18n.t("HOMEPAGE.NOTIFICATIONS.ERROR_TITLE"),
                i18n.t("HOMEPAGE.NOTIFICATIONS.ERROR_REMINDER_MESSAGE")
              );
            }
          } else {
            Alert.alert(
              i18n.t("HOMEPAGE.NOTIFICATIONS.INVALID_INPUT_TITLE"),
              i18n.t("HOMEPAGE.NOTIFICATIONS.INVALID_INPUT_MESSAGE")
            );
          }
        },
      },
    ],
    "plain-text",
    ""
  );
};
