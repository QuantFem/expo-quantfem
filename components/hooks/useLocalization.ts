import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/components/mycomponents/setup/localization/localization";

export function useLocalization() {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("appLanguage");
      if (savedLanguage && savedLanguage !== i18n.locale) {
        await changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = useCallback(async (lang: string) => {
    i18n.locale = lang;
    setLocale(lang);
    await AsyncStorage.setItem("appLanguage", lang);
  }, []);

  const t = useCallback((key: string, options?: any) => i18n.t(key, { ...options, locale }), [locale]);

  return { t, locale, changeLanguage };
}
