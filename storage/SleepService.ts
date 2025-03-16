import db from "@/storage/db";
import {SleepEntry} from "@/types/types";

export class SleepService {
    // Create a new sleep entry
    static async createSleepEntry(entry: SleepEntry): Promise<boolean> {
        try {
            await db.execSync(
                `INSERT INTO sleep_entries (
          id, date, bedTime, wakeTime, sleepQuality, nightWakeups, notes
        ) VALUES (
          '${entry.id}',
          '${entry.date}',
          '${entry.bedTime}',
          '${entry.wakeTime}',
          ${entry.sleepQuality},
          ${entry.nightWakeups? `'${JSON.stringify(entry.nightWakeups)}'`:'NULL'},
          ${entry.notes? `'${entry.notes.replace(/'/g,"''")}'`:'NULL'}
        );`
            );

            console.log("✅ Sleep entry created successfully");
            return true;
        } catch(error) {
            console.error("❌ Failed to create sleep entry:",error);
            return false;
        }
    }

    // Get sleep entry by ID
    static async getSleepEntryById(id: string): Promise<SleepEntry|null> {
        try {
            const results=await db.getAllAsync<SleepEntry>(
                `SELECT * FROM sleep_entries WHERE id = ?;`,
                [id]
            );

            if(!results||results.length===0) {
                console.warn("⚠️ No sleep entry found for ID:",id);
                return null;
            }

            const row=results[0];
            return {
                id: row.id,
                date: row.date,
                bedTime: row.bedTime,
                wakeTime: row.wakeTime,
                sleepQuality: row.sleepQuality,
                nightWakeups: row.nightWakeups,
                notes: row.notes,
            };
        } catch(error) {
            console.error("❌ Failed to fetch sleep entry:",error);
            return null;
        }
    }

    // Get all sleep entries
    static async getAllSleepEntries(): Promise<SleepEntry[]> {
        try {
            const results=await db.getAllAsync<SleepEntry>(
                "SELECT * FROM sleep_entries ORDER BY date DESC;"
            );

            if(!results||!Array.isArray(results)||results.length===0) {
                console.warn("⚠️ No sleep entries found.");
                return [];
            }

            return results.map((row) => ({
                id: row.id,
                date: row.date,
                bedTime: row.bedTime,
                wakeTime: row.wakeTime,
                sleepQuality: row.sleepQuality,
                nightWakeups: row.nightWakeups,
                notes: row.notes,
            }));
        } catch(error) {
            console.error("❌ Failed to fetch sleep entries:",error);
            return [];
        }
    }

    // Update a sleep entry
    static async updateSleepEntry(
    id: string,
    updates: Partial<Omit<SleepEntry, 'id'>>
): Promise<boolean> {
    try {
        const updateParts = [];
        if (updates.date !== undefined) updateParts.push(`date = '${updates.date}'`);
        if (updates.bedTime !== undefined) updateParts.push(`bedTime = '${updates.bedTime}'`);
        if (updates.wakeTime !== undefined) updateParts.push(`wakeTime = '${updates.wakeTime}'`);
        if (updates.sleepQuality !== undefined) updateParts.push(`sleepQuality = ${updates.sleepQuality}`);
        if (updates.nightWakeups !== undefined) {
            updateParts.push(`nightWakeups = '${JSON.stringify(updates.nightWakeups).replace(/'/g, "''")}'`);
        }
        if (updates.notes !== undefined) {
            updateParts.push(`notes = '${updates.notes.replace(/'/g, "''")}'`);
        }

        if (updateParts.length === 0) return false;

        await db.execSync(
            `UPDATE sleep_entries SET ${updateParts.join(", ")} WHERE id = '${id}';`
        );

        console.log("✅ Sleep entry updated successfully");
        return true;
    } catch (error) {
        console.error("❌ Failed to update sleep entry:", error);
        return false;
    }
}


    // Delete a sleep entry
    static async deleteSleepEntry(id: string): Promise<boolean> {
        try {
            await db.execSync(`DELETE FROM sleep_entries WHERE id = '${id}'`);
            console.log("✅ Sleep entry deleted successfully");
            return true;
        } catch(error) {
            console.error("❌ Failed to delete sleep entry:",error);
            return false;
        }
    }

    // Delete all sleep entries
    static async deleteAllSleepEntries(): Promise<boolean> {
        try {
            await db.execSync("DELETE FROM sleep_entries;");
            console.log("✅ All sleep entries deleted successfully");
            return true;
        } catch(error) {
            console.error("❌ Failed to delete all sleep entries:",error);
            return false;
        }
    }
}
