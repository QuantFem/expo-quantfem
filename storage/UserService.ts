import db from "@/storage/db";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { scheduleNotification } from "@/components/mycomponents/notifications/notifications";
import { HistoryEntry } from "@/types/types";

export interface UserStorageInfo {
  databaseSize: number;
  availableSpace: number;
  totalSpace: number;
  isStorageCritical: boolean;
}

export interface UserSettings {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

interface DBUserSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export class UserService {
  private static readonly MAX_DB_SIZE_MB = Platform.OS === 'ios' ? 50 : 100; // 50MB for iOS, 100MB for Android
  private static readonly STORAGE_WARNING_THRESHOLD = 0.8; // 80% of max size
  private static readonly CLEANUP_THRESHOLD = 0.9; // 90% of max size

  // Initialize user storage settings
  static async initializeStorage(): Promise<boolean> {
    try {
      // Set database pragma settings for better performance and reliability
      await db.execSync(`
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA temp_store = MEMORY;
        PRAGMA cache_size = 10000;
      `);

      // Create user_settings table if it doesn't exist
      await db.execSync(`
        CREATE TABLE IF NOT EXISTS user_settings (
          id TEXT PRIMARY KEY,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create user_logs table if it doesn't exist
      await db.execSync(`
        CREATE TABLE IF NOT EXISTS user_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          next_change TEXT
        );
      `);

      // Create indexes for better performance
      await db.execSync(`
        CREATE INDEX IF NOT EXISTS idx_user_settings_key ON user_settings(key);
        CREATE INDEX IF NOT EXISTS idx_user_logs_timestamp ON user_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_user_logs_action ON user_logs(action);
      `);

      console.log("✅ User storage initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize user storage:", error);
      return false;
    }
  }

  // Get current storage information
  static async getStorageInfo(): Promise<UserStorageInfo> {
    try {
      // Get database file size
      const dbPath = FileSystem.documentDirectory + "SQLite/quantfem.db";
      const dbInfo = await FileSystem.getInfoAsync(dbPath, { size: true });
      const databaseSize = ('size' in dbInfo) ? dbInfo.size : 0;

      // Get device storage info
      const deviceStorage = await FileSystem.getFreeDiskStorageAsync();
      const totalStorage = await FileSystem.getTotalDiskCapacityAsync();

      const maxDbSizeBytes = this.MAX_DB_SIZE_MB * 1024 * 1024;
      const isStorageCritical = databaseSize > (maxDbSizeBytes * this.CLEANUP_THRESHOLD);

      return {
        databaseSize,
        availableSpace: deviceStorage,
        totalSpace: totalStorage,
        isStorageCritical
      };
    } catch (error) {
      console.error("❌ Failed to get storage info:", error);
      throw error;
    }
  }

  // Check if storage is reaching critical levels
  static async checkStorageStatus(): Promise<{
    needsWarning: boolean;
    needsCleanup: boolean;
  }> {
    try {
      const { databaseSize } = await this.getStorageInfo();
      const maxDbSizeBytes = this.MAX_DB_SIZE_MB * 1024 * 1024;

      return {
        needsWarning: databaseSize > (maxDbSizeBytes * this.STORAGE_WARNING_THRESHOLD),
        needsCleanup: databaseSize > (maxDbSizeBytes * this.CLEANUP_THRESHOLD)
      };
    } catch (error) {
      console.error("❌ Failed to check storage status:", error);
      throw error;
    }
  }

  // Create a new user setting
  static async createSetting(setting: UserSettings): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO user_settings (
          id, key, value, updated_at
        ) VALUES (
          '${setting.id}',
          '${setting.key}',
          '${setting.value.replace(/'/g, "''")}',
          '${setting.updatedAt}'
        );`
      );

      console.log("✅ User setting created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create user setting:", error);
      return false;
    }
  }

