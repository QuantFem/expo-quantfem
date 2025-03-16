import db from "@/storage/db"; // Ensure this is the correct database instance
import {HealthEntry} from "@/types/types";


export class HealthService {
  // Create a new health entry
  static async createHealthEntry(entry: HealthEntry): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO health_entries (
           id, date, weight, systolic, diastolic, bloodSugar, note
         ) VALUES (
           '${entry.id}',
           '${entry.date}',
           ${entry.weight!==undefined? entry.weight:'NULL'},
           ${entry.systolic!==undefined? entry.systolic:'NULL'},
           ${entry.diastolic!==undefined? entry.diastolic:'NULL'},
           ${entry.bloodSugar!==undefined? entry.bloodSugar:'NULL'},
           ${entry.note? `'${entry.note.replace(/'/g,"''")}'`:'NULL'}
         );`
      );

      console.log("✅ Health entry created successfully");
      return true;
    } catch(error) {
      console.error("❌ Failed to create health entry:",error);
      return false;
    }
  }


  // Then update the methods with proper typing:

  static async getHealthEntryById(id: string): Promise<HealthEntry|null> {
    try {
      const results=await db.getAllAsync<HealthEntry>(
        `SELECT * FROM health_entries WHERE id = ?;`,
        [id]
      );

      if(!results||results.length===0) {
        console.warn("⚠️ No health entry found for ID:",id);
        return null;
      }

      const row=results[0];
      return {
        id: row.id,
        date: row.date,
        weight: row.weight,
        systolic: row.systolic,
        diastolic: row.diastolic,
        bloodSugar: row.bloodSugar,
        note: row.note,
      };
    } catch(error) {
      console.error("❌ Failed to fetch health entry:",error);
      return null;
    }
  }

  static async getAllHealthEntries(): Promise<HealthEntry[]> {
    try {
      const results=await db.getAllAsync<HealthEntry>(
        "SELECT * FROM health_entries ORDER BY date DESC;"
      );

      console.log("Raw database result:",results); // Debugging

      if(!results||!Array.isArray(results)||results.length===0) {
        console.warn("⚠️ No health entries found.");
        return [];
      }

      return results.map((row) => ({
        id: row.id,
        date: row.date,
        weight: row.weight??null,    // Convert undefined to null
        systolic: row.systolic??null,
        diastolic: row.diastolic??null,
        bloodSugar: row.bloodSugar??null,
        note: row.note??null,
      }));
    } catch(error) {
      console.error("❌ Failed to fetch health entries:",error);
      return [];
    }
  }

  // Update a health entry
  static async updateHealthEntry(
    id: string,
    updates: {
      weight?: number|null;
      systolic?: number|null;
      diastolic?: number|null;
      bloodSugar?: number|null;
      note?: string|null;
    }
  ): Promise<boolean> {
    try {
      const updateParts: string[]=[];

      if(updates.weight!==undefined) {
        updateParts.push(`weight = ${updates.weight!==null? updates.weight:"NULL"}`);
      }
      if(updates.systolic!==undefined) {
        updateParts.push(`systolic = ${updates.systolic!==null? updates.systolic:"NULL"}`);
      }
      if(updates.diastolic!==undefined) {
        updateParts.push(`diastolic = ${updates.diastolic!==null? updates.diastolic:"NULL"}`);
      }
      if(updates.bloodSugar!==undefined) {
        updateParts.push(`bloodSugar = ${updates.bloodSugar!==null? updates.bloodSugar:"NULL"}`);
      }
      if(updates.note!==undefined) {
        updateParts.push(`note = ${updates.note!==null? `'${updates.note.replace(/'/g,"''")}'`:"NULL"}`);
      }

      if(updateParts.length===0) return false; // No updates needed

      await db.execSync(
        `UPDATE health_entries SET ${updateParts.join(", ")} WHERE id = '${id}';`
      );

      console.log("✅ Health entry updated successfully");
      return true;
    } catch(error) {
      console.error("❌ Failed to update health entry:",error);
      return false;
    }
  }


  static async deleteHealthEntry(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM health_entries WHERE id = '${id}'`);
      console.log("✅ Health entry deleted successfully");
      return true;
    } catch(error) {
      console.error("❌ Failed to delete health entry:",error);
      return false;
    }
  }


  // Delete all health entries
  static async deleteAllHealthEntries(): Promise<boolean> {
    try {
      await db.execSync("DELETE FROM health_entries;");
      console.log("✅ All health entries deleted successfully");
      return true;
    } catch(error) {
      console.error("❌ Failed to delete all health entries:",error);
      return false;
    }
  }
}
