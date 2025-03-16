import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { MoodJournalService } from "@/storage/MoodService";
import { MoodJournal } from "@/types/types";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import LocalFormatter from "@/components/mycomponents/setup/formatDate";
import { useNavigation } from "@react-navigation/native";
import BackButton from "@/components/mycomponents/setup/BackButton";


// Predefined emoji options with their meanings
const moodEmojis = [
  { emoji: "😊", meaning: "Happy" },
  { emoji: "😢", meaning: "Sad" },
  { emoji: "😐", meaning: "Neutral" },
  { emoji: "😡", meaning: "Angry" },
  { emoji: "😴", meaning: "Tired" },
  { emoji: "🥰", meaning: "Loved" },
  { emoji: "😰", meaning: "Anxious" },
  { emoji: "🤗", meaning: "Grateful" },
];

const MoodJournalScreen: React.FC = () => {
  const [entries, setEntries] = useState<MoodJournal[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MoodJournal | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<MoodJournal>>({
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    mood: "😊", // default mood
    notes: ""
  });

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = async () => {
    try {
      const results = await MoodJournalService.getAllMoodEntries();
      setEntries(results);
    } catch (error) {
      console.error("❌ Error fetching mood entries:", error);
    }
  };

  const addMoodEntry = async () => {
    if (!newEntry.date || !newEntry.mood) {
      alert("Please select a date and mood");
      return;
    }

    const entry: MoodJournal = {
      date: newEntry.date,
      timestamp: new Date().toISOString(),
      mood: newEntry.mood,
      notes: newEntry.notes || ""
    };

    const success = await MoodJournalService.createMoodEntry(entry);
    if (success) {
      loadMoodEntries();
      setAddModalVisible(false);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        mood: "😊",
        notes: ""
      });
    }
  };

  const deleteEntry = async (id: number) => {
    const success = await MoodJournalService.deleteMoodEntry(id);
    if (success) {
      loadMoodEntries();
    }
  };

  const editEntry = async () => {
    if (!selectedEntry?.id) return;

    const success = await MoodJournalService.updateMoodEntry(
      selectedEntry.id,
      {
        mood: selectedEntry.mood,
        notes: selectedEntry.notes
      }
    );

    if (success) {
      loadMoodEntries();
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: MoodJournal }) => {

    return (
      <View style={styles.card}>
        <View style={styles.buttonContainer}>
          <Text style={styles.cardHeader}>
            {LocalFormatter({ date: new Date(item.date) })}
          </Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setSelectedEntry({ ...item, notes: item.notes || "" })}
          >
            <Text style={styles.title}>⋮</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardHeader}>{item.mood}</Text>

        {item.notes && <Text style={styles.text}>{item.notes}</Text>}

        {selectedEntry?.id === item.id && (
          <MenuContainer
            onEdit={() => {
              setSelectedEntry({ ...item, notes: item.notes || "" });
              setModalVisible(true);
            }}
            onDelete={() => {
              if (item.id) deleteEntry(item.id);
            }}
            setActiveMenu={() => { }} // No-op function
          />
        )}


      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <BackButton />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSelectedEntry(null); // Ensure we're in "Add" mode
            setModalVisible(true);  // Open the existing modal
          }}
        >
          <Text style={styles.buttonText}>{i18n.t('TRACKERS.MOOD.ADD')}</Text>

        </TouchableOpacity>
      </View>


      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Date.now().toString()}
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={styles.text}>{i18n.t('TRACKERS.MOOD.NO_DATA')}</Text>

          </View>
        }
      />
      {/* Add/Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              <Text style={styles.modalHeader}>
                {selectedEntry ? 'Edit Mood Entry' : 'New Mood Entry'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.text}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Mood Emoji Selection */}
            <View style={styles.buttonContainer}>
              <FlatList
                data={moodEmojis}
                keyExtractor={(item) => item.emoji}
                numColumns={4} // Ensures 4 emojis per row
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.roundButton,
                      (selectedEntry?.mood ?? newEntry.mood) === item.emoji &&
                      styles.roundButtonActive,
                    ]}
                    onPress={() =>
                      selectedEntry
                        ? setSelectedEntry({ ...selectedEntry, mood: item.emoji })
                        : setNewEntry({ ...newEntry, mood: item.emoji })
                    }
                  >
                    <Text style={styles.buttonText}>{item.emoji}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Notes Input */}
            <TextInput
              style={styles.input}
              value={selectedEntry ? selectedEntry.notes : newEntry.notes}
              onChangeText={(text) =>
                selectedEntry
                  ? setSelectedEntry({ ...selectedEntry, notes: text })
                  : setNewEntry({ ...newEntry, notes: text })
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Buttons for Save and Delete (Only show Delete if editing) */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => {
                  if (selectedEntry) {
                    editEntry();
                  } else {
                    addMoodEntry();
                  }
                  setModalVisible(false); // Close modal after action
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
        </View>
      </Modal>

    </View>
  );



};



export default MoodJournalScreen;
