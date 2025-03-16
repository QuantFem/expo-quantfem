import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {useEffect,useState,useCallback} from "react";
import "react-native-reanimated";
import SplashScreenComponent from "./SplashScreen";
import {getLocales} from "expo-localization";
import i18n from "@/components/mycomponents/setup/localization/localization"; // Import i18n
import { SafeAreaView } from "react-native-safe-area-context";

import {setupDatabase} from "@/storage/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import { UserService } from "@/storage/UserService";

export {ErrorBoundary} from "expo-router";

export default function RootLayout() {
  const [isReady,setIsReady]=useState(false);
  const [showCustomSplash,setShowCustomSplash]=useState(true);
  const styles = useThemedStyles();


  const initializeApp=useCallback(async () => {
    try {
      // Prevent auto-hide of Expo splash screen
      await SplashScreen.preventAutoHideAsync();

      // Setup database
      const success=await UserService.initializeStorage();
      if(success) {
        console.log("Database ready for use!");
      } else {
        console.warn("Database setup was not successful");
      }

      // Load the selected language from AsyncStorage
      const storedLanguage=await AsyncStorage.getItem("appLanguage");
      const deviceLanguage=getLocales()[0]?.languageCode||"en";
      const languageToUse=storedLanguage||deviceLanguage;

      (i18n as any).locale=languageToUse; // Apply to i18n
      console.log("Loaded language:",languageToUse);

      await new Promise(resolve => setTimeout(resolve,2000));

      //add other stuff here

      // Ensure a minimum duration for the native splash screen
      await new Promise(resolve => setTimeout(resolve,2000));

    } catch(e) {
      console.warn("Error during app initialization:",e);
    } finally {
      setIsReady(true);
    }
  },[]);

  useEffect(() => {
    initializeApp();
  },[initializeApp]);

  useEffect(() => {
    if(isReady) {
      (async () => {
        // Hide the native splash screen
        await SplashScreen.hideAsync();
        // Show the custom splash screen
        setShowCustomSplash(true);
        // Set a timer to hide the custom splash screen
        const timer=setTimeout(() => {
          setShowCustomSplash(false);
        },2500);
        return () => clearTimeout(timer);
      })();
    }
  },[isReady]);

  if(!isReady||showCustomSplash) {
    return <SplashScreenComponent />;
  }

 

  return (

<SafeAreaView style={[styles.container, { padding: 0 }]}>
  <StatusBar />
  <RootLayoutNav />
</SafeAreaView>

  );

}

function RootLayoutNav() {

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen name="modal" options={{presentation: "modal"}} />
      <Stack.Screen name="education" options={{headerShown: false}} />
      <Stack.Screen name="reports" options={{headerShown: false}} />
      <Stack.Screen name="settings" options={{headerShown: false}} />
    </Stack>
  );
}
