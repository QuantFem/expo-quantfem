import db from "@/storage/db";
import { Activity } from "@/types/types";

export class ActivityService {
  // Create a new activity
  static async createActivity(activity: Activity): Promise<boolean> {
    try {
      await db.execSync(
        `INSERT INTO activities (
          id, name, type, duration, startTime, endTime, 
          intensity, notes, favorite, lastUsed
        ) VALUES (
          '${activity.id}',
          '${activity.name}',
          '${activity.type}',
          ${activity.duration !== undefined ? activity.duration : 'NULL'},
          ${activity.startTime ? `'${activity.startTime.toISOString()}'` : 'NULL'},
          ${activity.endTime ? `'${activity.endTime.toISOString()}'` : 'NULL'},
          '${activity.intensity}',
          '${activity.notes.replace(/'/g, "''")}',
          ${activity.favorite ? 1 : 0},
          ${activity.lastUsed ? `'${activity.lastUsed.toISOString()}'` : 'NULL'}
        );`
      );

      console.log("✅ Activity created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to create activity:", error);
      return false;
    }
  }

  // Get activity by ID
  static async getActivityById(id: string): Promise<Activity | null> {
    try {
      const results = await db.getAllAsync<Activity>(
        `SELECT * FROM activities WHERE id = ?;`,
        [id]
      );

      if (!results || results.length === 0) {
        console.warn("⚠️ No activity found for ID:", id);
        return null;
      }

      const row = results[0];
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        duration: row.duration ?? undefined,
        startTime: row.startTime ? new Date(row.startTime) : undefined,
        endTime: row.endTime ? new Date(row.endTime) : undefined,
        intensity: row.intensity as 'Low' | 'Medium' | 'High',
        notes: row.notes,
        favorite: Boolean(row.favorite),
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined
      };
    } catch (error) {
      console.error("❌ Failed to fetch activity:", error);
      return null;
    }
  }

  // Get all activities
  static async getAllActivities(): Promise<Activity[]> {
    try {
      const results = await db.getAllAsync<Activity>(
        "SELECT * FROM activities ORDER BY lastUsed DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No activities found.");
        return [];
      }

      return results.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        duration: row.duration ?? undefined,
        startTime: row.startTime ? new Date(row.startTime) : undefined,
        endTime: row.endTime ? new Date(row.endTime) : undefined,
        intensity: row.intensity as 'Low' | 'Medium' | 'High',
        notes: row.notes,
        favorite: Boolean(row.favorite),
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined
      }));
    } catch (error) {
      console.error("❌ Failed to fetch activities:", error);
      return [];
    }
  }

  // Update an activity
  static async updateActivity(
    id: string,
    updates: Partial<Omit<Activity, 'id'>>
  ): Promise<boolean> {
    try {
      const updateParts = [];
      if (updates.name !== undefined) updateParts.push(`name = '${updates.name}'`);
      if (updates.type !== undefined) updateParts.push(`type = '${updates.type}'`);
      if (updates.duration !== undefined) updateParts.push(`duration = ${updates.duration}`);
      if (updates.startTime !== undefined) {
        updateParts.push(`startTime = '${updates.startTime.toISOString()}'`);
      }
      if (updates.endTime !== undefined) {
        updateParts.push(`endTime = '${updates.endTime.toISOString()}'`);
      }
      if (updates.intensity !== undefined) updateParts.push(`intensity = '${updates.intensity}'`);
      if (updates.notes !== undefined) updateParts.push(`notes = '${updates.notes.replace(/'/g, "''")}'`);
      if (updates.favorite !== undefined) updateParts.push(`favorite = ${updates.favorite ? 1 : 0}`);
      if (updates.lastUsed !== undefined) {
        updateParts.push(`lastUsed = '${updates.lastUsed.toISOString()}'`);
      }

      if (updateParts.length === 0) return false;

      await db.execSync(
        `UPDATE activities SET ${updateParts.join(", ")} WHERE id = '${id}';`
      );

      console.log("✅ Activity updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update activity:", error);
      return false;
    }
  }

  // Delete an activity
  static async deleteActivity(id: string): Promise<boolean> {
    try {
      await db.execSync(`DELETE FROM activities WHERE id = '${id}'`);
      console.log("✅ Activity deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete activity:", error);
      return false;
    }
  }

  // Delete all activities
  static async deleteAllActivities(): Promise<boolean> {
    try {
      await db.execSync("DELETE FROM activities;");
      console.log("✅ All activities deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete all activities:", error);
      return false;
    }
  }

  // Get favorite activities
  static async getFavoriteActivities(): Promise<Activity[]> {
    try {
      const results = await db.getAllAsync<Activity>(
        "SELECT * FROM activities WHERE favorite = 1 ORDER BY lastUsed DESC;"
      );

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn("⚠️ No favorite activities found.");
        return [];
      }

      return results.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        duration: row.duration ?? undefined,
        startTime: row.startTime ? new Date(row.startTime) : undefined,
        endTime: row.endTime ? new Date(row.endTime) : undefined,
        intensity: row.intensity as 'Low' | 'Medium' | 'High',
        notes: row.notes,
        favorite: Boolean(row.favorite),
        lastUsed: row.lastUsed ? new Date(row.lastUsed) : undefined
      }));
    } catch (error) {
      console.error("❌ Failed to fetch favorite activities:", error);
      return [];
    }
  }
}
