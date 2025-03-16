import React, { useState, useEffect } from "react";
import { Alert, View, ScrollView, Text, TouchableOpacity, FlatList, Modal, TextInput, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { HealthService } from "@/storage/GeneralService";
import { HealthEntry } from "@/types/types";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import LocalFormatter from "@/components/mycomponents/setup/formatDate";
import QuickLogButton from "@/components/mycomponents/setup/QuickLogButton";
import { useNavigation } from "@react-navigation/native";
import BackButton from "@/components/mycomponents/setup/BackButton";



const HealthEntriesScreen: React.FC = () => {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles
  const navigation = useNavigation();

  const [newEntry, setNewEntry] = useState<Partial<HealthEntry>>({
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    weight: null,
    systolic: null,
    diastolic: null,
    bloodSugar: null,
    note: null
  });
  // Add this state at the top of your component
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<HealthEntry | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);


  useEffect(() => {
    loadHealthEntries();
  }, []);


  const loadHealthEntries = async () => {
    try {
      const results = await HealthService.getAllHealthEntries();
      setEntries(results as HealthEntry[]); // add type assertion if needed
    } catch (error) {
      console.error("❌ Error fetching health entries:", error);
    }
  };

  const deleteEntry = async (id: string) => {
    const success = await HealthService.deleteHealthEntry(id);
    if (success) {
      // Update the local state by filtering out the deleted entry
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      // Or alternatively, reload all entries from the database
      await loadHealthEntries();
    }
  };

  const handleReenterWithNewTime = async (entry: HealthEntry) => {
    const today = new Date();
    const todayDateOnly = today.toISOString().split('T')[0]; // ✅ Extract YYYY-MM-DD format

    const newEntry = {
      ...entry,
      id: Date.now().toString(), // Generate a new ID for the entry
      date: todayDateOnly, // ✅ Properly formatted date
    };

    const success = await HealthService.createHealthEntry(newEntry);
    if (success) {
      loadHealthEntries();
    }
  };


  const deleteAllEntries = async () => {
    await HealthService.deleteAllHealthEntries();
    loadHealthEntries();
  };

  const editEntry = async () => {
    if (!selectedEntry) return;
    const success = await HealthService.updateHealthEntry(selectedEntry.id, {
      weight: isNaN(selectedEntry.weight as number) ? null : selectedEntry.weight,
      systolic: isNaN(selectedEntry.systolic as number) ? null : selectedEntry.systolic,
      diastolic: isNaN(selectedEntry.diastolic as number) ? null : selectedEntry.diastolic,
      bloodSugar: isNaN(selectedEntry.bloodSugar as number) ? null : selectedEntry.bloodSugar,
      note: selectedEntry.note || null, // Ensure it's null if empty
    });



    if (success) {
      loadHealthEntries();
      setModalVisible(false);
    }
  };



  const addHealthEntry = async () => {
    if (!newEntry.date) {
      alert("Please enter a date");
      return;
    }

    const entry: HealthEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      weight: newEntry.weight ?? null,
      systolic: newEntry.systolic ?? null,
      diastolic: newEntry.diastolic ?? null,
      bloodSugar: newEntry.bloodSugar ?? null,
      note: newEntry.note ?? null,
    };

    const success = await HealthService.createHealthEntry(entry);
    if (success) {
      loadHealthEntries();
      setAddModalVisible(false);
      setNewEntry({});
    }
  };


  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <BackButton />
      {/* Header Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}
          onPress={() => setAddModalVisible(true)}>
          <Text style={styles.buttonText}>{i18n.t('GENERAL_TRACKER.MODAL.ADD_HEALTH_ENTRY')}</Text>
        </TouchableOpacity>
      </View>

      {/* Main List */}
      <FlatList
        style={styles.scrollContainer}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Date Header */}
            <View style={styles.buttonContainer}>
              <Text style={styles.cardHeader}>
                {LocalFormatter({ date: new Date(item.date) })}
              </Text>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
              >
                <Text style={styles.title}>⋮</Text>
              </TouchableOpacity>

              {activeMenu === item.id && (
                <>
                  {/* Click outside to close */}
                  <TouchableOpacity
                    style={styles.menuBackdrop}
                    onPress={() => setActiveMenu(null)}
                  />

                  {/* Menu Container */}
                  <MenuContainer
                    onEdit={() => {
                      setSelectedEntry(item);
                      setModalVisible(true);
                      setActiveMenu(null);
                    }}
                    onDelete={() => deleteEntry(item.id)}
                    setActiveMenu={setActiveMenu}
                  />


                </>
              )}
            </View>

            {/* Metrics Section */}
            <View style={styles.section}>
              {item.weight && (
                <Text style={styles.menuText}>
                  {i18n.t('GENERAL_TRACKER.MODAL.WEIGHT')}: {item.weight} kg
                </Text>
              )}

              {item.systolic && item.diastolic && (
                <Text style={styles.menuText}>
                  {i18n.t('GENERAL_TRACKER.MODAL.BLOOD_PRESSURE')}: {item.systolic}/{item.diastolic} mmHg
                </Text>
              )}

              {item.bloodSugar && (
                <Text style={styles.menuText}>
                  {i18n.t('GENERAL_TRACKER.MODAL.BLOOD_SUGAR')}: {item.bloodSugar} mg/dL
                </Text>
              )}
            </View>

            {/* Notes Section */}
            {item.note && (
              <Text style={styles.text}>
                {i18n.t('GENERAL_TRACKER.MODAL.NOTES')}: {item.note}
              </Text>
            )}

            {/* Quick Log Button */}
            <QuickLogButton onReenter={() => handleReenterWithNewTime(item)} />

          </View>
        )}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.textSmall}>{i18n.t('TRACKER.NO_ENTRIES')}</Text>
          </View>
        }
      />

      {/* Add/Edit Entry Modal */}
      <Modal visible={isModalVisible || isAddModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.buttonContainer}>
                  <Text style={styles.modalHeader}>
                    {isModalVisible
                      ? i18n.t('GENERAL_TRACKER.MODAL.EDIT_HEALTH_ENTRY')
                      : i18n.t('GENERAL_TRACKER.MODAL.ADD_HEALTH_ENTRY')}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setModalVisible(false);
                    setAddModalVisible(false);
                  }}>
                    <Text style={styles.cardHeader}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                  style={styles.scrollContainer}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }} // Ensures scrolling space
                  keyboardShouldPersistTaps="handled"
                >


                  {/* Date Display (only for Add Entry) */}
                  {isAddModalVisible && (
                    <View style={styles.section}>
                      <Text style={styles.text}>{i18n.t('GENERAL_TRACKER.MODAL.DATE')}</Text>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text style={styles.buttonText}>
                            {isModalVisible
                              ? selectedEntry?.date
                              : newEntry.date
                                ? newEntry.date
                                : i18n.t('GENERAL_TRACKER.MODAL.SELECT_DATE')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {showDatePicker && (
                        <DateTimePicker
                          value={isModalVisible && selectedEntry?.date
                            ? new Date(selectedEntry.date)
                            : newEntry.date
                              ? new Date(newEntry.date)
                              : new Date()}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              const formattedDate = selectedDate.toISOString().split('T')[0];
                              if (isModalVisible && selectedEntry) {
                                setSelectedEntry({ ...selectedEntry, date: formattedDate });
                              } else {
                                setNewEntry({ ...newEntry, date: formattedDate });
                              }
                            }
                          }}
                        />
                      )}
                    </View>

                  )}

                  {/* Weight Input */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('GENERAL_TRACKER.MODAL.WEIGHT')}</Text>
                    <TextInput
                      style={styles.input}
                      value={isModalVisible ? selectedEntry?.weight?.toString() : newEntry.weight?.toString()}
                      onChangeText={(text) => {
                        if (isModalVisible && selectedEntry) {
                          setSelectedEntry({ ...selectedEntry, weight: parseFloat(text) || null });
                        } else {
                          setNewEntry({ ...newEntry, weight: parseFloat(text) || null });
                        }
                      }}
                      keyboardType="decimal-pad"

                    />
                  </View>

                  {/* Blood Pressure Inputs */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('GENERAL_TRACKER.MODAL.BLOOD_PRESSURE')}</Text>
                    <View style={styles.rowContainer}>
                      <TextInput
                        style={[styles.input, { flex: 0.45 }]}
                        value={isModalVisible ? selectedEntry?.systolic?.toString() : newEntry.systolic?.toString()}
                        onChangeText={(text) => {
                          if (isModalVisible && selectedEntry) {
                            setSelectedEntry({ ...selectedEntry, systolic: parseFloat(text) || null });
                          } else {
                            setNewEntry({ ...newEntry, systolic: parseFloat(text) || null });
                          }
                        }}
                        keyboardType="numeric"
                      />

                      <Text style={[styles.text, { marginHorizontal: 8 }]}>/</Text>

                      <TextInput
                        style={[styles.input, { flex: 0.45 }]}
                        value={isModalVisible ? selectedEntry?.diastolic?.toString() : newEntry.diastolic?.toString()}
                        onChangeText={(text) => {
                          if (isModalVisible && selectedEntry) {
                            setSelectedEntry({ ...selectedEntry, diastolic: parseFloat(text) || null });
                          } else {
                            setNewEntry({ ...newEntry, diastolic: parseFloat(text) || null });
                          }
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>


                  {/* Blood Sugar Input */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('GENERAL_TRACKER.MODAL.BLOOD_SUGAR')}</Text>
                    <TextInput
                      style={styles.input}
                      value={isModalVisible ? selectedEntry?.bloodSugar?.toString() : newEntry.bloodSugar?.toString()}
                      onChangeText={(text) => {
                        if (isModalVisible && selectedEntry) {
                          setSelectedEntry({ ...selectedEntry, bloodSugar: parseFloat(text) || null });
                        } else {
                          setNewEntry({ ...newEntry, bloodSugar: parseFloat(text) || null });
                        }
                      }}
                      keyboardType="decimal-pad"

                    />
                  </View>

                  {/* Notes Input */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('GENERAL_TRACKER.MODAL.NOTES')}</Text>
                    <TextInput
                      style={[styles.input]}
                      value={isModalVisible ? selectedEntry?.note ?? '' : newEntry.note?.toString() || ''}
                      onChangeText={(text) => {
                        if (isModalVisible && selectedEntry) {
                          setSelectedEntry({ ...selectedEntry, note: text });
                        } else {
                          setNewEntry({ ...newEntry, note: text });
                        }
                      }}
                      multiline
                      numberOfLines={4}
                    />
                  </View>


                  {/* Action Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={isModalVisible ? editEntry : addHealthEntry}
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
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>


    </View >

  );



};

export default HealthEntriesScreen;

