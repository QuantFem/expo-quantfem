export const SL_STRINGS={
  HOMEPAGE: {
    ACTIVITY: {
      TITLE: "Today's Vibes",
      NO_ACTIVITY: "Nada logged today, get on it!",
      QUICK_HINT: "Smash a button to log it real quick. Hit up Trackers for the deep dive.",
      UPCOMING: "What's Next:",
      HOME_HINT: "Tap any button to log your moves fast. Peep Trackers for details.",
      TRACKERS_HINT: "Click a tracker to edit, delete, or dupe an entry. Quick Log keeps it fresh.",
      CALENDAR_HINT: " Click a day to peep your logs in calendar mode.",
      SETTINGS_HINT: "Tweak your app style, vibes, and notifs.",
      SHOW_HELP: "Show Help Tooltips 🔍",
    },



    NOTIFICATIONS: {
      SCHEDULED_TITLE: "Sched Task",
      SCHEDULED_MESSAGE: "Yo, it's time to {{action}} at {{nextReminder}} You wanna hold off or log this rn?",
      WAIT_BUTTON: "Chill",
      LOG_NOW_BUTTON: "Log It, Fam",
      CONFIRM_TITLE: "You Sure?",
      CONFIRM_MESSAGE: "Fr, you wanna log {{action}}?",
      CANCEL_BUTTON: "Nah",
      CONFIRM_LOG_BUTTON: "Yeet It",
      REMINDER: "Yo, don't forget to {{action}}!",
    },
    ACTIONS: {
      CHANGED_TAMPON: "Swapped the Plug",
      CHANGED_PAD: "Switched the Rag",
      CHANGED_CUP: "Emptied the Bucket",
      CHANGED_UNDERWEAR: "Fresh Undies On",
      DRANK_WATER: "Chugged H2O",
      TOOK_PAINKILLER: "Popped a Pill",
      DRANK_COFFEE: "Guzzled Joe",
      DRANK_TEA: "Sipped Some Brew",
      PEED: "Took a Leak",
      POOPED: "Dropped a Deuce",
    },

    MENSTRUAL: {TITLE: "Period Stuff"},
    WELLNESS: {TITLE: "Self-Care"},
    BATHROOM: {TITLE: "Bathroom Break"},
    BUTTONS: {
      MENSTRUAL: {
        CHANGED_TAMPON: "Tampons",
        CHANGED_PAD: "Pads",
        CHANGED_CUP: "Cup",
        CHANGED_UNDERWEAR: "Period Underwear",
      },
      WELLNESS: {
        DRANK_WATER: "Hydrated 💦",
        TOOK_PAINKILLER: "Popped a Med 💊",
        DRANK_COFFEE: "Caffeine Hit ☕",
        DRANK_TEA: "Tea Sesh 🍵",
      },
      BATHROOM: {
        PEED: "Quick Pee 🚰",
        POOPED: "Did a Number Two 💩",
      },
    },
  },
  CALENDAR: {
    VIEW_MODES: {
      daily: "Daily Vibe",
      weekly: "Weekly",
      monthly: "Month",
      yearly: "Year"
    },
    WEEK_DAYS: [
      "Su ☀️",
      "Mo 😴",
      "Tu 😎",
      "We 🐫",
      "Th 🔥",
      "Fr 🎉",
      "Sa 🛌"
    ],
    MONTH_NAMES: [
      "Jan ❄️",
      "Feb ❤️",
      "Mar 🌸",
      "Apr 🌻",
      "May 🌞",
      "Jun 🌴",
      "Jul ☀️",
      "Aug 🌊",
      "Sep 📚",
      "Oct 🎃",
      "Nov 🍂",
      "Dec 🎄"
    ],
  },

  SETTINGS: {
    NOTIFICATIONS: {TITLE: "Ping Me 📲",DAILY_SUMMARIES: "Daily Recap 🔄"},
    LANGUAGE: {
      TITLE: "Language 🌐",
      SELECT: "Pick a Language",
      ENGLISH: "English ",
      FRENCH: "Frenchie ",
      SPANISH: "Espanol",
      SWAHILI: "Swahili",
      SLANG: "Lit Talk",
    },

    APPEARANCE: {
      TITLE: "Vibe Check 🎨",
      THEME: "Aesthetic 🎭",
      OPTIONS: {SYSTEM: "OG",LIGHT: "Bright Mode ☀️",DARK: "Dark Mode 🌙",BLUE: "Blue Hues 💙",GREEN: "Earthy 🌿",PURPLE: "Mystic 🟣"},
    },
    PRIVACY: {TITLE: "Keep It Lowkey 🔒",APP_LOCK: "Lock the App 🛑"},
    HISTORY: {TITLE: "Throwbacks 📜",HISTORY: "Old Stuff 🕰️",DOCTORS_REPORT: "Dr's Report 🏥"},
    DATA_MANAGEMENT: {TITLE: "Data Vibes 📂",EXPORT_DATA: "Ship It 🚀",IMPORT_DATA: "Bring It In 📥"},
    HELP_SUPPORT: {TITLE: "Need a Hand? 🤝",USER_GUIDE: "How-To Guide 📖",CONTACT_SUPPORT: "Talk to Us 💬"},
    WEBSITE: {TITLE: "Our Crib 🌐",LINK_TEXT: "QuantFem 🔗"},
    MODAL: {HEADER: "Reminder Setup ⏰",CLOSE_BUTTON: "Nah, I'm Good ✌️"},
  },
  TRACKER: {
    TITLE: "Tracking Zone 📊",
    BUTTONS: {
      CYCLE: {LABEL: "Cycle Check 🔴",ICON: "calendar-heart",ROUTE: "../tracker/period"},
      SLEEP: {LABEL: "Snooze Log 😴",ICON: "sleep",ROUTE: "../tracker/sleep"},
      SYMPTOM: {LABEL: "Feeling Meh? 🤒",ICON: "thermometer",ROUTE: "../tracker/symptoms"},
      MEDICATION: {LABEL: "Meds Log 💊",ICON: "pill",ROUTE: "../tracker/medication"},
      MOOD: {LABEL: "Mood Check 😃",ICON: "emoticon-happy",ROUTE: "../tracker/mood"},
      NUTRITION: {LABEL: "Foodie Log 🍎",ICON: "food-apple",ROUTE: "../tracker/nutrition"},
      ACTIVITY: {LABEL: "Move It 🏃‍♀️",ICON: "run",ROUTE: "../tracker/activity"},
      HEALTH: {LABEL: "Random Logs 📓",ICON: "notebook",ROUTE: "../tracker/general"},
    },
    LAST_ENTRY: "Last Logged: ⏳",
    NO_ENTRIES: "Nothing Yet 🚫",
  },
  GENERAL_TRACKER: {
    MODAL: {
      EDIT_HEALTH_ENTRY: "Glow up that health tea",
      ADD_HEALTH_ENTRY: "Spill some new health tea",
      CLOSE: "Yeet",
      DATE: "When tho",
      SELECT_DATE: "Pick a day, fam",
      WEIGHT: "Thiccness (kg)",
      BLOOD_PRESSURE: "Blood vibes (mmHg)",
      BLOOD_SUGAR: "Sweet blood energy (mg/dL)",
      NOTES: "Extra tea",
      SAVE_CHANGES: "Lock this glow up",
      SAVE: "Bet",
    },

    MENU: {
      EDIT: "Glow Up",
      DELETE: "Yeet",
      DELETE_CONFIRM_TITLE: "Yeet This Entry?",
      DELETE_CONFIRM_MESSAGE: "You sure you wanna yeet this entry into oblivion?",
      CANCEL: "Nah, I'm Good",
    },
    NO_DATA: "No tea to spill",
  },
  TRACKERS: {
    SYMPTOM: {
      ADD: "Drop a Symptom",
      NO_DATA: "No symptoms in the house",
    },
    MEDICATION: {
      ADD: "Add Some Meds",
      NO_DATA: "No meds in the mix",
    },
    PERIOD: {
      ADD: "Log That Flow",
      NO_DATA: "No flow data to show",
    },
    ACTIVITY: {
      ADD: "Log a Flex",
      NO_DATA: "No flexes logged yet",
    },
    MOOD: {
      ADD: "Vibe Check",
      NO_DATA: "No vibes checked in",
    },
    NUTRITION: {
      ADD: "Log a Snack",
      NO_DATA: "No snacks tracked",
    },
    SLEEP: {
      ADD: "Log Some Zs",
      NO_DATA: "No Zs caught yet",
    },
  },
  COMMON: {
    NA: "Nada"
  },
  HISTORY: {
    TABS: {
      DAILY: "Quick Vibes",
      TRACKER: "Stat Flex"
    },

    DR_REPORTS: {
      TITLE: "QuantFem Doc's Tea",
      DATE: "When: {{date}}",
      SHARE_BUTTON: "Spill This Tea",
      LOADING: "Brewing the tea...",
      NO_RECORDS: "No tea to spill.",
      PDF: {
        FILENAME: "QuantFem Doc's Tea {{date}}.pdf",
        SHARE_DIALOG_TITLE: "Share QuantFem Doc's Tea",
        FOOTER: "Brewed by QuantFem | Top Secret Health Tea"
      },
      CATEGORIES: {
        ACTIVITY: "MOVES",
        SLEEP: "SNOOZE",
        SYMPTOM: "FEELS",
        CYCLE: "FLOW",
        MOOD: "VIBE",
        NUTRITION: "EATS",
        HEALTH: "STATS",
        MEDICATION: "PILLS"
      },
      REPORT_ENTRIES: {
        CYCLE_START: "🔥 Cycle started on: {{date}}\n",
        CYCLE_END: "🚀 Cycle ended on: {{date}}\n",

        MEDICATION_ENTRY: "\n💊 Meds: {{name}}\n📏 Dosage: {{dosage}}\n🔁 Frequency: {{frequency}}\n",

        SLEEP_SUMMARY: "😴 Sleep Logs: {{count}}\n🛏️ Total Zzz: {{total}} hrs\n💤 Avg Sleep: {{average}} hrs\n⭐ Sleep Quality: {{averageQuality}}/5\n",

        ACTIVITY_SUMMARY: "🏃‍♂️ Total Workouts: {{count}}\n⏳ Duration: {{duration}} min\n",

        SYMPTOM_ENTRY: "🤒 {{symptom}}: Happened {{count}} times 😭\n",

        MOOD_ENTRY: "😎 {{mood}} ({{count}} vibes)\n",

        NUTRITION_SUMMARY: "🍽️ Calories: {{calories}} kcal\n💪 Protein: {{protein}}g\n🥔 Carbs: {{carbs}}g\n🧈 Fat: {{fat}}g\n",

        HEALTH_ENTRY: "\n⚖️ Weight: {{weight}} kg\n💖 BP: {{systolic}}/{{diastolic}} mmHg\n🍬 Blood Sugar: {{bloodSugar}} mg/dL\n📝 Notes: {{notes}}\n"
      }

    }
  },

  LABELS: {
    STARTDATE: "First Vibes ⏳",
    ENDDATE: "Last Stop 🚏",
    CYCLELENGTH: "Cycle Grind ⏰",
    PERIODLENGTH: "Red Szn 🔴",
    SYMPTOMS: "Oof Feels 🤕",
    NOTES: "Lil Thoughts ✍️",
    CREATEDAT: "Made This 🏗️",
    UPDATEDAT: "Glow Up ✨",
    ID: "Tag #️⃣",
    ACTION: "Big Moves 🚀",
    TIMESTAMP: "Time Stamp ⏰",
    NEXTCHANGE: "Plot Twist 🔄",
    FLOW: "Drip Check 💧",
    NEXTCYCLEDATE: "Next Round 🔜",
    MOOD: "Vibe Check 🔥",
    REMEDY: "Fix It Quick 🩹",
    DATE: "When? 📅",
    CONSUMEDAT: "Chomped At 🍔",
    WEIGHT: "Lbs or Nah? ⚖️",
    SYSTOLIC: "Heart Pump 💓",
    DIASTOLIC: "Blood Flow 🩸",
    BLOODSUGAR: "Sugar Levels 🍬",
    NOTE: "Hot Take 📝",
    VALUE: "What's the Score? 🎯",
    UNIT: "How Much? 📏",
    NAME: "Tag Yo'self 🏷️",
    TYPE: "What's the Vibe? 🤔",
    CALORIES: "Burn It Up 🔥",
    PROTEIN: "Gainz 💪",
    CARBS: "Bread Count 🍞",
    FAT: "Chunky Stats 🧈",
    SERVINGSIZE: "Snack Size? 🍿",
    SERVINGUNIT: "Big or Nah? 📊",
    FAVORITE: "Certified Bop ✅",
    LASTUSED: "Throwback 🔙",
    DOSAGE: "Hit Me Up 💊",
    FREQUENCY: "How Often? ⏲️",
    TIMETOTAKE: "When to Pop? 🕒",
    STARTTIME: "Kickoff ⏳",
    ENDTIME: "Wrap It Up 🎬",
    INTENSITY: "Go Hard or Nah? 🔥",
    BEDTIME: "Snooze Time 😴",
    WAKETIME: "Wake n' Shake ☀️",
    SLEEPQUALITY: "Snooze Score 💯",
    NIGHTWAKEUPS: "Sleep Drama 🚨",
    SEVERITY: "How Bad? 😵",
    LASTTAKEN: "Last Dose? ⏳",
    NEXTDOSE: "Hit Me Next 💉",
    DURATION: "How Long Tho? ⏰",
  },
  INSIGHTS: {
    CATEGORY_COUNT: {
      SYMPTOMS: "Vibes check count: {{count}}",
      MEDICATIONS: "Med count: {{count}}",
      CYCLES: "Flow count: {{count}}",
      MOODS: "Mood ring count: {{count}}",
      SLEEP: "Zzz count: {{count}}",
      NUTRITION: "Snack count: {{count}}",
      HEALTH: "Health check count: {{count}}"
    },
    CORRELATIONS: {
      TITLE: "Vibe Connections ��",
      CYCLE_SYMPTOMS: "{{symptom}} shows up {{frequency}} times during flow szn",
      SLEEP_NUTRITION: "{{food}} gives {{quality}}% sleep quality vibes",
      MOOD_SYMPTOMS: "{{symptom}} hits different with {{mood}} mood ({{frequency}} times)",
      ACTIVITY_SLEEP: "{{activity}} gives {{quality}}% sleep quality vibes",
      MEDICATION_EFFECT: "{{medication}} cuts the bad vibes by {{reduction}}%",
      ACTIVITY_MOOD: "{{activity}} brings that {{mood}} energy ({{frequency}} times)",
      HEALTH_SYMPTOMS: "{{condition}} links with {{symptom}} ({{frequency}} times)",
      HEALTH_MOOD: "{{condition}} brings {{mood}} vibes ({{frequency}} times)",
      WEIGHT_NUTRITION: "{{food}} changes the scale by {{change}}kg"
    },
  },
};

