export const FR_STRINGS={
  HOMEPAGE: {
    ACTIVITY: {
      TITLE: "Activité du Jour",
      NO_ACTIVITY: "Aucune activité enregistrée aujourd'hui. Commencez à suivre ci-dessous !",
      QUICK_HINT: "Appuyez sur un bouton pour enregistrer instantanément une activité avec l'heure actuelle.\n" +
                 "Par exemple, si vous appuyez sur 'Thé', cela signifie que vous venez de boire du thé.\n" +
                 "Si vous enregistrez 'Antidouleur', cela signifie que vous l'avez pris maintenant, et la prochaine dose sera programmée dans 6 heures\n" +
                 "(visible dans les Activités du Jour).\n\n" +
                 "Pour des enregistrements détaillés comme les doses de médicaments, les symptômes ou la nutrition, utilisez la section Suivi.",
      UPCOMING: "À venir :",
      HOME_HINT: "Appuyez sur un bouton pour enregistrer votre activité instantanément.\n" +
                "Consultez la section Suivi pour un historique complet.",
      TRACKERS_HINT: "Utilisez les suivis pour des enregistrements détaillés avec un contrôle total.\n" +
                    "Voir, modifier ou supprimer les entrées précédentes.\n\n" +
                    "Pour les activités récurrentes (par exemple, manger le même repas),\n" +
                    "appuyez sur le bouton d'enregistrement rapide au lieu de ressaisir les détails manuellement.",
      CALENDAR_HINT: "Voyez toutes vos activités enregistrées au format calendrier.\n" +
                    "Appuyez sur une date pour voir les entrées précédentes.",
      SETTINGS_HINT: "Personnalisez votre expérience :\n" +
                    "- Changez les thèmes, les notifications et les préférences.\n" +
                    "- Générez des rapports pour les visites médicales.\n" +
                    "- Exportez les données pour sauvegarde (ex. Google Drive) ou importez des enregistrements passés.\n" +
                    "- Sécurisez l'application avec la biométrie.\n" +
                    "- Accédez aux ressources éducatives sur notre site web, aux fonctionnalités IA ou ajustez les notifications.",
      SHOW_HELP: "Afficher l'Aide",
      ACTION_VERBS: {
        PEED: "faire pipi",
        POOPED: "aller à la selle",
        DRANK_WATER: "boire de l'eau",
        DRANK_COFFEE: "boire du café",
        DRANK_TEA: "boire du thé",
        TOOK_PAINKILLER: "prendre un antidouleur",
        CHANGED_TAMPON: "changer votre tampon",
        CHANGED_PAD: "changer votre serviette hygiénique",
        CHANGED_CUP: "changer votre coupe menstruelle",
        CHANGED_UNDERWEAR: "changer vos sous-vêtements menstruels",
      },
    },
  
  
  
    NOTIFICATIONS: {
      SCHEDULED_TITLE: "Action Programmée",
      SCHEDULED_MESSAGE: "Vous devez {{action}} à {{nextReminder}} Voulez-vous attendre ou l'enregistrer maintenant ?",
      WAIT_BUTTON: "Attendre",
      LOG_NOW_BUTTON: "Enregistrer Maintenant",
      CONFIRM_TITLE: "Confirmer l'Action",
      CONFIRM_MESSAGE: "Êtes-vous sûr de vouloir enregistrer : {{action}} ?",
      CANCEL_BUTTON: "Annuler",
      CONFIRM_LOG_BUTTON: "Oui, Enregistrer",
      REMINDER: "Rappel pour {{action}} !",
  },
  ACTIONS: {
    CHANGED_TAMPON: "Changé le tampon",
    CHANGED_PAD: "Changé la serviette hygiénique",
    CHANGED_CUP: "Changé la coupe menstruelle",
    CHANGED_UNDERWEAR: "Changé la culotte menstruelle",
    DRANK_WATER: "Bu de l'eau",
    TOOK_PAINKILLER: "Pris un antidouleur",
    DRANK_COFFEE: "Bu du café",
    DRANK_TEA: "Bu du thé",
    PEED: "Fait pipi",
    POOPED: "Fait caca",
},

    MENSTRUAL: {TITLE: "Soins menstruels"},
    WELLNESS: {TITLE: "Bien-être"},
    BATHROOM: {TITLE: "Salle de bain"},
    BUTTONS: {
      MENSTRUAL: {
        CHANGED_TAMPON: "Tampon",
        CHANGED_PAD: "Serviette hygiénique",
        CHANGED_CUP: "Coupe menstruelle",
        CHANGED_UNDERWEAR: "Sous-vêtements menstruels",
      },
      WELLNESS: {
        DRANK_WATER: "Eau",
        TOOK_PAINKILLER: "Antidouleur",
        DRANK_COFFEE: "Café",
        DRANK_TEA: "Thé",
      },
      BATHROOM: {
        PEED: "Urination",
        POOPED: "Selles",
      },
    },
  },
  CALENDAR: {
    VIEW_MODES: {daily: "quotidien",weekly: "hebdomadaire",monthly: "mensuel",yearly: "annuel"},
    WEEK_DAYS: ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],
    MONTH_NAMES: [
      "Janvier","Février","Mars","Avril","Mai","Juin",
      "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
    ],
  },
  SETTINGS: {
    NOTIFICATIONS: {
      TITLE: "Notifications",
      ENABLE: "Activer les notifications",
      DAILY_SUMMARIES: "Résumés quotidiens",
    },
    LANGUAGE: {
      TITLE: "Langue",
      SELECT: "Sélectionner la langue",
      ENGLISH: "Anglais",
      FRENCH: "Français",
      SPANISH: "Espagnol",
      SWAHILI: "Swahili",
      SLANG: "Argot Gen Z",
    },
    APPEARANCE: {
      TITLE: "Apparence",
      THEME: "Thème",
      OPTIONS: {SYSTEM: "Par défaut",LIGHT: "Clair",DARK: "Sombre",BLUE: "Bleu",GREEN: "Vert",PURPLE: "Violet"},
    },
    PRIVACY: {TITLE: "Confidentialité",APP_LOCK: "Verrouillage de l'application"},
    HISTORY: {TITLE: "Historique",HISTORY: "Historique",DOCTORS_REPORT: "Rapport médical"},
    DATA_MANAGEMENT: {TITLE: "Gestion des données",EXPORT_DATA: "Exporter les données",IMPORT_DATA: "Importer des données"},
    HELP_SUPPORT: {TITLE: "Aide & Support",USER_GUIDE: "Guide utilisateur",CONTACT_SUPPORT: "Contacter le support"},
    WEBSITE: {TITLE: "Notre site web",LINK_TEXT: "QuantFem"},
    MODAL: {HEADER: "Définir les durées de rappel",CLOSE_BUTTON: "Fermer"},
  },
  TRACKER: {
    TITLE: "Suivi de santé",
    BUTTONS: {
      CYCLE: {LABEL: "Cycle menstruel",ICON: "calendar-heart",ROUTE: "../tracker/period"},
      SLEEP: {LABEL: "Sommeil",ICON: "sleep",ROUTE: "../tracker/sleep"},
      SYMPTOM: {LABEL: "Symptômes",ICON: "thermometer",ROUTE: "../tracker/symptoms"},
      MEDICATION: {LABEL: "Médicaments",ICON: "pill",ROUTE: "../tracker/medication"},
      MOOD: {LABEL: "Humeur",ICON: "emoticon-happy",ROUTE: "../tracker/mood"},
      NUTRITION: {LABEL: "Nutrition",ICON: "food-apple",ROUTE: "../tracker/nutrition"},
      ACTIVITY: {LABEL: "Activité",ICON: "run",ROUTE: "../tracker/activity"},
      HEALTH: {LABEL: "Général",ICON: "notebook",ROUTE: "../tracker/general"},
    },
    LAST_ENTRY: "Dernière entrée :",
    NO_ENTRIES: "Aucune entrée",
  },
  GENERAL_TRACKER: {
    MODAL: {
      EDIT_HEALTH_ENTRY: "Modifier l'entrée de santé",
      ADD_HEALTH_ENTRY: "Ajouter une entrée de santé",
      CLOSE: "✕",
      DATE: "Date",
      SELECT_DATE: "Sélectionner une date",
      WEIGHT: "Poids (kg)",
      BLOOD_PRESSURE: "Tension artérielle (mmHg)",
      BLOOD_SUGAR: "Glycémie (mg/dL)",
      NOTES: "Notes",
      SAVE_CHANGES: "Enregistrer les modifications",
      SAVE: "Enregistrer",
    },

    MENU: {
      EDIT: "Modifier",
      DELETE: "Supprimer",
      DELETE_CONFIRM_TITLE: "Supprimer l'entrée",
      DELETE_CONFIRM_MESSAGE: "Êtes-vous sûr de vouloir supprimer cette entrée ?",
      CANCEL: "Annuler",
    },
    NO_DATA: "Aucune entrée",
  },
  TRACKERS: {
    SYMPTOM: {
      ADD: "Ajouter un symptôme",
      EDIT: "Modifier le symptôme",
      NO_DATA: "Aucun symptôme enregistré",
    },
    MEDICATION: {
      ADD: "Ajouter un médicament",
      EDIT: "Modifier le médicament",
      NO_DATA: "Aucun médicament enregistré",
    },
    PERIOD: {
      ADD: "Ajouter période/cycle",
      EDIT: "Modifier période/cycle",
      NO_DATA: "Aucune donnée de période/cycle enregistrée",
    },
    ACTIVITY: {
      ADD: "Ajouter une activité",
      EDIT: "Modifier l'activité",
      NO_DATA: "Aucune activité enregistrée",
    },
    MOOD: {
      ADD: "Ajouter une humeur",
      EDIT: "Modifier l'humeur",
      NO_DATA: "Aucune entrée d'humeur enregistrée",
    },
    NUTRITION: {
      ADD: "Ajouter nutrition",
      EDIT: "Modifier nutrition",
      NO_DATA: "Aucune donnée nutritionnelle enregistrée",
    },
    SLEEP: {
      ADD: "Ajouter sommeil",
      EDIT: "Modifier sommeil",
      NO_DATA: "Aucune donnée de sommeil enregistrée",
    },
  },
  COMMON: {
    ADD: "Ajouter",
    EDIT: "Modifier",
    DELETE: "Supprimer",
    CANCEL: "Annuler",
    SAVE: "Enregistrer",
    NA: "Données non disponibles",
    
    // Common levels
    INTENSITY: {
      LOW: "Faible",
      MEDIUM: "Moyenne",
      HIGH: "Élevée"
    },
    SEVERITY: {
      MILD: "Légère",
      MODERATE: "Modérée",
      SEVERE: "Sévère"
    }
  },
  HISTORY: {
    TABS: {
      DAILY: "Entrées Rapides",
      TRACKER: "Données de Suivi"
  },
  
    DR_REPORTS: {
      TITLE: "Rapport Médical QuantFem",
      DATE: "Date : {{date}}",
      SHARE_BUTTON: "Partager ce Rapport",
      LOADING: "Génération du rapport...",
      NO_RECORDS: "Aucun enregistrement disponible.",
      PDF: {
        FILENAME: "Rapports Médicaux QuantFem {{date}}.pdf",
        SHARE_DIALOG_TITLE: "Partager les Rapports Médicaux QuantFem",
        FOOTER: "Généré par QuantFem | Rapport de Santé Confidentiel"
      },
      CATEGORIES: {
        ACTIVITY: "ACTIVITÉ",
        SLEEP: "SOMMEIL",
        SYMPTOM: "SYMPTÔME",
        CYCLE: "CYCLE",
        MOOD: "HUMEUR",
        NUTRITION: "NUTRITION",
        HEALTH: "SANTÉ",
        MEDICATION: "MÉDICAMENT"
      },
      REPORT_ENTRIES: {
        CYCLE_START: "Début du cycle: {{date}}\n",
        CYCLE_END: "Fin du cycle: {{date}}\n",
      
        MEDICATION_ENTRY: "\nMédicament: {{name}}\nDosage: {{dosage}}\nFréquence: {{frequency}}\n",
      
        SLEEP_SUMMARY: "Enregistrements de sommeil: {{count}}\nTotal de sommeil: {{total}} heures\nMoyenne de sommeil: {{average}} heures\nQualité moyenne: {{averageQuality}}/5\n",
      
        ACTIVITY_SUMMARY: "Total des activités: {{count}}\nDurée totale: {{duration}} min\n",
      
        SYMPTOM_ENTRY: "{{symptom}}: {{count}} occurrences\n",
      
        MOOD_ENTRY: "{{mood}} ({{count}} fois)\n",
      
        NUTRITION_SUMMARY: "Total de calories: {{calories}} kcal\nProtéines: {{protein}}g\nGlucides: {{carbs}}g\nLipides: {{fat}}g\n",
      
        HEALTH_ENTRY: "\nPoids: {{weight}} kg\nTension artérielle: {{systolic}}/{{diastolic}} mmHg\nGlycémie: {{bloodSugar}} mg/dL\nRemarques: {{notes}}\n"
      }
      
    }
  },
  LABELS: {
    STARTDATE: "Date de début",
        ENDDATE: "Date de fin",
        CYCLELENGTH: "Durée du cycle",
        PERIODLENGTH: "Durée des règles",
        SYMPTOMS: "Symptômes",
        NOTES: "Notes",
        CREATEDAT: "Créé le",
        UPDATEDAT: "Mis à jour le",
        ACTION: "Action",
        TIMESTAMP: "Horodatage",
        NEXTCHANGE: "Prochain changement",
        FLOW: "Flux",
        NEXTCYCLEDATE: "Prochaine date de cycle",
        MOOD: "Humeur",
        REMEDY: "Remède",
        DATE: "Date",
        CONSUMEDAT: "Consommé à",
        WEIGHT: "Poids",
        SYSTOLIC: "Pression systolique",
        DIASTOLIC: "Pression diastolique",
        BLOODSUGAR: "Glycémie",
        NOTE: "Note",
        VALUE: "Valeur",
        UNIT: "Unité",
        NAME: "Nom",
        TYPE: "Type",
        CALORIES: "Calories",
        PROTEIN: "Protéines",
        CARBS: "Glucides",
        FAT: "Lipides",
        SERVINGSIZE: "Portion",
        SERVINGUNIT: "Unité de portion",
        FAVORITE: "Favori",
        LASTUSED: "Dernière utilisation",
        DOSAGE: "Dosage",
        FREQUENCY: "Fréquence",
        TIMETOTAKE: "Heure de prise",
        STARTTIME: "Heure de début",
        ENDTIME: "Heure de fin",
        INTENSITY: "Intensité",
        BEDTIME: "Heure du coucher",
        WAKETIME: "Heure de réveil",
        SLEEPQUALITY: "Qualité du sommeil",
        NIGHTWAKEUPS: "Réveils nocturnes",
        SEVERITY: "Gravité",
        LASTTAKEN: "Dernière prise",
        NEXTDOSE: "Prochaine dose",
        DURATION: "Durée",
      
  },
  SLEEP: {
    INTERRUPTIONS: {
      TITLE: "Interruptions de Sommeil",
      ADD_BUTTON: "Ajouter une Interruption",
      REASONS: {
        BATHROOM: "Toilettes",
        NOISE: "Bruit",
        DISCOMFORT: "Inconfort",
        ANXIETY: "Anxiété",
        PAIN: "Douleur",
        OTHER: "Autre"
      }
    }
  },
  NUTRITION: {
    MEAL_TYPES: {
      MEAL: "Repas",
      SNACK: "Collation",
      DRINK: "Boisson"
    },
    SERVING_UNITS: {
      GRAMS: "g",
      MILLILITERS: "ml",
      OUNCES: "oz",
      PIECE: "unité"
    }
  },
  MEDICATION: {
    ACTIONS: {
      TAKE: "Prendre",
      STOP: "Arrêter",
      CHANGE: "Changer la Dose",
      RESTART: "Reprendre"
    },
    STATUS: {
      ACTIVE: "Actif",
      STOPPED: "Arrêté"
    },
    ALERTS: {
      SUCCESS: {
        ADDED: "✅ Entrée ajoutée avec succès",
        UPDATED: "✅ Entrée mise à jour avec succès",
        DELETED: "✅ Entrée supprimée avec succès",
        STOPPED: "✅ Entrée arrêtée avec succès",
        RESTARTED: "✅ Entrée redémarrée avec succès",
        TAKEN: "✅ Entrée enregistrée avec succès",
        SAVED: "✅ Modifications enregistrées avec succès",
        NEXT_DOSE: "✅ Prochaine dose prévue pour: {{time}}",
        IMPORT: "✅ Importation Terminée",
        IMPORT_DETAILS: "✅ Suivi: {{trackerSuccess}} importés, {{trackerFailed}} échoués.\n✅ Historique: {{historySuccess}} importés, {{historyFailed}} échoués."
      },

      ERROR: {
        ADD: "❌ Échec de l'ajout de l'entrée",
        UPDATE: "❌ Échec de la mise à jour de l'entrée",
        DELETE: "❌ Échec de la suppression de l'entrée",
        SAVE: "❌ Échec de l'enregistrement des modifications",
        GENERIC: "❌ Une erreur s'est produite",
        IMPORT: "❌ Erreur d'Importation",
        INVALID_FORMAT: "❌ Format JSON invalide. Veuillez vérifier le contenu du fichier.",
        REMINDER: "❌ Échec de la configuration du rappel. Veuillez réessayer."
      },

      // Warning/Validation messages with emojis
      WARNING: {
        REQUIRED_FIELDS: "⚠️ Veuillez remplir tous les champs obligatoires",
        INVALID_INPUT: "⚠️ Entrée Invalide",
        UNSUPPORTED_VALUE: "⚠️ Valeur non prise en charge",
        INVALID_DATE: "⚠️ Date sélectionnée invalide",
        INVALID_TIME: "⚠️ Heure sélectionnée invalide",
        INVALID_REMINDER: "⚠️ Veuillez entrer un nombre de jours valide pour le rappel."
      },

      // Empty states
      NO_ENTRIES: "Aucune entrée disponible",
      NO_ACTIVE_ENTRIES: "Aucune entrée active",
      NO_STOPPED_ENTRIES: "Aucune entrée arrêtée",

      // Confirmation messages
      CONFIRM: {
        DELETE: "Êtes-vous sûr de vouloir supprimer cette entrée ?",
        STOP: "Êtes-vous sûr de vouloir arrêter cette entrée ?",
        RESTART: "Êtes-vous sûr de vouloir redémarrer cette entrée ?",
        DISCARD: "Êtes-vous sûr de vouloir annuler les modifications ?",
        ACTION: "Confirmer l'Action",
        MESSAGE: "Êtes-vous sûr de vouloir enregistrer : {{action}} ?",
        SCHEDULED_ACTION: "Action Programmée",
        SCHEDULED_MESSAGE: "Vous devez {{action}} à {{nextReminder}}. Voulez-vous attendre ou l'enregistrer maintenant ?",
        WAIT: "Attendre",
        LOG_NOW: "Enregistrer Maintenant",
        CANCEL: "Annuler",
        LOG: "Oui, Enregistrer",
        QUICK_LOG: "Voulez-vous enregistrer une entrée pour {{date}} ?"
      }
    }
  },
  CYCLE: {
    FLOW: {
      NONE: "Aucun",
      LIGHT: "Léger",
      MEDIUM: "Moyen",
      HEAVY: "Abondant",
      SPOTTING: "Spotting"
    }
  }
};

