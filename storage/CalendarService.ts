import db from "@/storage/db";
import {Activity} from "@/types/types";

// Define interfaces for each entry type
interface HealthEntry {
  id: string;
  date: string;
  weight?: number;
  systolic?: number;
  diastolic?: number;
  bloodSugar?: number;
  note?: string;
}

interface SymptomEntry {
  id: string;
  name: string;
  severity: 'Mild'|'Moderate'|'Severe';
  notes?: string;
  startTime: string;
  endTime?: string;
  lastUsed?: string;
}

interface CycleEntry {
  id: string;
  startDate: string;
  endDate?: string;
  flow?: string;
  symptoms?: string;
  mood?: string;
}

interface Frequency {
  value: number;
  unit: "hours"|"days"|"weeks";
}

interface MedicationEntry {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  nextDose?: string;
  dosage?: string;
  frequency?: Frequency;

}

interface SleepEntry {
  id: string;
  date: string;
  bedTime?: string;
  wakeTime?: string;
  sleepQuality?: number;
}

interface MoodJournal {
  id?: number;
  date: string;
  timestamp: string;
  mood: string; // emoji
  notes?: string;
}

interface Nutrition {
  id: string;
  name: string;
  type: 'Meal'|'Snack'|'Drink';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: 'g'|'ml'|'oz'|'piece';
  consumedAt?: Date;
  notes: string;
  favorite: boolean;
  lastUsed?: Date;
}

export interface CalendarItem {
  id: string;
  date: Date;
  type: 'health'|'symptom'|'cycle'|'medication'|'sleep'|'mood'|'nutrition'|'activity';
  details?: any;
}

export class CalendarDataService {

  static async getAllCalendarItems(): Promise<CalendarItem[]> {
    try {
      const calendarItems: CalendarItem[]=[];

      // Fetch all necessary entries
      const healthResults=await db.getAllAsync<HealthEntry>("SELECT * FROM health_entries WHERE date IS NOT NULL;");
      const symptomResults=await db.getAllAsync<SymptomEntry>("SELECT * FROM symptoms WHERE lastUsed IS NOT NULL OR startTime IS NOT NULL;");
      const cycleResults=await db.getAllAsync<CycleEntry>("SELECT * FROM cycle_entries WHERE startDate IS NOT NULL;");
      const medicationResults=await db.getAllAsync<MedicationEntry>("SELECT * FROM medications WHERE startDate IS NOT NULL;");
      const sleepResults=await db.getAllAsync<SleepEntry>("SELECT * FROM sleep_entries WHERE date IS NOT NULL;");
      const activityResults=await db.getAllAsync<Activity>("SELECT * FROM activities WHERE lastUsed IS NOT NULL;");
      const moodResults=await db.getAllAsync<MoodJournal>("SELECT * FROM mood_journals WHERE date IS NOT NULL;");
      const nutritionResults=await db.getAllAsync<Nutrition>("SELECT * FROM nutrition WHERE lastUsed IS NOT NULL;");

      // Process fetched entries
      healthResults?.forEach(entry => calendarItems.push({
        id: `health-${entry.id}`,
        date: new Date(entry.date),
        type: 'health',details: {
          ...entry,weight: entry.weight,
          systolic: entry.systolic,diastolic: entry.diastolic,
          bloodSugar: entry.bloodSugar,note: entry.note
        }
      }));

      symptomResults?.forEach(symptom => {
        calendarItems.push({
          id: `symptom-${symptom.id}`,
          date: new Date(symptom.startTime),
          type: 'symptom',details: {
            ...symptom,severity: symptom.severity,
            notes: symptom.notes
          }
        });
      });

      cycleResults?.forEach(entry => {
        calendarItems.push({
          id: `cycle-${entry.id}`,
          date: new Date(entry.startDate),
          type: 'cycle',details: {...entry,flow: entry.flow,symptoms: entry.symptoms,mood: entry.mood}
        });
        if(entry.endDate) calendarItems.push({
          id: `cycle-end-${entry.id}`,date: new Date(entry.endDate),
          type: 'cycle',details: entry
        });
      });

      medicationResults?.forEach(med => calendarItems.push({
        id: `med-${med.id}`,
        date: new Date(med.startDate),
        type: 'medication',
        details: {
          ...med,
          nextDose: med.nextDose,
          dosage: med.dosage,
          frequency: med.frequency
        }
      }));

      sleepResults?.forEach(entry => calendarItems.push({
        id: `sleep-${entry.id}`,
        date: new Date(entry.date),
        type: 'sleep',
        details: {
          ...entry,
          bedTime: entry.bedTime,
          wakeTime: entry.wakeTime,
          sleepQuality: entry.sleepQuality
        }
      }));

      activityResults?.forEach(activity =>
        activity.lastUsed&&calendarItems.push({
          id: `activity-${activity.id}`,
          date: new Date(activity.lastUsed),
          type: 'activity',details: {
            ...activity,
            duration: activity.duration,
            startTime: activity.startTime,
            endTime: activity.endTime,
            intensity: activity.intensity,
            notes: activity.notes
          }
        }));

      moodResults?.forEach(mood =>
        calendarItems.push({
          id: `mood-${mood.id}`,
          date: new Date(mood.date),
          type: 'mood',
          details: {...mood,mood: mood.mood,notes: mood.notes}
        }));

      nutritionResults?.forEach(nutrition => calendarItems.push({
        id: `nutrition-${nutrition.id}`,
        date: new Date(nutrition.lastUsed??new Date()),
        type: 'nutrition',details: {
          ...nutrition,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          servingSize: nutrition.servingSize,
          servingUnit: nutrition.servingUnit,
          notes: nutrition.notes
        }
      }));

      return calendarItems.sort((a,b) => b.date.getTime()-a.date.getTime());
    } catch(error) {
      console.error("❌ Failed to fetch calendar items:",error);
      return [];
    }
  }

