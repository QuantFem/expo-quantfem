import db from "@/storage/db";
import {CycleEntry} from "@/types/types";



export class CycleService {
  // Create a new cycle entry
  static async createCycleEntry(entry: CycleEntry): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO cycle_entries (
          id, startDate, endDate, cycleLength, flow, symptoms, 
          nextCycleDate, mood, remedy
        ) VALUES (
          '${entry.id}',
          '${entry.startDate}',
          ${entry.endDate ? `'${entry.endDate}'` : 'NULL'},
          ${entry.cycleLength !== undefined ? entry.cycleLength : 'NULL'},
          ${entry.flow ? `'${entry.flow.replace(/'/g, "''")}'` : 'NULL'},
          ${entry.symptoms ? `'${entry.symptoms.replace(/'/g, "''")}'` : 'NULL'},
          ${entry.nextCycleDate ? `'${entry.nextCycleDate}'` : 'NULL'},
          ${entry.mood ? `'${entry.mood.replace(/'/g, "''")}'` : 'NULL'},
          ${entry.remedy ? `'${entry.remedy.replace(/'/g, "''")}'` : 'NULL'}
        );`
      );

      console.log("✅ Cycle entry created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create cycle entry:", error);
      return false;
    }
  }

  // Get a specific cycle entry by ID
  static async getCycleEntryById(id: string): Promise<CycleEntry | null> {
    try {
      const results = await db.getAllAsync<CycleEntry>(
        `SELECT * FROM cycle_entries WHERE id = ?;`,
        [id]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No cycle entry found for ID:", id);
        return null;
      }

      const row = results[0];
      return {
        id: row.id,
        startDate: row.startDate,
        endDate: row.endDate,
        cycleLength: row.cycleLength,
        flow: row.flow,
        symptoms: row.symptoms,
        nextCycleDate: row.nextCycleDate,
        mood: row.mood,
        remedy: row.remedy,
      };
    } catch (error) {
      console.error("❌ Failed to fetch cycle entry:", error);
      return null;
    }
  }

  // Get all cycle entries
  static async getAllCycleEntries(): Promise<CycleEntry[]> {
    try {
      const results = await db.getAllAsync<CycleEntry>(
        "SELECT * FROM cycle_entries ORDER BY startDate DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No cycle entries found.");
        return [];
      }

      return results.map((row) => ({
        id: row.id,
        startDate: row.startDate,
        endDate: row.endDate ?? null,
        cycleLength: row.cycleLength ?? null,
        flow: row.flow ?? null,
        symptoms: row.symptoms ?? null,
        nextCycleDate: row.nextCycleDate ?? null,
        mood: row.mood ?? null,
        remedy: row.remedy ?? null,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch cycle entries:", error);
      return [];
    }
  }

  // Update a cycle entry
  static async updateCycleEntry(
    id: string,
    updates: {
      endDate?: string;
      cycleLength?: number;
      flow?: string;
      symptoms?: string;
      nextCycleDate?: string;
      mood?: string;
      remedy?: string;
    }
  ): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.endDate !== undefined) 
        updateParts.push(`endDate = '${updates.endDate}'`);
      if (updates.cycleLength !== undefined) 
        updateParts.push(`cycleLength = ${updates.cycleLength}`);
      if (updates.flow !== undefined) 
        updateParts.push(`flow = '${updates.flow.replace(/'/g, "''")}'`);
      if (updates.symptoms !== undefined) 
        updateParts.push(`symptoms = '${updates.symptoms.replace(/'/g, "''")}'`);
      if (updates.nextCycleDate !== undefined)
        updateParts.push(`nextCycleDate = '${updates.nextCycleDate}'`);
      if (updates.mood !== undefined)
        updateParts.push(`mood = '${updates.mood.replace(/'/g, "''")}'`);
      if (updates.remedy !== undefined)
        updateParts.push(`remedy = '${updates.remedy.replace(/'/g, "''")}'`);

      if (updateParts.length === 0) return false;

      await db.execSync(
        `UPDATE cycle_entries SET ${updateParts.join(", ")} WHERE id = '${id}';`
      );

      console.log("✅ Cycle entry updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update cycle entry:", error);
      return false;
    }
  }

  // Delete a specific cycle entry
  static async deleteCycleEntry(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM cycle_entries WHERE id = '${id}'`);
      console.log("✅ Cycle entry deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete cycle entry:", error);
      return false;
    }
  }

  // Delete all cycle entries
  static async deleteAllCycleEntries(): Promise<boolean> {
    try {
      await db.execSync("DELETE FROM cycle_entries;");
      console.log("✅ All cycle entries deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete all cycle entries:", error);
      return false;
    }
  }

  // Helper method to calculate next cycle date
  static calculateNextCycleDate(startDate: string, cycleLength: number): string {
    const date = new Date(startDate);
    date.setDate(date.getDate() + cycleLength);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }
}
