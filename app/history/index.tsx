import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HistoryLog from './dailyhistory';
import AllTrackerData from './trackhistory';
import useThemedStyles from '@/components/hooks/useThemedStyles';
import i18n from '@/components/mycomponents/setup/localization/localization';
import BackButton from '@/components/mycomponents/setup/BackButton';

const TabsComponent = () => {
  const [viewMode, setViewMode] = useState('HISTORY.TABS.DAILY');
  const styles = useThemedStyles();

  return (
    <SafeAreaView style={{ flex: 1 }}> 
      <View style={styles.container}>
        
        <BackButton/>

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

        {viewMode === 'HISTORY.TABS.DAILY' ? <HistoryLog /> : <AllTrackerData />}
      </View>
    </SafeAreaView>
  );
};

export default TabsComponent;
