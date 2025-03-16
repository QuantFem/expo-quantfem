import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// Import translations
import { EN_STRINGS } from "@/constants/locales/English";
import { FR_STRINGS } from "@/constants/locales/French";
import { ES_STRINGS } from "@/constants/locales/Spanish";
import { SW_STRINGS } from "@/constants/locales/Swahili";
import { SL_STRINGS } from "@/constants/locales/Slang";

// Get the device's primary language code (e.g., "en", "fr", "es", "sw", "sl")
const deviceLanguage = getLocales()[0]?.languageCode || "en"; // Default to English if undefined

// Create a new I18n instance
const i18n = new I18n({
  en: EN_STRINGS,
  fr: FR_STRINGS,
  es: ES_STRINGS,
  sw: SW_STRINGS,
  sl: SL_STRINGS
});

// Set current locale
i18n.locale = deviceLanguage;
i18n.defaultLocale = "en"; // Set fallback default language
i18n.enableFallback = true; // Falls back to default language if missing

export default i18n;
