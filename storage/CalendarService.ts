import db from "@/storage/db";
import {Activity, CycleEntry, HealthEntry, Medication, MoodJournal, Nutrition, SleepEntry, Symptom, } from "@/types/types";



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
      const symptomResults=await db.getAllAsync<Symptom>("SELECT * FROM symptoms WHERE lastUsed IS NOT NULL OR startTime IS NOT NULL;");
      const cycleResults=await db.getAllAsync<CycleEntry>("SELECT * FROM cycle_entries WHERE startDate IS NOT NULL;");
      const medicationResults=await db.getAllAsync<Medication>("SELECT * FROM medications WHERE startDate IS NOT NULL;");
      const sleepResults=await db.getAllAsync<SleepEntry>("SELECT * FROM sleep_entries WHERE date IS NOT NULL;");
      const activityResults=await db.getAllAsync<Activity>("SELECT * FROM activities WHERE lastUsed IS NOT NULL;");
      const moodResults=await db.getAllAsync<MoodJournal>("SELECT * FROM mood_journals WHERE date IS NOT NULL;");
      const nutritionResults=await db.getAllAsync<Nutrition>("SELECT * FROM nutrition WHERE lastUsed IS NOT NULL;");

      // Process fetched entries
      healthResults?.forEach(entry => calendarItems.push({
        id: `health-${entry.id}`,
        date: new Date(entry.date),
        type: 'health',
        details: {
          weight: entry.weight,
          systolic: entry.systolic,
          diastolic: entry.diastolic,
          bloodSugar: entry.bloodSugar,
          note: entry.note
        }
      }));

      symptomResults?.forEach(symptom => {
        calendarItems.push({
          id: `symptom-${symptom.id}`,
          date: new Date(symptom.startTime || new Date()),
          type: 'symptom',
          details: {
            name: symptom.name,
            severity: symptom.severity,
            notes: symptom.notes,
            startTime: symptom.startTime || new Date().toISOString(),
            endTime: symptom.endTime,
            favorite: symptom.favorite ? 1 : 0,
            lastUsed: symptom.lastUsed || new Date().toISOString()
          }
        });
      });

      cycleResults?.forEach(entry => {
        calendarItems.push({
          id: `cycle-${entry.id}`,
          date: new Date(entry.startDate),
          type: 'cycle',
          details: {
            startDate: entry.startDate,
            endDate: entry.endDate,
            cycleLength: entry.cycleLength,
            flow: entry.flow,
            symptoms: entry.symptoms,
            nextCycleDate: entry.nextCycleDate,
            mood: entry.mood,
            remedy: entry.remedy
          }
        });
        if(entry.endDate) calendarItems.push({
          id: `cycle-end-${entry.id}`,
          date: new Date(entry.endDate),
          type: 'cycle',
          details: {
            startDate: entry.startDate,
            endDate: entry.endDate,
            cycleLength: entry.cycleLength,
            flow: entry.flow,
            symptoms: entry.symptoms,
            nextCycleDate: entry.nextCycleDate,
            mood: entry.mood,
            remedy: entry.remedy
          }
        });
      });

      medicationResults?.forEach(med => calendarItems.push({
        id: `med-${med.id}`,
        date: new Date(med.startDate),
        type: 'medication',
        details: {
          name: med.name || "Unnamed Medication",
          dosage: med.dosage || "N/A",
          frequency: med.frequency || "N/A",
          nextDose: med.nextDose,
          notes: med.notes,
          startDate: med.startDate,
          endDate: med.endDate,
          lastTaken: med.lastTaken
        }
      }));

      sleepResults?.forEach(entry => calendarItems.push({
        id: `sleep-${entry.id}`,
        date: new Date(entry.date),
        type: 'sleep',
        details: {
          date: entry.date,
          bedTime: entry.bedTime,
          wakeTime: entry.wakeTime,
          sleepQuality: entry.sleepQuality,
          nightWakeups: entry.nightWakeups,
          notes: entry.notes
        }
      }));

      activityResults?.forEach(activity =>
        activity.lastUsed && calendarItems.push({
          id: `activity-${activity.id}`,
          date: new Date(activity.lastUsed),
          type: 'activity',
          details: {
            name: activity.name,
            type: activity.type || "exercise",
            duration: activity.duration,
            startTime: activity.startTime,
            endTime: activity.endTime,
            intensity: activity.intensity || "Medium",
            notes: activity.notes,
            favorite: activity.favorite ? 1 : 0,
            lastUsed: activity.lastUsed
          }
        }));

      moodResults?.forEach(mood =>
        calendarItems.push({
          id: `mood-${mood.id}`,
          date: new Date(mood.date),
          type: 'mood',
          details: {
            date: mood.date,
            timestamp: mood.timestamp || new Date().toISOString(),
            mood: mood.mood || "😐",
            notes: mood.notes
          }
        }));

      nutritionResults?.forEach(nutrition => calendarItems.push({
        id: `nutrition-${nutrition.id}`,
        date: new Date(nutrition.lastUsed || new Date()),
        type: 'nutrition',
        details: {
          name: nutrition.name || "Unknown Food",
          type: nutrition.type || "Meal",
          calories: nutrition.calories || 0,
          protein: nutrition.protein || 0,
          carbs: nutrition.carbs || 0,
          fat: nutrition.fat || 0,
          servingSize: nutrition.servingSize || 1,
          servingUnit: nutrition.servingUnit || "g",
          notes: nutrition.notes,
          favorite: nutrition.favorite ? 1 : 0,
          consumedAt: nutrition.consumedAt,
          lastUsed: nutrition.lastUsed || new Date().toISOString()
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
        const existingMood = await db.getFirstAsync("SELECT id FROM mood_journals WHERE id = ?;", [itemId]);
        if (existingMood) return console.warn(`⚠️ Duplicate mood entry: ${itemId}`);

        await db.runAsync(
          "INSERT INTO mood_journals (id, date, timestamp, mood, notes) VALUES (?, ?, ?, ?, ?);",
          [
            itemId,
            item.details?.date || item.date.toISOString().split('T')[0],
            item.details?.timestamp || new Date().toISOString(),
            item.details?.mood || "😐",
            item.details?.notes || null
          ]
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

  static async deleteAllEntries(): Promise<void> {
    try {
      // Delete from all calendar-related tables while preserving insights
      await db.runAsync('DELETE FROM health_entries;');
      await db.runAsync('DELETE FROM symptoms;');
      await db.runAsync('DELETE FROM cycle_entries;');
      await db.runAsync('DELETE FROM medications;');
      await db.runAsync('DELETE FROM sleep_entries;');
      await db.runAsync('DELETE FROM activities;');
      await db.runAsync('DELETE FROM mood_journals;');
      await db.runAsync('DELETE FROM nutrition;');
      // Do NOT delete from insights table
    } catch (error) {
      console.error('Error deleting calendar entries:', error);
      throw error;
    }
  }
}
