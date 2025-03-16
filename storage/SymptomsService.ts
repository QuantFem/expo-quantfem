import db from "@/storage/db";
import { Symptom } from "@/types/types";

export class SymptomService {
  // Create a new symptom
  static async createSymptom(symptom: Omit<Symptom, 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO symptoms (
          id, name, severity, notes, startTime, endTime, 
          favorite, lastUsed
        ) VALUES (
          '${symptom.id}',
          '${symptom.name}',
          '${symptom.severity}',
          '${symptom.notes?.replace(/'/g, "''")}',
          ${symptom.startTime ? `'${symptom.startTime.toISOString()}'` : 'NULL'},
          ${symptom.endTime ? `'${symptom.endTime.toISOString()}'` : 'NULL'},
          ${symptom.favorite ? 1 : 0},
          ${symptom.lastUsed ? `'${symptom.lastUsed.toISOString()}'` : 'NULL'}
        );`
      );

      console.log("✅ Symptom created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create symptom:", error);
      return false;
    }
  }

  // Get symptom by ID
  static async getSymptomById(id: string): Promise<Symptom | null> {
    try {
      const results = await db.getAllAsync<Symptom>(
        `SELECT * FROM symptoms WHERE id = ?;`,
        [id]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No symptom found for ID:", id);
        return null;
      }

      const row = results[0];
      return {
        id: row.id,
        name: row.name,
        severity: row.severity as 'Mild' | 'Moderate' | 'Severe',
        notes: row.notes,
        startTime: row.startTime ? new Date(row.startTime) : undefined,
        endTime: row.endTime ? new Date(row.endTime) : undefined,
        favorite: Boolean(row.favorite),
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (error) {
      console.error("❌ Failed to fetch symptom:", error);
      return null;
    }
  }

  // Get all symptoms
  static async getAllSymptoms(): Promise<Symptom[]> {
    try {
      const results = await db.getAllAsync<Symptom>(
        "SELECT * FROM symptoms ORDER BY lastUsed DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No symptoms found.");
        return [];
      }

      return results.map(row => ({
        id: row.id,
        name: row.name,
        severity: row.severity as 'Mild' | 'Moderate' | 'Severe',
        notes: row.notes,
        startTime: row.startTime ? new Date(row.startTime) : undefined,
        endTime: row.endTime ? new Date(row.endTime) : undefined,
        favorite: Boolean(row.favorite),
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error("❌ Failed to fetch symptoms:", error);
      return [];
    }
  }

  // Update a symptom
  static async updateSymptom(
    id: string,
    updates: Partial<Omit<Symptom, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.name !== undefined) updateParts.push(`name = '${updates.name}'`);
      if (updates.severity !== undefined) updateParts.push(`severity = '${updates.severity}'`);
      if (updates.notes !== undefined) updateParts.push(`notes = '${updates.notes.replace(/'/g, "''")}'`);
      if (updates.startTime !== undefined) {
        updateParts.push(`startTime = '${updates.startTime.toISOString()}'`);
      }
      if (updates.endTime !== undefined) {
        updateParts.push(`endTime = '${updates.endTime.toISOString()}'`);
      }
      if (updates.favorite !== undefined) updateParts.push(`favorite = ${updates.favorite ? 1 : 0}`);
      if (updates.lastUsed !== undefined) {
        updateParts.push(`lastUsed = '${updates.lastUsed.toISOString()}'`);
      }

      // Always update the updated_at timestamp
      updateParts.push(`updated_at = datetime('now')`);

      if (updateParts.length === 0) return false;

      await db.execSync(
        `UPDATE symptoms SET ${updateParts.join(", ")} WHERE id = '${id}';`
      );

      console.log("✅ Symptom updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update symptom:", error);
      return false;
    }
  }

  // Delete a symptom
  static async deleteSymptom(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM symptoms WHERE id = '${id}'`);
      console.log("✅ Symptom deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete symptom:", error);
      return false;
    }
  }

  // Get favorite symptoms
  static async getFavoriteSymptoms(): Promise<Symptom[]> {
    try {
      const results = await db.getAllAsync<Symptom>(
        "SELECT * FROM symptoms WHERE favorite = 1 ORDER BY lastUsed DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No favorite symptoms found.");
        return [];
      }

      return results.map(row => ({
        id: row.id,
        name: row.name,
        severity: row.severity as 'Mild' | 'Moderate' | 'Severe',
        notes: row.notes,
        startTime: row.startTime ? new Date(row.startTime) : undefined,
        endTime: row.endTime ? new Date(row.endTime) : undefined,
        favorite: Boolean(row.favorite),
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error("❌ Failed to fetch favorite symptoms:", error);
      return [];
    }
  }
}
