import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferencesContextType {
  showInstructions: boolean;
  toggleInstructions: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  showInstructions: true,
  toggleInstructions: () => {},
});

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem('showInstructions');
        if (storedPreference !== null) {
          setShowInstructions(JSON.parse(storedPreference)); // ✅ Properly parses stored value
        }
      } catch (error) {
        console.error("Error loading preference:", error);
      }
    };
    loadPreference();
  }, []);

  const toggleInstructions = async () => {
    try {
      const newValue = !showInstructions;
      setShowInstructions(newValue); // ✅ Ensures state update triggers re-render
      await AsyncStorage.setItem('showInstructions', JSON.stringify(newValue)); // ✅ Persists in AsyncStorage
    } catch (error) {
      console.error("Error saving preference:", error);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ showInstructions, toggleInstructions }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
