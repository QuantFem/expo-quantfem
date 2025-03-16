import db from "@/storage/db";
import { Nutrition } from "@/types/types";

export class NutritionService {
  // Create a new nutrition entry
  static async createNutrition(nutrition: Nutrition): Promise<boolean> {
    try {
      const query = `
        INSERT INTO nutrition (
          id,
          name,
          type,
          calories,
          protein,
          carbs,
          fat,
          servingSize,
          servingUnit,
          notes,
          favorite,
          consumedAt,
          lastUsed
        ) VALUES (
          '${nutrition.id}',
          '${nutrition.name}',
          '${nutrition.type}',
          ${nutrition.calories},
          ${nutrition.protein},
          ${nutrition.carbs},
          ${nutrition.fat},
          ${nutrition.servingSize},
          '${nutrition.servingUnit}',
          '${nutrition.notes}',
          ${nutrition.favorite ? 1 : 0},
          ${nutrition.consumedAt ? `'${nutrition.consumedAt.toISOString()}'` : 'NULL'},
          ${nutrition.lastUsed ? `'${nutrition.lastUsed.toISOString()}'` : 'NULL'}
        )
      `;

      await db.execSync(query);
      console.log("✅ Nutrition entry created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create nutrition entry:", error);
      return false;
    }
  }

  // Get all nutrition entries
  static async getAllNutrition(): Promise<Nutrition[]> {
    try {
      const results = await db.getAllAsync<any>(`SELECT * FROM nutrition ORDER BY lastUsed DESC;`);
      
      return results.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type as 'Meal' | 'Snack' | 'Drink',
        calories: Number(row.calories),
        protein: Number(row.protein),
        carbs: Number(row.carbs),
        fat: Number(row.fat),
        servingSize: Number(row.servingSize),
        servingUnit: row.servingUnit as 'g' | 'ml' | 'oz' | 'piece',
        notes: row.notes,
        favorite: Boolean(row.favorite),
        consumedAt: row.consumedAt ? new Date(row.consumedAt) : undefined,
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined
      }));
    } catch (error) {
      console.error("❌ Failed to fetch nutrition entries:", error);
      return [];
    }
  }

  // Update a nutrition entry
  static async updateNutrition(id: string, updates: Partial<Nutrition>): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.name !== undefined) {
        updateParts.push(`name = '${updates.name}'`);
      }
      if (updates.type !== undefined) {
        updateParts.push(`type = '${updates.type}'`);
      }
      if (updates.calories !== undefined) {
        updateParts.push(`calories = ${updates.calories}`);
      }
      if (updates.protein !== undefined) {
        updateParts.push(`protein = ${updates.protein}`);
      }
      if (updates.carbs !== undefined) {
        updateParts.push(`carbs = ${updates.carbs}`);
      }
      if (updates.fat !== undefined) {
        updateParts.push(`fat = ${updates.fat}`);
      }
      if (updates.servingSize !== undefined) {
        updateParts.push(`servingSize = ${updates.servingSize}`);
      }
      if (updates.servingUnit !== undefined) {
        updateParts.push(`servingUnit = '${updates.servingUnit}'`);
      }
      if (updates.notes !== undefined) {
        updateParts.push(`notes = '${updates.notes}'`);
      }
      if (updates.favorite !== undefined) {
        updateParts.push(`favorite = ${updates.favorite ? 1 : 0}`);
      }
      if (updates.consumedAt !== undefined) {
        updateParts.push(`consumedAt = ${updates.consumedAt ? `'${updates.consumedAt.toISOString()}'` : 'NULL'}`);
      }
      if (updates.lastUsed !== undefined) {
        updateParts.push(`lastUsed = ${updates.lastUsed ? `'${updates.lastUsed.toISOString()}'` : 'NULL'}`);
      }

      if (updateParts.length === 0) return false;

      const query = `
        UPDATE nutrition 
        SET ${updateParts.join(', ')}
        WHERE id = '${id}'
      `;

      await db.execSync(query);
      console.log("✅ Nutrition entry updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update nutrition entry:", error);
      return false;
    }
  }

  // Delete a nutrition entry
  static async deleteNutrition(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM nutrition WHERE id = '${id}'`);
      console.log("✅ Nutrition entry deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete nutrition entry:", error);
      return false;
    }
  }

  // Get favorite nutrition entries
  static async getFavoriteNutrition(): Promise<Nutrition[]> {
    try {
      const results = await db.getAllAsync<any>(
        `SELECT * FROM nutrition WHERE favorite = 1 ORDER BY lastUsed DESC;`
      );
      
      return results.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type as 'Meal' | 'Snack' | 'Drink',
        calories: Number(row.calories),
        protein: Number(row.protein),
        carbs: Number(row.carbs),
        fat: Number(row.fat),
        servingSize: Number(row.servingSize),
        servingUnit: row.servingUnit as 'g' | 'ml' | 'oz' | 'piece',
        notes: row.notes,
        favorite: Boolean(row.favorite),
        consumedAt: row.consumedAt ? new Date(row.consumedAt) : undefined,
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined
      }));
    } catch (error) {
      console.error("❌ Failed to fetch favorite nutrition entries:", error);
      return [];
    }
  }
}

// Setup table
export const setupNutritionTable = async () => {
  try {
    await db.execSync(`
      CREATE TABLE IF NOT EXISTS nutrition (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        servingSize REAL NOT NULL,
        servingUnit TEXT NOT NULL,
        notes TEXT,
        favorite INTEGER DEFAULT 0,
        consumedAt TEXT,
        lastUsed TEXT
      );
    `);
    console.log("✅ Nutrition table created successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to create nutrition table:", error);
    return false;
  }
};
