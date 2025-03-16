/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  blueColor?: string;
  greenColor?: string;
  purpleColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string; blue?: string; green?: string; purple?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark & keyof typeof Colors.blue & keyof typeof Colors.green & keyof typeof Colors.purple
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return (
      Colors[theme]?.[colorName] ||
      Colors.light?.[colorName] ||
      Colors.dark?.[colorName] ||
      Colors.blue?.[colorName] ||
      Colors.green?.[colorName] ||
      Colors.purple?.[colorName] // ✅ Fallback to custom themes
    );
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, blueColor, greenColor, purpleColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor, blue: blueColor, green: greenColor, purple: purpleColor },
    "text"
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, blueColor, greenColor, purpleColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor, blue: blueColor, green: greenColor, purple: purpleColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
