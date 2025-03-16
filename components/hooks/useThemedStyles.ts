import { getThemedStyles } from "@/constants/Styles";
import { useCustomColorScheme } from "@/components/useCustomColorScheme";
import { useState, useEffect } from "react";

export default function useThemedStyles() {
  const theme = useCustomColorScheme() ?? "system"; // ✅ Get the current theme
  const [styles, setStyles] = useState(getThemedStyles(theme)); // ✅ Store styles in state

  useEffect(() => {
    setStyles(getThemedStyles(theme)); // ✅ Update styles whenever theme changes
  }, [theme]); // ✅ Runs every time the theme updates

  return styles; // ✅ Returns updated styles
}