  // Get a specific user setting by key
  static async getSettingByKey(key: string): Promise<UserSettings | null> {
    try {
      const results = await db.getAllAsync<DBUserSettings>(
        "SELECT * FROM user_settings WHERE key = ?;",
        [key]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No user setting found for key:", key);
        return null;
      }

      const row = results[0];
      return {
        id: row.id,
        key: row.key,
        value: row.value,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error("❌ Failed to fetch user setting:", error);
      return null;
    }
  }

  // Get all user settings
  static async getAllSettings(): Promise<UserSettings[]> {
    try {
      const results = await db.getAllAsync<DBUserSettings>(
        "SELECT * FROM user_settings ORDER BY updated_at DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No user settings found.");
        return [];
      }

      return results.map((row) => ({
        id: row.id,
        key: row.key,
        value: row.value,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error("❌ Failed to fetch user settings:", error);
      return [];
    }
  }

  // Update a user setting
  static async updateSetting(id: string, updates: Partial<UserSettings>): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.key !== undefined) {
        updateParts.push(`key = '${updates.key}'`);
      }
      if (updates.value !== undefined) {
        updateParts.push(`value = '${updates.value.replace(/'/g, "''")}'`);
      }
      updateParts.push("updated_at = CURRENT_TIMESTAMP");

      if (updateParts.length === 0) return false;

      await db.execSync(`
        UPDATE user_settings 
        SET ${updateParts.join(', ')}
        WHERE id = '${id}';
      `);

      console.log("✅ User setting updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update user setting:", error);
      return false;
    }
  }

