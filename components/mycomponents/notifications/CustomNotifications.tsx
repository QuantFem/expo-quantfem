import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {deleteNotification, scheduleCustomNotification} from "./notifications";
import useThemedStyles from "@/components/hooks/useThemedStyles";



const CustomNotifications: React.FC = () => {
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [customNotifications, setCustomNotifications] = useState<any[]>([]);
    const styles=useThemedStyles(); // ✅ Automatically gets updated styles
  

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const storedNotifications = JSON.parse(await AsyncStorage.getItem("customNotifications") || "[]");
    setCustomNotifications(storedNotifications);
  };

  const handleScheduleCustomNotification = async () => {
    if (customTitle.trim() === "" || customBody.trim() === "") {
      alert("Please enter both title and message.");
      return;
    }

    await scheduleCustomNotification(customTitle, customBody, selectedTime);
    setCustomTitle("");
    setCustomBody("");
    setSelectedTime(new Date());
    loadNotifications();
  };

  const handleDeleteNotification = async (id: number) => {
    await deleteNotification(id);
    loadNotifications();
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Custom Notifications</Text>
  
    <TextInput
      style={styles.input}
      placeholder="Notification Title"
      value={customTitle}
      onChangeText={setCustomTitle}
    />
  
    <TextInput
      style={styles.input}
      placeholder="Notification Message"
      value={customBody}
      onChangeText={setCustomBody}
    />
  
    <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.button, styles.roundButton]}>
      <Text style={styles.buttonText}>Pick Time: {selectedTime.toLocaleTimeString()}</Text>
    </TouchableOpacity>
  
    {showPicker && (
      <DateTimePicker
        value={selectedTime}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, date) => {
          setShowPicker(false);
          if (date) setSelectedTime(date);
        }}
      />
    )}
  
    <TouchableOpacity onPress={handleScheduleCustomNotification} style={[styles.button, styles.buttonPrimary]}>
      <Text style={styles.buttonText}>Add Notification</Text>
    </TouchableOpacity>
  
    <FlatList
      data={customNotifications}
      keyExtractor={(item) => item.id.toString()}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.text}>
            {item.title} - {new Date(item.time).toLocaleTimeString()}
          </Text>
          <TouchableOpacity onPress={() => handleDeleteNotification(item.id)}>
            <Text style={styles.textSmall}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
  
  );
};


export default CustomNotifications;
