import {View,Text,TouchableOpacity} from 'react-native';
import {useRouter,useFocusEffect} from 'expo-router'; // Import useFocusEffect
import {useCallback,useState} from 'react';
import {CalendarDataService} from '@/storage/CalendarService';
import {ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useThemedStyles from "@/components/hooks/useThemedStyles"; // ✅ Import the custom hook
import i18n from "@/components/mycomponents/setup/localization/localization";
import LocalFormatter from '@/components/mycomponents/setup/formatDate';

export default function TrackerHomeScreen() {
  const router=useRouter();
  const [lastEntries,setLastEntries]=useState<{[key: string]: string}>({});
  const styles=useThemedStyles(); // ✅ Automatically gets updated styles

  // Fetch latest entries when the screen comes into focus
  const fetchLastEntries=useCallback(async () => {
    const items=await CalendarDataService.getAllCalendarItems();

    const latestEntries: {[key: string]: Date}={};

    items.forEach((item) => {
      if(!latestEntries[item.type]||new Date(item.date)>latestEntries[item.type]) {
        latestEntries[item.type]=new Date(item.date);
      }
    });

    

    const formattedEntries: {[key: string]: string}={};
    Object.keys(latestEntries).forEach((key) => {
      formattedEntries[key]=latestEntries[key]
        ? LocalFormatter({
          date: new Date(latestEntries[key]),
          includeTime: false,
          timeFormat: '12h'
        })
        :i18n.t("TRACKER.NO_ENTRIES");
    });

    console.log("Formatted entries:",formattedEntries);

    setLastEntries(formattedEntries);
  },[]);



  // Refresh when navigating back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchLastEntries();
    },[fetchLastEntries])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(i18n.t("TRACKER.BUTTONS",{returnObjects: true}) as Record<string,{LABEL: string; ICON: string; ROUTE: `/${string}`}>).reduce(
          (rows,[key,value],index) => {
            if(index%2===0) rows.push([]); // Start a new row every 2 items
            rows[rows.length-1].push(
              <TouchableOpacity key={key} style={styles.button} onPress={() => router.push(value.ROUTE as any)}>
                <Icon name={value.ICON} style={styles.icon} />
                <Text style={styles.buttonText}>{value.LABEL}</Text>
                <Text style={[styles.buttonText,{fontWeight: "normal",fontSize: 14}]}>
                  {i18n.t("TRACKER.LAST_ENTRY")} {lastEntries[key.toLowerCase()]||i18n.t("TRACKER.NO_ENTRIES")}
                </Text>
              </TouchableOpacity>
            );
            return rows;
          },
          [] as JSX.Element[][]
        ).map((row,rowIndex) => (
          <View key={rowIndex} style={styles.section}>
            <View style={styles.buttonContainer}>{row}</View>
          </View>
        ))}
      </ScrollView>

    </View>

  );
};

