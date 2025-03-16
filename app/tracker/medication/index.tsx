import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { enableLayoutAnimations } from "react-native-reanimated";
import MedicationsScreen from './medication';
import useThemedStyles from '@/components/hooks/useThemedStyles';
import { useNavigation } from '@react-navigation/native';
import BackButton from '@/components/mycomponents/setup/BackButton';
import i18n from "@/components/mycomponents/setup/localization/localization";

enableLayoutAnimations(true);

type ViewMode = 'active' | 'stopped';

const MedicationTabs = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const styles = useThemedStyles(); // Use themed styles
  const navigation = useNavigation();

  const renderViewModeSelector = () => (
    <View style={styles.buttonContainer}>
      {(['active', 'stopped'] as ViewMode[]).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.roundButton,
            viewMode === mode ? styles.roundButtonActive : styles.roundButton,
          ]}
          onPress={() => setViewMode(mode)}
        >
          <Text
            style={[
              styles.buttonText,
              viewMode === mode && styles.selectedSelectionButtonText,
            ]}
          >
            {mode === 'active' 
              ? i18n.t('MEDICATION.STATUS.ACTIVE')
              : i18n.t('MEDICATION.STATUS.STOPPED')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <BackButton />
      {renderViewModeSelector()}
      <MedicationsScreen activeTab={viewMode.toUpperCase() as "ACTIVE" | "STOPPED"} />
    </View>
  );
};

export default MedicationTabs;
