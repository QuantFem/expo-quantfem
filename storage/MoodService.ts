import db from "@/storage/db";
import { MoodJournal } from "@/types/types";

export class MoodJournalService {
  // Create a new mood journal entry
  static async createMoodEntry(entry: MoodJournal): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO mood_journals (
          date, timestamp, mood, notes
        ) VALUES (
          '${entry.date}',
          '${entry.timestamp}',
          '${entry.mood}',
          ${entry.notes ? `'${entry.notes.replace(/'/g, "''")}'` : 'NULL'}
        );`
      );

      console.log("✅ Mood journal entry created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create mood journal entry:", error);
      return false;
    }
  }

  // Get a specific mood journal entry by ID
  static async getMoodEntryById(id: number): Promise<MoodJournal | null> {
    try {
      const results = await db.getAllAsync<MoodJournal>(
        `SELECT * FROM mood_journals WHERE id = ?;`,
        [id]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No mood journal entry found for ID:", id);
        return null;
      }

      const row = results[0];
      return {
        id: row.id,
        date: row.date,
        timestamp: row.timestamp,
        mood: row.mood,
        notes: row.notes ,
      };
    } catch (error) {
      console.error("❌ Failed to fetch mood journal entry:", error);
      return null;
    }
  }

  // Get all mood journal entries
  static async getAllMoodEntries(): Promise<MoodJournal[]> {
    try {
      const results = await db.getAllAsync<MoodJournal>(
        "SELECT * FROM mood_journals ORDER BY date DESC, timestamp DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No mood journal entries found.");
        return [];
      }

      return results.map((row) => ({
        id: row.id,
        date: row.date,
        timestamp: row.timestamp,
        mood: row.mood,
        notes: row.notes ,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch mood journal entries:", error);
      return [];
    }
  }

  // Update a mood journal entry
  static async updateMoodEntry(
    id: number,
    updates: {
      mood?: string;
      notes?: string;
    }
  ): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.mood !== undefined) {
        updateParts.push(`mood = '${updates.mood}'`);
      }
      if (updates.notes !== undefined) {
        updateParts.push(`notes = '${updates.notes.replace(/'/g, "''")}'`);
      }

      if (updateParts.length === 0) return false;

      await db.execSync(
        `UPDATE mood_journals SET ${updateParts.join(", ")} WHERE id = ${id};`
      );

      console.log("✅ Mood journal entry updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update mood journal entry:", error);
      return false;
    }
  }

  // Delete a specific mood journal entry
  static async deleteMoodEntry(id: number): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM mood_journals WHERE id = ${id}`);
      console.log("✅ Mood journal entry deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete mood journal entry:", error);
      return false;
    }
  }

  // Delete all mood journal entries
  static async deleteAllMoodEntries(): Promise<boolean> {
    try {
      await db.execSync("DELETE FROM mood_journals;");
      console.log("✅ All mood journal entries deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete all mood journal entries:", error);
      return false;
    }
  }

  // Get entries by date range
  static async getMoodEntriesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<MoodJournal[]> {
    try {
      const results = await db.getAllAsync<MoodJournal>(
        `SELECT * FROM mood_journals 
         WHERE date BETWEEN ? AND ? 
         ORDER BY date DESC, timestamp DESC;`,
        [startDate, endDate]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No mood journal entries found in the specified date range");
        return [];
      }

      return results.map((row) => ({
        id: row.id,
        date: row.date,
        timestamp: row.timestamp,
        mood: row.mood,
        notes: row.notes,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch mood journal entries by date range:", error);
      return [];
    }
  }
}
