
export interface Cycle {
  id?: number;
  start_date: string;  // Changed from 'date' to 'start_date'
  end_date?: string;
  cycle_length?: number;
  period_length?: number;
  symptoms?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBResult {
  rows: any[];
}
export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: string;
  nextChange?: string;
}

export interface CycleEntry {
  id: string;
  startDate: string;
  endDate: string | null;
  cycleLength: number | null;
  flow: string | null; // e.g., 'light', 'medium', 'heavy'
  symptoms: string | null;
  nextCycleDate: string | null;
  mood: string | null; // e.g., 'happy', 'irritable', 'anxious'
  remedy: string | null; // e.g., 'painkillers', 'heat pad', 'exercise'
}
export interface MoodJournal {
  id?: number;
  date: string;
  timestamp: string;
  mood: string; // emoji
  notes?: string;
}

export interface Nutrition {
  id: string;
  name: string;
  type: 'Meal' | 'Snack' | 'Drink';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: 'g' | 'ml' | 'oz' | 'piece';
  consumedAt?: Date;
  notes: string;
  favorite: boolean;
  lastUsed?: Date;
}

export interface HealthEntry {
  id: string;
  date: string;
  weight: number|null;  // standardize to null
  systolic: number|null;
  diastolic: number|null;
  bloodSugar: number|null;
  note: string|null;
}


export interface Frequency {
  value: number;
  unit: "hours"|"days"|"weeks";
}


export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: Frequency;
  timeToTake: string; // Store as ISO string
  notes?: string;
  startDate: string; // Store as ISO string
  endDate?: string; // Store as ISO string
  nextDose?: string; // Store as ISO string
  lastTaken?: string; // Store as ISO string
}


export interface Activity {
  id: string;
  name: string;
  type: string;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  intensity: 'Low'|'Medium'|'High';
  notes: string;
  favorite: boolean;
  lastUsed?: Date;
}

export interface SleepEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  sleepQuality: number; // 1-5 scale
  nightWakeups?: {
      time: string;
      reason: string;
  }[];
  notes?: string;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  notes: string;
  startTime?: Date;
  endTime?: Date;
  favorite: boolean;
  lastUsed?: Date;
  created_at: string;    // Added automatic timestamp
  updated_at: string;    // Added automatic timestamp
}

