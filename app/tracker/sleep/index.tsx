import React, { useState, useEffect } from "react";
import { View, Alert, Text, TouchableOpacity, FlatList, Modal, TextInput, ScrollView, Keyboard, Platform, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { SleepService } from "@/storage/SleepService";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import { SleepEntry } from "@/types/types";
import LocalFormatter from "@/components/mycomponents/setup/formatDate";
import QuickLogButton from "@/components/mycomponents/setup/QuickLogButton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";


const SleepEntriesScreen: React.FC = () => {
  // State Management
  const [currentEntry, setCurrentEntry] = useState<Partial<SleepEntry>>({
    date: new Date().toISOString().split('T')[0],
    bedTime: "",
    wakeTime: "",
    sleepQuality: 5,
    nightWakeups: [],
    notes: ""
  });

  const [entries, setEntries] = useState<SleepEntry[]>([]);

  const styles = useThemedStyles(); // ✅ Automatically gets updated styles
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBedTimePicker, setShowBedTimePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SleepEntry | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<SleepEntry>>({
    date: new Date().toISOString().split('T')[0],
    bedTime: "",
    wakeTime: "",
    sleepQuality: 5,
    nightWakeups: [],
    notes: ""
  });
  const [selectedWakeupEntry, setSelectedWakeupEntry] = useState<SleepEntry | null>(null);
  const [isInterruptionModalVisible, setInterruptionModalVisible] = useState(false);
  const [interruptionReason, setInterruptionReason] = useState('');
  const navigation = useNavigation();


  useEffect(() => {
    loadSleepEntries();
  }, []);


  const addInterruption = async () => {
    if (!selectedWakeupEntry?.id) {
      alert("⚠️ No sleep entry selected.");
      return;
    }

    try {
      // Initialize nightWakeups array
      let updatedNightWakeups = [];

      // Safely handle existing nightWakeups
      if (selectedWakeupEntry.nightWakeups) {
        if (Array.isArray(selectedWakeupEntry.nightWakeups)) {
          updatedNightWakeups = [...selectedWakeupEntry.nightWakeups];
        } else if (typeof selectedWakeupEntry.nightWakeups === "string") {
          try {
            updatedNightWakeups = JSON.parse(selectedWakeupEntry.nightWakeups) || [];
          } catch {
            updatedNightWakeups = [];
          }
        }
      }

      // Get current time if no time is selected
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Create new interruption object with proper validation
      const newInterruption = {
        time: newEntry.nightWakeups &&
          Array.isArray(newEntry.nightWakeups) &&
          newEntry.nightWakeups.length > 0
          ? newEntry.nightWakeups[newEntry.nightWakeups.length - 1].time || currentTime
          : currentTime,
        reason: interruptionReason?.trim() || "No reason provided"
      };

      // Add new interruption to the array
      updatedNightWakeups.push(newInterruption);

      // Create the updated entry with all required fields
      const updatedEntry = {
        ...selectedWakeupEntry,
        id: selectedWakeupEntry.id,
        date: selectedWakeupEntry.date,
        bedTime: selectedWakeupEntry.bedTime || "",
        wakeTime: selectedWakeupEntry.wakeTime || "",
        sleepQuality: selectedWakeupEntry.sleepQuality || 5,
        notes: selectedWakeupEntry.notes || "",
        nightWakeups: updatedNightWakeups
      };

      console.log("✅ Updated Night Wakeups:", updatedNightWakeups);
      // Update the entry
      const success = await SleepService.updateSleepEntry(
        selectedWakeupEntry.id,
        updatedEntry
      );

      if (success) {
        await loadSleepEntries();
        setInterruptionModalVisible(false);
        setInterruptionReason("");
        alert("✅ Interruption added successfully.");
      } else {
        alert("❌ Failed to add interruption.");
      }
    } catch (error) {
      console.error("❌ Error adding interruption:", error);
      alert("⚠️ Error adding interruption");
    }
  };

  //handlereentry just does the thing with todays date 
  const handleReenterWithNewTime = async (entry: SleepEntry) => {
    const today = new Date();
    const todayDateOnly = today.toISOString().split('T')[0]; // ✅ Correct format: YYYY-MM-DD

    const newEntry = {
      ...entry,
      id: Date.now().toString(), // Generate a new ID for the entry
      date: todayDateOnly, // ✅ Properly formatted date
    };

    const success = await SleepService.createSleepEntry(newEntry);
    if (success) {
      loadSleepEntries();
    }
  };


  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setCurrentEntry({ ...currentEntry, date: formattedDate });
    }
  };

  const addSleepEntry = async () => {
    if (!newEntry.date || !newEntry.bedTime || !newEntry.wakeTime) {
      Alert.alert("Required Fields", "Please fill in all required fields");
      return;
    }

    try {
      const entry: SleepEntry = {
        id: Date.now().toString(),
        date: newEntry.date || new Date().toISOString().split('T')[0],
        bedTime: newEntry.bedTime || '',
        wakeTime: newEntry.wakeTime || '',
        sleepQuality: newEntry.sleepQuality || 5,
        nightWakeups: newEntry.nightWakeups || [], // Ensure it's an array
        notes: newEntry.notes || ''
      };

      const success = await SleepService.createSleepEntry(entry);
      if (success) {
        await loadSleepEntries();
        setModalVisible(false);
        // Reset form
        setNewEntry({
          date: new Date().toISOString().split('T')[0],
          bedTime: "",
          wakeTime: "",
          sleepQuality: 5,
          nightWakeups: [],
          notes: ""
        });
      }
    } catch (error) {
      console.error('Error adding sleep entry:', error);
      Alert.alert('Error', 'Failed to add sleep entry');
    }
  };



  const deleteSleepEntry = async (id: string) => {
    const success = await SleepService.deleteSleepEntry(id);
    if (success) {
      await loadSleepEntries();
    }
  };




  const loadSleepEntries = async () => {
    try {
      const results = await SleepService.getAllSleepEntries();

      // Ensure nightWakeups is always an array
      const fixedResults = results.map(entry => ({
        ...entry,
        nightWakeups: Array.isArray(entry.nightWakeups)
          ? entry.nightWakeups
          : typeof entry.nightWakeups === "string"
            ? JSON.parse(entry.nightWakeups) || []
            : [],
      }));

      setEntries(fixedResults);
    } catch (error) {
      console.error("❌ Error loading sleep entries:", error);
    }
  };






  return (
    <View style={styles.container}>

      {/* ✅ Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} >
        <Text style={styles.cardHeader}>← </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSelectedEntry(null);
            setNewEntry({
              date: new Date().toISOString().split('T')[0],
              bedTime: "",
              wakeTime: "",
              sleepQuality: 5,
              nightWakeups: [],
              notes: ""
            });
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>{i18n.t('TRACKERS.SLEEP.ADD')}</Text>
        </TouchableOpacity>


      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={styles.text}>{i18n.t("TRACKERS.SLEEP.NO_DATA")}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowContainer}>
              <Text style={styles.title}>
                {LocalFormatter({ date: new Date(item.date) })}
              </Text>


              <TouchableOpacity onPress={() => setMenuVisible((prev) => (prev === item.id ? null : item.id))}>
                <Text style={styles.title}>⋮</Text>
              </TouchableOpacity>
            </View>

            {menuVisible === item.id && (
              <>
                {/* Click outside to close */}
                <TouchableOpacity style={styles.menuBackdrop} onPress={() => setMenuVisible(null)} />

                {/* Menu Container */}
                <MenuContainer
                  onEdit={() => {
                    setSelectedEntry(item);
                    setNewEntry(item);
                    setModalVisible(true);
                    setMenuVisible(null);
                  }}
                  onDelete={() => deleteSleepEntry(item.id)}
                  setActiveMenu={setMenuVisible}
                />
              </>
            )}

            <Text style={styles.menuText}>{i18n.t('LABELS.BEDTIME')}
              : {item.bedTime}</Text>
            <Text style={styles.menuText}>{i18n.t('LABELS.WAKETIME')}
              : {item.wakeTime}</Text>
            <Text style={styles.menuText}>{i18n.t('LABELS.SLEEPQUALITY')}:
              {item.sleepQuality}/5</Text>

            {item.notes && <Text style={styles.menuText}>{i18n.t('LABELS.NOTES')}: {item.notes}
            </Text>}


            {/* Display Interruptions */}
            <View style={styles.container}>
              {Array.isArray(item.nightWakeups) && item.nightWakeups.length > 0 ? (
                item.nightWakeups.map((wakeup, index) => (
                  <View key={index} >

                    <Text style={styles.text}>
                      {i18n.t('LABELS.TIMESTAMP')}: {wakeup?.time || i18n.t('COMMON.NA')}
                    </Text>

                    <Text style={styles.text}>
                      {i18n.t('LABELS.NOTES')}: {wakeup?.reason || i18n.t('GENERAL_TRACKER.NO_DATA')}
                    </Text>

                  </View>
                ))
              ) : (
                <Text style={styles.text}>{i18n.t('GENERAL_TRACKER.NO_DATA')}</Text>
              )}

              <TouchableOpacity
                style={[styles.roundButton, styles.roundButtonActive]}
                onPress={() => {
                  setSelectedWakeupEntry(item);
                  setInterruptionModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>
                  {i18n.t('LABELS.NIGHTWAKEUPS')}
                </Text>
              </TouchableOpacity>

            </View>



            <QuickLogButton onReenter={() => handleReenterWithNewTime(item)} />
          </View>



        )
        }
      />


      {/**Interruptions Modal */}
      <Modal
        visible={isInterruptionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInterruptionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeader}>{i18n.t('LABELS.NIGHTWAKEUPS')}</Text>
                <TouchableOpacity onPress={() => setInterruptionModalVisible(false)}>
                  <Text style={styles.cardHeader}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                {selectedWakeupEntry && (
                  <>
                    <View style={styles.section}>
                      <Text style={styles.text}>{i18n.t('LABELS.TIMESTAMP')}:</Text>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
                          <Text style={styles.buttonText}>
                            {Array.isArray(newEntry.nightWakeups) && newEntry.nightWakeups.length > 0
                              ? newEntry.nightWakeups[newEntry.nightWakeups.length - 1]?.time || "Select Time"
                              : "Select Time"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {showTimePicker && (
                        <DateTimePicker
                          value={new Date()}
                          mode="time"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            if (selectedDate) {
                              const formattedTime = selectedDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              });

                              // Safely update the newEntry state
                              setNewEntry((prev) => ({
                                ...prev,
                                nightWakeups: [
                                  ...(Array.isArray(prev.nightWakeups) ? prev.nightWakeups : []),
                                  {
                                    time: formattedTime,
                                    reason: interruptionReason || "No reason provided"
                                  }
                                ]
                              }));
                            }
                          }}
                        />
                      )}

                      <Text style={styles.text}>{i18n.t('LABELS.NOTES')}:</Text>
                      <TextInput
                        style={[styles.input, { minHeight: 100 }]}
                        value={interruptionReason}
                        onChangeText={setInterruptionReason}
                        multiline
                        placeholder={i18n.t("GENERAL_TRACKER.MODAL.ENTER_NOTES")}
                      />
                    </View>

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={addInterruption}
                      >
                        <Text style={styles.buttonText}>
                          {isModalVisible
                            ? i18n.t("GENERAL_TRACKER.MODAL.SAVE_CHANGES")
                            : i18n.t("GENERAL_TRACKER.MODAL.SAVE")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>




      {/* Combined Add/Edit Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeader}>
                  {selectedEntry ? 'Edit Sleep Entry' : 'Add Sleep Entry'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cardHeader}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.section}>
                  {/* Date Picker */}
                  <Text style={styles.text}>{i18n.t('LABELS.DATE')}:</Text>
                  <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.buttonText}>
                      {newEntry.date || "Select Date"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(newEntry.date || Date.now())}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}

                  {/* Bed Time Selector */}
                  <Text style={styles.text}>{i18n.t('LABELS.BEDTIME')}:</Text>
                  <TouchableOpacity style={styles.button} onPress={() => setShowBedTimePicker(true)}>
                    <Text style={styles.buttonText}>
                      {newEntry.bedTime || "Select Time"}
                    </Text>
                  </TouchableOpacity>
                  {showBedTimePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowBedTimePicker(false);
                        if (selectedDate) {
                          const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          });
                          setNewEntry(prev => ({
                            ...prev,
                            bedTime: formattedTime || prev.bedTime
                          }));
                        }
                      }}
                    />
                  )}

                  {/* Wake Time Selector */}
                  <Text style={styles.text}>{i18n.t('LABELS.WAKETIME')}:</Text>
                  <TouchableOpacity style={styles.button} onPress={() => setShowWakeTimePicker(true)}>
                    <Text style={styles.buttonText}>
                      {newEntry.wakeTime || "Select Time"}
                    </Text>
                  </TouchableOpacity>
                  {showWakeTimePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowWakeTimePicker(false);
                        if (selectedDate) {
                          const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          });
                          setNewEntry(prev => ({
                            ...prev,
                            wakeTime: formattedTime || prev.wakeTime
                          }));
                        }
                      }}
                    />
                  )}

                  {/* Sleep Quality Selector */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('LABELS.SLEEPQUALITY')}:</Text>
                    <View style={styles.buttonContainer}>
                      {[1, 2, 3, 4, 5].map(num => (
                        <TouchableOpacity
                          key={num}
                          style={[
                            styles.roundButton,
                            newEntry.sleepQuality === num && styles.roundButtonActive
                          ]}
                          onPress={() => setNewEntry(prev => ({ ...prev, sleepQuality: num }))}
                        >
                          <Text style={styles.buttonText}>{num}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Notes Input */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('LABELS.NOTES')}:</Text>
                    <TextInput
                      style={[styles.input, { minHeight: 100 }]}
                      multiline
                      value={newEntry.notes}
                      onChangeText={text => setNewEntry(prev => ({ ...prev, notes: text }))}
                      placeholder={i18n.t("GENERAL_TRACKER.MODAL.ENTER_NOTES")}
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={async () => {
                    try {
                      if (selectedEntry) {
                        // Update existing entry
                        const updatedEntry: SleepEntry = {
                          ...selectedEntry,
                          date: newEntry.date || selectedEntry.date,
                          bedTime: newEntry.bedTime || selectedEntry.bedTime,
                          wakeTime: newEntry.wakeTime || selectedEntry.wakeTime,
                          sleepQuality: newEntry.sleepQuality || selectedEntry.sleepQuality,
                          nightWakeups: selectedEntry.nightWakeups || [], // Keep existing wakeups
                          notes: newEntry.notes || selectedEntry.notes || ''
                        };

                        const success = await SleepService.updateSleepEntry(selectedEntry.id, updatedEntry);
                        if (success) {
                          await loadSleepEntries();
                          setModalVisible(false);
                          setSelectedEntry(null);
                        }
                      } else {
                        // Create new entry
                        await addSleepEntry();
                      }
                    } catch (error) {
                      console.error('Error saving sleep entry:', error);
                      Alert.alert('Error', 'Failed to save sleep entry');
                    }
                  }}
                >
                  <Text style={styles.buttonText}>
                    {isModalVisible
                      ? i18n.t('GENERAL_TRACKER.MODAL.SAVE_CHANGES')
                      : i18n.t('GENERAL_TRACKER.MODAL.SAVE')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>


    </View>
  );


};



export default SleepEntriesScreen;
