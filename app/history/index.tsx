import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HistoryLog from './dailyhistory';
import AllTrackerData from './trackhistory';
import useThemedStyles from '@/components/hooks/useThemedStyles';
import i18n from '@/components/mycomponents/setup/localization/localization';

const TabsComponent = () => {
  const [viewMode, setViewMode] = useState('HISTORY.TABS.DAILY');
  const styles = useThemedStyles();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}> {/* ✅ Fixes iOS notch issue */}
      <View style={styles.container}>
        
        {/* ✅ Back Button */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Text style={styles.title}>← </Text>
          </TouchableOpacity>
        </View>

        {/* View Mode Selection */}
        <View style={styles.buttonContainer}>
          {['HISTORY.TABS.DAILY', 'HISTORY.TABS.TRACKER'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.roundButton,
                viewMode === mode ? styles.roundButtonActive : styles.roundButton,
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Text style={[
                styles.buttonText,
                viewMode === mode && styles.selectedSelectionButtonText,
              ]}>
                {i18n.t(mode)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {viewMode === 'HISTORY.TABS.DAILY' ? <HistoryLog /> : <AllTrackerData />}
      </View>
    </SafeAreaView>
  );
};

export default TabsComponent;
