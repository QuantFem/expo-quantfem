import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import i18n from "@/components/mycomponents/setup/localization/localization";
import useThemedStyles from '@/components/hooks/useThemedStyles';

interface MenuContainerProps {
  onEdit: () => void;
  onDelete: () => void;
  setActiveMenu: (menu: string | null) => void;
}

const MenuContainer: React.FC<MenuContainerProps> = ({ onEdit, onDelete, setActiveMenu }) => {
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles

  const handleDelete = useCallback(() => {
    Alert.alert(
      i18n.t('GENERAL_TRACKER.MENU.DELETE_CONFIRM_TITLE'),
      i18n.t('GENERAL_TRACKER.MENU.DELETE_CONFIRM_MESSAGE'),
      [
        { text: i18n.t('GENERAL_TRACKER.MENU.CANCEL'), style: "cancel" },
        {
          text: i18n.t('GENERAL_TRACKER.MENU.DELETE'),
          style: "destructive",
          onPress: () => {
            onDelete();
            setActiveMenu(null);
          }
        },
      ]
    );
  }, [onDelete, setActiveMenu]); // ✅ Ensures function is memoized properly

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onEdit();
          setActiveMenu(null);
        }}
      >
        <Text style={styles.cardHeader}>{i18n.t('GENERAL_TRACKER.MENU.EDIT')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleDelete} // ✅ Optimized with `useCallback`
      >
        <Text style={styles.cardHeader}>{i18n.t('GENERAL_TRACKER.MENU.DELETE')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuContainer;
