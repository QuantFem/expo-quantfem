import React,{useEffect} from "react";
import {Tabs} from "expo-router";
import {useCustomColorScheme} from "@/components/useCustomColorScheme"; // ✅ Custom hook for theme
import {getThemedStyles} from "@/constants/Styles";
import Colors from "@/constants/Colors";
import useBiometricAuth from "@/components/mycomponents/BiometricAuth";
import {View} from "react-native";
import {requestNotificationPermission} from "@/components/mycomponents/notifications/notifications"; // ✅ Import notifications
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {UserPreferencesProvider} from "@/contexts/UserPreferencesContext";
import InstructionBox from "@/components/mycomponents/setup/InstructionBox";

function TabBarIcon({name,color}: {name: React.ComponentProps<typeof FontAwesome>["name"]; color: string}) {
  return <FontAwesome name={name} size={28} style={{marginBottom: -3}} color={color} />;
}

export default function TabsLayout() {
  const theme=useCustomColorScheme(); // ✅ Uses custom theme selection
  const themeColors=Colors[theme]; // ✅ Get colors from Colors.ts
  const styles=getThemedStyles(theme); // ✅ Get global styles
  const {isAuthenticating,isAuthenticated}=useBiometricAuth();

  useEffect(() => {
    requestNotificationPermission(); // ✅ Calls your existing function
  },[]);

  // Loading Screen with Themed Background
  const BlankLoadingScreen=() => <View style={styles.container} />; // ✅ Uses global styles

  if(isAuthenticating||!isAuthenticated) {
    return <BlankLoadingScreen />; // ✅ Uses the themed background
  }

  return (
    <UserPreferencesProvider>
      <View style={{flex: 1}}>
        {/* ✅ Tooltip Button Always at the Top-Right */}
        <InstructionBox />

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: themeColors.buttonText,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: themeColors.accentBackground,
            }

          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({color}) => <TabBarIcon name="home" color={color} />,
            }}
          />

          <Tabs.Screen
            name="insights"
            options={{
              title: "Insights",
              tabBarIcon: ({color}) => <TabBarIcon name="line-chart" color={color} />,
            }}
          />
          <Tabs.Screen
            name="trackers"
            options={{
              title: "Trackers",
              tabBarIcon: ({color}) => <TabBarIcon name="plus" color={color} />,
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: "Calendar",
              tabBarIcon: ({color}) => <TabBarIcon name="calendar" color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({color}) => <TabBarIcon name="cog" color={color} />,
            }}
          />
        </Tabs>
      </View>
    </UserPreferencesProvider>
  );
}
