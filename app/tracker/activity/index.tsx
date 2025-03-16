import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { ActivityService } from "@/storage/ActivityService";
import { Activity } from "@/types/types";
import useThemedStyles from "@/components/hooks/useThemedStyles"; // ✅ Import the custom hook
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import i18n from "@/components/mycomponents/setup/localization/localization";
import QuickLogButton from "@/components/mycomponents/setup/QuickLogButton";
import { useNavigation } from "@react-navigation/native";



const ActivityEntriesScreen: React.FC = () => {
  // Base state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const styles = useThemedStyles(); // ✅ Automatically gets updated styles


  // New state for types and names management
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [activityNames, setActivityNames] = useState<{ [type: string]: string[] }>({});
  const navigation = useNavigation();




  // Activity form state
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    id: Date.now().toString(),
    name: "",
    type: "",
    intensity: "Medium",
    notes: "",
    favorite: false,
    lastUsed: new Date(),
  });

  // Initial load
  useEffect(() => {
    loadActivities();
  }, []);

  // Load and organize types and names
  useEffect(() => {
    const types = new Set(activities.map(a => a.type));
    setActivityTypes(Array.from(types));

    const names: { [type: string]: string[] } = {};
    activities.forEach(activity => {
      if (!names[activity.type]) {
        names[activity.type] = [];
      }
      if (!names[activity.type].includes(activity.name)) {
        names[activity.type].push(activity.name);
      }
    });
    setActivityNames(names);
  }, [activities]);

  // Base data loading
  const loadActivities = async () => {
    const results = await ActivityService.getAllActivities();
    setActivities(results);
  };

  // Activity CRUD Operations
  const handleAddActivity = async () => {
    if (!newActivity.name || !newActivity.type || !newActivity.intensity) {
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      type: newActivity.type,
      intensity: newActivity.intensity as 'Low' | 'Medium' | 'High' || "Medium",
      notes: newActivity.notes || "",
      favorite: newActivity.favorite || false,
      duration: newActivity.duration,
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      lastUsed: new Date(),
    };

    const success = await ActivityService.createActivity(activity);
    if (success) {
      loadActivities();
      setModalVisible(false);
      setNewActivity({});
    }
  };

  const handleUpdateActivity = async () => {
    if (!selectedActivity) return;

    const success = await ActivityService.updateActivity(selectedActivity.id, selectedActivity);
    if (success) {
      loadActivities();
      setModalVisible(false);
      setSelectedActivity(null);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await ActivityService.deleteActivity(id);
            if (success) {
              loadActivities();
            }
            setMenuVisible(null);
          }
        }
      ]
    );
  };

  const handleToggleFavorite = async (activity: Activity) => {
    const updatedActivity = { ...activity, favorite: !activity.favorite };
    const success = await ActivityService.updateActivity(activity.id, updatedActivity);
    if (success) {
      loadActivities();
    }
  };

  const handleReenterWithNewTime = async (activity: Activity) => {
    const newEntry = {
      ...activity,
      id: Date.now().toString(), // Generate a new ID for the entry
      lastUsed: new Date(), // Update lastUsed timestamp
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await ActivityService.createActivity(newEntry);
    if (success) {
      loadActivities();
    }
  };


  const renderActivityItem = ({ item }: { item: Activity }) => (
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
          onPress={() => setMenuVisible(isMenuVisible === item.id ? null : item.id)}
        >
          <Text style={styles.title}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Type */}
      <Text style={styles.menuText}>{item.type}</Text>

      {/* Intensity Badge */}
      <Text style={styles.cardHeader}>{item.intensity}</Text>

      {/* Duration */}
      {item.duration && (
        <Text style={styles.menuText}>{item.duration} minutes</Text>
      )}

      {/* Notes */}
      {item.notes && <Text style={styles.text}>{item.notes}</Text>}

      {/* Quick Log Button */}
      <QuickLogButton onReenter={() => handleReenterWithNewTime(item)} />


      {/* Menu Actions */}
      {isMenuVisible === item.id && (
        <>
          {/* Click outside to close */}
          <TouchableOpacity
            style={styles.menuBackdrop}
            onPress={() => setMenuVisible(null)}
          />

          {/* Menu Container */}
          <MenuContainer
            onEdit={() => {
              if (item && item.id) { // ✅ Ensure item exists before setting state
                setSelectedActivity({ ...item });
                setModalVisible(true);
                setMenuVisible(null);
              }
            }}
            onDelete={() => {
              if (item && item.id) { // ✅ Ensure item exists before deleting
                handleDeleteActivity(item.id);
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
      {/* ✅ Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} >
        <Text style={styles.cardHeader}>← </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button} // Reusing button style
          onPress={() => {
            setSelectedActivity(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>{i18n.t('TRACKERS.ACTIVITY.ADD')}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Activity List */}
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={styles.menuText}>{i18n.t('TRACKERS.ACTIVITY.NO_DATA')}</Text>

          </View>
        }
      />

      {/* Activity Modal */}
      {/* Activity Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
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
                    {selectedActivity ? "Edit Activity" : "Add Activity"}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.cardHeader}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                  style={styles.scrollContainer}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Type */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('LABELS.TYPE')}</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedActivity?.type || newActivity.type}
                      onChangeText={(text) =>
                        selectedActivity
                          ? setSelectedActivity({ ...selectedActivity, type: text })
                          : setNewActivity({ ...newActivity, type: text })
                      }
                    />
                  </View>

                  {/* Name */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('LABELS.NAME')}</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedActivity?.name || newActivity.name}
                      onChangeText={(text) =>
                        selectedActivity
                          ? setSelectedActivity({ ...selectedActivity, name: text })
                          : setNewActivity({ ...newActivity, name: text })
                      }
                    />
                  </View>

                  {/* Duration */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('LABELS.DURATION')} (minutes)</Text>
                    <TextInput
                      style={styles.input}
                      value={String(selectedActivity?.duration || newActivity.duration || '')}
                      onChangeText={(text) => {
                        const duration = parseInt(text) || undefined;
                        selectedActivity
                          ? setSelectedActivity({ ...selectedActivity, duration })
                          : setNewActivity({ ...newActivity, duration });
                      }}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Intensity */}
                  <View style={styles.section}>
                    <Text style={styles.text}>{i18n.t('LABELS.INTENSITY')}</Text>
                    <View style={styles.buttonContainer}>
                      {(['Low', 'Medium', 'High'] as const).map((intensity) => (
                        <TouchableOpacity
                          key={intensity}
                          style={[
                            styles.roundButton,
                            (selectedActivity?.intensity === intensity ||
                              (!selectedActivity && newActivity?.intensity === intensity)) &&
                            styles.roundButtonActive
                          ]}
                          onPress={() => {
                            if (selectedActivity) {
                              setSelectedActivity({ ...selectedActivity, intensity });
                            } else {
                              setNewActivity((prev) => ({
                                ...prev,
                                intensity: intensity || "Medium",
                              }));
                            }
                          }}
                        >
                          <Text style={styles.buttonText}>{intensity}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Notes Input (Prevents Overlapping with Keyboard) */}
                  <View style={[styles.section, { marginBottom: 20 }]}>
                    <Text style={styles.text}>{i18n.t('LABELS.NOTES')}</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedActivity?.notes || newActivity.notes}
                      onChangeText={(text) =>
                        selectedActivity
                          ? setSelectedActivity({ ...selectedActivity, notes: text })
                          : setNewActivity({ ...newActivity, notes: text })
                      }
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  {/* Save Button (Fixed at Bottom) */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={selectedActivity ? handleUpdateActivity : handleAddActivity}
                    >
                      <Text style={styles.buttonText}>{i18n.t('GENERAL_TRACKER.MODAL.SAVE')}</Text>
                    </TouchableOpacity>
                  </View>

                </ScrollView>



              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>



    </View>

  );



};

export default ActivityEntriesScreen;
