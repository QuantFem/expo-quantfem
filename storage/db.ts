
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