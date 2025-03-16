import { UserService } from './UserService';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import * as Sharing from 'expo-sharing';
import db from "@/storage/db";
import { CalendarDataService } from './CalendarService';

interface DataStats {
    totalEntries: number;
    earliestEntry: string;
    latestEntry: string;
    categoryCounts: {
        symptoms: number;
        medications: number;
        cycles: number;
        moods: number;
        sleep: number;
        nutrition: number;
    };
}

interface BackupData {
    [key: string]: Array<Record<string, string | number | boolean | null>>;
}

interface DbResult {
    [key: string]: string | number | boolean | null;
}

export class DataHealthService {
    static async getStorageInfo() {
        try {
            const dbPath = `${FileSystem.documentDirectory}SQLite/quantfem.db`;
            const dbInfo = await FileSystem.getInfoAsync(dbPath, { size: true });
            const dbSize = dbInfo.exists && 'size' in dbInfo ? dbInfo.size : 0;
            const availableSpace = await FileSystem.getFreeDiskStorageAsync();

            return {
                databaseSize: dbSize,
                availableSpace: availableSpace,
                isStorageCritical: availableSpace < 100 * 1024 * 1024 // Less than 100MB is critical
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            throw error;
        }
    }

    static async getDataStats(): Promise<DataStats> {
        try {
            // Get all calendar items
            const allData = await CalendarDataService.getAllCalendarItems();
            
            // Sort data by date
            const sortedData = allData.sort((a, b) => a.date.getTime() - b.date.getTime());

            return {
                totalEntries: allData.length,
                earliestEntry: sortedData[0]?.date.toISOString() || new Date().toISOString(),
                latestEntry: sortedData[sortedData.length - 1]?.date.toISOString() || new Date().toISOString(),
                categoryCounts: {
                    symptoms: allData.filter(d => d.type === 'symptom').length,
                    medications: allData.filter(d => d.type === 'medication').length,
                    cycles: allData.filter(d => d.type === 'cycle').length,
                    moods: allData.filter(d => d.type === 'mood').length,
                    sleep: allData.filter(d => d.type === 'sleep').length,
                    nutrition: allData.filter(d => d.type === 'nutrition').length,
                }
            };
        } catch (error) {
            console.error('Failed to get data stats:', error);
            throw error;
        }
    }

    static async getBackupSettings() {
        try {
            // TODO: Implement backup settings storage
            return {
                autoBackup: true,
                reminderInterval: 7, // days
                lastBackupDate: await this.getLastBackupDate()
            };
        } catch (error) {
            console.error('Failed to get backup settings:', error);
            throw error;
        }
    }

    static async createEncryptedBackup(): Promise<boolean> {
        try {
            const tables = [
                'health_entries',
                'symptoms',
                'medications',
                'cycles',
                'moods',
                'sleep_entries',
                'nutrition'
            ];

            const backupData: BackupData = {};

            for (const table of tables) {
                const data = await db.getAllAsync<DbResult>(`SELECT * FROM ${table};`);
                backupData[table] = data;
            }

            const jsonData = JSON.stringify(backupData);
            const key = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                Date.now().toString()
            );

            if (!key) {
                throw new Error('Failed to generate encryption key');
            }

            const encryptedData = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA512,
                jsonData + key
            );

            if (!encryptedData) {
                throw new Error('Failed to encrypt data');
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `quantfem_backup_${timestamp}.enc`;
            const filePath = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(filePath, encryptedData);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filePath, {
                    mimeType: 'application/octet-stream',
                    dialogTitle: 'Export QuantFem Data'
                });
                return true;
            }

