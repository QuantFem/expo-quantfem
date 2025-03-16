import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useThemedStyles from '@/components/hooks/useThemedStyles';

interface BackButtonProps {
  onPress?: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress,
  label = '←'
}) => {
  const navigation = useNavigation();
  const styles = useThemedStyles();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.cardHeader}>🔙</Text>
    </TouchableOpacity>
  );
};

export default BackButton;