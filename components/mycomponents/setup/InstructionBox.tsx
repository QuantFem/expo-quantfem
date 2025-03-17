import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import { usePathname } from "expo-router"; // ✅ Get current tab path
import i18n from "@/components/mycomponents/setup/localization/localization";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const InstructionBox: React.FC = () => {
  const styles = useThemedStyles();
  const { showInstructions } = useUserPreferences();
  const [visible, setVisible] = useState(false);
  const pathname = usePathname(); // ✅ Get current tab route

  // ✅ Get translated instructions dynamically
  const instructionMessages: { [key: string]: string } = {
    "/": i18n.t("HOMEPAGE.ACTIVITY.QUICK_HINT"),
    "/trackers": i18n.t("HOMEPAGE.ACTIVITY.TRACKERS_HINT"),
    "/calendar": i18n.t("HOMEPAGE.ACTIVITY.CALENDAR_HINT"),
    "/settings": i18n.t("HOMEPAGE.ACTIVITY.SETTINGS_HINT"),
  };

  if (!showInstructions || !instructionMessages[pathname]) return null; // ✅ Hide if disabled or no instructions for the tab

  return (
    <View style={styles.tooltipContainer}>
      {visible && (
        <View style={styles.card}>
          <Text style={styles.text}>{instructionMessages[pathname]}</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => setVisible(!visible)} style={[styles.roundButton, styles.roundButtonActive, styles.buttonPrimary]}>
        <Text style={styles.text}>
          <Icon name="lightbulb-on-outline" size={30}  />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InstructionBox;
