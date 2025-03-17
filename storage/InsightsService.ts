import db from '@/storage/db';

export interface InsightsTrends {
    mostTrackedSymptom: string;
    commonMoodPattern: string;
    averageSleepHours: number;
    medicationAdherence: number;
    weightTrend?: {
        current: number;
        change: number;
        period: string;
    };
    bloodPressureTrend?: {
        systolic: { avg: number; change: number };
        diastolic: { avg: number; change: number };
        period: string;
    };
}

export interface InsightsCategories {
    symptoms: number;
    medications: number;
    cycles: number;
    moods: number;
    sleep: number;
    nutrition: number;
    health: number;
}

export interface InsightsCorrelations {
    cycleSymptoms: Array<{ symptom: string; frequency: number }>;
    sleepNutrition: Array<{ food: string; avgSleepQuality: number }>;
    moodSymptoms: Array<{ symptom: string; mood: string; frequency: number }>;
    nutritionSymptoms: Array<{ food: string; symptom: string; frequency: number }>;
    activitySleep: Array<{ activity: string; avgSleepQuality: number }>;
    medicationEffectiveness: Array<{ medication: string; symptomReduction: number }>;
    activityMood: Array<{ activity: string; mood: string; frequency: number }>;
    healthSymptoms: Array<{ health: string; symptom: string; frequency: number }>;
    healthMood: Array<{ health: string; mood: string; frequency: number }>;
    nutritionWeight: Array<{ food: string; weightChange: number }>;
}

export interface InsightsDataInput {
    totalEntries: number;
    dateRange: {
        start: string;
        end: string;
    };
    categories: {
        symptoms: number;
        medications: number;
        cycles: number;
        moods: number;
        sleep: number;
        nutrition: number;
        health: number;
    };
    trends: {
        mostTrackedSymptom: string;
        commonMoodPattern: string;
        averageSleepHours: number;
        medicationAdherence: number;
        weightTrend?: {
            current: number;
            change: number;
            period: string;
        };
        bloodPressureTrend?: {
            systolic: {
                avg: number;
                change: number;
            };
            diastolic: {
                avg: number;
                change: number;
            };
            period: string;
        };
    };
    streaks: {
        current: number;
        longest: number;
        lastActivity: string;
    };
    correlations: {
        cycleSymptoms: Array<{ symptom: string; frequency: number }>;
        sleepNutrition: Array<{ food: string; avgSleepQuality: number }>;
        moodSymptoms: Array<{ symptom: string; mood: string; frequency: number }>;
        nutritionSymptoms: Array<{ food: string; symptom: string; frequency: number }>;
        activitySleep: Array<{ activity: string; avgSleepQuality: number }>;
        medicationEffectiveness: Array<{ medication: string; symptomReduction: number }>;
        activityMood: Array<{ activity: string; mood: string; frequency: number }>;
        healthSymptoms: Array<{ health: string; symptom: string; frequency: number }>;
        healthMood: Array<{ health: string; mood: string; frequency: number }>;
        nutritionWeight: Array<{ food: string; weightChange: number }>;
    };
}

export interface InsightsData extends InsightsDataInput {
    id: number;
    timestamp: string;
}

export class InsightsService {
    static async initializeTable(): Promise<void> {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS insights (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    total_entries INTEGER NOT NULL,
                    date_range TEXT NOT NULL,
                    categories TEXT NOT NULL,
                    trends TEXT NOT NULL,
                    streaks TEXT NOT NULL,
                    correlations TEXT NOT NULL
                );
            `);
        } catch (error) {
            console.error('Failed to initialize insights table:', error);
            throw error;
        }
    }

    static async saveInsights(insights: InsightsDataInput): Promise<void> {
        try {
            // Ensure table exists
            await this.initializeTable();

            await db.runAsync(
                `INSERT INTO insights (
                    timestamp,
                    total_entries,
                    date_range,
                    categories,
                    trends,
                    streaks,
                    correlations
                ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [
                    new Date().toISOString(),
                    insights.totalEntries,
                    JSON.stringify(insights.dateRange),
                    JSON.stringify(insights.categories),
                    JSON.stringify(insights.trends),
                    JSON.stringify(insights.streaks),
                    JSON.stringify(insights.correlations)
                ]
            );
        } catch (error) {
            console.error('Failed to save insights:', error);
            throw error;
        }
    }

    static async getLatestInsights(): Promise<InsightsData | null> {
        try {
            // Ensure table exists
            await this.initializeTable();

            const result = await db.getFirstAsync<any>(
                'SELECT * FROM insights ORDER BY timestamp DESC LIMIT 1;'
            );

            if (!result) return null;

            return {
                id: result.id,
                timestamp: result.timestamp,
                totalEntries: result.total_entries,
                dateRange: JSON.parse(result.date_range),
                categories: JSON.parse(result.categories),
                trends: JSON.parse(result.trends),
                streaks: JSON.parse(result.streaks),
                correlations: JSON.parse(result.correlations)
            };
        } catch (error) {
            console.error('Failed to get latest insights:', error);
            throw error;
        }
    }

    static async getAllInsights(): Promise<InsightsData[]> {
        try {
            // Ensure table exists
            await this.initializeTable();

            const results = await db.getAllAsync<any>(
                'SELECT * FROM insights ORDER BY timestamp DESC;'
            );

            return results.map(result => ({
                id: result.id,
                timestamp: result.timestamp,
                totalEntries: result.total_entries,
                dateRange: JSON.parse(result.date_range),
                categories: JSON.parse(result.categories),
                trends: JSON.parse(result.trends),
                streaks: JSON.parse(result.streaks),
                correlations: JSON.parse(result.correlations)
            }));
        } catch (error) {
            console.error('Failed to get all insights:', error);
            throw error;
        }
    }

    // Changed to keep more historical data and never delete old insights
    static async deleteOldInsights(keepLatest: number = 100): Promise<void> {
        try {
            // Ensure table exists
            await this.initializeTable();

            // Keep more historical data (default 100 entries)
            await db.runAsync(
                'DELETE FROM insights WHERE id NOT IN (SELECT id FROM insights ORDER BY timestamp DESC LIMIT ?);',
                [keepLatest]
            );
        } catch (error) {
            console.error('Failed to clean up insights:', error);
            throw error;
        }
    }
} 