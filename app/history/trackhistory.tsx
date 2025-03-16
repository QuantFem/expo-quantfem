import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,ScrollView,FlatList,ActivityIndicator} from 'react-native';
import {CalendarDataService,CalendarItem} from '@/storage/CalendarService';
import useThemedStyles from "@/components/hooks/useThemedStyles"; // ✅ Import the custom hook
import LocalFormatter from '@/components/mycomponents/setup/formatDate';
import i18n from '@/components/mycomponents/setup/localization/localization';


const AllTrackerData: React.FC=() => {
  const [calendarItems,setCalendarItems]=useState<CalendarItem[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const styles=useThemedStyles(); // ✅ Automatically gets updated styles
  const [loadedCount,setLoadedCount]=useState(10); // ✅ Start with 10 items

  const loadCalendarData=async () => {
    try {
      setIsLoading(true);

      const allItems=await CalendarDataService.getAllCalendarItems();

      if(!allItems||!Array.isArray(allItems)) {
        console.error("❌ Error: Data returned is undefined or not an array.");
        return;
      }

      // ✅ Append new items instead of resetting everything
      setCalendarItems(allItems.slice(0,loadedCount));
    } catch(error) {
      console.error("❌ Error loading calendar data:",error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Call this when user reaches the bottom
  const loadMoreItems=() => {
    if(!isLoading) {
      setLoadedCount((prev) => prev+10);
    }
  };

  // ✅ Load data initially and when `loadedCount` changes
  useEffect(() => {
    loadCalendarData();
  },[loadedCount]);


  const groupedEvents=calendarItems.reduce((acc,item) => {
    const dateKey=LocalFormatter({date: new Date(item.date),includeTime: false});

    if(!acc[dateKey]) {
      acc[dateKey]=[];
    }
    acc[dateKey].push(item);
    return acc;
  },{} as {[key: string]: CalendarItem[]});

  const groupedData=Object.entries(groupedEvents);

  return (
    <FlatList
      data={groupedData}
      keyExtractor={([date]) => date}
      renderItem={({item: [date,events]}) => (
        <View>
          {/* ✅ Date Header (Same as ScrollView) */}
          <Text style={styles.title}>{date}</Text>

          {/* ✅ Events Under Each Date */}
          {events.map((event) => (
            <TouchableOpacity key={event.id} style={styles.card}>
              {event.details&&
                Object.entries(event.details).map(([key,value]) => {
                  const ignoredFields=['id','created_at','updated_at','lastused','date'];
                  if(!value||ignoredFields.includes(key.toLowerCase())) {
                    return null;
                  }

                  
                  const formattedKey=i18n.t(`LABELS.${key.toUpperCase().replace(/_/g,'')}`)||
                    key.replace(/([A-Z])/g,' $1').replace(/_/g,' ').replace(/\b\w/g,(char) => char.toUpperCase()).trim();

                  let formattedValue;

                  
                  if(key.toLowerCase()==='frequency'&&typeof value==='string') {
                    try {
                      const parsedFrequency=JSON.parse(value);
                      formattedValue=`${parsedFrequency.value} / ${parsedFrequency.value===1? parsedFrequency.unit.slice(0,-1):parsedFrequency.unit}`;
                    } catch(error) {
                      formattedValue=value; 
                    }
                  }

                  else if(key.toLowerCase()==='nightwakeups'&&typeof value==='string') {
                    try {
                      const parsedNighties=JSON.parse(value);
                      formattedValue = (
                        <View>
                          {parsedNighties.map((nightie: {time: string; reason: string}, index: number) => (
                            <Text key={index}>
                              {`${nightie.time} - ${nightie.reason}`}
                            </Text>
                          ))}
                        </View>
                      );
                    } catch(error) {
                      formattedValue=<Text>{value}</Text>; 
                    }
                  }



                  else if(typeof value==='string'&&!isNaN(Date.parse(value))) {
                    formattedValue=LocalFormatter({date: new Date(value),includeTime: true,timeFormat: '12h'});
                  }

                  else {
                    formattedValue=String(value);
                  }

                  return (
                    <Text key={key} style={styles.text}>
                      <Text style={styles.cardHeader}>{formattedKey}: </Text>
                      {formattedValue}
                    </Text>
                  );
                })}

              {/* ✅ Footer with Event Type and Timestamp */}
              <View style={styles.rowContainer}>
                <Text style={styles.textSmall}>{event.type}</Text>
                <Text style={styles.textSmall}>
                  {LocalFormatter({date: new Date(event.date),timeOnly: true,timeFormat: '12h'})}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (
        isLoading? (
          <View style={{padding: 10,alignItems: 'center'}}>
            <Text style={styles.textSmall}>{i18n.t('HOMEPAGE.NOTIFICATIONS.WAIT_BUTTON')}</Text>
          </View>
        ):null
      )}
      ListEmptyComponent={
        <View style={{padding: 20,alignItems: 'center'}}>
          <Text style={styles.textSmall}>{i18n.t("COMMON.NA")}</Text>
        </View>
      }

    />
  );



};

export default AllTrackerData;