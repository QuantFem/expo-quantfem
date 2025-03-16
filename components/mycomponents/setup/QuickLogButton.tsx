import useThemedStyles from '@/components/hooks/useThemedStyles';
import React from 'react';
import {View,TouchableOpacity,Text,Alert} from 'react-native';
import i18n from './localization/localization';
import LocalFormatter from './formatDate';

interface QuickLogButtonProps {
    onReenter: () => void;
}

const QuickLogButton: React.FC<QuickLogButtonProps>=({onReenter}) => {
    const styles=useThemedStyles();

    const handleQuickLogPress = () => {
        const formattedDate = LocalFormatter({ date: new Date() }); // Ensure LocalFormatter returns a string    
        Alert.alert(
            i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_TITLE"),
            i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_MESSAGE", {
                action: i18n.t("LABELS.CREATEDAT") + " " + formattedDate, 
            }),
            [
                {
                    text: i18n.t("HOMEPAGE.NOTIFICATIONS.CANCEL_BUTTON"),
                },
                {
                    text: i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_LOG_BUTTON"),
                    onPress: onReenter
                }
            ]
        );
    };
    


    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[styles.roundButton,styles.roundButtonActive]}
                onPress={handleQuickLogPress}
            >
                <Text style={styles.buttonText}>
                    {i18n.t("HOMEPAGE.NOTIFICATIONS.LOG_NOW_BUTTON")}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default QuickLogButton;
