export const SW_STRINGS={
  HOMEPAGE: {
    ACTIVITY: {
      TITLE: "Shughuli ya Leo",
      NO_ACTIVITY: "Hakuna shughuli iliyorekodiwa leo. Anza kufuatilia hapa chini!",
      QUICK_HINT: "Gonga kitufe kurekodi haraka. Nenda kwenye Trackers kwa maelezo zaidi.",
      UPCOMING: "Zinazokuja:",
      HOME_HINT: "Gonga kitufe chochote ili kurekodi kwa haraka. Angalia Trackers kwa undani zaidi.",
      TRACKERS_HINT: "Chagua tracker kuhariri, kufuta, au kunakili. 'Quick Log' inahifadhi na tarehe ya leo.",
      CALENDAR_HINT: "Tazama data yako kwa mtazamo wa kalenda. Gonga tarehe ili kuona rekodi zako.",
      SETTINGS_HINT: "Binafsisha programu yako: Mandhari, arifa, na vipengele vingine.",
      SHOW_HELP: "Onyesha vidokezo vya msaada",
    },


    NOTIFICATIONS: {
      SCHEDULED_TITLE: "Kitendo Kilichopangwa",
      SCHEDULED_MESSAGE: "Unapaswa {{action}} saa {{nextReminder}} Unataka kusubiri au kurekodi sasa?",
      WAIT_BUTTON: "Subiri",
      LOG_NOW_BUTTON: "Rekodi Sasa",
      CONFIRM_TITLE: "Thibitisha Kitendo",
      CONFIRM_MESSAGE: "Una uhakika unataka kurekodi: {{action}}?",
      CANCEL_BUTTON: "Ghairi",
      CONFIRM_LOG_BUTTON: "Ndiyo, Rekodi",
      REMINDER: "Kikumbusho cha {{action}}!",
    },
    ACTIONS: {
      CHANGED_TAMPON: "Kubadilisha Tampon",
      CHANGED_PAD: "Kubadilisha Pedi",
      CHANGED_CUP: "Kubadilisha Kikombe cha Hedhi",
      CHANGED_UNDERWEAR: "Kubadilisha Chupi ya Hedhi",
      DRANK_WATER: "Kunywa Maji",
      TOOK_PAINKILLER: "Kumeza Dawa ya Maumivu",
      DRANK_COFFEE: "Kunywa Kahawa",
      DRANK_TEA: "Kunywa Chai",
      PEED: "Kukojoa",
      POOPED: "Kunya",
    },


    MENSTRUAL: {TITLE: "Huduma ya Hedhi"},
    WELLNESS: {TITLE: "Afya Njema"},
    BATHROOM: {TITLE: "Choo"},
    BUTTONS: {
      MENSTRUAL: {
        CHANGED_TAMPON: "Tamponi",
        CHANGED_PAD: "Pedi",
        CHANGED_CUP: "Kikombe cha hedhi",
        CHANGED_UNDERWEAR: "Chupi za hedhi",
      },
      WELLNESS: {
        DRANK_WATER: "Maji",
        TOOK_PAINKILLER: "Dawa ya Maumivu",
        DRANK_COFFEE: "Kahawa",
        DRANK_TEA: "Chai",
      },
      BATHROOM: {
        PEED: "Kojoa",
        POOPED: "Jisaidie",
      },
    },
  },
  CALENDAR: {
    VIEW_MODES: {daily: "leo",weekly: "wiki",monthly: "mwezi",yearly: "mwaka"},
    WEEK_DAYS: [
      "J2",
      "J3",
      "J4",
      "J5",
      "Al",
      "Ij",
      "J1"
    ],

    MONTH_NAMES: [
      "Januari","Februari","Machi","Aprili","Mei","Juni",
      "Julai","Agosti","Septemba","Oktoba","Novemba","Desemba"
    ],
  },
  SETTINGS: {
    NOTIFICATIONS: {TITLE: "Arifa za Jumla",DAILY_SUMMARIES: "Muhtasari wa Kila Siku"},
    LANGUAGE: {
      TITLE: "Lugha",
      SELECT: "Chagua Lugha",
      ENGLISH: "Kiingereza",
      FRENCH: "Kifaransa",
      SPANISH: "Kihispania",
      SWAHILI: "Kiswahili",
      SLANG: "Slang ya Gen Z",
    },

    APPEARANCE: {
      TITLE: "Mwonekano",
      THEME: "Mandhari",
      OPTIONS: {SYSTEM: "Chaguomsingi",LIGHT: "Mwanga",DARK: "Giza",BLUE: "Bluu",GREEN: "Kijani",PURPLE: "Zambarau"},
    },
    PRIVACY: {TITLE: "Faragha",APP_LOCK: "Kufunga Programu"},
    HISTORY: {TITLE: "Historia",HISTORY: "Historia",DOCTORS_REPORT: "Ripoti ya Daktari"},
    DATA_MANAGEMENT: {TITLE: "Usimamizi wa Data",EXPORT_DATA: "Hamisha Data",IMPORT_DATA: "Ingiza Data"},
    HELP_SUPPORT: {TITLE: "Msaada na Usaidizi",USER_GUIDE: "Mwongozo wa Mtumiaji",CONTACT_SUPPORT: "Wasiliana na Usaidizi"},
    WEBSITE: {TITLE: "Tovuti Yetu",LINK_TEXT: "QuantFem"},
    MODAL: {HEADER: "Weka Muda wa Vikumbusho",CLOSE_BUTTON: "Funga"},
  },
  TRACKER: {
    TITLE: "Ufuatiliaji wa Afya",
    BUTTONS: {
      CYCLE: {LABEL: "Mzunguko wa Hedhi",ICON: "calendar-heart",ROUTE: "../tracker/period"},
      SLEEP: {LABEL: "Usingizi",ICON: "sleep",ROUTE: "../tracker/sleep"},
      SYMPTOM: {LABEL: "Dalili",ICON: "thermometer",ROUTE: "../tracker/symptoms"},
      MEDICATION: {LABEL: "Dawa",ICON: "pill",ROUTE: "../tracker/medication"},
      MOOD: {LABEL: "Hisia",ICON: "emoticon-happy",ROUTE: "../tracker/mood"},
      NUTRITION: {LABEL: "Lishe",ICON: "food-apple",ROUTE: "../tracker/nutrition"},
      ACTIVITY: {LABEL: "Shughuli",ICON: "run",ROUTE: "../tracker/activity"},
      HEALTH: {LABEL: "Jumla",ICON: "notebook",ROUTE: "../tracker/general"},
    },
    LAST_ENTRY: "Kuingiza Mwisho:",
    NO_ENTRIES: "Hakuna Rekodi",
  },
  GENERAL_TRACKER: {
    MODAL: {
      EDIT_HEALTH_ENTRY: "Hariri ingizo la afya",
      ADD_HEALTH_ENTRY: "Ongeza ingizo la afya",
      CLOSE: "✕",
      DATE: "Tarehe",
      SELECT_DATE: "Chagua tarehe",
      WEIGHT: "Uzito (kg)",
      BLOOD_PRESSURE: "Shinikizo la damu (mmHg)",
      BLOOD_SUGAR: "Sukari ya damu (mg/dL)",
      NOTES: "Maelezo",
      SAVE_CHANGES: "Hifadhi mabadiliko",
      SAVE: "Hifadhi",
    },

    MENU: {
      EDIT: "Hariri",
      DELETE: "Futa",
      DELETE_CONFIRM_TITLE: "Futa Ingizo",
      DELETE_CONFIRM_MESSAGE: "Una uhakika unataka kufuta ingizo hili?",
      CANCEL: "Ghairi",
    },
    NO_DATA: "Hakuna maingizo",
  },
  TRACKERS: {
    SYMPTOM: {
      ADD: "Ongeza Dalili",
      NO_DATA: "Hakuna dalili zilizorekodiwa",
    },
    MEDICATION: {
      ADD: "Ongeza Dawa",
      NO_DATA: "Hakuna dawa zilizorekodiwa",
    },
    PERIOD: {
      ADD: "Ongeza Hedhi/Mzunguko",
      NO_DATA: "Hakuna data ya hedhi/mzunguko iliyorekodiwa",
    },
    ACTIVITY: {
      ADD: "Ongeza Shughuli",
      NO_DATA: "Hakuna shughuli zilizorekodiwa",
    },
    MOOD: {
      ADD: "Ongeza Hali ya Mawazo",
      NO_DATA: "Hakuna maingizo ya hali ya mawazo yaliyorekodiwa",
    },
    NUTRITION: {
      ADD: "Ongeza Lishe",
      NO_DATA: "Hakuna data ya lishe iliyorekodiwa",
    },
    SLEEP: {
      ADD: "Ongeza Usingizi",
      NO_DATA: "Hakuna data ya usingizi iliyorekodiwa",
    },
  },
  COMMON: {
    NA: "Hakuna"
  },
  HISTORY: {
    TABS: {
      DAILY: "Ingizo la Haraka",
      TRACKER: "Data ya Ufuatiliaji"
    },

    DR_REPORTS: {
      TITLE: "Ripoti ya Daktari ya QuantFem",
      DATE: "Tarehe: {{date}}",
      SHARE_BUTTON: "Shiriki Ripoti Hii",
      LOADING: "Inatengeneza ripoti...",
      NO_RECORDS: "Hakuna rekodi zinazopatikana.",
      PDF: {
        FILENAME: "Ripoti za Daktari za QuantFem {{date}}.pdf",
        SHARE_DIALOG_TITLE: "Shiriki Ripoti za Daktari za QuantFem",
        FOOTER: "Imetengenezwa na QuantFem | Ripoti ya Afya ya Siri"
      },
      CATEGORIES: {
        ACTIVITY: "SHUGHULI",
        SLEEP: "USINGIZI",
        SYMPTOM: "DALILI",
        CYCLE: "MZUNGUKO",
        MOOD: "HALI YA MAWAZO",
        NUTRITION: "LISHE",
        HEALTH: "AFYA",
        MEDICATION: "DAWA"
      },
      REPORT_ENTRIES: {
        CYCLE_START: "Mwanzo wa mzunguko: {{date}}\n",
        CYCLE_END: "Mwisho wa mzunguko: {{date}}\n",
      
        MEDICATION_ENTRY: "\nDawa: {{name}}\nKipimo: {{dosage}}\nMarudio: {{frequency}}\n",
      
        SLEEP_SUMMARY: "Rekodi za usingizi: {{count}}\nJumla ya usingizi: {{total}} saa\nWastani wa usingizi: {{average}} saa\nUbora wa wastani: {{averageQuality}}/5\n",
      
        ACTIVITY_SUMMARY: "Jumla ya shughuli: {{count}}\nMuda wa jumla: {{duration}} dakika\n",
      
        SYMPTOM_ENTRY: "{{symptom}}: {{count}} matukio\n",
      
        MOOD_ENTRY: "{{mood}} ({{count}} mara)\n",
      
        NUTRITION_SUMMARY: "Jumla ya kalori: {{calories}} kcal\nProtini: {{protein}}g\nWanga: {{carbs}}g\nMafuta: {{fat}}g\n",
      
        HEALTH_ENTRY: "\nUzito: {{weight}} kg\nShinikizo la damu: {{systolic}}/{{diastolic}} mmHg\nSukari ya damu: {{bloodSugar}} mg/dL\nVidokezo: {{notes}}\n"
      }
      
    }
  },

  LABELS: {
    STARTDATE: "Tarehe ya Kuanza",
    ENDDATE: "Tarehe ya Mwisho",
    CYCLELENGTH: "Urefu wa Mzunguko",
    PERIODLENGTH: "Urefu wa Hedhi",
    SYMPTOMS: "Dalili",
    NOTES: "Vidokezo",
    CREATEDAT: "Imeundwa",
    UPDATEDAT: "Imesasishwa",
    ACTION: "Kitendo",
    TIMESTAMP: "Muda wa Muda",
    NEXTCHANGE: "Mabadiliko Yanayofuata",
    FLOW: "Mtiririko",
    NEXTCYCLEDATE: "Tarehe Ijayo ya Mzunguko",
    MOOD: "Hisia",
    REMEDY: "Tiba",
    DATE: "Tarehe",
    CONSUMEDAT: "Imekunywa Saa",
    WEIGHT: "Uzito",
    SYSTOLIC: "Shinikizo la Systolic",
    DIASTOLIC: "Shinikizo la Diastolic",
    BLOODSUGAR: "Sukari ya Damu",
    NOTE: "Maelezo",
    VALUE: "Thamani",
    UNIT: "Kipimo",
    NAME: "Jina",
    TYPE: "Aina",
    CALORIES: "Kalori",
    PROTEIN: "Protini",
    CARBS: "Wanga",
    FAT: "Mafuta",
    SERVINGSIZE: "Kiasi cha Kula",
    SERVINGUNIT: "Kipimo cha Kula",
    FAVORITE: "Unapenda",
    LASTUSED: "Ilitumika Mwisho",
    DOSAGE: "Kipimo",
    FREQUENCY: "Mara ngapi",
    TIMETOTAKE: "Muda wa Kuchukua",
    BEDTIME: "Muda wa Kulala",
    WAKETIME: "Muda wa Kuamka",
    SLEEPQUALITY: "Ubora wa Usingizi",
    NIGHTWAKEUPS: "Kuamka Usiku",
    SEVERITY: "Ukali",
    DURATION: "Muda",
  },

  INSIGHTS: {
    CATEGORY_COUNT: {
      SYMPTOMS: "Dalili zilizofuatiliwa: {{count}}",
      MEDICATIONS: "Dawa zilizofuatiliwa: {{count}}",
      CYCLES: "Mizunguko iliyofuatiliwa: {{count}}",
      MOODS: "Hali za kihisia zilizofuatiliwa: {{count}}",
      SLEEP: "Rekodi za usingizi: {{count}}",
      NUTRITION: "Rekodi za lishe: {{count}}",
      HEALTH: "Rekodi za afya: {{count}}"
    },
    CORRELATIONS: {
      TITLE: "Uhusiano na Mifumo",
      CYCLE_SYMPTOMS: "{{symptom}} hutokea mara {{frequency}} wakati wa mizunguko",
      SLEEP_NUTRITION: "{{food}} inahusishwa na ubora wa usingizi wa {{quality}}%",
      MOOD_SYMPTOMS: "{{symptom}} huwa inatokea na hali ya {{mood}} (mara {{frequency}})",
      ACTIVITY_SLEEP: "{{activity}} inahusishwa na ubora wa usingizi wa {{quality}}%",
      MEDICATION_EFFECT: "{{medication}} hupunguza dalili kwa {{reduction}}%",
      ACTIVITY_MOOD: "{{activity}} inahusishwa na hali ya {{mood}} (mara {{frequency}})",
      HEALTH_SYMPTOMS: "{{condition}} inahusiana na {{symptom}} (mara {{frequency}})",
      HEALTH_MOOD: "{{condition}} inahusishwa na hali ya {{mood}} (mara {{frequency}})",
      WEIGHT_NUTRITION: "{{food}} inahusishwa na mabadiliko ya uzito wa {{change}}kg"
    },
  },

};



