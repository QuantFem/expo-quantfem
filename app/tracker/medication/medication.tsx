import React, { useState, useEffect } from "react";
import { MedicationService } from "@/storage/MedicationService";
import { Frequency, Medication } from "@/types/types";
import { Platform, FlatList, Modal, TextInput, ScrollView, Text, TouchableOpacity, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";



const MedicationsScreen: React.FC<{ activeTab: "ACTIVE" | "STOPPED" }> = ({ activeTab }) => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [stoppedMedications, setStoppedMedications] = useState<Medication[]>([]);
    const [isChangeDosageModalVisible, setChangeDosageModalVisible] = useState(false);
    const styles = useThemedStyles(); // ✅ Automatically gets updated styles
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const displayedMedications = activeTab === "ACTIVE" ? medications : stoppedMedications;
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Hour", value: "hours" },
        { label: "Day", value: "days" },
        { label: "Week", value: "weeks" },
    ]);

    useEffect(() => {
        loadMedications();
    }, []);

    const loadMedications = async () => {
        try {
            const allMeds = await MedicationService.getAllMedications();
            const stoppedIds = JSON.parse(await AsyncStorage.getItem('stoppedMedicationIds') || '[]');

            setMedications(allMeds.filter(med => !stoppedIds.includes(med.id)));
            setStoppedMedications(allMeds.filter(med => stoppedIds.includes(med.id)));
        } catch (error) {
            console.error("Error loading medications:", error);
        }
    };


    const stopMedication = async (id: string) => {
        const medication = medications.find((med) => med.id === id);
        if (!medication) return;

        try {
            const stoppedIds: string[] = JSON.parse(await AsyncStorage.getItem('stoppedMedicationIds') || '[]');
            await AsyncStorage.setItem('stoppedMedicationIds', JSON.stringify([...stoppedIds, id]));

            setStoppedMedications(prev => [...prev, medication]);
            setMedications(prev => prev.filter(med => med.id !== id));
            alert(i18n.t('ALERTS.SUCCESS.STOPPED'));
        } catch (error) {
            console.error("Error stopping medication:", error);
            alert(i18n.t('ALERTS.ERROR.UPDATE'));
        }
    };

    const restartMedication = async (id: string) => {
        const medication = stoppedMedications.find((med) => med.id === id);
        if (!medication) return;

        try {
            const stoppedIds: string[] = JSON.parse(await AsyncStorage.getItem('stoppedMedicationIds') || '[]');
            await AsyncStorage.setItem(
                'stoppedMedicationIds',
                JSON.stringify(stoppedIds.filter(stopId => stopId !== id))
            );

            setMedications(prev => [...prev, medication]);
            setStoppedMedications(prev => prev.filter(med => med.id !== id));
            alert(i18n.t('ALERTS.SUCCESS.RESTARTED'));
        } catch (error) {
            console.error("Error restarting medication:", error);
            alert(i18n.t('ALERTS.ERROR.UPDATE'));
        }
    };


    const deleteMedication = async (id: string) => {
        const success = await MedicationService.deleteMedication(id);
        if (success) {
            setMedications(prevMeds => prevMeds.filter(med => med.id !== id));
            await loadMedications();
        }
    };

    // Medication state
    const [currentMedication, setCurrentMedication] = useState<Partial<Medication>>({
        name: "",
        dosage: "",
        frequency: { value: 1, unit: "days" },
        timeToTake: new Date().toISOString(),
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        notes: "",
    });

    useEffect(() => {
        loadMedications();
    }, []);


    const openModalForEdit = (medication: Medication) => {
        // Ensure all date fields are properly formatted
        const formattedMedication = {
            ...medication,
            timeToTake: medication.timeToTake || new Date().toISOString(),
            startDate: medication.startDate || new Date().toISOString().split("T")[0],
            endDate: medication.endDate || "",
            frequency: {
                value: medication.frequency?.value || 1,
                unit: medication.frequency?.unit || "days"
            }
        };

        setIsEditing(true);
        setCurrentMedication(formattedMedication);
        setModalVisible(true);
    };


    const openModalForAdd = () => {
        setIsEditing(false);
        setCurrentMedication({
            name: "",
            dosage: "",
            frequency: { value: 1, unit: "days" },
            timeToTake: new Date().toISOString(),
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            notes: "",
        });
        setModalVisible(true);
    };


    const handleSave = async () => {
        if (!currentMedication.name || !currentMedication.dosage) {
            alert(i18n.t('ALERTS.WARNING.REQUIRED_FIELDS'));
            return;
        }

        try {
            // Prepare medication data with all required fields
            const medicationData: Medication = {
                id: currentMedication.id || Date.now().toString(),
                name: currentMedication.name,
                dosage: currentMedication.dosage,
                frequency: {
                    value: currentMedication.frequency?.value || 1,
                    unit: currentMedication.frequency?.unit || "days"
                },
                timeToTake: currentMedication.timeToTake || new Date().toISOString(),
                startDate: currentMedication.startDate || new Date().toISOString().split("T")[0],
                endDate: currentMedication.endDate || "",
                notes: currentMedication.notes || ""
            };

            if (isEditing) {
                const success = await MedicationService.updateMedication(
                    medicationData.id,
                    medicationData
                );
                if (success) {
                    await loadMedications();
                    alert(i18n.t('ALERTS.SUCCESS.UPDATED'));
                } else {
                    alert(i18n.t('ALERTS.ERROR.UPDATE'));
                }
            } else {
                await addMedication(medicationData);
            }
            setModalVisible(false);
            setIsEditing(false);
            // Reset current medication
            setCurrentMedication({
                name: "",
                dosage: "",
                frequency: { value: 1, unit: "days" },
                timeToTake: new Date().toISOString(),
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
                notes: "",
            });
        } catch (error) {
            console.error("Error saving medication:", error);
            alert(i18n.t('ALERTS.ERROR.SAVE'));
        }
    };


    const addMedication = async (newMed: Partial<Medication>) => {
        const newMedication: Medication = {
            id: Date.now().toString(),
            name: newMed.name!,
            dosage: newMed.dosage!,
            frequency: newMed.frequency!,
            timeToTake: newMed.timeToTake!,
            startDate: newMed.startDate!,
            endDate: newMed.endDate,
            notes: newMed.notes!,
        };

        try {
            const success = await MedicationService.createMedication(newMedication);
            if (success) {
                await loadMedications();
                alert(i18n.t('ALERTS.SUCCESS.ADDED'));
            } else {
                alert(i18n.t('ALERTS.ERROR.ADD'));
            }
        } catch (error) {
            console.error("Error adding medication:", error);
            alert(i18n.t('ALERTS.ERROR.SAVE'));
        }
    };

    const takeMedication = async (medicationId: string) => {
        try {
            const medication = medications.find((med) => med.id === medicationId);
            if (!medication) return;

            const now = new Date();
            const nowISO = now.toISOString();

            let { frequency } = medication;

            // Ensure frequency is always an object
            if (typeof frequency === "string") {
                try {
                    frequency = JSON.parse(frequency);
                } catch (error) {
                    console.error("❌ Error parsing frequency:", error);
                    alert(i18n.t('ALERTS.WARNING.INVALID_INPUT'));
                    return;
                }
            }

            if (!frequency || typeof frequency !== "object" || !frequency.value || !frequency.unit) {
                console.error("⚠️ Invalid frequency detected:", frequency);
                alert(i18n.t('ALERTS.WARNING.INVALID_INPUT'));
                return;
            }

            // Calculate next dose based on current time
            const nextDose = new Date(now);

            switch (frequency.unit) {
                case "hours":
                    nextDose.setHours(nextDose.getHours() + frequency.value);
                    break;
                case "days":
                    nextDose.setDate(nextDose.getDate() + frequency.value);
                    break;
                case "weeks":
                    nextDose.setDate(nextDose.getDate() + (frequency.value * 7));
                    break;
                default:
                    console.error("❌ Unknown frequency unit:", frequency.unit);
                    alert(i18n.t('ALERTS.WARNING.UNSUPPORTED_VALUE'));
                    return;
            }

            const updatedMedication: Medication = {
                ...medication,
                lastTaken: nowISO,           // Set last taken to current time
                nextDose: nextDose.toISOString(),  // Set next dose time
                timeToTake: nextDose.toISOString() // Update time to take to next dose
            };

            const success = await MedicationService.updateMedication(
                medicationId,
                updatedMedication
            );

            if (success) {
                await loadMedications();
                alert(i18n.t('ALERTS.SUCCESS.TAKEN') + '\n' + i18n.t('ALERTS.SUCCESS.NEXT_DOSE', { time: nextDose.toLocaleString() }));
            } else {
                alert(i18n.t('ALERTS.ERROR.UPDATE'));
            }
        } catch (error) {
            console.error("Error taking medication:", error);
            alert(i18n.t('ALERTS.ERROR.SAVE'));
        }
    };



    const changeDosage = async () => {
        if (!selectedMedication) {
            alert("⚠️ No medication selected.");
            return;
        }

        try {
            console.log("📌 Selected Medication Before Update:", selectedMedication);

            const medication = medications.find((med) => med.id === selectedMedication.id);
            if (!medication) {
                alert("⚠️ Medication not found.");
                return;
            }

            const newDosage = selectedMedication.dosage?.trim();
            if (!newDosage) {
                alert(i18n.t('ALERTS.WARNING.REQUIRED_FIELDS'));
                return;
            }

            // ✅ Update only the dosage
            const success = await MedicationService.updateMedication(selectedMedication.id, {
                dosage: newDosage, // Keep it as a string
            });

            if (success) {
                await loadMedications(); // Refresh medication list
                setChangeDosageModalVisible(false); // Close modal
                alert(i18n.t('ALERTS.SUCCESS.UPDATED'));
            } else {
                alert(i18n.t('ALERTS.ERROR.UPDATE'));
            }
        } catch (error) {
            console.error("❌ Error changing dosage:", error);
            alert(i18n.t('ALERTS.ERROR.SAVE'));
        }
    };


    useEffect(() => {
        loadMedications();
    }, []);


    return (
        <View style={styles.container}>

            {/* Only show Add button in Active tab */}
            {activeTab === "ACTIVE" && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={openModalForAdd}>
                        <Text style={styles.buttonText}>{i18n.t("TRACKERS.MEDICATION.ADD")}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={displayedMedications}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.section}>
                        <Text style={styles.menuText}>
                            {activeTab === "ACTIVE"
                                ? i18n.t('TRACKERS.MEDICATION.NO_ACTIVE')
                                : i18n.t('TRACKERS.MEDICATION.NO_STOPPED')}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.cardHeader}>{item.name}</Text>
                            {activeTab === "ACTIVE" && (
                                <TouchableOpacity
                                    style={styles.menuButton}
                                    onPress={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                >
                                    <Text style={styles.title}>⋮</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {activeMenu === item.id && activeTab === "ACTIVE" && (
                            <>
                                <TouchableOpacity
                                    style={styles.menuBackdrop}
                                    onPress={() => setActiveMenu(null)}
                                />
                                <MenuContainer
                                    onEdit={() => openModalForEdit(item)}
                                    onDelete={() => deleteMedication(item.id)}
                                    setActiveMenu={setActiveMenu}
                                />
                                <View style={styles.menuContainer}>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            takeMedication(item.id);
                                            setActiveMenu(null);
                                        }}
                                    >
                                        <Text style={styles.cardHeader}>{i18n.t('MEDICATION.ACTIONS.TAKE')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            stopMedication(item.id);
                                            setActiveMenu(null);
                                        }}
                                    >
                                        <Text style={styles.cardHeader}>{i18n.t('MEDICATION.ACTIONS.STOP')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setSelectedMedication(item);
                                            setChangeDosageModalVisible(true);
                                            setActiveMenu(null);
                                        }}
                                    >
                                        <Text style={styles.cardHeader}>{i18n.t('MEDICATION.ACTIONS.CHANGE')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        <Text style={styles.menuText}>{i18n.t('LABELS.DOSAGE')}: {item.dosage}</Text>
                        <Text style={styles.menuText}>
                            {i18n.t('LABELS.FREQUENCY')}: {item.frequency.value} / {item.frequency.value === 1
                                ? item.frequency.unit.slice(0, -1)
                                : item.frequency.unit}
                        </Text>
                        <Text style={styles.menuText}>{i18n.t('LABELS.TIMETOTAKE')}: {new Date(item.timeToTake).toLocaleTimeString()}</Text>
                        <Text style={styles.menuText}>{i18n.t('LABELS.STARTDATE')}: {new Date(item.startDate).toLocaleDateString()}</Text>
                        {item.nextDose && (
                            <Text style={styles.menuText}>{i18n.t('LABELS.NEXTDOSE')}: {new Date(item.nextDose).toLocaleString()}
                            </Text>
                        )}

                        {item.endDate && (
                            <Text style={styles.menuText}>{i18n.t('LABELS.ENDDATE')}: {new Date(item.endDate).toLocaleDateString()}</Text>
                        )}
                        {item.notes && <Text style={styles.text}>{i18n.t('LABELS.NOTES')}: {item.notes}</Text>}

                        {/* Action Buttons */}
                        <View style={styles.buttonContainer}>
                            {activeTab === "ACTIVE" ? (
                                <>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => takeMedication(item.id)}
                                    >
                                        <Text style={styles.buttonText}>{i18n.t('MEDICATION.ACTIONS.TAKE')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => stopMedication(item.id)}
                                    >
                                        <Text style={styles.buttonText}>{i18n.t('MEDICATION.ACTIONS.STOP')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            setSelectedMedication(item);
                                            setChangeDosageModalVisible(true);
                                        }}
                                    >
                                        <Text style={styles.buttonText}>{i18n.t('MEDICATION.ACTIONS.CHANGE')}</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => restartMedication(item.id)}
                                >
                                    <Text style={styles.buttonText}>{i18n.t('MEDICATION.ACTIONS.RESTART')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />



            {/* Change Dosage Modal */}
            <Modal
                visible={isChangeDosageModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setChangeDosageModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.modalHeader}>
                                {i18n.t('MEDICATION.ACTIONS.CHANGE')}
                            </Text>
                            <TouchableOpacity onPress={() => setChangeDosageModalVisible(false)}>
                                <Text style={styles.cardHeader}>{i18n.t('GENERAL_TRACKER.MODAL.CLOSE')}</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedMedication && (
                            <>
                                {/* Dosage Input Section */}
                                <View style={styles.section}>
                                    <Text style={styles.text}>{i18n.t('LABELS.DOSAGE')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={selectedMedication.dosage}
                                        onChangeText={(text) =>
                                            setSelectedMedication({ ...selectedMedication, dosage: text })
                                        }
                                    />
                                </View>

                                {/* Save Button */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={changeDosage}
                                    >
                                        <Text style={styles.buttonText}>
                                            {isModalVisible
                                                ? i18n.t('GENERAL_TRACKER.MODAL.SAVE_CHANGES')
                                                : i18n.t('GENERAL_TRACKER.MODAL.SAVE')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Combined Add/Edit Medication Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => {
                    setModalVisible(false);
                    setIsEditing(false);
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            {/* Modal Header */}
                            <View style={styles.buttonContainer}>
                                <Text style={styles.modalHeader}>
                                    {isEditing ? i18n.t('TRACKERS.MEDICATION.EDIT') : i18n.t('TRACKERS.MEDICATION.ADD')}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                        setIsEditing(false);
                                    }}
                                >
                                    <Text style={styles.cardHeader}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Medication Form */}
                            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                                <View style={styles.section}>
                                    {/* Name */}
                                    <Text style={styles.text}>{i18n.t('LABELS.NAME')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentMedication.name}
                                        onChangeText={(text) =>
                                            setCurrentMedication({ ...currentMedication, name: text })
                                        }
                                    />

                                    {/* Dosage */}
                                    <Text style={styles.text}>{i18n.t('LABELS.DOSAGE')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentMedication.dosage}
                                        onChangeText={(text) =>
                                            setCurrentMedication({ ...currentMedication, dosage: text })
                                        }
                                    />

                                    {/* Frequency */}
                                    <Text style={styles.text}>{i18n.t('LABELS.FREQUENCY')}</Text>
                                    <View style={{ zIndex: 3000 }}>
                                        <View style={styles.rowContainer}>
                                            <TextInput
                                                style={[styles.input, { flex: 0.3 }]}
                                                keyboardType="numeric"
                                                value={currentMedication.frequency?.value?.toString() ?? ""}
                                                onChangeText={(text) => {
                                                    const numericValue = text.replace(/[^0-9]/g, "");
                                                    setCurrentMedication({
                                                        ...currentMedication,
                                                        frequency: {
                                                            value: numericValue !== "" ? parseInt(numericValue, 10) : 0,
                                                            unit: currentMedication.frequency?.unit ?? "days",
                                                        },
                                                    });
                                                }}
                                            />

                                            {/* Divider */}
                                            <Text style={styles.text}> / </Text>

                                            {/* Dropdown Picker for Frequency Unit */}
                                            <View style={{ flex: 0.5 }}>
                                                <DropDownPicker
                                                    open={open}
                                                    value={currentMedication.frequency?.unit ?? "days"}
                                                    items={items}
                                                    setOpen={setOpen}
                                                    setValue={(callback) => {
                                                        const newValue = typeof callback === "function"
                                                            ? callback(currentMedication.frequency?.unit ?? "days")
                                                            : callback;

                                                        setCurrentMedication({
                                                            ...currentMedication,
                                                            frequency: {
                                                                value: currentMedication.frequency?.value ?? 0,
                                                                unit: newValue,
                                                            },
                                                        });
                                                    }}
                                                    setItems={setItems}
                                                    style={{ backgroundColor: "white", minWidth: 100 }}
                                                    dropDownContainerStyle={{ backgroundColor: "white" }}
                                                    listMode="SCROLLVIEW"
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Time to Take */}
                                    <Text style={styles.text}>{i18n.t('LABELS.TIMETOTAKE')}</Text>
                                    <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                                        <Text>
                                            {new Date(currentMedication.timeToTake || new Date()).toLocaleTimeString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showTimePicker && Platform.OS !== 'web' && (
                                        <DateTimePicker
                                            value={new Date(currentMedication.timeToTake || new Date())}
                                            mode="time"
                                            is24Hour={true}
                                            onChange={(event, selectedDate) => {
                                                setShowTimePicker(false);
                                                if (selectedDate) {
                                                    const newDateTime = new Date(currentMedication.timeToTake || new Date());
                                                    newDateTime.setHours(selectedDate.getHours());
                                                    newDateTime.setMinutes(selectedDate.getMinutes());
                                                    setCurrentMedication({
                                                        ...currentMedication,
                                                        timeToTake: newDateTime.toISOString(),
                                                    });
                                                }
                                            }}
                                        />
                                    )}

                                    {/* Start Date */}
                                    <Text style={styles.text}>{i18n.t('LABELS.STARTDATE')}</Text>
                                    <TouchableOpacity style={styles.input} onPress={() => setShowStartDatePicker(true)}>
                                        <Text>
                                            {new Date(currentMedication.startDate || new Date()).toLocaleDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showStartDatePicker && Platform.OS !== 'web' && (
                                        <DateTimePicker
                                            value={new Date(currentMedication.startDate || new Date())}
                                            mode="date"
                                            onChange={(event, selectedDate) => {
                                                setShowStartDatePicker(false);
                                                if (selectedDate) {
                                                    setCurrentMedication({
                                                        ...currentMedication,
                                                        startDate: selectedDate.toISOString().split('T')[0],
                                                    });
                                                }
                                            }}
                                        />
                                    )}

                                    {/* End Date */}
                                    <Text style={styles.text}>{i18n.t('LABELS.ENDDATE')}</Text>
                                    <TouchableOpacity style={styles.input} onPress={() => setShowEndDatePicker(true)}>
                                        <Text>
                                            {currentMedication.endDate
                                                ? new Date(currentMedication.endDate).toLocaleDateString()
                                                : "Select End Date"}
                                        </Text>
                                    </TouchableOpacity>
                                    {showEndDatePicker && Platform.OS !== 'web' && (
                                        <DateTimePicker
                                            value={new Date(currentMedication.endDate || new Date())}
                                            mode="date"
                                            onChange={(event, selectedDate) => {
                                                setShowEndDatePicker(false);
                                                if (selectedDate) {
                                                    setCurrentMedication({
                                                        ...currentMedication,
                                                        endDate: selectedDate.toISOString().split('T')[0],
                                                    });
                                                }
                                            }}
                                        />
                                    )}

                                    {/* Notes */}
                                    <Text style={styles.text}>{i18n.t('LABELS.NOTES')}</Text>
                                    <TextInput
                                        style={[styles.input, { height: 100 }]}
                                        multiline
                                        value={currentMedication.notes}
                                        onChangeText={(text) =>
                                            setCurrentMedication({ ...currentMedication, notes: text })
                                        }
                                    />
                                </View>
                                {/* Save Button */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleSave}
                                    >
                                        <Text style={styles.buttonText}>
                                            {isEditing ? i18n.t('GENERAL_TRACKER.MODAL.SAVE') : i18n.t('GENERAL_TRACKER.MODAL.SAVE')}
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

export default MedicationsScreen;
