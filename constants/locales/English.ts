export const EN_STRINGS = {

    // Keep existing translations...

    HOMEPAGE: {
        // Activity Section
        ACTIVITY: {
            TITLE: "Today's Activity",
            NO_ACTIVITY: "No activity logged today. Start tracking below!",
        
            QUICK_HINT: "Tap a button to instantly log an activity with the current time.\n" +
                        "For example, if you tap 'Tea,' it means you just drank tea.\n" +
                        "If you log 'Painkiller,' it means you took one now, and the next dose will be scheduled in 6 hours\n" +
                        "(visible in Today's Activities).\n\n" +
                        "For detailed logs like medication doses, symptoms, or nutrition, use the Tracker section.",
        
            UPCOMING: "Upcoming:",
        
            HOME_HINT: "Tap a button to log your activity instantly.\n" +
                       "Check the Trackers section for a full history.",
        
            TRACKERS_HINT: "Use trackers for detailed logs with full control.\n" +
                           "View, edit, or delete past entries.\n\n" +
                           "For recurring activities (e.g., eating the same meal),\n" +
                           "tap the quick log button instead of re-entering details manually.",
        
            CALENDAR_HINT: "See all your logged activities in a calendar format.\n" +
                           "Tap any date to view past entries.",
        
            SETTINGS_HINT: "Customize your experience:\n" +
                           "- Change themes, notifications, and preferences.\n" +
                           "- Generate reports for doctor visits.\n" +
                           "- Export data for backup (e.g., Google Drive) or import past records.\n" +
                           "- Secure the app with biometrics.\n" +
                           "- Access educational resources on our website, AI features, or adjust notifications.",
        
            SHOW_HELP: "Show Help Tooltips",
        },
        


        // Menstrual Care Section
        MENSTRUAL: {
            TITLE: "Menstrual Care",
        },
        BUTTONS: {
            MENSTRUAL: {
                CHANGED_TAMPON: "Tampon",
                CHANGED_PAD: "Pad",
                CHANGED_CUP: "Menstrual Cup",
                CHANGED_UNDERWEAR: "Period Underwear",
            },
            WELLNESS: {
                DRANK_WATER: "Water",
                TOOK_PAINKILLER: "Painkiller",
                DRANK_COFFEE: "Coffee",
                DRANK_TEA: "Tea",
            },
            BATHROOM: {
                PEED: "Urination",
                POOPED: "Bowel Movement",
            },
        },

        // Wellness Section
        WELLNESS: {
            TITLE: "Wellness",
        },

        // Bathroom Section
        BATHROOM: {
            TITLE: "Bathroom",
        },

        NOTIFICATIONS: {
            SCHEDULED_TITLE: "Scheduled Action",
            SCHEDULED_MESSAGE: "You are due to {{action}} at {{nextReminder}}. Do you want to wait or log it now?",

            WAIT_BUTTON: "Wait",
            LOG_NOW_BUTTON: "Log It Now",

            CONFIRM_TITLE: "Confirm Action",
            CONFIRM_MESSAGE: "Are you sure you want to log: {{action}}?",

            CANCEL_BUTTON: "Cancel",
            CONFIRM_LOG_BUTTON: "Yes, Log It",

            REMINDER: "Reminder to {{action}}!",
            REMIND_LATER_BUTTON: "Remind Me Later", // ✅ Added missing button
            SET_REMINDER_TITLE: "Set Reminder",
            SET_REMINDER_MESSAGE: "Would you like to set a reminder for {{action}}?",

            REMINDER_SCHEDULED: "Reminder scheduled for {{time}}",
            REMINDER_CANCELLED: "Reminder cancelled",
            NEXT_REMINDER: "Next reminder at {{nextReminder}}",

            REMINDER_FREQUENCY: "Reminder Frequency",
            REMINDER_OPTIONS: {
                HOURLY: "Every Hour",
                FOUR_HOURS: "Every 4 Hours",
                SIX_HOURS: "Every 6 Hours",
                DAILY: "Once a Day",
            }
        },


        // Icons
        ICONS: {
            MENSTRUAL: "gender-female",
            WELLNESS: "heart",
            BATHROOM: "toilet",
        },

        // Action Mapping (For Logging)
        ACTIONS: {
            CHANGED_TAMPON: "Changed Tampon",
            CHANGED_PAD: "Changed Pad",
            CHANGED_CUP: "Changed Menstrual Cup",
            CHANGED_UNDERWEAR: "Changed Period Underwear",
            DRANK_WATER: "Drank Water",
            TOOK_PAINKILLER: "Took Painkiller",
            DRANK_COFFEE: "Drank Coffee",
            DRANK_TEA: "Drank Tea",
            PEED: "Peed",
            POOPED: "Pooped",
        },
    },
    CALENDAR: {

        VIEW_MODES: {
            daily: "daily",
            weekly: "weekly",
            monthly: "monthly",
            yearly: "yearly",
        },

        // Weekdays (Short Names)
        WEEK_DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        EVENT_EMOJIS: {
            HEALTH: "🩺",
            CYCLE: "🩸",
            MEDICATION: "💊",
            SLEEP: "🛌",
            MOOD: "😃",
            NUTRITION: "🥗",
            ACTIVITY: "🏋️‍♀️",
            SYMPTOM: "🥶",
            DEFAULT: "📅",
        },

        // Month Names (Full)
        MONTH_NAMES: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        //date format


    },
    SETTINGS: {
        LANGUAGE: {
            TITLE: "Language",
            SELECT: "Select Language",
            ENGLISH: "English",
            FRENCH: "Français",
            SPANISH: "Español",
            SWAHILI: "Swahili",
            SLANG: "Gen Z Slang",
        },
        NOTIFICATIONS: {
            TITLE: "Notifications",
            ENABLE: "Enable Notifications",
        },

        APPEARANCE: {
            TITLE: "Appearance",
            THEME: "Theme",
            OPTIONS: {
                SYSTEM: "Default",
                LIGHT: "Light",
                DARK: "Dark",
                BLUE: "Blue",
                GREEN: "Green",
                PURPLE: "Purple",
            },
        },

        PRIVACY: {
            TITLE: "Privacy",
            APP_LOCK: "App Lock",
        },

        HISTORY: {
            TITLE: "History",
            HISTORY: "History",
            DOCTORS_REPORT: "Doctor's Report",
        },

        DATA_MANAGEMENT: {
            TITLE: "Data Management",
            EXPORT_DATA: "Export Data",
            IMPORT_DATA: "Import Data",
        },

        HELP_SUPPORT: {
            TITLE: "Help & Support",
            USER_GUIDE: "User Guide",
            CONTACT_SUPPORT: "Contact Support",
        },

        WEBSITE: {
            TITLE: "Our Website",
            LINK_TEXT: "QuantFem",
        },

        MODAL: {
            HEADER: "Set Reminder Durations",
            CLOSE_BUTTON: "Close",
        },
    },
    TRACKER: {
        TITLE: "Health Tracker",

        BUTTONS: {
            CYCLE: { LABEL: "Period/Cycle", ICON: "calendar-heart", ROUTE: "../tracker/period" },
            SLEEP: { LABEL: "Sleep", ICON: "sleep", ROUTE: "../tracker/sleep" },
            SYMPTOM: { LABEL: "Symptoms", ICON: "thermometer", ROUTE: "../tracker/symptoms" },
            MEDICATION: { LABEL: "Medication", ICON: "pill", ROUTE: "../tracker/medication" },
            MOOD: { LABEL: "Mood", ICON: "emoticon-happy", ROUTE: "../tracker/mood" },
            NUTRITION: { LABEL: "Nutrition", ICON: "food-apple", ROUTE: "../tracker/nutrition" },
            ACTIVITY: { LABEL: "Activity", ICON: "run", ROUTE: "../tracker/activity" },
            HEALTH: { LABEL: "General", ICON: "notebook", ROUTE: "../tracker/general" },
        },

        LAST_ENTRY: "Last Entry:",
        NO_ENTRIES: "No Entries",
    },
    // New strings for the modal
    GENERAL_TRACKER: {
        MODAL: {
            EDIT_HEALTH_ENTRY: "Edit Health Entry",
            ADD_HEALTH_ENTRY: "Add Health Entry",
            CLOSE: "✕",
            DATE: "Date",
            SELECT_DATE: "Select Date",
            WEIGHT: "Weight (kg)",
            BLOOD_PRESSURE: "Blood Pressure (mmHg)",
            BLOOD_SUGAR: "Blood Sugar (mg/dL)",
            NOTES: "Notes",
            SAVE_CHANGES: "Save Changes",
            SAVE: "Save",
        },

        MENU: {
            EDIT: "Edit",
            DELETE: "Delete",
            DELETE_CONFIRM_TITLE: "Delete Entry",
            DELETE_CONFIRM_MESSAGE: "Are you sure you want to delete this entry?",
            CANCEL: "Cancel",
        },
        NO_DATA: "No entries",
    },
    TRACKERS: {
        SYMPTOM: {
            ADD: "Add Symptom",
            NO_DATA: "No symptoms recorded",
        },
        MEDICATION: {
            ADD: "Add Medication",
            NO_DATA: "No medications recorded",
        },
        PERIOD: {
            ADD: "Add Period/Cycle",
            NO_DATA: "No period/cycle data recorded",
        },
        ACTIVITY: {
            ADD: "Add Activity",
            NO_DATA: "No activities recorded",
        },
        MOOD: {
            ADD: "Add Mood",
            NO_DATA: "No mood entries recorded",
        },
        NUTRITION: {
            ADD: "Add Nutrition",
            NO_DATA: "No nutrition data recorded",
        },
        SLEEP: {
            ADD: "Add Sleep",
            NO_DATA: "No sleep data recorded",
        },
    },
    // strings.ts
    COMMON: {
        NA: "None" // Add this line for "Not Available"
    },
    HISTORY: {
        TABS: {
            DAILY: "Quick Entries",
            TRACKER: "Tracker Data"
        },
        DR_REPORTS: {
            TITLE: "QuantFem Doctor Report",
            DATE: "Date: {{date}}",
            SHARE_BUTTON: "Share This Report",
            LOADING: "Generating report...",
            NO_RECORDS: "No records available.",

            PDF: {
                FILENAME: "QuantFem Dr Reports {{date}}.pdf",
                SHARE_DIALOG_TITLE: "Share QuantFem Dr Reports",
                FOOTER: "Generated by QuantFem | Confidential Health Report"
            },
            CATEGORIES: {
                ACTIVITY: "ACTIVITY",
                SLEEP: "SLEEP",
                SYMPTOM: "SYMPTOM",
                CYCLE: "CYCLE",
                MOOD: "MOOD",
                NUTRITION: "NUTRITION",
                HEALTH: "HEALTH",
                MEDICATION: "MEDICATION" // Add this line
            },
            REPORT_ENTRIES: {
                CYCLE_START: "Cycle Start: {{date}}\n",
                CYCLE_END: "Cycle End: {{date}}\n",

                MEDICATION_ENTRY: "\nMedication: {{name}}\nDosage: {{dosage}}\nFrequency: {{frequency}}\n",

                SLEEP_SUMMARY: "Sleep entries: {{count}}\nTotal sleep: {{total}} hours\nSleep Average: {{average}} hours\nAverage Quality: {{averageQuality}}/5\n",

                ACTIVITY_SUMMARY: "Total Activities: {{count}}\nTotal Duration: {{duration}} min\n",

                SYMPTOM_ENTRY: "{{symptom}}: {{count}} occurrences\n",

                MOOD_ENTRY: "{{mood}} ({{count}} times)\n",

                NUTRITION_SUMMARY: "Total Calories: {{calories}} kcal\nProtein: {{protein}}g\nCarbs: {{carbs}}g\nFat: {{fat}}g\n",

                HEALTH_ENTRY: "\nWeight: {{weight}} kg\nBlood Pressure: {{systolic}}/{{diastolic}} mmHg\nBlood Sugar: {{bloodSugar}} mg/dL\nNotes: {{notes}}\n"
            }


        }
    },
    LABELS: {
        STARTDATE: "Start Date",
        ENDDATE: "End Date",
        CYCLELENGTH: "Cycle Length",
        PERIODLENGTH: "Period Length",
        SYMPTOMS: "Symptoms",
        NOTES: "Notes",
        CREATEDAT: "Created At",
        UPDATEDAT: "Updated At",
        ID: "ID",
        ACTION: "Action",
        TIMESTAMP: "Timestamp",
        NEXTCHANGE: "Next Change",
        FLOW: "Flow",
        NEXTCYCLEDATE: "Next Cycle Date",
        MOOD: "Mood",
        REMEDY: "Remedy",
        DATE: "Date",
        CONSUMEDAT: "Consumed At",
        WEIGHT: "Weight",
        SYSTOLIC: "Systolic Pressure",
        DIASTOLIC: "Diastolic Pressure",
        BLOODSUGAR: "Blood Sugar",
        NOTE: "Note",
        VALUE: "Value",
        UNIT: "Unit",
        NAME: "Name",
        TYPE: "Type",
        CALORIES: "Calories",
        PROTEIN: "Protein",
        CARBS: "Carbohydrates",
        FAT: "Fat",
        SERVINGSIZE: "Serving Size",
        SERVINGUNIT: "Serving Unit",
        FAVORITE: "Favorite",
        LASTUSED: "Last Used",
        DOSAGE: "Dosage",
        FREQUENCY: "Frequency",
        TIMETOTAKE: "Time to Take",
        STARTTIME: "Start Time",
        ENDTIME: "End Time",
        INTENSITY: "Intensity",
        BEDTIME: "Bed Time",
        WAKETIME: "Wake Time",
        SLEEPQUALITY: "Sleep Quality",
        NIGHTWAKEUPS: "Night Wakeups",
        SEVERITY: "Severity",
        LASTTAKEN: "Last Taken",
        NEXTDOSE: "Next Dose",
        DURATION: "Duration",
    },
    INSIGHTS: {
        TITLE: "Insights",
        OVERVIEW: "Overview",
        TOTAL_ENTRIES: "{{count}} total entries",
        TRACKING_PERIOD: "Tracking from {{start}} to {{end}}",
        STORAGE_INFO: "Storage used: {{used}}MB / {{available}}MB available",
        CATEGORIES: "Categories",
        CATEGORY_COUNT: {
            SYMPTOMS: "Symptoms tracked: {{count}}",
            MEDICATIONS: "Medications tracked: {{count}}",
            CYCLES: "Cycles tracked: {{count}}",
            MOODS: "Moods tracked: {{count}}",
            SLEEP: "Sleep entries: {{count}}",
            NUTRITION: "Nutrition entries: {{count}}",
            HEALTH: "Health entries: {{count}}"
        },
        TRENDS: "Trends & Patterns",
        MOST_TRACKED_SYMPTOM: "Most tracked symptom: {{symptom}}",
        COMMON_MOOD: "Most common mood: {{pattern}}",
        AVG_SLEEP: "Average sleep: {{hours}} hours",
        MED_ADHERENCE: "Medication adherence: {{percentage}}%",
        STREAKS: "Activity Streaks",
        CURRENT_STREAK: "Current streak: {{days}} days",
        LONGEST_STREAK: "Longest streak: {{days}} days",
        LAST_ACTIVITY: "Last activity: {{time}}",
        EXPORT_DATA: "Export Data",
        RESET_DATA: "Reset Data",
        HEALTH_METRICS: {
            TITLE: "Health Metrics",
            WEIGHT_CURRENT: "Current weight: {{weight}}kg",
            WEIGHT_CHANGE: "Weight change over {{period}}: {{change}}kg",
            BP_AVERAGE: "Average blood pressure: {{systolic}}/{{diastolic}} mmHg",
            BP_CHANGE: "Blood pressure change over {{period}}:",
            BP_SYSTOLIC: "Systolic: {{change}} mmHg",
            BP_DIASTOLIC: "Diastolic: {{change}} mmHg"
        },
        CORRELATIONS: {
            TITLE: "Correlations & Patterns",
            CYCLE_SYMPTOMS: "{{symptom}} occurs {{frequency}} times during cycles",
            SLEEP_NUTRITION: "{{food}} is associated with {{quality}}% sleep quality",
            MOOD_SYMPTOMS: "{{symptom}} often occurs with {{mood}} mood ({{frequency}} times)",
            ACTIVITY_SLEEP: "{{activity}} is associated with {{quality}}% sleep quality",
            MEDICATION_EFFECT: "{{medication}} reduces symptoms by {{reduction}}%",
            ACTIVITY_MOOD: "{{activity}} is associated with {{mood}} mood ({{frequency}} times)",
            HEALTH_SYMPTOMS: "{{condition}} is related to {{symptom}} ({{frequency}} times)",
            HEALTH_MOOD: "{{condition}} is associated with {{mood}} mood ({{frequency}} times)",
            WEIGHT_NUTRITION: "{{food}} is associated with {{change}}kg weight change"
        },
    },
    ALERTS: {
        CONFIRM: {
            RESET: "Reset All Data",
            RESET_MESSAGE: "This will permanently delete all your data. Are you sure you want to continue?",
            DELETE_ALL: "Delete All Entries",
            DELETE_ALL_MESSAGE: "Are you sure you want to delete all entries? This action cannot be undone. Your insights history will be preserved.",
        },
        SUCCESS: {
            EXPORT: "Data Exported",
            EXPORT_MESSAGE: "Your data has been successfully exported and encrypted.",
            RESET: "Data Reset Complete",
            DELETE_ALL: "All entries have been deleted successfully.",
        },
        ERROR: {
            EXPORT: "Failed to export data",
            RESET: "Failed to reset data",
            DELETE_ALL: "Failed to delete entries. Please try again.",
        },
    },
    MEDICATION: {
        ACTIONS: {
            EDIT: "Edit",
            DELETE: "Delete",
            TAKE: "Take",
            STOP: "Stop",
            CHANGE: "Change Dosage",
            RESTART: "Restart"
        },
        LABELS: {
            NAME: "Name",
            DOSAGE: "Dosage",
            FREQUENCY: "Frequency",
            TIMETOTAKE: "Time to Take",
            STARTDATE: "Start Date",
            ENDDATE: "End Date",
            NOTES: "Notes",
            NEXTDOSE: "Next Dose"
        },
        ALERTS: {
            STOPPED_SUCCESS: "Medication stopped successfully",
            RESTARTED_SUCCESS: "Medication restarted successfully",
            TAKEN_SUCCESS: "Medication taken. Next dose at ",
            UPDATED_SUCCESS: "Medication updated successfully",
            ADDED_SUCCESS: "Medication added successfully",
            UPDATE_FAILED: "Failed to update medication",
            SAVE_ERROR: "Error saving medication",
            REQUIRED_FIELDS: "Name and dosage are required",
            INVALID_INPUT: "Invalid input provided",
            UNSUPPORTED_FREQUENCY: "Unsupported frequency unit"
        }
    },
} as const;
