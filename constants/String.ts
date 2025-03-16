
export const STRINGS={
    HOMEPAGE: {
        // Activity Section
        ACTIVITY: {
            TITLE: "Today's Activity",
            NO_ACTIVITY: "No activity logged today. Start tracking below!",
            TRACKING_HINT: "Tap any button to log your activity instantly with a timestamp. For detailed tracking and history, head to the Tracker section.",
            UPCOMING: "Upcoming:",
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

        // Alerts & Reminders
        NOTIFICATIONS: {
            SCHEDULED_TITLE: "Scheduled Action",
            SCHEDULED_MESSAGE: (action: string,nextReminder: string) =>
                `You are due to ${action} at ${nextReminder}. Do you want to wait or log it now?`,
            WAIT_BUTTON: "Wait",
            LOG_NOW_BUTTON: "Log It Now",
            CONFIRM_TITLE: "Confirm Action",
            CONFIRM_MESSAGE: (action: string) =>
                `Are you sure you want to log: ${action}?`,
            CANCEL_BUTTON: "Cancel",
            CONFIRM_LOG_BUTTON: "Yes, Log It",
            REMINDER: (action: string) => `Reminder to ${action}!`,
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
        // View Modes for Calendar/Tracking
        VIEW_MODES: {
            daily: "daily",
            weekly: "weekly",
            monthly: "monthly",
            yearly: "yearly",
        },

        // Weekdays (Short Names)
        WEEK_DAYS: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],

        EVENT_EMOJIS: {
            HEALTH: "🩺", // Stethoscope for symptoms, heart for general health
            CYCLE: "🩸", // Blood drop for menstrual cycle
            MEDICATION: "💊", // Pill for medication
            SLEEP: "🛌", // Bed for sleep instead of face emoji
            MOOD: "😃", // Smiling face for mood
            NUTRITION: "🥗", // Salad to better represent food/nutrition
            ACTIVITY: "🏋️‍♀️", // Weightlifting for general activity instead of running
            SYMPTOM: "🥶", // Thermometer for symptoms
            DEFAULT: "📅", // Calendar icon for any undefined event
        },

        // Month Names (Full)
        MONTH_NAMES: [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ],
    },
    SETTINGS: {
        NOTIFICATIONS: {
            TITLE: "General Notifications",
            DAILY_SUMMARIES: "Daily Summaries",
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
            PERIOD: {LABEL: "Period/Cycle",ICON: "calendar-heart",ROUTE: "../tracker/period"},
            SLEEP: {LABEL: "Sleep",ICON: "sleep",ROUTE: "../tracker/sleep"},
            SYMPTOM: {LABEL: "Symptoms",ICON: "thermometer",ROUTE: "../tracker/symptoms"},
            MEDICATION: {LABEL: "Medication",ICON: "pill",ROUTE: "../tracker/medication"},
            MOOD: {LABEL: "Mood",ICON: "emoticon-happy",ROUTE: "../tracker/mood"},
            NUTRITION: {LABEL: "Nutrition",ICON: "food-apple",ROUTE: "../tracker/nutrition"},
            ACTIVITY: {LABEL: "Activity",ICON: "run",ROUTE: "../tracker/activity"},
            HEALTH: {LABEL: "General",ICON: "notebook",ROUTE: "../tracker/general"},
        },

        LAST_ENTRY: "Last Entry:",
        NO_ENTRIES: "No Entries",
    },

} as const;