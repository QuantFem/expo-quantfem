import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { CalendarDataService, CalendarItem } from "@/storage/CalendarService";
import db from "@/storage/db";
import i18n from "@/components/mycomponents/setup/localization/localization";

export const importData = async () => {
  try {
    // Pick a file
    const result = await DocumentPicker.getDocumentAsync({ type: ["application/json", "text/csv"] });
    if (result.canceled || !result.assets?.[0]?.uri) return; // User cancels or invalid file

    // Read file contents
    const fileUri = result.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const fileType = result.assets[0].mimeType;

    if (fileType === "application/json") {
      await handleJSONImport(fileContent);
    } else if (fileType === "text/csv") {
      await handleCSVImport(fileContent);
    } else {
      Alert.alert("Unsupported file type", "Please select a JSON or CSV file.");
    }
  } catch (error) {
    console.error("❌ Error importing data:", error);
    Alert.alert("Import Failed", "An error occurred while importing data.");
  }
};


  const handleJSONImport = async (jsonString: string) => {
    try {
      const jsonData = JSON.parse(jsonString);
      const { trackerData, historyData } = jsonData;
  
      let trackerSuccess = 0;
      let trackerFailed = 0;
      let historySuccess = 0;
      let historyFailed = 0;
  
      // ✅ Insert Tracker Data (Skip invalid entries)
      if (Array.isArray(trackerData) && trackerData.length > 0) {
        for (const event of trackerData) {
          if (!event?.id || !event?.date || !event?.type) {
            console.warn(`⚠️ Skipping invalid tracker event:`, event);
            trackerFailed++;
            continue;
          }
  
          try {
            // Ensure valid data types
            const cleanEvent: CalendarItem = {
              id: String(event.id),
              date: new Date(event.date),
              type: String(event.type) as CalendarItem["type"],
              details: event.details || {},
            };
  
            await CalendarDataService.addCalendarItem(cleanEvent);
            trackerSuccess++;
          } catch (error: any) {
            console.error(`❌ Failed to add tracker event ${event.id}:`, error.message);
            trackerFailed++;
          }
        }
      } else {
        console.warn("⚠️ No valid tracker data found.");
      }
  
      // ✅ Insert History Data (Skip invalid entries)
      if (Array.isArray(historyData) && historyData.length > 0) {
        for (const entry of historyData) {
          if (!entry?.id || !entry?.timestamp || !entry?.action) {
            console.warn(`⚠️ Skipping invalid history entry:`, entry);
            historyFailed++;
            continue;
          }
  
          try {
            // Prevent duplicate history entries
            const existingHistory = await db.getFirstAsync("SELECT id FROM user_logs WHERE id = ?;", [String(entry.id)]);
            if (existingHistory) {
              console.warn(`⚠️ Duplicate history entry skipped: ${entry.id}`);
              continue;
            }
  
            await db.runAsync(
              "INSERT INTO user_logs (id, action, timestamp, next_change) VALUES (?, ?, ?, ?);",
              [
                String(entry.id),
                String(entry.action),
                new Date(entry.timestamp).toISOString(), // Ensure correct timestamp format
                entry.nextChange ? new Date(entry.nextChange).toISOString() : null,
              ]
            );
            historySuccess++;
          } catch (error: any) {
            console.error(`❌ Failed to add history entry ${entry.id}:`, error.message);
            historyFailed++;
          }
        }
      } else {
        console.warn("⚠️ No valid history data found.");
      }
  
      // ✅ Final Success Message
      Alert.alert(
        i18n.t('ALERTS.SUCCESS.IMPORT'),
        i18n.t('ALERTS.SUCCESS.IMPORT_DETAILS', {
          trackerSuccess,
          trackerFailed,
          historySuccess,
          historyFailed
        })
      );
  
    } catch (error: any) {
      console.error("❌ Critical Error Parsing JSON:", error.message);
      Alert.alert(i18n.t('ALERTS.ERROR.IMPORT'), i18n.t('ALERTS.ERROR.INVALID_FORMAT'));
    }
  };

