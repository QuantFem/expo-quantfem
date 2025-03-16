import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark" | "blue" | "green" | "purple";

export function useCustomColorScheme(): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>("purple");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("themeMode");
      if (savedTheme && ["light", "dark", "blue", "green", "purple"].includes(savedTheme)) {
        setTheme(savedTheme as ThemeMode);
      } else {
        setTheme("purple");
      }
    };

    loadTheme();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(loadTheme);

    // Polling AsyncStorage for manual theme changes
    const checkStorageChange = setInterval(loadTheme, 1000);

    return () => {
      subscription.remove();
      clearInterval(checkStorageChange);
    };
  }, []);

  return theme;
}
