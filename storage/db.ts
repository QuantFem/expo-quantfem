import {scheduleNotification} from "@/components/mycomponents/notifications/notifications";
import {HistoryEntry} from "@/types/types";
import * as SQLite from "expo-sqlite";


// Open database connection
const db=SQLite.openDatabaseSync("quantfem.db");

// Check database connection
export const checkDatabaseConnection=async (): Promise<boolean> => {
  try {
    db.execSync("SELECT 1;");
    console.log("✅ Database connected successfully");
    return true;
  } catch(error) {
    console.error("❌ Database connection error:",error);
    return false;
  }
};

// Modify logUserAction to include notifications
export const logUserAction=(action: string,nextChangeInHours?: number): void => {
  if(!action||action.trim()==="") {
    console.error("❌ Error: Action cannot be empty");
    return;
  }

  const currentTime=new Date().toISOString();
  const nextChangeTime=nextChangeInHours
    ? new Date(Date.now()+nextChangeInHours*60*60*1000).toISOString()
    :null;

  try {
    db.execSync(
      `INSERT INTO user_logs (action, timestamp, next_change) VALUES ('${action}', '${currentTime}', ${nextChangeTime? `'${nextChangeTime}'`:"NULL"});`
    );
    console.log(`✅ Action logged: ${action}`);

    // Schedule notification if next change is provided
    if(nextChangeInHours) {
      scheduleNotification(
        `Reminder: ${action}`,
        `It's time to ${action.toLowerCase()}.`,
        nextChangeInHours
      );
    }
  } catch(error) {
    console.error("❌ Failed to log action:",error);
  }
};



// Function to fetch user logs
export const fetchUserLogs = async (): Promise<HistoryEntry[]> => {
  try {
    const results = await db.getAllAsync("SELECT * FROM user_logs ORDER BY timestamp DESC;");

    if (!results || !Array.isArray(results)) {
      console.error("❌ Error: Unexpected response from SQLite query");
      return [];
    }

    return results.map((row: any) => ({
      id: row.id.toString(),
      action: row.action,
      timestamp: new Date(row.timestamp).toISOString(),
      nextChange: row.next_change ? new Date(row.next_change).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    return [];
  }
};

//delete userlogs
export const deleteHistoryEntry = async (id: string): Promise<boolean> => {
  try {
    const result = await db.execAsync(`DELETE FROM user_logs WHERE id = '${id}';`);
    console.log(`✅ History entry deleted: ${id}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to delete history entry:", error);
    return false;
  }
};

//delete only todays entry
export const deleteTodaysHistoryEntry = async (action: string): Promise<boolean> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to start of tomorrow

    const result = await db.execAsync(
      `DELETE FROM user_logs WHERE action = '${action}' AND timestamp >= '${today.toISOString()}' AND timestamp < '${tomorrow.toISOString()}';`
    );
    console.log(`✅ Todays history entry deleted: ${action}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to delete todays history entry:", error);
    return false;
  }
};

{/**
    //clear all tables 
    db.execSync("DROP TABLE IF EXISTS user_logs;");
    db.execSync("DROP TABLE IF EXISTS health_entries;");
    db.execSync("DROP TABLE IF EXISTS cycles;");
    db.execSync("DROP TABLE IF EXISTS symptoms;");
    db.execSync("DROP TABLE IF EXISTS medications;"); 
    db.execSync("DROP TABLE IF EXISTS nutrition;");
    db.execSync("DROP TABLE IF EXISTS mood_journals;");
    db.execSync("DROP TABLE IF EXISTS activities;");
    db.execSync("DROP TABLE IF EXISTS sleep_entries;");
    db.execSync("DROP TABLE IF EXISTS cycle_entries;");

     */}

// Setup database tables
export const setupDatabase=async (): Promise<boolean> => {
  try {


    // Homepage logs
    db.execSync(
      `CREATE TABLE IF NOT EXISTS user_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        next_change TEXT
      );`
    );
    // Health entries table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS health_entries (
        id TEXT PRIMARY KEY,
        date TEXT,
        weight REAL,
        systolic INTEGER,
        diastolic INTEGER,
        bloodSugar REAL,
        note TEXT
      );`
    );

    // Period tracking table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        cycle_length INTEGER,
        period_length INTEGER,
        symptoms TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );

    // Symptoms table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS symptoms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        severity TEXT CHECK(severity IN ('Mild', 'Moderate', 'Severe')) NOT NULL,
        notes TEXT,
        startTime TEXT,
        endTime TEXT,
        favorite INTEGER DEFAULT 0,
        lastUsed TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );


    //medication table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS medications (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     dosage TEXT NOT NULL,
     frequency TEXT NOT NULL,
     timeToTake TEXT NOT NULL,
     notes TEXT,
     startDate TEXT NOT NULL,
     endDate TEXT,
     nextDose TEXT,
     lastTaken TEXT
   );`
    );

    // Nutrition table

    db.execSync(
      `CREATE TABLE IF NOT EXISTS nutrition (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT CHECK(type IN ('Meal', 'Snack', 'Drink')) NOT NULL,
            calories INTEGER NOT NULL,
            protein REAL NOT NULL,
            carbs REAL NOT NULL,
            fat REAL NOT NULL,
            servingSize REAL NOT NULL,
            servingUnit TEXT CHECK(servingUnit IN ('g', 'ml', 'oz', 'piece')) NOT NULL,
            notes TEXT,
            favorite INTEGER DEFAULT 0,
            consumedAt TEXT,
            lastUsed TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
    );

    // Mood Journals table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS mood_journals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        mood TEXT NOT NULL,
        notes TEXT
      );`
    );

    
    //Cycle entry table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS cycle_entries (
        id TEXT PRIMARY KEY,
        startDate TEXT NOT NULL,
        endDate TEXT,
        cycleLength INTEGER,
        flow TEXT,
        symptoms TEXT,
        nextCycleDate TEXT,
        mood TEXT,
        remedy TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );

    //Sleep table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS sleep_entries (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            bedTime TEXT NOT NULL,
            wakeTime TEXT NOT NULL,
            sleepQuality INTEGER NOT NULL,
            nightWakeups TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
    );


    // Activities table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        duration INTEGER,
        startTime TEXT,
        endTime TEXT,
        intensity TEXT CHECK(intensity IN ('Low', 'Medium', 'High')) NOT NULL,
        notes TEXT,
        favorite INTEGER DEFAULT 0,
        lastUsed TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );


    console.log("✅ Database setup completed");
    return true;
  } catch(error) {
    console.error("❌ Database setup failed:",error);
    return false;
  }
};

// Export database instance for services
export default db;