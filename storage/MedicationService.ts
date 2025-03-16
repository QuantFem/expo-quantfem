import db from "@/storage/db"; // Ensure this is the correct database instance
import { Medication, Frequency } from "@/types/types";

export class MedicationService {
  static async createMedication(medication: Medication): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO medications (
          id, name, dosage, frequency, timeToTake, notes, 
          startDate, endDate, nextDose, lastTaken
        ) VALUES (
          '${medication.id}',
          '${medication.name.replace(/'/g, "''")}',  -- Escape single quotes
          '${medication.dosage.replace(/'/g, "''")}',
          '${JSON.stringify(medication.frequency)}',  -- Store frequency as JSON
          '${medication.timeToTake}',
          ${medication.notes ? `'${medication.notes.replace(/'/g, "''")}'` : 'NULL'},
          '${medication.startDate}',
          ${medication.endDate ? `'${medication.endDate}'` : 'NULL'},
          ${medication.nextDose ? `'${medication.nextDose}'` : 'NULL'},
          ${medication.lastTaken ? `'${medication.lastTaken}'` : 'NULL'}
        );`
      );
  
      console.log("✅ Medication created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create medication:", error);
      return false;
    }
  }
  
  static async getAllMedications(): Promise<Medication[]> {
    try {
      const results = await db.getAllAsync<any>(
        "SELECT * FROM medications ORDER BY startDate DESC;"
      );
  
      console.log("Raw database result:", results); // Debugging
  
      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No medications found.");
        return [];
      }
  
      return results.map((row) => ({
        id: row.id,
        name: row.name,
        dosage: row.dosage,
        frequency: row.frequency ? JSON.parse(row.frequency) : { value: 1, unit: "days" }, // ✅ Ensure frequency is parsed correctly
        timeToTake: row.timeToTake,
        notes: row.notes ?? null,
        startDate: row.startDate,
        endDate: row.endDate ?? null,
        nextDose: row.nextDose ?? null,
        lastTaken: row.lastTaken ?? null,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch medications:", error);
      return [];
    }
  }
  

  static async getMedicationById(id: string): Promise<Medication | null> {
    try {
      const results = await db.getAllAsync<any>(
        `SELECT * FROM medications WHERE id = ?;`,
        [id]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No medication found for ID:", id);
        return null;
      }

      const row = results[0];
      return {
        id: row.id,
        name: row.name,
        dosage: row.dosage,
        frequency: row.frequency, 
        timeToTake: row.timeToTake,
        notes: row.notes,
        startDate: row.startDate,
        endDate: row.endDate,
        nextDose: row.nextDose,
        lastTaken: row.lastTaken,
      };
    } catch (error) {
      console.error("❌ Failed to fetch medication:", error);
      return null;
    }
  }

  static async updateMedication(
    id: string,
    updates: {
      name?: string;
      dosage?: string;
      frequency?: Frequency;
      timeToTake?: string;
      notes?: string;
      startDate?: string;
      endDate?: string;
      nextDose?: string;
      lastTaken?: string;
    }
  ): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.name !== undefined) updateParts.push(`name = '${updates.name.replace(/'/g, "''")}'`);
      if (updates.dosage !== undefined) updateParts.push(`dosage = '${updates.dosage.replace(/'/g, "''")}'`);
      if (updates.frequency !== undefined) updateParts.push(`frequency = '${JSON.stringify(updates.frequency)}'`); // ✅ Store frequency as JSON
      if (updates.timeToTake !== undefined) updateParts.push(`timeToTake = '${updates.timeToTake}'`);
      if (updates.notes !== undefined) updateParts.push(`notes = '${updates.notes.replace(/'/g, "''")}'`);
      if (updates.startDate !== undefined) updateParts.push(`startDate = '${updates.startDate}'`);
      if (updates.endDate !== undefined) updateParts.push(`endDate = '${updates.endDate}'`);
      if (updates.nextDose !== undefined) updateParts.push(`nextDose = '${updates.nextDose}'`);
      if (updates.lastTaken !== undefined) updateParts.push(`lastTaken = '${updates.lastTaken}'`);
  
      if (updateParts.length === 0) return false;
  
      await db.execSync(
        `UPDATE medications SET ${updateParts.join(", ")} WHERE id = '${id}';`
      );
  
      console.log("✅ Medication updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update medication:", error);
      return false;
    }
  }
  
  static async deleteMedication(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM medications WHERE id = '${id}'`);
      console.log("✅ Medication deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete medication:", error);
      return false;
    }
  }
}