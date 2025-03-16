import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { CalendarDataService } from "@/storage/CalendarService";
import db from "@/storage/db";

export const exportData = async () => {
  try {
    // Fetch Tracker Data
    const trackerItems = await CalendarDataService.getAllCalendarItems();
    // Fetch History Data
    const historyResults = await db.getAllAsync("SELECT * FROM user_logs ORDER BY timestamp DESC;");

    const formattedHistory = historyResults?.map((row: any) => ({
      id: row.id.toString(),
      action: row.action,
      timestamp: new Date(row.timestamp).toISOString(),
      nextChange: row.next_change ? new Date(row.next_change).toISOString() : undefined,
    }));

    // Create JSON Data
    const jsonData = JSON.stringify({ trackerData: trackerItems, historyData: formattedHistory }, null, 2);

    // Define JSON file path
    const fileUri = `${FileSystem.documentDirectory}tracker_history.json`;

    // Write JSON file
    await FileSystem.writeAsStringAsync(fileUri, jsonData, { encoding: FileSystem.EncodingType.UTF8 });

    // Ensure the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      Alert.alert("Error", "File could not be created.");
      return;
    }

    // Check if sharing is available
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Sharing is not available on this device.");
      console.log("File saved at:", fileUri);
      return;
    }

    // Share the JSON file with explicit MIME type
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Export Tracker Data",
      UTI: "public.json",
    });

  } catch (error) {
    console.error("Error exporting data:", error);
    Alert.alert("Export Failed", "An error occurred while exporting data.");
  }
};