            return false;
        } catch (error) {
            console.error('Failed to create encrypted backup:', error);
            throw error;
        }
    }

    static async cleanupOldData(retentionDays: number = 365): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

            // Begin transaction
            await db.execAsync('BEGIN TRANSACTION;');

            // Delete old data from each table
            const tables = [
                'health_entries',
                'symptoms',
                'medications',
                'cycles',
                'moods',
                'sleep_entries',
                'nutrition'
            ];

            let totalDeleted = 0;

            for (const table of tables) {
                const result = await db.runAsync(
                    `DELETE FROM ${table} WHERE date < ?;`,
                    [cutoffDate.toISOString()]
                );
                totalDeleted += result.changes || 0;
            }

            // Vacuum database to reclaim space
            await db.execAsync('VACUUM;');
            
            // Commit transaction
            await db.execAsync('COMMIT;');

            return totalDeleted;
        } catch (error) {
            console.error('Failed to cleanup old data:', error);
            // Rollback on error
            await db.execAsync('ROLLBACK;');
            throw error;
        }
    }

    static async restoreFromBackup(filePath: string): Promise<boolean> {
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                throw new Error('Backup file does not exist');
            }

            const encryptedData = await FileSystem.readAsStringAsync(filePath);
            if (!encryptedData || encryptedData.trim() === '') {
                throw new Error('Backup file is empty');
            }

            await db.execAsync('BEGIN TRANSACTION;');

            const tables = [
                'health_entries',
                'symptoms',
                'medications',
                'cycles',
                'moods',
                'sleep_entries',
                'nutrition'
            ];

            for (const table of tables) {
                await db.execAsync(`DELETE FROM ${table};`);
            }

            let backupData: BackupData;
            try {
                backupData = JSON.parse(encryptedData) as BackupData;
            } catch (e) {
                throw new Error('Invalid backup file format');
            }

            for (const [table, data] of Object.entries(backupData)) {
                if (!Array.isArray(data)) continue;

                for (const row of data) {
                    const columns = Object.keys(row);
                    if (columns.length === 0) continue;

                    const placeholders = columns.map(() => '?').join(', ');
                    const values = columns.map(col => {
                        const val = row[col];
                        return val === null ? null : String(val);
                    });

                    // Skip if all values are null
                    if (values.every(v => v === null)) continue;

                    // Filter out null values and their corresponding columns
                    const validPairs = columns.map((col, i) => ({ col, val: values[i] }))
                        .filter((pair): pair is { col: string, val: string } => pair.val !== null);

                    if (validPairs.length > 0) {
                        const validColumns = validPairs.map(p => p.col).join(', ');
                        const validPlaceholders = validPairs.map(() => '?').join(', ');
                        const validValues = validPairs.map(p => p.val);

                        await db.runAsync(
                            `INSERT INTO ${table} (${validColumns}) VALUES (${validPlaceholders});`,
                            validValues
                        );
                    }
                }
            }

            await db.execAsync('COMMIT;');
            return true;
        } catch (error) {
            console.error('Failed to restore from backup:', error);
            await db.execAsync('ROLLBACK;');
            throw error;
        }
    }

    private static async getDatabaseSize(): Promise<number> {
        try {
            const dbInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/quantfem.db');
            return dbInfo.exists ? Math.round(dbInfo.size / 1024 / 1024) : 0; // Convert to MB
        } catch (error) {
            console.error('Failed to get database size:', error);
            return 0;
        }
    }

    private static async getAvailableSpace(): Promise<number> {
        try {
            const fileInfo = await FileSystem.getFreeDiskStorageAsync();
            return Math.round(fileInfo / 1024 / 1024); // Convert to MB
        } catch (error) {
            console.error('Failed to get available space:', error);
            return 1000; // Default to 1GB to prevent critical warnings
        }
    }

    private static async getLastBackupDate(): Promise<string | undefined> {
        try {
            const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
            const backupFiles = files.filter(f => f.startsWith('quantfem_backup_'));
            if (backupFiles.length === 0) return undefined;

            const lastBackup = backupFiles
                .map(f => f.replace('quantfem_backup_', '').replace('.enc', ''))
                .sort()
                .pop();

            return lastBackup ? new Date(lastBackup).toISOString() : undefined;
        } catch (error) {
            console.error('Failed to get last backup date:', error);
            return undefined;
        }
    }

    private static async updateLastBackupDate() {
        // TODO: Implement backup date storage
    }

    private static async encryptData(data: string, key: string): Promise<string> {
        try {
            // Simple XOR encryption for demo
            // In production, use a proper encryption library
            const encrypted = Array.from(data)
                .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
                .join('');
            return encrypted;
        } catch (error) {
            console.error('Failed to encrypt data:', error);
            throw error;
        }
    }
} 