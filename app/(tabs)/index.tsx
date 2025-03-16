import { UserService } from "@/storage/UserService";
import React,{useState,useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import {HistoryEntry} from "@/types/types";
import i18n from "@/components/mycomponents/setup/localization/localization";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {promptAndScheduleReminder} from "@/components/mycomponents/notifications/homenotification";


const HomeScreen: React.FC=() => {
  const [history,setHistory]=useState<HistoryEntry[]>([]);
  const styles=useThemedStyles();


  useEffect(() => {
    loadHistory();
  },[history]);


  const calculateNextOccurrence=(entry: {action: string; timestamp: string},nextActions: {[key: string]: string}) => {
    const actionIntervals: {[key: string]: number}={
      "Changed Tampon": 4,
      "Changed Pad": 6,
      "Changed Menstrual Cup": 12,
      "Changed Period Underwear": 8,
      "Took Painkiller": 6,
    };

    if(entry.action in actionIntervals) {
      const lastChangeDate=new Date(entry.timestamp);
      const nextChangeDate=new Date(lastChangeDate);
      nextChangeDate.setHours(lastChangeDate.getHours()+actionIntervals[entry.action]);
      if(!nextActions[entry.action]||nextChangeDate>new Date(nextActions[entry.action])) {
        nextActions[entry.action]=nextChangeDate.toLocaleTimeString([],{hour: '2-digit',minute: '2-digit'});
      }
    }
  };

  const logAction=(action: string,reminderFrequency?: number) => {
    const formattedAction = i18n.t(`HOMEPAGE.ACTION_VERBS.${action.toUpperCase().replace(/\s+/g, '_')}`) || action.toLowerCase();

    const insights=generateInsights();
    const existingInsight=insights.find(insight => insight.action===action);
    const nextReminder=existingInsight?.nextTime;

    if(nextReminder) {
      Alert.alert(
        i18n.t('ALERTS.CONFIRM.SCHEDULED_ACTION'),
        i18n.t('ALERTS.CONFIRM.SCHEDULED_MESSAGE', {
          action: formattedAction,
          nextReminder
        }),
        [
          {text: i18n.t('ALERTS.CONFIRM.WAIT'), style: "cancel"},
          {
            text: i18n.t('ALERTS.CONFIRM.LOG_NOW'),
            onPress: async () => {
              await UserService.logUserAction(action);
              loadHistory();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        i18n.t('ALERTS.CONFIRM.ACTION'),
        i18n.t('ALERTS.CONFIRM.MESSAGE', {
          action: action
        }),
        [
          {text: i18n.t('ALERTS.CONFIRM.CANCEL'), style: "cancel"},
          {
            text: i18n.t('ALERTS.CONFIRM.LOG'),
            onPress: async () => {
              await UserService.logUserAction(action);
              loadHistory();

              if(reminderFrequency) {
                promptAndScheduleReminder({
                  action,
                  formattedAction,
                  reminderFrequency
                });
              }
            },
          },
        ]
      );
    }
  };


  const loadHistory=async () => {
    try {
      const formattedHistory = await UserService.fetchUserLogs();
      setHistory(formattedHistory);
    } catch(error) {
      console.error("❌ Error fetching history:",error);
    }
  };

  const generateInsights=() => {
    const actionCounts: {[key: string]: number}={};
    const nextActions: {[key: string]: string}={};

    const today=new Date();
    today.setHours(0,0,0,0); // Set to start of day
    const tomorrow=new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);

    history.forEach((entry) => {
      const entryDate=new Date(entry.timestamp);

      // Only process entries from today
      if(entryDate>=today&&entryDate<tomorrow) {
        actionCounts[entry.action]=(actionCounts[entry.action]||0)+1;
      }

      // Use the function to calculate next expected occurrence
      calculateNextOccurrence(entry,nextActions);
    });

    return Object.entries(actionCounts).map(([action,count]) => ({
      action,
      count,
      nextTime: nextActions[action]||null, // Ensuring next time is visible
    }));
  };



  const handleDecrementHistory=async (action: string) => {
    // Find all matching entries for the action
    const matchingEntries=history.filter((entry) => entry.action===action);

    if(matchingEntries.length===0) {
      console.error("❌ Error: No matching entries found for action:",action);
      Alert.alert("Error","Could not find the activity to decrement.");
      return;
    }

    // Find the most recent entry based on timestamp
    const entryToDelete=matchingEntries.reduce((latest,entry) =>
      new Date(entry.timestamp)>new Date(latest.timestamp)? entry:latest
    );

    Alert.alert(
      i18n.t("HOMEPAGE.NOTIFICATIONS.DECREMENT_TITLE"),
      i18n.t("HOMEPAGE.NOTIFICATIONS.DECREMENT_MESSAGE", { action: action }),
      [
        { text: i18n.t("HOMEPAGE.NOTIFICATIONS.CANCEL_BUTTON"), style: "cancel" },
        {
          text: i18n.t("HOMEPAGE.NOTIFICATIONS.DECREMENT_CONFIRM"),
          style: "destructive",
          onPress: async () => {
            const success = await UserService.deleteHistoryEntry(entryToDelete.id);

            if (success) {
              setHistory((prevHistory) =>
                prevHistory.filter((entry) => entry.id !== entryToDelete.id)
              );
              Alert.alert(
                i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_TITLE"),
                i18n.t("HOMEPAGE.NOTIFICATIONS.DECREMENT_SUCCESS")
              );
            } else {
              Alert.alert(
                i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_TITLE"),
                i18n.t("HOMEPAGE.NOTIFICATIONS.DECREMENT_ERROR")
              );
            }
          },
        },
      ]
    );
  };



  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Today's Activity Section */}
        <Text style={styles.title}>

          {i18n.t("HOMEPAGE.ACTIVITY.TITLE")}
          
        </Text>
        <View>
          {generateInsights().length===0? (
            <Text style={[styles.textSmall]}>{i18n.t("HOMEPAGE.ACTIVITY.NO_ACTIVITY")}</Text>
          ):(
            generateInsights().map((entry,index) => (
              <View key={`${entry.action}-${index}`} style={styles.card}>
                <View style={styles.buttonContainer}>

                  <Text style={styles.cardHeader}>
                    {entry.action}{" "}
                    <Text style={{fontWeight: "bold"}}>
                      — {entry.count} {entry.count===1}
                    </Text>
                  </Text>

                  <TouchableOpacity onPress={() => handleDecrementHistory(entry.action)}>
                    <Text style={styles.cardHeader}>
                      <Icon name="close" size={26} />
                    </Text>
                  </TouchableOpacity>
                </View>

                {entry.nextTime&&
                  <View style={styles.rowContainer}>
                    <Text style={[styles.textSmall]}>
                      {i18n.t("HOMEPAGE.ACTIVITY.UPCOMING")} {entry.nextTime}
                    </Text>
                  </View>
                }
              </View>
            ))
          )}
        </View>

        {/* Menstrual Products Section */}
        <Text style={styles.title}>
          {i18n.t("HOMEPAGE.MENSTRUAL.TITLE")}
          
        </Text>

        {/* Menstrual Products Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logAction("Changed Tampon",4)}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.MENSTRUAL.CHANGED_TAMPON")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logAction("Changed Pad",6)}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.MENSTRUAL.CHANGED_PAD")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logAction("Changed Menstrual Cup",12)}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.MENSTRUAL.CHANGED_CUP")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logAction("Changed Period Underwear",8)}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.MENSTRUAL.CHANGED_UNDERWEAR")}</Text>
          </TouchableOpacity>
        </View>



        {/* Caffeine Intake Section */}
        <Text style={styles.title}>

          {i18n.t("HOMEPAGE.WELLNESS.TITLE")}
         
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logAction(i18n.t("HOMEPAGE.ACTIONS.DRANK_WATER"))}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.WELLNESS.DRANK_WATER")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
            onPress={() => logAction(i18n.t("HOMEPAGE.ACTIONS.TOOK_PAINKILLER"),6)}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.WELLNESS.TOOK_PAINKILLER")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.button}
            onPress={() => logAction(i18n.t("HOMEPAGE.ACTIONS.DRANK_COFFEE"))}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.WELLNESS.DRANK_COFFEE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            onPress={() => logAction(i18n.t("HOMEPAGE.ACTIONS.DRANK_TEA"))}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.WELLNESS.DRANK_TEA")}</Text>
          </TouchableOpacity>
        </View>

        {/* Bathroom Breaks Section */}
        <Text style={styles.title}>
          {i18n.t("HOMEPAGE.BATHROOM.TITLE")}
          
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}
            onPress={() => logAction(i18n.t("HOMEPAGE.ACTIONS.PEED"))}
          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.BATHROOM.PEED")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            onPress={() => logAction(i18n.t("HOMEPAGE.ACTIONS.POOPED"))}

          >
            <Text style={styles.buttonText}>{i18n.t("HOMEPAGE.BUTTONS.BATHROOM.POOPED")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>

  );
};

export default HomeScreen;