import React, { useState, useEffect } from "react";
import { View,ScrollView, Text, TouchableOpacity, FlatList, Modal, TextInput, Alert, Keyboard, Platform, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { SymptomService } from "@/storage/SymptomsService";
import { Symptom } from "@/types/types";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import DateTimePicker from '@react-native-community/datetimepicker';
import QuickLogButton from "@/components/mycomponents/setup/QuickLogButton";
import { useNavigation } from "@react-navigation/native";

const SymptomEntriesScreen: React.FC = () => {
  // Base state
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState<string | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const navigation = useNavigation();

  // Symptom form state
  const [newSymptom, setNewSymptom] = useState<Partial<Symptom>>({
    id: Date.now().toString(),
    name: "",
    severity: "Moderate",
    notes: "",
    favorite: false,
    startTime: new Date(),
  });

  // Initial load
  useEffect(() => {
    loadSymptoms();
  }, []);

  // Base data loading
  const loadSymptoms = async () => {
    const results = await SymptomService.getAllSymptoms();
    setSymptoms(results);
  };

  // Symptom CRUD Operations
  const handleAddSymptom = async () => {
    if (!newSymptom.name || !newSymptom.severity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom.name,
      severity: newSymptom.severity as 'Mild' | 'Moderate' | 'Severe',
      notes: newSymptom.notes || "",
      favorite: newSymptom.favorite || false,
      startTime: newSymptom.startTime,
      endTime: newSymptom.endTime,
      lastUsed: new Date(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await SymptomService.createSymptom(symptom);
    if (success) {
      loadSymptoms();
      setModalVisible(false);
      setNewSymptom({});
    }
  };

  const handleUpdateSymptom = async () => {
    if (!selectedSymptom) return;

    const success = await SymptomService.updateSymptom(selectedSymptom.id, selectedSymptom);
    if (success) {
      loadSymptoms();
      setModalVisible(false);
      setSelectedSymptom(null);
    }
  };

  const handleDeleteSymptom = async (id: string) => {
    Alert.alert(
      "Delete Symptom",
      "Are you sure you want to delete this symptom?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await SymptomService.deleteSymptom(id);
            if (success) {
              loadSymptoms();
            }
            setMenuVisible(null);
          }
        }
      ]
    );
  };

  const handleToggleFavorite = async (symptom: Symptom) => {
    const updatedSymptom = { ...symptom, favorite: !symptom.favorite };
    const success = await SymptomService.updateSymptom(symptom.id, updatedSymptom);
    if (success) {
      loadSymptoms();
    }
  };

  const handleReenterWithNewTime = async (symptom: Symptom) => {
    const newEntry = {
      ...symptom,
      id: Date.now().toString(), // Generate a new ID for the entry
      lastUsed: new Date(), // Update lastUsed timestamp
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await SymptomService.createSymptom(newEntry);
    if (success) {
      loadSymptoms();
    }
  };

  const renderSymptomItem = ({ item }: { item: Symptom }) => (
    <View style={styles.card}>
      <View style={styles.buttonContainer}>
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleToggleFavorite(item)}
        >
          <Text style={styles.title}>{item.favorite ? "★" : "☆"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{item.name}</Text>

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(isMenuVisible === item?.id ? null : item?.id)}
        >
          <Text style={styles.title}>⋮</Text>
        </TouchableOpacity>

      </View>

      {/* Severity Badge */}
      <Text style={styles.cardHeader}>{item.severity}</Text>

      {/* Calculate and Display Duration */}
      {item.startTime && item.endTime && (
        <Text style={styles.text}>
          {i18n.t('LABELS.DURATION')}: {(() => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);
            const durationMs = end.getTime() - start.getTime(); // Difference in milliseconds

            // Convert milliseconds to hours, minutes, and seconds
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

            // Format the output
            return `${hours}h ${minutes}m ${seconds}s`;
          })()}
        </Text>
      )}


      {/* Notes */}
      {item.notes && <Text style={styles.textSmall}>{item.notes}</Text>}

      <QuickLogButton onReenter={() => handleReenterWithNewTime(item)} />

      {/* Menu Actions */}
      {isMenuVisible === item?.id && (
        <>
          {/* Click outside to close */}
          <TouchableOpacity style={styles.menuBackdrop} onPress={() => setMenuVisible(null)} />

          {/* Menu Container */}
          <MenuContainer
            onEdit={() => {
              if (item && item.id) { // ✅ Ensure item exists before setting state
                setSelectedSymptom(item);
                setModalVisible(true);
                setMenuVisible(null);
              }
            }}
            onDelete={() => {
              if (item && item.id) { // ✅ Ensure item exists before deleting
                handleDeleteSymptom(item.id);
                setMenuVisible(null);
              }
            }}
            setActiveMenu={setMenuVisible}
          />
        </>
      )}

    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button} // Keeping the standard button style
          onPress={() => {
            setSelectedSymptom(null);
            setNewSymptom({
              id: Date.now().toString(),
              name: "",
              severity: "Moderate", // ✅ Preselect Moderate for new symptoms
              notes: "",
              favorite: false,
              startTime: new Date(),
              endTime: new Date(),
            });
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>{i18n.t('TRACKERS.SYMPTOM.ADD')}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Symptom List */}
      <FlatList
        data={symptoms}
        keyExtractor={(item) => item.id}
        renderItem={renderSymptomItem}
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={styles.text}>{i18n.t('TRACKERS.PERIOD.NO_DATA')}</Text>
          </View>
        }
      />

      {/* ✅ Back Button */}
      <BackButton />

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
                  {selectedSymptom ? "Edit Symptom" : "Add Symptom"}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cardHeader}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                {/* Name */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t('LABELS.SYMPTOMS')}</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedSymptom?.name || newSymptom.name}
                    onChangeText={(text) =>
                      selectedSymptom
                        ? setSelectedSymptom({ ...selectedSymptom, name: text })
                        : setNewSymptom({ ...newSymptom, name: text })
                    }
                  />
                </View>

                {/* Severity */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t('LABELS.SEVERITY')}</Text>
                  <View style={styles.buttonContainer}>
                    {(["Mild", "Moderate", "Severe"] as const).map((severity) => (
                      <TouchableOpacity
                        key={severity}
                        style={[
                          styles.roundButton,
                          (selectedSymptom?.severity === severity ||
                            (!selectedSymptom && newSymptom?.severity === severity)) &&
                          styles.roundButtonActive,
                        ]}
                        onPress={() => {
                          if (selectedSymptom) {
                            setSelectedSymptom({ ...selectedSymptom, severity });
                          } else {
                            setNewSymptom((prev) => ({
                              ...prev,
                              severity: severity || "Moderate",
                            }));
                          }
                        }}
                      >
                        <Text style={styles.buttonText}>{severity}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Start Time Selector */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t('LABELS.STARTTIME')}:</Text>
                  <TouchableOpacity style={styles.button} onPress={() => setShowStartTimePicker(true)}>
                    <Text style={styles.buttonText}>
                      {selectedSymptom?.startTime
                        ? new Date(selectedSymptom.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                        : newSymptom.startTime
                          ? new Date(newSymptom.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          : 'Select Time'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showStartTimePicker && (
                  <DateTimePicker
                    value={selectedSymptom?.startTime ? new Date(selectedSymptom.startTime) : new Date(newSymptom.startTime || Date.now())}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartTimePicker(false);
                      if (selectedDate) {
                        if (selectedSymptom) {
                          setSelectedSymptom((prev) =>
                            prev ? { ...prev, startTime: selectedDate } : null
                          );
                        } else {
                          setNewSymptom((prev) => ({ ...prev, startTime: selectedDate }));
                        }
                      }
                    }}
                  />
                )}

                {/* End Time Selector */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t('LABELS.ENDTIME')}:</Text>
                  <TouchableOpacity style={styles.button} onPress={() => setShowEndTimePicker(true)}>
                    <Text style={styles.buttonText}>
                      {selectedSymptom?.endTime
                        ? new Date(selectedSymptom.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                        : newSymptom.endTime
                          ? new Date(newSymptom.endTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          : 'Select Time'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showEndTimePicker && (
                  <DateTimePicker
                    value={selectedSymptom?.endTime ? new Date(selectedSymptom.endTime) : new Date(newSymptom.endTime || Date.now())}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndTimePicker(false);
                      if (selectedDate) {
                        if (selectedSymptom) {
                          setSelectedSymptom((prev) =>
                            prev ? { ...prev, endTime: selectedDate } : null
                          );
                        } else {
                          setNewSymptom((prev) => ({ ...prev, endTime: selectedDate }));
                        }
                      }
                    }}
                  />
                )}

                {/* Notes */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t('LABELS.NOTES')}</Text>
                  <TextInput
                    style={[styles.input, { minHeight: 100 }]}
                    value={selectedSymptom?.notes || newSymptom.notes}
                    onChangeText={(text) =>
                      selectedSymptom
                        ? setSelectedSymptom({ ...selectedSymptom, notes: text })
                        : setNewSymptom({ ...newSymptom, notes: text })
                    }
                    multiline
                  />
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={selectedSymptom ? handleUpdateSymptom : handleAddSymptom}
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

export default SymptomEntriesScreen;
