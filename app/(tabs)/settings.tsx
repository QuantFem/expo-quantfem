import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  Linking,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import useBiometricAuth from "@/components/mycomponents/BiometricAuth";
import { exportData } from "../history/exportData";
import { importData } from "../history/importData";
import { requestNotificationPermission } from "@/components/mycomponents/notifications/notifications";
import { useRouter } from "expo-router";
import i18n from "@/components/mycomponents/setup/localization/localization";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const actionsWithReminders = ["Tampon", "Pad", "Menstrual Cup", "Period Underwear", "Painkiller"];

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { appLockEnabled, toggleBiometricAuth } = useBiometricAuth();
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles

  const [darkMode, setDarkMode] = useState<"system" | "blue" | "green" | "purple" | "light" | "dark">("system");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderDurations, setReminderDurations] = useState<{ [key: string]: string }>({});
  const [tempReminderDurations, setTempReminderDurations] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const { showInstructions, toggleInstructions } = useUserPreferences();

  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.locale);

  const [openLanguage, setOpenLanguage] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);

  const languageItems = [
    { label: i18n.t("SETTINGS.LANGUAGE.ENGLISH"), value: "en" },
    { label: i18n.t("SETTINGS.LANGUAGE.FRENCH"), value: "fr" },
    { label: i18n.t("SETTINGS.LANGUAGE.SPANISH"), value: "es" },
    { label: i18n.t("SETTINGS.LANGUAGE.SWAHILI"), value: "sw" },
    { label: i18n.t("SETTINGS.LANGUAGE.SLANG"), value: "sl" },
  ];

  const themeItems = [
    { label: i18n.t("SETTINGS.APPEARANCE.OPTIONS.LIGHT"), value: "light" },
    { label: i18n.t("SETTINGS.APPEARANCE.OPTIONS.DARK"), value: "dark" },
    { label: i18n.t("SETTINGS.APPEARANCE.OPTIONS.BLUE"), value: "blue" },
    { label: i18n.t("SETTINGS.APPEARANCE.OPTIONS.GREEN"), value: "green" },
    { label: i18n.t("SETTINGS.APPEARANCE.OPTIONS.PURPLE"), value: "purple" },
  ];

  const changeLanguage = async (lang: string) => {
    (i18n as any).locale = lang;
    setSelectedLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedMode = await AsyncStorage.getItem("themeMode");
    if (savedMode) setDarkMode(savedMode as "system" | "light" | "dark" | "blue" | "green" | "purple");

    const notificationsStatus = await AsyncStorage.getItem("notificationsEnabled");
    setNotificationsEnabled(notificationsStatus === "true");

    const savedDurations = JSON.parse(await AsyncStorage.getItem("reminderDurations") || "{}");
    setReminderDurations(savedDurations);

    const savedLanguage = await AsyncStorage.getItem("appLanguage");
    if (savedLanguage) {
      (i18n as any).locale = savedLanguage;
      setSelectedLanguage(savedLanguage);
    }
  };

  const changeTheme = async (value: "system" | "light" | "dark" | "blue" | "green" | "purple") => {
    setDarkMode(value);
    await AsyncStorage.setItem("themeMode", value);
  };

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notificationsEnabled", value.toString());
    if (value) {
      await requestNotificationPermission();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Notifications Section */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.NOTIFICATIONS.TITLE")}</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>{i18n.t("SETTINGS.NOTIFICATIONS.ENABLE")}</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>

        {/* Language Selection */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.LANGUAGE.TITLE")}</Text>
        <View style={{ zIndex: 3000, marginBottom: openLanguage ? 150 : 0 }}>
          <DropDownPicker
            open={openLanguage}
            value={selectedLanguage}
            items={languageItems}
            setOpen={setOpenLanguage}
            setValue={(callback) => {
              const newValue = typeof callback === "function" ? callback(selectedLanguage) : callback;
              changeLanguage(newValue);
            }}
            style={{ backgroundColor: "white" }}
            dropDownContainerStyle={{ backgroundColor: "white" }}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Theme Selection */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.APPEARANCE.TITLE")}</Text>
        <View style={{ zIndex: 2000, marginBottom: openTheme ? 150 : 0 }}>
          <DropDownPicker
            open={openTheme}
            value={darkMode}
            items={themeItems}
            setOpen={setOpenTheme}
            setValue={(callback) => {
              const newValue = typeof callback === "function" ? callback(darkMode) : callback;
              changeTheme(newValue);
            }}
            style={{ backgroundColor: "white" }}
            dropDownContainerStyle={{ backgroundColor: "white" }}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Instructions Toggle */}
        <View style={styles.rowContainer}>
          <Text style={styles.text}>{i18n.t("HOMEPAGE.ACTIVITY.SHOW_HELP")}</Text>
          <Switch
            value={showInstructions}
            onValueChange={toggleInstructions}
          />
        </View>

        {/* Privacy Section */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.PRIVACY.TITLE")}</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>{i18n.t("SETTINGS.PRIVACY.APP_LOCK")}</Text>
          <Switch value={appLockEnabled} onValueChange={toggleBiometricAuth} />
        </View>

        {/* History Section */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.HISTORY.TITLE")}</Text>
        <Text style={[styles.link]} onPress={() => router.push("/history")}>
          {i18n.t("SETTINGS.HISTORY.HISTORY")}
        </Text>
        <Text style={[styles.link]} onPress={() => router.push("/reports")}>
          {i18n.t("SETTINGS.HISTORY.DOCTORS_REPORT")}
        </Text>

        {/* Data Management */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.DATA_MANAGEMENT.TITLE")}</Text>
        <Text style={[styles.link]} onPress={exportData}>{i18n.t("SETTINGS.DATA_MANAGEMENT.EXPORT_DATA")}</Text>
        <Text style={[styles.link]} onPress={importData}>{i18n.t("SETTINGS.DATA_MANAGEMENT.IMPORT_DATA")}</Text>

        {/* Help & Support */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.HELP_SUPPORT.TITLE")}</Text>
        <Text style={[styles.link]} onPress={() => Linking.openURL("https://quantfem.com")}>
          {i18n.t("SETTINGS.HELP_SUPPORT.USER_GUIDE")}
        </Text>
        <Text style={[styles.link]} onPress={() => Linking.openURL("https://quantfem.com")}>
          {i18n.t("SETTINGS.HELP_SUPPORT.CONTACT_SUPPORT")}
        </Text>

        {/* Website Section */}
        <Text style={[styles.cardHeader]}>{i18n.t("SETTINGS.WEBSITE.TITLE")}</Text>
        <Text style={[styles.link]} onPress={() => Linking.openURL("https://quantfem.com")}>
          {i18n.t("SETTINGS.WEBSITE.LINK_TEXT")}
        </Text>
      </ScrollView>

      {/* Reminder Settings Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{i18n.t("SETTINGS.MODAL.HEADER")}</Text>
            <ScrollView>
              {actionsWithReminders.map((action) => (
                <View key={action} style={styles.rowContainer}>
                  <Text style={styles.text}>{action} (days):</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={tempReminderDurations[action] || ""}
                    onChangeText={(text) => setTempReminderDurations({ ...tempReminderDurations, [action]: text })}
                  />
                </View>
              ))}
            </ScrollView>
            <Text style={styles.modalButton} onPress={() => setModalVisible(false)}>
              {i18n.t("SETTINGS.MODAL.CLOSE_BUTTON")}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
