import React, { useState, useEffect } from "react";
import { Alert, View, ScrollView, TextInput, Text, TouchableOpacity, FlatList, Modal, Platform, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { CycleService } from "@/storage/PeriodService";
import { CycleEntry } from "@/types/types";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import LocalFormatter from "@/components/mycomponents/setup/formatDate";
import QuickLogButton from "@/components/mycomponents/setup/QuickLogButton";
import { useNavigation } from "@react-navigation/native";
import BackButton from "@/components/mycomponents/setup/BackButton";

const FLOW_OPTIONS = ['none', 'light', 'medium', 'heavy'];

// Update the MOOD_OPTIONS to match the database constraints
const MOOD_OPTIONS = [
  { emoji: '😊', label: 'happy' },     // Changed from 'Happy'
  { emoji: '😢', label: 'sad' },       // Changed from 'Sad'
  { emoji: '😠', label: 'irritable' }, // Changed from 'Angry'
  { emoji: '😰', label: 'anxious' },   // Changed from 'Anxious'
  { emoji: '😴', label: 'tired' },     // Changed from 'Tired'
  { emoji: '😐', label: 'neutral' },   // Changed from 'Neutral'
];



const CycleEntriesScreen: React.FC = () => {
  // Add this line with your other state declarations
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [entries, setEntries] = useState<CycleEntry[]>([]);
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CycleEntry | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<CycleEntry>>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    cycleLength: null,
    flow: 'medium',
    symptoms: null,
    nextCycleDate: null,
    mood: 'neutral',
    remedy: null
  });

  useEffect(() => {
    loadCycleEntries();
  }, []);

  const loadCycleEntries = async () => {
    try {
      const results = await CycleService.getAllCycleEntries();
      setEntries(results);
    } catch (error) {
      console.error("❌ Error fetching cycle entries:", error);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (isModalVisible && selectedEntry) {
        setSelectedEntry({ ...selectedEntry, startDate: dateString });
      } else {
        setNewEntry(prev => ({ ...prev, startDate: dateString }));
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (isModalVisible && selectedEntry) {
        setSelectedEntry({ ...selectedEntry, endDate: dateString });
      } else {
        setNewEntry(prev => ({ ...prev, endDate: dateString }));
      }
    }
  };

  const handleFlowSelection = (flow: string) => {
    if (isModalVisible && selectedEntry) {
      setSelectedEntry({ ...selectedEntry, flow });
    } else {
      setNewEntry(prev => ({ ...prev, flow }));
    }
  };

  const handleMoodSelection = (mood: string) => {
    if (isModalVisible && selectedEntry) {
      setSelectedEntry({ ...selectedEntry, mood });
    } else {
      setNewEntry(prev => ({ ...prev, mood }));
    }
  };

  const deleteEntry = async (id: string) => {
    const success = await CycleService.deleteCycleEntry(id);
    if (success) {
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      await loadCycleEntries();
    }
  };

  const editEntry = async () => {
    if (!selectedEntry) return;
    const success = await CycleService.updateCycleEntry(selectedEntry.id, {
      endDate: selectedEntry.endDate ?? undefined,
      cycleLength: selectedEntry.cycleLength ?? undefined,
      flow: selectedEntry.flow ?? undefined,
      symptoms: selectedEntry.symptoms ?? undefined,
      nextCycleDate: selectedEntry.nextCycleDate ?? undefined,
      mood: selectedEntry.mood ?? undefined,
      remedy: selectedEntry.remedy ?? undefined,
    });

    if (success) {
      loadCycleEntries();
      setModalVisible(false);
    }
  };

  const addCycleEntry = async () => {
    if (!newEntry.startDate) {
      alert("Please enter a start date");
      return;
    }

    const entry: CycleEntry = {
      id: Date.now().toString(),
      startDate: newEntry.startDate,
      endDate: newEntry.endDate ?? null,
      cycleLength: newEntry.cycleLength ?? null,
      flow: newEntry.flow ?? null,
      symptoms: newEntry.symptoms ?? null,
      nextCycleDate: newEntry.nextCycleDate ?? null,
      mood: newEntry.mood ?? null,
      remedy: newEntry.remedy ?? null,
    };

    const success = await CycleService.createCycleEntry(entry);
    if (success) {
      loadCycleEntries();
      setAddModalVisible(false);
      setNewEntry({});
    }
  };


  const handleReenterWithNewTime = async (cycle: CycleEntry) => {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Removes time

    // Calculate new end date (difference from original)
    let newEndDate = null;
    if (cycle.startDate && cycle.endDate) {
      const originalStart = new Date(cycle.startDate);
      const originalEnd = new Date(cycle.endDate);
      const durationMs = originalEnd.getTime() - originalStart.getTime(); // Duration in ms
      newEndDate = new Date(todayDateOnly.getTime() + durationMs); // Add duration to today
    }

    const newEntry: CycleEntry = {
      ...cycle,
      id: Date.now().toString(), // New unique ID
      startDate: todayDateOnly.toISOString().split('T')[0], // ✅ Set start date to today
      endDate: newEndDate ? newEndDate.toISOString().split('T')[0] : null, // ✅ New end date
    };

    const success = await CycleService.createCycleEntry(newEntry);
    if (success) {
      loadCycleEntries();
    }
  };



  const renderFlowOptions = () => (
    <View style={styles.buttonContainer}>
      {FLOW_OPTIONS.map((flow) => (
        <TouchableOpacity
          key={flow}
          style={[
            styles.roundButton, // Uses the existing button style
            (isModalVisible ? selectedEntry?.flow : newEntry.flow) === flow &&
            styles.roundButtonActive // Applies active state
          ]}
          onPress={() => handleFlowSelection(flow)}
        >
          <Text
            style={[
              styles.buttonText, // Ensures readability
              (isModalVisible ? selectedEntry?.flow : newEntry.flow) === flow &&
              styles.selectedSelectionButtonText
            ]}
          >
            {flow}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

  );

  const renderMoodOptions = () => (
    <View style={styles.buttonContainer}>
      {MOOD_OPTIONS.map((mood) => (
        <TouchableOpacity
          key={mood.label}
          style={[
            styles.roundButton, // Reusing existing button style
            (isModalVisible ? selectedEntry?.mood : newEntry.mood) === mood.label &&
            styles.roundButtonActive // Highlight when selected
          ]}
          onPress={() => handleMoodSelection(mood.label)}
        >
          <Text style={styles.buttonText}>{mood.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>

  );

  // Update the renderModalContent function to include cycle length, symptoms, and ScrollView
  const renderModalContent = (isEdit: boolean) => (

    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.buttonContainer}>
          <Text style={styles.modalHeader}>
            {isEdit ? "Edit Cycle Entry" : "Add New Cycle Entry"}
          </Text>
          <TouchableOpacity onPress={() => (isEdit ? setModalVisible(false) : setAddModalVisible(false))}>
            <Text style={styles.cardHeader}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Start Date Picker */}
        <Text style={styles.text}>{i18n.t('LABELS.STARTDATE')}</Text>
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.button} onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.buttonText}>
              {isEdit ? selectedEntry?.startDate : newEntry.startDate || "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(isEdit ? selectedEntry?.startDate || Date.now() : newEntry.startDate || Date.now())}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {/* End Date Picker */}

        <Text style={styles.text}>{i18n.t('LABELS.ENDDATE')}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.buttonText}>
              {isEdit ? selectedEntry?.endDate : newEntry.endDate || "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(isEdit ? selectedEntry?.endDate || Date.now() : newEntry.endDate || Date.now())}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}


        {/* Cycle Length Input */}
        <Text style={styles.text}>{i18n.t('LABELS.CYCLELENGTH')}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={isEdit ? selectedEntry?.cycleLength?.toString() : newEntry.cycleLength?.toString()}
          onChangeText={(text) => {
            const length = text ? parseInt(text) : null;
            if (isEdit && selectedEntry) {
              setSelectedEntry({ ...selectedEntry, cycleLength: length });
            } else {
              setNewEntry((prev) => ({ ...prev, cycleLength: length }));
            }
          }}
        />

        {/* Flow Options */}
        <Text style={styles.text}>{i18n.t('LABELS.FLOW')}</Text>
        {renderFlowOptions()}

        {/* Mood Options */}
        <Text style={styles.text}>{i18n.t('LABELS.MOOD')}</Text>
        {renderMoodOptions()}

        {/* Symptoms Input */}
        <Text style={styles.text}>{i18n.t('LABELS.SYMPTOMS')}</Text>
        <TextInput
          style={[styles.input]}
          multiline
          numberOfLines={4}
          value={isEdit ? selectedEntry?.symptoms || "" : newEntry.symptoms || ""}
          onChangeText={(text) => {
            if (isEdit && selectedEntry) {
              setSelectedEntry({ ...selectedEntry, symptoms: text });
            } else {
              setNewEntry((prev) => ({ ...prev, symptoms: text }));
            }
          }}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>

          <TouchableOpacity
            style={[styles.button]}
            onPress={isEdit ? editEntry : addCycleEntry}
          >
            <Text style={styles.buttonText}>
              {isModalVisible
                ? i18n.t('GENERAL_TRACKER.MODAL.SAVE_CHANGES')
                : i18n.t('GENERAL_TRACKER.MODAL.SAVE')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

  );


  const renderItem = ({ item }: { item: CycleEntry }) => (
    <View style={styles.card}>
      <View style={styles.buttonContainer}>
        <Text style={styles.cardHeader}>
          {LocalFormatter({ date: new Date(item.startDate) })}
        </Text>


        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(menuVisible === item.id ? null : item.id)}
        >
          <Text style={styles.title}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      {menuVisible === item.id && (
        <>
          {/* Click outside to close */}
          <TouchableOpacity style={styles.menuBackdrop} onPress={() => setMenuVisible(null)} />


          {/* Menu Container */}
          <MenuContainer
            onEdit={() => {
              setSelectedEntry(item);
              setModalVisible(true);
              setMenuVisible(null);
            }}
            onDelete={() => deleteEntry(item.id)}
            setActiveMenu={setMenuVisible}
          />


        </>
      )}


      {/* Entry Details */}
      {item.startDate && (
        <Text style={styles.menuText}>
          {i18n.t('LABELS.STARTDATE')}: {LocalFormatter({ date: new Date(item.startDate) })}
        </Text>
      )}
      {item.endDate && (
        <Text style={styles.menuText}>{i18n.t('LABELS.ENDDATE')}:
          {LocalFormatter({ date: new Date(item.endDate) })}
        </Text>
      )}
      {item.cycleLength && (
        <Text style={styles.menuText}>{i18n.t('LABELS.CYCLELENGTH')}: {item.cycleLength}</Text>
      )}
      {item.flow && (
        <Text style={styles.menuText}>{i18n.t('LABELS.FLOW')}: {item.flow}</Text>
      )}
      {item.mood && (
        <Text style={styles.menuText}>
          {i18n.t('LABELS.MOOD')}
          : {MOOD_OPTIONS.find((m) => m.label === item.mood)?.emoji || ""} {item.mood}
        </Text>
      )}
      {item.symptoms && (
        <Text style={styles.menuText}>{i18n.t('LABELS.SYMPTOMS')}: {item.symptoms}</Text>
      )}


      {/* Quick Log Button */}
      <QuickLogButton onReenter={() => handleReenterWithNewTime(item)} />
    </View>
  );



  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <BackButton />
      {/* Add New Entry Button */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}
          onPress={() => setAddModalVisible(true)}>
          <Text style={styles.buttonText}>{i18n.t('TRACKERS.PERIOD.ADD')}</Text>

        </TouchableOpacity>
      </View>

      {/* Cycle Entries List */}
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.scrollContainer} // Ensures proper scrolling
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={styles.text}>{i18n.t('TRACKERS.PERIOD.NO_DATA')}</Text>

          </View>
        }
      />

      {/* Edit Cycle Entry Modal */}
      <Modal
        visible={isModalVisible || isAddModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          setAddModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeader}>
                  {isModalVisible ? "Edit Cycle Entry" : "Add New Cycle Entry"}
                </Text>
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  setAddModalVisible(false);
                }}>
                  <Text style={styles.cardHeader}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Start Date Picker */}
                <Text style={styles.text}>{i18n.t('LABELS.STARTDATE')}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => setShowStartDatePicker(true)}>
                    <Text style={styles.buttonText}>
                      {isModalVisible ? selectedEntry?.startDate : newEntry.startDate || "Select Date"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={new Date(isModalVisible ? selectedEntry?.startDate || Date.now() : newEntry.startDate || Date.now())}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                )}

                {/* End Date Picker */}
                <Text style={styles.text}>{i18n.t('LABELS.ENDDATE')}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => setShowEndDatePicker(true)}>
                    <Text style={styles.buttonText}>
                      {isModalVisible ? selectedEntry?.endDate : newEntry.endDate || "Select Date"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={new Date(isModalVisible ? selectedEntry?.endDate || Date.now() : newEntry.endDate || Date.now())}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                )}

                {/* Cycle Length Input */}
                <Text style={styles.text}>{i18n.t('LABELS.CYCLELENGTH')}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={isModalVisible ? selectedEntry?.cycleLength?.toString() : newEntry.cycleLength?.toString()}
                  onChangeText={(text) => {
                    const length = text ? parseInt(text) : null;
                    if (isModalVisible && selectedEntry) {
                      setSelectedEntry({ ...selectedEntry, cycleLength: length });
                    } else {
                      setNewEntry((prev) => ({ ...prev, cycleLength: length }));
                    }
                  }}
                />

                {/* Flow Options */}
                <Text style={styles.text}>{i18n.t('LABELS.FLOW')}</Text>
                {renderFlowOptions()}

                {/* Mood Options */}
                <Text style={styles.text}>{i18n.t('LABELS.MOOD')}</Text>
                {renderMoodOptions()}

                {/* Symptoms Input */}
                <Text style={styles.text}>{i18n.t('LABELS.SYMPTOMS')}</Text>
                <TextInput
                  style={[styles.input]}
                  multiline
                  numberOfLines={4}
                  value={isModalVisible ? selectedEntry?.symptoms || "" : newEntry.symptoms || ""}
                  onChangeText={(text) => {
                    if (isModalVisible && selectedEntry) {
                      setSelectedEntry({ ...selectedEntry, symptoms: text });
                    } else {
                      setNewEntry((prev) => ({ ...prev, symptoms: text }));
                    }
                  }}
                />


                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={isModalVisible ? editEntry : addCycleEntry}
                  >
                    <Text style={styles.buttonText}>
                      {isModalVisible
                        ? i18n.t('GENERAL_TRACKER.MODAL.SAVE_CHANGES')
                        : i18n.t('GENERAL_TRACKER.MODAL.SAVE')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>


    </View>

  );
};

export default CycleEntriesScreen;