  // Delete a user setting
  static async deleteSetting(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM user_settings WHERE id = '${id}';`);
      console.log("✅ User setting deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete user setting:", error);
      return false;
    }
  }

  // Delete all user settings
  static async deleteAllSettings(): Promise<boolean> {
    try {
      await db.execSync("DELETE FROM user_settings;");
      console.log("✅ All user settings deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete all user settings:", error);
      return false;
    }
  }

  // Clean up old data based on retention policy
  static async cleanupOldData(retentionDays: number = 365): Promise<boolean> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      const cutoffDateStr = cutoffDate.toISOString();

      // Begin transaction
      await db.execAsync('BEGIN TRANSACTION;');

      // Clean up old data from each table
      const cleanupQueries = [
        "DELETE FROM user_logs WHERE timestamp < ?;",
        "DELETE FROM health_entries WHERE date < ?;",
        "DELETE FROM mood_journals WHERE date < ?;",
        "DELETE FROM sleep_entries WHERE date < ?;",
        "DELETE FROM activities WHERE lastUsed < ?;",
        "DELETE FROM nutrition WHERE lastUsed < ?;",
        "DELETE FROM symptoms WHERE lastUsed < ?;",
        "DELETE FROM medications WHERE endDate < ? AND endDate IS NOT NULL;",
        "DELETE FROM cycle_entries WHERE endDate < ? AND endDate IS NOT NULL;"
      ];

      for (const query of cleanupQueries) {
        await db.execSync(`${query.replace('?', `'${cutoffDateStr}'`)}`);
      }

      // Vacuum database to reclaim space
      await db.execAsync('VACUUM;');
      
      // Commit transaction
      await db.execAsync('COMMIT;');

      console.log("✅ Old data cleaned up successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to clean up old data:", error);
      // Rollback transaction on error
      await db.execAsync('ROLLBACK;');
      return false;
    }
  }

  // Export user data
  static async exportUserData(): Promise<string> {
    try {
      const tables = [
        'user_logs', 'health_entries', 'mood_journals', 
        'sleep_entries', 'activities', 'nutrition',
        'symptoms', 'medications', 'cycle_entries'
      ];
      
      const exportData: { [key: string]: any[] } = {};

      for (const table of tables) {
        const data = await db.getAllAsync(`SELECT * FROM ${table};`);
        exportData[table] = data;
      }

      const exportString = JSON.stringify(exportData);
      
      // Save to file in app documents directory
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `quantfem_backup_${timestamp}.json`;
      const filePath = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(filePath, exportString);

      return filePath;
    } catch (error) {
      console.error("❌ Failed to export user data:", error);
      throw error;
    }
  }

  // Import user data
  static async importUserData(filePath: string): Promise<boolean> {
    try {
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const importData = JSON.parse(fileContent);

      await db.execAsync('BEGIN TRANSACTION;');

      for (const [table, data] of Object.entries(importData)) {
        if (!Array.isArray(data)) continue;

        // Clear existing table data
        await db.execAsync(`DELETE FROM ${table};`);

        // Insert new data
        for (const row of data) {
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row)
            .map(val => (val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`))
            .join(', ');

          await db.execAsync(`
            INSERT INTO ${table} (${columns})
            VALUES (${values});
          `);
        }
      }

      await db.execAsync('COMMIT;');
      return true;
    } catch (error) {
      console.error("❌ Failed to import user data:", error);
      await db.execAsync('ROLLBACK;');
      return false;
    }
  }

  // Optimize database
  static async optimizeDatabase(): Promise<boolean> {
    try {
      await db.execAsync('BEGIN TRANSACTION;');

      // Analyze tables for query optimization
      await db.execAsync('ANALYZE;');

      // Rebuild indexes
      await db.execAsync('REINDEX;');

      // Compact the database
      await db.execAsync('VACUUM;');

      await db.execAsync('COMMIT;');

      console.log("✅ Database optimized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to optimize database:", error);
      await db.execAsync('ROLLBACK;');
      return false;
    }
  }

  // Log user action with optional notification
  static async logUserAction(action: string, nextChangeInHours?: number): Promise<boolean> {
    try {
      if (!action || action.trim() === "") {
        console.error("❌ Error: Action cannot be empty");
        return false;
      }

      const currentTime = new Date().toISOString();
      const nextChangeTime = nextChangeInHours
        ? new Date(Date.now() + nextChangeInHours * 60 * 60 * 1000).toISOString()
        : null;

      await db.execSync(
        `INSERT INTO user_logs (action, timestamp, next_change) 
         VALUES ('${action}', '${currentTime}', ${nextChangeTime ? `'${nextChangeTime}'` : "NULL"});`
      );
      console.log(`✅ Action logged: ${action}`);

      // Schedule notification if next change is provided
      if (nextChangeInHours) {
        await scheduleNotification(
          `Reminder: ${action}`,
          `It's time to ${action.toLowerCase()}.`,
          nextChangeInHours
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to log action:", error);
      return false;
    }
  }

  // Fetch user logs
  static async fetchUserLogs(): Promise<HistoryEntry[]> {
    try {
      const results = await db.getAllAsync("SELECT * FROM user_logs ORDER BY timestamp DESC;");

      if (!results || !Array.isArray(results)) {
        console.error("❌ Error: Unexpected response from SQLite query");
        return [];
      }

      return results.map((row: any) => ({
        id: row.id.toString(),
        action: row.action,
        timestamp: new Date(row.timestamp).toISOString(),
        nextChange: row.next_change ? new Date(row.next_change).toISOString() : undefined,
      }));
    } catch (error) {
      console.error("❌ Error fetching history:", error);
      return [];
    }
  }

  // Delete history entry
  static async deleteHistoryEntry(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM user_logs WHERE id = '${id}';`);
      console.log(`✅ History entry deleted: ${id}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to delete history entry:", error);
      return false;
    }
  }

  // Delete today's history entry
  static async deleteTodaysHistoryEntry(action: string): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set to start of tomorrow

      await db.execSync(
        `DELETE FROM user_logs 
         WHERE action = '${action}' 
         AND timestamp >= '${today.toISOString()}' 
         AND timestamp < '${tomorrow.toISOString()}';`
      );
      console.log(`✅ Today's history entry deleted: ${action}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to delete today's history entry:", error);
      return false;
    }
  }
} 