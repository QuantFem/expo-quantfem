export const ES_STRINGS={
  HOMEPAGE: {
    ACTIVITY: {
      TITLE: "Actividad de Hoy",
      NO_ACTIVITY: "No hay actividad registrada hoy. ¡Empieza a registrar abajo!",
      
      QUICK_HINT: "Toca un botón para registrar instantáneamente una actividad con la hora actual.\n" +
                 "Por ejemplo, si tocas 'Té', significa que acabas de beber té.\n" +
                 "Si registras 'Analgésico', significa que lo tomaste ahora, y la próxima dosis se programará en 6 horas\n" +
                 "(visible en Actividades de Hoy).\n\n" +
                 "Para registros detallados como dosis de medicamentos, síntomas o nutrición, usa la sección de Seguimiento.",
      
      UPCOMING: "Próximamente:",
      
      HOME_HINT: "Toca un botón para registrar tu actividad instantáneamente.\n" +
                "Consulta la sección de Seguimiento para un historial completo.",
      
      TRACKERS_HINT: "Usa los seguimientos para registros detallados con control total.\n" +
                    "Ver, editar o eliminar entradas anteriores.\n\n" +
                    "Para actividades recurrentes (por ejemplo, comer la misma comida),\n" +
                    "toca el botón de registro rápido en lugar de volver a ingresar los detalles manualmente.",
      
      CALENDAR_HINT: "Ve todas tus actividades registradas en formato calendario.\n" +
                    "Toca cualquier fecha para ver entradas anteriores.",
      
      SETTINGS_HINT: "Personaliza tu experiencia:\n" +
                    "- Cambia temas, notificaciones y preferencias.\n" +
                    "- Genera informes para visitas médicas.\n" +
                    "- Exporta datos para respaldo (ej. Google Drive) o importa registros anteriores.\n" +
                    "- Asegura la aplicación con biometría.\n" +
                    "- Accede a recursos educativos en nuestro sitio web, funciones de IA o ajusta notificaciones.",
      
      SHOW_HELP: "Mostrar Ayuda",
    },



    NOTIFICATIONS: {
      SCHEDULED_TITLE: "Acción Programada",
      SCHEDULED_MESSAGE: "Debes {{action}} a las {{nextReminder}} ¿Quieres esperar o registrarlo ahora?",
      WAIT_BUTTON: "Esperar",
      LOG_NOW_BUTTON: "Registrar Ahora",
      CONFIRM_TITLE: "Confirmar Acción",
      CONFIRM_MESSAGE: "¿Estás seguro de que quieres registrar: {{action}}?",
      CANCEL_BUTTON: "Cancelar",
      CONFIRM_LOG_BUTTON: "Sí, Registrar",
      DECREMENT_TITLE: "Reducir Actividad",
      DECREMENT_MESSAGE: "¿Estás seguro de que quieres reducir el conteo de \"{{action}}\"?",
      DECREMENT_CONFIRM: "Eliminar Última Entrada",
      DECREMENT_SUCCESS: "Conteo de actividad reducido.",
      DECREMENT_ERROR: "Error al reducir el conteo de actividad.",
      REMINDER: "¡Recordatorio para {{action}}!",
    },
    ACTIONS: {
      CHANGED_TAMPON: "Cambió el Tampón",
      CHANGED_PAD: "Cambió la Toalla Sanitaria",
      CHANGED_CUP: "Cambió la Copa Menstrual",
      CHANGED_UNDERWEAR: "Cambió la Ropa Interior Menstrual",
      DRANK_WATER: "Bebió Agua",
      TOOK_PAINKILLER: "Tomó Analgésico",
      DRANK_COFFEE: "Bebió Café",
      DRANK_TEA: "Bebió Té",
      PEED: "Orinó",
      POOPED: "Defecó",
    },


    MENSTRUAL: {TITLE: "Cuidado menstrual"},
    WELLNESS: {TITLE: "Bienestar"},
    BATHROOM: {TITLE: "Baño"},
    BUTTONS: {
      MENSTRUAL: {
        CHANGED_TAMPON: "Tampón",
        CHANGED_PAD: "Toalla sanitaria",
        CHANGED_CUP: "Copa menstrual",
        CHANGED_UNDERWEAR: "Ropa interior menstrual",
      },
      WELLNESS: {
        DRANK_WATER: "Agua",
        TOOK_PAINKILLER: "Analgésico",
        DRANK_COFFEE: "Café",
        DRANK_TEA: "Té",
      },
      BATHROOM: {
        PEED: "Orinar",
        POOPED: "Defecar",
      },
    },
    ACTION_VERBS: {
      PEED: "orinar",
      POOPED: "defecar",
      DRANK_WATER: "beber agua",
      DRANK_COFFEE: "beber café",
      DRANK_TEA: "beber té",
      TOOK_PAINKILLER: "tomar un analgésico",
      CHANGED_TAMPON: "cambiar tu tampón",
      CHANGED_PAD: "cambiar tu toalla sanitaria",
      CHANGED_CUP: "cambiar tu copa menstrual",
      CHANGED_UNDERWEAR: "cambiar tu ropa interior menstrual",
    },
  },
  CALENDAR: {
    VIEW_MODES: {daily: "diario",weekly: "semanal",monthly: "mensual",yearly: "anual"},
    WEEK_DAYS: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
    MONTH_NAMES: [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ],
  },
  SETTINGS: {
    NOTIFICATIONS: {
      TITLE: "Notificaciones",
      ENABLE: "Activar notificaciones",
      DAILY_SUMMARIES: "Resúmenes diarios",
    },
    LANGUAGE: {
      TITLE: "Idioma",
      SELECT: "Seleccionar idioma",
      ENGLISH: "Inglés",
      FRENCH: "Francés",
      SPANISH: "Español",
      SWAHILI: "Swahili",
      SLANG: "Jerga Gen Z",
    },

    APPEARANCE: {
      TITLE: "Apariencia",
      THEME: "Tema",
      OPTIONS: {SYSTEM: "Predeterminado",LIGHT: "Claro",DARK: "Oscuro",BLUE: "Azul",GREEN: "Verde",PURPLE: "Morado"},
    },
    PRIVACY: {TITLE: "Privacidad",APP_LOCK: "Bloqueo de aplicación"},
    HISTORY: {TITLE: "Historial",HISTORY: "Historial",DOCTORS_REPORT: "Informe médico"},
    DATA_MANAGEMENT: {TITLE: "Gestión de datos",EXPORT_DATA: "Exportar datos",IMPORT_DATA: "Importar datos"},
    HELP_SUPPORT: {TITLE: "Ayuda y soporte",USER_GUIDE: "Guía de usuario",CONTACT_SUPPORT: "Contactar soporte"},
    WEBSITE: {TITLE: "Nuestro sitio web",LINK_TEXT: "QuantFem"},
    MODAL: {HEADER: "Configurar duración de recordatorios",CLOSE_BUTTON: "Cerrar"},
  },
  TRACKER: {
    TITLE: "Seguimiento de salud",
    BUTTONS: {
      CYCLE: {LABEL: "Ciclo menstrual",ICON: "calendar-heart",ROUTE: "../tracker/period"},
      SLEEP: {LABEL: "Sueño",ICON: "sleep",ROUTE: "../tracker/sleep"},
      SYMPTOM: {LABEL: "Síntomas",ICON: "thermometer",ROUTE: "../tracker/symptoms"},
      MEDICATION: {LABEL: "Medicamentos",ICON: "pill",ROUTE: "../tracker/medication"},
      MOOD: {LABEL: "Estado de ánimo",ICON: "emoticon-happy",ROUTE: "../tracker/mood"},
      NUTRITION: {LABEL: "Nutrición",ICON: "food-apple",ROUTE: "../tracker/nutrition"},
      ACTIVITY: {LABEL: "Actividad",ICON: "run",ROUTE: "../tracker/activity"},
      HEALTH: {LABEL: "General",ICON: "notebook",ROUTE: "../tracker/general"},
    },
    LAST_ENTRY: "Última entrada:",
    NO_ENTRIES: "Sin entradas",
  },
  GENERAL_TRACKER: {
    MODAL: {
      EDIT_HEALTH_ENTRY: "Editar entrada de salud",
      ADD_HEALTH_ENTRY: "Añadir entrada de salud",
      CLOSE: "✕",
      DATE: "Fecha",
      SELECT_DATE: "Seleccionar fecha",
      WEIGHT: "Peso (kg)",
      BLOOD_PRESSURE: "Presión arterial (mmHg)",
      BLOOD_SUGAR: "Azúcar en sangre (mg/dL)",
      NOTES: "Notas",
      SAVE_CHANGES: "Guardar cambios",
      SAVE: "Guardar",
    },

    MENU: {
      EDIT: "Editar",
      DELETE: "Eliminar",
      DELETE_CONFIRM_TITLE: "Eliminar entrada",
      DELETE_CONFIRM_MESSAGE: "¿Estás seguro de que quieres eliminar esta entrada?",
      CANCEL: "Cancelar",
    },
    NO_DATA: "Sin entradas",
  },
  TRACKERS: {
    SYMPTOM: {
      ADD: "Añadir síntoma",
      NO_DATA: "No hay síntomas registrados",
    },
    MEDICATION: {
      ADD: "Añadir medicación",
      NO_DATA: "No hay medicaciones registradas",
    },
    PERIOD: {
      ADD: "Añadir período/ciclo",
      NO_DATA: "No hay datos de período/ciclo registrados",
    },
    ACTIVITY: {
      ADD: "Añadir actividad",
      NO_DATA: "No hay actividades registradas",
    },
    MOOD: {
      ADD: "Añadir estado de ánimo",
      NO_DATA: "No hay entradas de estado de ánimo registradas",
    },
    NUTRITION: {
      ADD: "Añadir nutrición",
      NO_DATA: "No hay datos de nutrición registrados",
    },
    SLEEP: {
      ADD: "Añadir sueño",
      NO_DATA: "No hay datos de sueño registrados",
    },
  },
  COMMON: {
    NA: "Ninguno"
  },
  HISTORY: {
    TABS: {
      DAILY: "Entradas Rápidas",
      TRACKER: "Datos de Seguimiento"
    },

    DR_REPORTS: {
      TITLE: "Informe Médico QuantFem",
      DATE: "Fecha: {{date}}",
      SHARE_BUTTON: "Compartir Este Informe",
      LOADING: "Generando informe...",
      NO_RECORDS: "No hay registros disponibles.",
      PDF: {
        FILENAME: "Informes Médicos QuantFem {{date}}.pdf",
        SHARE_DIALOG_TITLE: "Compartir Informes Médicos QuantFem",
        FOOTER: "Generado por QuantFem | Informe de Salud Confidencial"
      },
      CATEGORIES: {
        ACTIVITY: "ACTIVIDAD",
        SLEEP: "SUEÑO",
        SYMPTOM: "SÍNTOMA",
        CYCLE: "CICLO",
        MOOD: "ESTADO DE ÁNIMO",
        NUTRITION: "NUTRICIÓN",
        HEALTH: "SALUD",
        MEDICATION: "MEDICACIÓN"
      },
      REPORT_ENTRIES: {
        CYCLE_START: "Inicio del ciclo: {{date}}\n",
        CYCLE_END: "Fin del ciclo: {{date}}\n",
      
        MEDICATION_ENTRY: "\nMedicación: {{name}}\nDosis: {{dosage}}\nFrecuencia: {{frequency}}\n",
      
        SLEEP_SUMMARY: "Registros de sueño: {{count}}\nTotal de sueño: {{total}} horas\nPromedio de sueño: {{average}} horas\nCalidad promedio: {{averageQuality}}/5\n",
      
        ACTIVITY_SUMMARY: "Total de actividades: {{count}}\nDuración total: {{duration}} min\n",
      
        SYMPTOM_ENTRY: "{{symptom}}: {{count}} ocurrencias\n",
      
        MOOD_ENTRY: "{{mood}} ({{count}} veces)\n",
      
        NUTRITION_SUMMARY: "Total de calorías: {{calories}} kcal\nProteína: {{protein}}g\nCarbohidratos: {{carbs}}g\nGrasa: {{fat}}g\n",
      
        HEALTH_ENTRY: "\nPeso: {{weight}} kg\nPresión arterial: {{systolic}}/{{diastolic}} mmHg\nGlucosa en sangre: {{bloodSugar}} mg/dL\nNotas: {{notes}}\n"
      },
    }
  },

  LABELS: {

    STARTDATE: "Fecha de inicio",
    ENDDATE: "Fecha de finalización",
    CYCLELENGTH: "Duración del ciclo",
    PERIODLENGTH: "Duración del período",
    SYMPTOMS: "Síntomas",
    NOTES: "Notas",
    CREATEDAT: "Creado en",
    UPDATEDAT: "Actualizado en",
    ACTION: "Acción",
    TIMESTAMP: "Marca de tiempo",
    NEXTCHANGE: "Próximo cambio",
    FLOW: "Flujo",
    NEXTCYCLEDATE: "Próxima fecha del ciclo",
    MOOD: "Estado de ánimo",
    REMEDY: "Remedio",
    DATE: "Fecha",
    CONSUMEDAT: "Consumido en",
    WEIGHT: "Peso",
    SYSTOLIC: "Presión sistólica",
    DIASTOLIC: "Presión diastólica",
    BLOODSUGAR: "Azúcar en sangre",
    NOTE: "Nota",
    VALUE: "Valor",
    UNIT: "Unidad",
    NAME: "Nombre",
    TYPE: "Tipo",
    CALORIES: "Calorías",
    PROTEIN: "Proteínas",
    CARBS: "Carbohidratos",
    FAT: "Grasas",
    SERVINGSIZE: "Tamaño de la porción",
    SERVINGUNIT: "Unidad de porción",
    FAVORITE: "Favorito",
    LASTUSED: "Último uso",
    DOSAGE: "Dosis",
    FREQUENCY: "Frecuencia",
    TIMETOTAKE: "Hora de tomar",
    STARTTIME: "Hora de inicio",
    ENDTIME: "Hora de finalización",
    INTENSITY: "Intensidad",
    BEDTIME: "Hora de dormir",
    WAKETIME: "Hora de despertar",
    SLEEPQUALITY: "Calidad del sueño",
    NIGHTWAKEUPS: "Despertares nocturnos",
    SEVERITY: "Gravedad",
    LASTTAKEN: "Última dosis",
    NEXTDOSE: "Próxima dosis",
    DURATION: "Duración",
  },

 
  

};