const handleCSVImport = async (csvString: string) => {
  try {
    const lines = csvString.trim().split("\n");
    if (lines.length < 2) {
      Alert.alert("Error", "CSV file is empty or incorrectly formatted.");
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    if (!headers.includes("Type") || !headers.includes("Date")) {
      Alert.alert("Error", "Invalid CSV format. Ensure the first row has 'Type' and 'Date' columns.");
      return;
    }

    const typeIndex = headers.indexOf("Type");
    const dateIndex = headers.indexOf("Date");
    const detailsIndex = headers.indexOf("Details");

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length < 2) continue; // Skip empty lines

      const type = values[typeIndex];
      const date = new Date(values[dateIndex]);
      const details = detailsIndex !== -1 ? values[detailsIndex] : null;

      if (isNaN(date.getTime())) {
        console.warn(`⚠️ Skipping invalid date at row ${i + 1}:`, values);
        continue;
      }

      if (!type) {
        console.warn(`⚠️ Skipping row with missing type at row ${i + 1}:`, values);
        continue;
      }

      if (type.toLowerCase() === "tracker") {
        await CalendarDataService.addCalendarItem({
          id: `${Date.now()}-${i}`,
          date,
          type: "health",
          details: { notes: details || "No details provided" },
        });
      } else if (type.toLowerCase() === "history") {
        await db.runAsync(
          "INSERT INTO user_logs (id, action, timestamp) VALUES (?, ?, ?);",
          [`${Date.now()}-${i}`, details || "No action specified", date.toISOString()]
        );
      } else {
        console.warn(`⚠️ Unrecognized type '${type}' at row ${i + 1}, skipping.`);
      }
    }

    Alert.alert("Success", "CSV data imported successfully.");
  } catch (error) {
    console.error("❌ Error processing CSV:", error);
    Alert.alert("Error", "Failed to import CSV. Ensure it's formatted correctly.");
  }
};

{/**
    
   const handleJSONImport = async (jsonString: string) => {
    try {
      const jsonData = JSON.parse(jsonString);
      const { trackerData, historyData } = jsonData;
  
      let trackerSuccess = 0;
      let trackerFailed = 0;
      let historySuccess = 0;
      let historyFailed = 0;
  
      // ✅ Insert Tracker Data (Skip invalid entries)
      if (trackerData?.length) {
        for (const event of trackerData) {
          if (!event.id || !event.date || !event.type) {
            console.warn(`⚠️ Skipping invalid tracker event:`, event);
            trackerFailed++;
            continue;
          }
          try {
            await CalendarDataService.addCalendarItem({
              id: event.id,
              date: new Date(event.date),
              type: event.type,
              details: event.details || {},
            });
            trackerSuccess++;
          } catch (error) {
            console.error(`❌ Failed to add tracker event ${event.id}:`, error);
            trackerFailed++;
          }
        }
      }
  
      // ✅ Insert History Data (Skip invalid entries)
      if (historyData?.length) {
        for (const entry of historyData) {
          if (!entry.id || !entry.timestamp || !entry.action) {
            console.warn(`⚠️ Skipping invalid history entry:`, entry);
            historyFailed++;
            continue;
          }
  
          try {
            // Prevent duplicate history entries
            const existingHistory = await db.getFirstAsync("SELECT id FROM user_logs WHERE id = ?;", [entry.id]);
            if (existingHistory) {
              console.warn(`⚠️ Duplicate history entry skipped: ${entry.id}`);
              continue;
            }
  
            await db.runAsync(
              "INSERT INTO user_logs (id, action, timestamp, next_change) VALUES (?, ?, ?, ?);",
              [entry.id, entry.action, entry.timestamp, entry.nextChange || null]
            );
            historySuccess++;
          } catch (error) {
            console.error(`❌ Failed to add history entry ${entry.id}:`, error);
            historyFailed++;
          }
        }
      }
  
      // ✅ Final Success Message
      Alert.alert(
        "Import Completed",
        `✅ Tracker: ${trackerSuccess} imported, ${trackerFailed} failed.\n✅ History: ${historySuccess} imported, ${historyFailed} failed.`
      );
  
    } catch (error) {
      console.error("❌ Error parsing JSON:", error);
      Alert.alert("Error", "Invalid JSON format.");
    }
  }; 
    
    */}

