// storage/CycleService.ts
import * as SQLite from "expo-sqlite";
import { Cycle, DBResult } from "@/types/types";

export class CycleService {
  constructor(private db: SQLite.SQLiteDatabase) {}

  // 1. CREATE - Save a new cycle
  async saveCycle(cycle: Omit<Cycle, 'id'>): Promise<boolean> {
    try {
      this.db.execSync(
        `INSERT INTO cycles (
          start_date, 
          end_date, 
          cycle_length, 
          period_length, 
          symptoms, 
          notes
        ) VALUES (
          '${cycle.start_date}',
          ${cycle.end_date ? `'${cycle.end_date}'` : 'NULL'},
          ${cycle.cycle_length || 'NULL'},
          ${cycle.period_length || 'NULL'},
          ${cycle.symptoms ? `'${cycle.symptoms}'` : 'NULL'},
          ${cycle.notes ? `'${cycle.notes}'` : 'NULL'}
        );`
      );
      console.log('✅ Cycle saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving cycle:', error);
      return false;
    }
  }


  // 3. UPDATE - Update an existing cycle
  async updateCycle(id: number, cycle: Partial<Cycle>): Promise<boolean> {
    try {
      const updateFields = Object.entries(cycle)
        .map(([key, value]) => {
          if (value === undefined) return null;
          return `${key} = ${typeof value === 'string' ? `'${value}'` : value}`;
        })
        .filter(Boolean)
        .join(', ');

      this.db.execSync(
        `UPDATE cycles 
         SET ${updateFields}
         WHERE id = ${id};`
      );
      console.log('✅ Cycle updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating cycle:', error);
      return false;
    }
  }

  // 4. DELETE - Delete a cycle
  async deleteCycle(id: number): Promise<boolean> {
    try {
      this.db.execSync(`DELETE FROM cycles WHERE id = ${id};`);
      console.log('✅ Cycle deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting cycle:', error);
      return false;
    }
  }

  // 5. Get current cycle
  async getCurrentCycle(): Promise<Cycle | null> {
    try {
      const result = this.db.execSync(
        `SELECT * FROM cycles 
         WHERE end_date IS NULL 
         OR end_date = (
           SELECT MAX(end_date) 
           FROM cycles
         )
         LIMIT 1;`
      ) as unknown as DBResult[];

      if (!result || !result[0] || !result[0].rows.length) {
        return null;
      }

      return result[0].rows[0];
    } catch (error) {
      console.error('❌ Error fetching current cycle:', error);
      return null;
    }
  }

  // 6. Get cycles by date range
  async getCyclesByDateRange(startDate: string, endDate: string): Promise<Cycle[]> {
    try {
      const result = this.db.execSync(
        `SELECT * FROM cycles 
         WHERE start_date BETWEEN '${startDate}' AND '${endDate}'
         ORDER BY start_date DESC;`
      ) as unknown as DBResult[];

      if (!result || !result[0]) {
        return [];
      }

      return result[0].rows;
    } catch (error) {
      console.error('❌ Error fetching cycles by date range:', error);
      return [];
    }
  }

  // 7. End current cycle
  async endCurrentCycle(endDate: string): Promise<boolean> {
    try {
      const currentCycle = await this.getCurrentCycle();
      if (!currentCycle?.id) return false;

      const startDate = new Date(currentCycle.start_date);
      const end = new Date(endDate);
      const cycleLength = Math.round((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      return await this.updateCycle(currentCycle.id, {
        end_date: endDate,
        cycle_length: cycleLength
      });
    } catch (error) {
      console.error('❌ Error ending current cycle:', error);
      return false;
    }
  }

  // 8. Get average cycle length
  async getAverageCycleLength(): Promise<number | null> {
    try {
      const result = this.db.execSync(
        `SELECT AVG(cycle_length) as avg_length 
         FROM cycles 
         WHERE cycle_length IS NOT NULL;`
      ) as unknown as DBResult[];

      if (!result || !result[0] || !result[0].rows.length) {
        return null;
      }

      return result[0].rows[0].avg_length;
    } catch (error) {
      console.error('❌ Error calculating average cycle length:', error);
      return null;
    }
  }

  // storage/CycleService.ts
  async getCycles(): Promise<Cycle[]> {
    try {
      console.log('Fetching cycles...'); // Debug log
      const result = this.db.execSync(
        `SELECT 
          id,
          start_date,
          end_date,
          cycle_length,
          period_length,
          symptoms,
          notes,
          created_at,
          updated_at
         FROM cycles 
         ORDER BY start_date DESC;`
      ) as unknown as DBResult[];
  
      console.log('Query result:', result); // Debug log
  
      if (!result || !result[0]) {
        console.log('No results found'); // Debug log
        return [];
      }
  
      console.log('Rows:', result[0].rows); // Debug log
      return result[0].rows;
    } catch (error) {
      console.error('❌ Error fetching cycles:', error);
      return [];
    }
  }
  
}
