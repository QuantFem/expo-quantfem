import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_LOCK_KEY = "appLockEnabled";

const useBiometricAuth = () => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [authenticationAttempted, setAuthenticationAttempted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the device supports biometrics and load stored preference
  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);

      // Load stored preference
      const storedPreference = await AsyncStorage.getItem(APP_LOCK_KEY);
      const isAppLockEnabled = storedPreference === "true";
      setAppLockEnabled(isAppLockEnabled);

      if (!isAppLockEnabled) {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
      }
    };

    checkBiometrics();
  }, []);

  // Authenticate when appLockEnabled changes and only once after mounting
  useEffect(() => {
    const attemptAuthentication = async () => {
      if (appLockEnabled && !authenticationAttempted) {
        setIsAuthenticating(true);
        await authenticateUser();
        setAuthenticationAttempted(true);
        setIsAuthenticating(false);
      }
    };

    attemptAuthentication();
  }, [appLockEnabled, authenticationAttempted]);

  // Function to prompt biometric authentication
  const authenticateUser = async () => {
    if (!biometricAvailable) {
      setIsAuthenticated(true);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access the app",
      cancelLabel: "Cancel",
    });

    if (!result.success) {
      // 🔥 Exit the app if authentication fails
      console.warn("Authentication failed. Exiting app...");
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
  };

  // Function to toggle App Lock
  const toggleBiometricAuth = async () => {
    if (!biometricAvailable) return;

    // Authenticate before enabling
    if (!appLockEnabled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to enable App Lock",
      });

      if (!result.success) return;
    }

    // Toggle App Lock state and save to storage
    const newState = !appLockEnabled;
    setAppLockEnabled(newState);
    await AsyncStorage.setItem(APP_LOCK_KEY, newState.toString());
    setAuthenticationAttempted(false); // Reset authenticationAttempted when toggling the setting
    
    if (!newState) {
      setIsAuthenticated(true);
    }
  };

  return {
    biometricAvailable,
    appLockEnabled,
    toggleBiometricAuth,
    isAuthenticating,
    isAuthenticated,
  };
};

export default useBiometricAuth;