  static async addCalendarItem(item: CalendarItem): Promise<void> {
    try {
      const itemId=String(item.id);

      switch(item.type) {
      case "health":
        // Prevent duplicate entry
        const existingHealth=await db.getFirstAsync("SELECT id FROM health_entries WHERE id = ?;",[itemId]);
        if(existingHealth) return console.warn(`⚠️ Duplicate health entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO health_entries (id, date, weight, systolic, diastolic, bloodSugar, note) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.date.toISOString(),item.details?.weight||null,item.details?.systolic||null,item.details?.diastolic||null,item.details?.bloodSugar||null,item.details?.note||null]
        );
        break;

      case "symptom":
        const existingSymptom=await db.getFirstAsync("SELECT id FROM symptoms WHERE id = ?;",[itemId]);
        if(existingSymptom) return console.warn(`⚠️ Duplicate symptom entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO symptoms (id, name, severity, notes, startTime, endTime, favorite, lastUsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.details?.name||"Unknown",item.details?.severity||"Mild",item.details?.notes||null,item.details?.startTime||item.date.toISOString(),item.details?.endTime||null,item.details?.favorite||0,item.details?.lastUsed||null]
        );
        break;

      case "cycle":
        const existingCycle=await db.getFirstAsync("SELECT id FROM cycle_entries WHERE id = ?;",[itemId]);
        if(existingCycle) return console.warn(`⚠️ Duplicate cycle entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO cycle_entries (id, startDate, endDate, cycleLength, flow, symptoms, nextCycleDate, mood, remedy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.details?.startDate||item.date.toISOString(),item.details?.endDate||null,item.details?.cycleLength||null,item.details?.flow||null,item.details?.symptoms||null,item.details?.nextCycleDate||null,item.details?.mood||null,item.details?.remedy||null]
        );
        break;

      case "medication":
        const existingMedication=await db.getFirstAsync("SELECT id FROM medications WHERE id = ?;",[itemId]);
        if(existingMedication) return console.warn(`⚠️ Duplicate medication entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO medications (id, name, dosage, frequency, nextDose, notes, startDate, endDate, nextDose, lastTaken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.details?.name||"Unnamed Medication",item.details?.dosage||"N/A",item.details?.frequency||"N/A",item.details?.nextDose||"N/A",item.details?.notes||null,item.details?.startDate||item.date.toISOString(),item.details?.endDate||null,item.details?.nextDose||null,item.details?.lastTaken||null]
        );
        break;

      case "sleep":
        const existingSleep=await db.getFirstAsync("SELECT id FROM sleep_entries WHERE id = ?;",[itemId]);
        if(existingSleep) return console.warn(`⚠️ Duplicate sleep entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO sleep_entries (id, date, bedTime, wakeTime, sleepQuality, nightWakeups, notes) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.date.toISOString(),item.details?.bedTime||null,item.details?.wakeTime||null,item.details?.sleepQuality||null,item.details?.nightWakeups||null,item.details?.notes||null]
        );
        break;

      case "activity":
        if(!item.details?.name) {
          return console.warn(`⚠️ Skipping activity ID ${itemId} due to missing name.`);
        }

        const existingActivity=await db.getFirstAsync("SELECT id FROM activities WHERE id = ?;",[itemId]);
        if(existingActivity) return console.warn(`⚠️ Duplicate activity entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO activities (id, name, type, duration, startTime, endTime, intensity, notes, favorite, lastUsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.details?.name,item.details?.type||"exercise",item.details?.duration||null,item.details?.startTime||null,item.details?.endTime||null,item.details?.intensity||"Medium",item.details?.notes||null,item.details?.favorite? 1:0,item.details?.lastUsed||item.date.toISOString()]
        );
        break;

      case "mood":
        const existingMood=await db.getFirstAsync("SELECT id FROM mood_journals WHERE id = ?;",[itemId]);
        if(existingMood) return console.warn(`⚠️ Duplicate mood entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO mood_journals (id, date, timestamp, mood, notes) VALUES (?, ?, ?, ?, ?);",
          [itemId,item.details?.date||item.date.toISOString(),item.details?.timestamp||new Date().toISOString(),item.details?.mood||"Neutral",item.details?.notes||null]
        );
        break;

      case "nutrition":
        const existingNutrition=await db.getFirstAsync("SELECT id FROM nutrition WHERE id = ?;",[itemId]);
        if(existingNutrition) return console.warn(`⚠️ Duplicate nutrition entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO nutrition (id, name, type, calories, protein, carbs, fat, servingSize, servingUnit, notes, favorite, consumedAt, lastUsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [itemId,item.details?.name||"Unknown Food",item.details?.type||"Meal",item.details?.calories||0,item.details?.protein||0,item.details?.carbs||0,item.details?.fat||0,item.details?.servingSize||1,item.details?.servingUnit||"g",item.details?.notes||null,item.details?.favorite? 1:0,item.details?.consumedAt||null,item.details?.lastUsed||item.date.toISOString()]
        );
        break;
      default:
        throw new Error(`❌ Unknown calendar item type: ${item.type}`);
      }
    } catch(error) {
      console.error(`❌ Failed to add calendar item: ${error}`);
      throw error;
    }
  }



}
