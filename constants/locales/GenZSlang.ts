COMMON: {
  ADD: "Drop",
  EDIT: "Fix Up",
  DELETE: "Yeet",
  CANCEL: "Nvm",
  SAVE: "Lock It In",
  NA: "No Tea Here",
  
  // Common levels
  INTENSITY: {
    LOW: "Lowkey",
    MEDIUM: "Mid",
    HIGH: "Bussin"
  },
  SEVERITY: {
    MILD: "No Cap",
    MODERATE: "Kinda Sus",
    SEVERE: "Big Yikes"
  }
},

SLEEP: {
  // ... existing sleep translations ...
  INTERRUPTIONS: {
    TITLE: "Sleep Disruption Vibes",
    ADD_BUTTON: "Drop a Wake-up Note",
    REASONS: {
      BATHROOM: "Gotta Go",
      NOISE: "Too Much Tea",
      DISCOMFORT: "Not Vibing",
      ANXIETY: "Mind's Wildin",
      PAIN: "Ouchie Vibes",
      OTHER: "Different Energy"
    }
  }
},

NUTRITION: {
  // ... existing nutrition translations ...
  MEAL_TYPES: {
    MEAL: "Main Snack",
    SNACK: "Quick Bite",
    DRINK: "Sip Sip"
  },
  SERVING_UNITS: {
    GRAMS: "g",
    MILLILITERS: "ml",
    OUNCES: "oz",
    PIECE: "unit"
  }
},

MEDICATION: {
  // ... existing medication translations ...
  ACTIONS: {
    TAKE: "Pop This",
    STOP: "Pause This",
    CHANGE: "Switch Up Dose",
    RESTART: "Back On It"
  },
  STATUS: {
    ACTIVE: "On Deck",
    STOPPED: "On Pause"
  },
  ALERTS: {
    SUCCESS: {
      ADDED: "✅ New entry just dropped!",
      UPDATED: "✅ Entry update hittin' different now!",
      DELETED: "✅ Entry yeeted successfully!",
      STOPPED: "✅ Entry's on pause now, no cap!",
      RESTARTED: "✅ Entry's back in rotation, fr fr!",
      TAKEN: "✅ Entry secured!",
      SAVED: "✅ Changes locked in, fr fr!",
      NEXT_DOSE: "✅ Next one finna be at {{time}}",
      IMPORT: "✅ Import's a whole vibe!",
      IMPORT_DETAILS: "✅ Tracker: {{trackerSuccess}} entries bussin', {{trackerFailed}} ain't it.\n✅ History: {{historySuccess}} entries slapped, {{historyFailed}} flopped."
    },

    // Error messages with emojis
    ERROR: {
      ADD: "❌ Couldn't drop that entry, no cap",
      UPDATE: "❌ Update ain't it chief",
      DELETE: "❌ Couldn't yeet that entry",
      SAVE: "❌ Bruh moment - couldn't save that",
      GENERIC: "❌ This ain't it chief",
      IMPORT: "❌ Import's not bussin'",
      INVALID_FORMAT: "❌ This JSON ain't giving what it's supposed to give. Check the file, bestie!",
      REMINDER: "❌ Reminder setup flopped. Try again bestie!"
    },
    
    // Warning/Validation messages with emojis
    WARNING: {
      REQUIRED_FIELDS: "⚠️ Bestie, fill all the required fields!",
      INVALID_INPUT: "⚠️ This Input Ain't It",
      UNSUPPORTED_VALUE: "⚠️ That value's not giving what it's supposed to give",
      INVALID_DATE: "⚠️ That date ain't valid fam",
      INVALID_TIME: "⚠️ That time ain't valid bestie",
      INVALID_REMINDER: "⚠️ Drop a real number of days for the reminder, bestie!"
    },
    
    // Empty states
    NO_ENTRIES: "No entries in the house rn",
    NO_ACTIVE_ENTRIES: "No active entries on deck",
    NO_STOPPED_ENTRIES: "No entries on pause rn",

    // Confirmation messages
    CONFIRM: {
      DELETE: "You sure you wanna yeet this entry?",
      STOP: "You finna pause this entry fr fr?",
      RESTART: "Ready to bring this entry back fr?",
      DISCARD: "You tryna ditch these changes?",
      ACTION: "Vibe Check",
      MESSAGE: "You finna log this: {{action}}?",
      SCHEDULED_ACTION: "Scheduled Vibe",
      SCHEDULED_MESSAGE: "You supposed to {{action}} at {{nextReminder}}. Wanna wait or drop it now?",
      WAIT: "Hold Up",
      LOG_NOW: "Drop It Now",
      CANCEL: "Nah, I'm Good",
      LOG: "Bet, Let's Do It",
      QUICK_LOG: "You tryna drop an entry for {{date}}?"
    }
  }
},

CYCLE: {
  // ... existing cycle translations ...
  FLOW: {
    NONE: "Nada",
    LIGHT: "Barely There",
    MEDIUM: "Regular Vibes",
    HEAVY: "Extra",
    SPOTTING: "Just Spots"
  }
},

TRACKERS: {
  SYMPTOM: {
    ADD: "Drop a Symptom",
    EDIT: "Fix Up That Symptom",
    NO_DATA: "No symptoms in the house",
  },
  MEDICATION: {
    ADD: "Add Some Meds",
    EDIT: "Switch Up Those Meds",
    NO_DATA: "No meds in the mix",
  },
  PERIOD: {
    ADD: "Log That Flow",
    EDIT: "Update That Flow",
    NO_DATA: "No flow data to show",
  },
  ACTIVITY: {
    ADD: "Log a Flex",
    EDIT: "Fix Up That Flex",
    NO_DATA: "No flexes logged yet",
  },
  MOOD: {
    ADD: "Vibe Check",
    EDIT: "Update That Vibe",
    NO_DATA: "No vibes checked in",
  },
  NUTRITION: {
    ADD: "Log a Snack",
    EDIT: "Fix Up That Snack",
    NO_DATA: "No snacks tracked",
  },
  SLEEP: {
    ADD: "Log Some Zs",
    EDIT: "Fix Up Those Zs",
    NO_DATA: "No Zs caught yet",
  },
} 