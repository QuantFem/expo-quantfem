import db,{deleteHistoryEntry,logUserAction} from "@/storage/db";
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
    const actionVerbMap: {[key: string]: string}={
      Peed: "pee",
      Pooped: "poo",
      "Drank Water": "drink water",
      "Drank Coffee": "drink coffee",
      "Drank Tea": "drink tea",
      "Took Painkiller": "take a painkiller",
      "Changed Tampon": "change your tampon",
      "Changed Pad": "change your pad",
      "Changed Menstrual Cup": "change your menstrual cup",
      "Changed Period Underwear": "change your period underwear",
    };

    const formattedAction=actionVerbMap[action]||action.toLowerCase();

    const insights=generateInsights();
    const existingInsight=insights.find(insight => insight.action===action);
    const nextReminder=existingInsight?.nextTime;

    if(nextReminder) {
      Alert.alert(
        i18n.t("HOMEPAGE.NOTIFICATIONS.SCHEDULED_TITLE"),
        i18n.t("HOMEPAGE.NOTIFICATIONS.SCHEDULED_MESSAGE",{
          action: action,
          nextReminder,
        }),
        [
          {text: i18n.t("HOMEPAGE.NOTIFICATIONS.WAIT_BUTTON"),style: "cancel"},
          {
            text: i18n.t("HOMEPAGE.NOTIFICATIONS.LOG_NOW_BUTTON"),
            onPress: async () => {
              logUserAction(action);
              loadHistory();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_TITLE"),
        i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_MESSAGE",{
          action: action,
        }),
        [
          {text: i18n.t("HOMEPAGE.NOTIFICATIONS.CANCEL_BUTTON"),style: "cancel"},
          {
            text: i18n.t("HOMEPAGE.NOTIFICATIONS.CONFIRM_LOG_BUTTON"),
            onPress: async () => {
              logUserAction(action);
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
      const results=await db.getAllAsync(
        "SELECT * FROM user_logs ORDER BY timestamp DESC;",
      );

      if(!results||!Array.isArray(results)) {
        console.error("❌ Error: Unexpected response from SQLite query");
        return;
      }

      const formattedHistory: HistoryEntry[]=results.map((row: any) => ({
        id: row.id.toString(),
        action: row.action,
        timestamp: new Date(row.timestamp).toISOString(),
        nextChange: row.next_change
          ? new Date(row.next_change).toISOString()
          :undefined,
      }));

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
      "Decrement Activity",
      `Are you sure you want to reduce the count for "${action}"?`,
      [
        {text: "Cancel",style: "cancel"},
        {
          text: "Remove Last Entry",
          style: "destructive",
          onPress: async () => {
            const success=await deleteHistoryEntry(entryToDelete.id);

            if(success) {
              setHistory((prevHistory) =>
                prevHistory.filter((entry) => entry.id!==entryToDelete.id)
              );
              Alert.alert("Success","Activity count reduced.");
            } else {
              Alert.alert("Error","Failed to reduce activity count.");
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