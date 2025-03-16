import React,{useState,useEffect} from "react";
import {View,Text,FlatList} from "react-native";
import db from "@/storage/db"; // Import the database instance
import useThemedStyles from "@/components/hooks/useThemedStyles";
import LocalFormatter from "@/components/mycomponents/setup/formatDate";
import i18n from "@/components/mycomponents/setup/localization/localization";

interface HistoryEntry {
  id: string;
  action: string;
  timestamp: string;
  nextChange?: string;
}

const HistoryLog: React.FC=() => {
  const [history,setHistory]=useState<{[key: string]: HistoryEntry[]}>({});

  const [historyList,setHistoryList]=useState<[string,HistoryEntry[]][]>([]);
  const [loadedCount,setLoadedCount]=useState(10);
  const [fullHistory,setFullHistory]=useState<[string,HistoryEntry[]][]>([]);
  const styles=useThemedStyles();

  // ✅ Load history on first render
  useEffect(() => {
    loadHistory();
  },[]);

  // ✅ Fetch and store full history without displaying all at once
  const loadHistory=async () => {
    try {
      const results=await db.getAllAsync("SELECT * FROM user_logs ORDER BY timestamp DESC;");

      if(!results||!Array.isArray(results)) {
        console.error("❌ Error: Unexpected response from SQLite query");
        return;
      }

      const formattedHistory: HistoryEntry[]=results.map((row: any) => ({
        id: row.id.toString(),
        action: row.action,
        timestamp: new Date(row.timestamp).toISOString(),
        nextChange: row.next_change? new Date(row.next_change).toISOString():undefined,
      }));

      const groupedHistory: {[key: string]: HistoryEntry[]}={};

      formattedHistory.forEach((entry) => {
        const dateKey=entry.timestamp.split("T")[0]; // Extract YYYY-MM-DD
        if(!groupedHistory[dateKey]) {
          groupedHistory[dateKey]=[];
        }
        groupedHistory[dateKey].push(entry);
      });

      const sortedHistory=Object.entries(groupedHistory).sort(([dateA],[dateB]) =>
        new Date(dateB).getTime()-new Date(dateA).getTime()
      );

      setFullHistory(sortedHistory); // ✅ Store all data but don't display all
      setHistoryList(sortedHistory.slice(0,loadedCount)); // ✅ Show only first 10
    } catch(error) {
      console.error("❌ Error fetching history:",error);
    }
  };

  // ✅ Load more items on scroll
  const loadMoreItems=() => {
    const newCount=loadedCount+10;
    setLoadedCount(newCount);
    setHistoryList(fullHistory.slice(0,newCount)); // ✅ Append new data without resetting
  };



  return (
    <FlatList
      style={styles.scrollContainer}
      data={historyList}
      keyExtractor={(item) => item[0]}
      renderItem={({item}) => {
        const [date,events]=item;
        const sortedEvents=events.sort((a,b) => new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime());
        const titleDate=new Date(sortedEvents[0].timestamp);

        return (
          <View>
            <Text style={styles.title}>{LocalFormatter({date: titleDate})}</Text>
            {sortedEvents.map((entry) => {
              const formattedTime=LocalFormatter({
                date: new Date(entry.timestamp),
                timeOnly: true,
                timeFormat: "12h",
              });

              const formattedNextChange=entry.nextChange
                ? LocalFormatter({
                  date: new Date(entry.nextChange),
                  includeTime: true,
                  timeFormat: "12h",
                })
                :null;

              return (
                <View key={entry.id} style={styles.card}>
                  <Text style={styles.text}>{entry.action}</Text>
                  <Text style={styles.textSmall}>{formattedTime}</Text>
                  {formattedNextChange&&(
                    <Text style={styles.textSmall}>
                      {i18n.t("HOMEPAGE.ACTIVITY.UPCOMING")}: {formattedNextChange}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      }}
      onEndReached={loadMoreItems} // ✅ Loads more when scrolling
      onEndReachedThreshold={0.5}

      // ✅ Handles empty list case
      ListEmptyComponent={
        <Text style={styles.textSmall}>{i18n.t("COMMON.NA")}</Text>
      }
    />


  );
};


export default HistoryLog;
