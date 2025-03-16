import React,{useState,useEffect,useCallback} from 'react';
import {View,Text,TouchableOpacity,ScrollView} from 'react-native';
import {CalendarDataService,CalendarItem} from '@/storage/CalendarService';
import useThemedStyles from '@/components/hooks/useThemedStyles';
import i18n from '@/components/mycomponents/setup/localization/localization';
import {useFocusEffect} from 'expo-router';


interface CalendarProps {
  // You can add props here later for database events
  onEventPress?: (event: CalendarItem) => void;
}

const Calendar: React.FC<CalendarProps>=({onEventPress}) => {

  const [currentDate,setCurrentDate]=useState(new Date());
  const [calendarItems,setCalendarItems]=useState<CalendarItem[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const styles=useThemedStyles(); // ✅ Automatically gets updated styles

  // Initialize `viewMode` after `viewModes` is set
  const [viewMode,setViewMode]=useState<ViewMode>(() => {
    return i18n.t("CALENDAR.VIEW_MODES.yearly") as ViewMode;
  });

  // Keep your state declarations
  const [weekDays,setWeekDays]=useState<string[]>([]);
  const [monthNames,setMonthNames]=useState<string[]>([]);
  const [viewModes,setViewModes]=useState<Record<string,string>>({});

// Create a reusable function to update translations
const updateTranslations = useCallback(() => {
  setWeekDays(i18n.t("CALENDAR.WEEK_DAYS", { returnObjects: true }) as string[]);
  setMonthNames(i18n.t("CALENDAR.MONTH_NAMES", { returnObjects: true }) as string[]);
  
  const newViewModes = {
    daily: i18n.t("CALENDAR.VIEW_MODES.daily"),
    weekly: i18n.t("CALENDAR.VIEW_MODES.weekly"),
    monthly: i18n.t("CALENDAR.VIEW_MODES.monthly"),
    yearly: i18n.t("CALENDAR.VIEW_MODES.yearly")
  };
  
  setViewModes(newViewModes);
}, []);

// Single useEffect for initial translation setup and yearly default
useEffect(() => {
  updateTranslations();
  setViewMode(i18n.t("CALENDAR.VIEW_MODES.yearly") as ViewMode);
}, [i18n.locale, updateTranslations]);

// Use useFocusEffect for screen focus updates
useFocusEffect(
  useCallback(() => {
    updateTranslations();
  }, [updateTranslations])
);



  type ViewMode=keyof typeof viewModes;

  const renderYearlyView=() => (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.buttonContainer}>
        {monthNames.map((month,index) => {
          const monthDate=new Date(currentDate.getFullYear(),index,1);
          const monthEndDate=new Date(currentDate.getFullYear(),index+1,0);
          const monthEvents=calendarItems.filter(item =>
            item.date>=monthDate&&item.date<=monthEndDate
          );

          return (
            <TouchableOpacity
              key={month}
              style={styles.threeCell}
              onPress={() => {
                setCurrentDate(new Date(currentDate.getFullYear(),index,1));
                setViewMode(viewModes.monthly as ViewMode);


              }}
            >
              <Text style={styles.cardHeader}>{month}</Text>
              {monthEvents.length>0&&(
                <View style={styles.buttonContainer}>
                  <Text key={monthEvents[0]?.id} style={styles.text}>
                    {getEventEmoji(monthEvents[0]?.type)}
                  </Text>
                  {monthEvents.length>1&&(
                    <Text style={styles.textSmall}>+{monthEvents.length-1}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );


  // Ensure correct layout by using a stricter row structure
  const renderMonthlyView=() => {
    const daysInMonth=new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0).getDate();
    const firstDayOfMonth=new Date(currentDate.getFullYear(),currentDate.getMonth(),1).getDay();
    const cells=[];

    // Empty cells for days before the first of the month
    for(let i=0; i<firstDayOfMonth; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.cell} />);
    }

    // Cells for each day of the month
    for(let day=1; day<=daysInMonth; day++) {
      const date=new Date(currentDate.getFullYear(),currentDate.getMonth(),day);
      const dayEvents=getEventsForDate(date);
      const isToday=date.toDateString()===new Date().toDateString();

      cells.push(
        <TouchableOpacity
          key={day}
          style={[styles.cell,isToday&&styles.button]}
          onPress={() => {
            setCurrentDate(date);
            if(dayEvents.length>0) {
              setViewMode(viewModes.daily as ViewMode);
            }
          }}
        >
          <Text style={[styles.text,isToday&&styles.cardHeader]}>{day}</Text>
          {dayEvents.length>0&&(
            <View style={styles.eventIndicatorContainer}>
              <Text style={styles.textSmall}>
                {getEventEmoji(dayEvents[0]?.type)}
              </Text>
              {dayEvents.length>1&&(
                <Text style={styles.textSmall}>+{dayEvents.length-1}</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <>
        <View style={styles.rowContainer}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.buttonText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>{cells}</View>
      </>
    );
  };



  // Weekly view with plain emojis
  const renderWeeklyView=() => {
    const weekStart=new Date(currentDate);
    weekStart.setDate(currentDate.getDate()-currentDate.getDay());
    const days=[];

    for(let i=0; i<7; i++) {
      const day=new Date(weekStart);
      day.setDate(weekStart.getDate()+i);
      days.push(day);
    }

    return (
      <View style={styles.buttonContainer}>
        {days.map((day,index) => {
          const dayEvents=getEventsForDate(day);
          return (
            <View key={index}>
              {/* Day Name */}
              <Text style={styles.textSmall}>{weekDays[day.getDay()]}</Text>
              {/* Date */}
              <Text style={styles.text}>{day.getDate()}</Text>
              {/* Emojis Stacking Vertically */}
              {dayEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => onEventPress?.(event)}
                >
                  <Text style={styles.textSmall}>{getEventEmoji(event.type)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </View>
    );
  };


  const renderDailyView=() => {
    const dayEvents=getEventsForDate(currentDate);

    return (
      <View style={styles.container}>
        <ScrollView>
          {dayEvents.length===0? (
            <Text style={styles.textSmall}>
              {i18n.t("TRACKER.NO_ENTRIES")||"No events"} {/* ✅ Translatable fallback */}
            </Text>
          ):(
            dayEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.card}
                onPress={() => onEventPress?.(event)}
              >
                {/* ✅ Render Event Details, Skipping Unwanted Fields */}
                {event.details&&
                  Object.entries(event.details).map(([key,value]) => {
                    // ✅ Skip empty values and unwanted metadata fields
                    const ignoredFields=["id","created_at","updated_at","lastused"];
                    if(!value||ignoredFields.includes(key.toLowerCase())) {
                      return null;
                    }

                    // ✅ Format key for display: Convert camelCase or snake_case to Title Case
                   const formattedKey = key
                   ? i18n.t(`LABELS.${key.toUpperCase().replace(/_/g, '')}`) || 
                     key
                       .replace(/([A-Z])/g, ' $1')
                       .replace(/_/g, ' ')
                       .replace(/\b\w/g, (char) => char.toUpperCase())
                       .trim()
                   : "";
                 

                    let formattedValue;

                    // ✅ Handle frequency stored as a JSON string
                    if(key.toLowerCase()==="frequency"&&typeof value==="string") {
                      try {
                        const parsedFrequency=JSON.parse(value);
                        formattedValue=`Every ${parsedFrequency.value} ${parsedFrequency.value===1
                          ? parsedFrequency.unit.slice(0,-1)
                          :parsedFrequency.unit
                          }`;
                      } catch(error) {
                        formattedValue=value; // Fallback if parsing fails
                      }
                    }

                     // Handle night wakeups which is an array that has time and reason, similar to frequency
                     else if(key.toLowerCase()==='nightwakeups'&&typeof value==='string') {
                      try {
                        const parsedNighties=JSON.parse(value);
                        formattedValue=parsedNighties
                          .map((nightie: {time: string; reason: string}) => `${nightie.time} - ${nightie.reason}`)
                          .join('\n'); // Add newline for better readability
                      } catch(error) {
                        formattedValue=value; // Fallback if parsing fails
                      }
                    }


                    // ✅ Convert timestamp strings to readable date & time format
                    else if(typeof value==="string"&&!isNaN(Date.parse(value))) {
                      const dateObj=new Date(value);
                      formattedValue=`${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}`;
                    }

                    // ✅ Default: Convert to string
                    else {
                      formattedValue=String(value);
                    }

                    // ✅ Render the formatted key-value pair
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
                    {new Date(event.date).toLocaleTimeString([],{
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

      </View>
    );
  };


 

  const loadCalendarData=useCallback(async () => {
    try {
      setIsLoading(true);
      const items=await CalendarDataService.getAllCalendarItems();

      // Ensure all dates are converted to Date objects
      const parsedItems=items.map(item => ({
        ...item,
        date: new Date(item.date),
      }));

      setCalendarItems(parsedItems);
    } catch(error) {
    } finally {
      setIsLoading(false);
    }
  },[]);

// Calendar data loading effect
useEffect(() => {
  loadCalendarData();
}, [currentDate, viewMode, loadCalendarData]);




  // First, let's add an emoji mapping helper function at the top of your Calendar component
  const getEventEmoji=(type: CalendarItem["type"]): string => {
    const eventEmojis=i18n.t("CALENDAR.EVENT_EMOJIS",{returnObjects: true}) as Record<string,string>;
    return eventEmojis[type.toUpperCase() as keyof typeof eventEmojis]||eventEmojis.DEFAULT;
  };




  // Helper function to get events for a date
  const getEventsForDate=(date: Date) => {
    return calendarItems.filter(item => {
      const itemDate=new Date(item.date); // Ensure item.date is a Date object

      return (
        itemDate.getDate()===date.getDate()&&
        itemDate.getMonth()===date.getMonth()&&
        itemDate.getFullYear()===date.getFullYear()
      );
    });
  };

  const renderViewModeSelector=() => (
    <View style={styles.buttonContainer}>
      {Object.keys(viewModes).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.roundButton,
            viewMode===viewModes[mode]&&styles.roundButtonActive
          ]}
          onPress={() => setViewMode(viewModes[mode] as ViewMode)}
        >
          <Text style={[
            styles.buttonText,
            viewMode===viewModes[mode]&&styles.buttonText
          ]}>
            {viewModes[mode]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );


  const renderNavigationHeader=() => {
    let title='';
    let prevAction=() => {};
    let nextAction=() => {};

    switch(viewMode) {
    case viewModes.daily:
      title=currentDate.toLocaleDateString(i18n.locale);
      prevAction=() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate()-1)));
      nextAction=() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate()+1)));
      break;

    case viewModes.weekly:
      const weekStart=new Date(currentDate);
      weekStart.setDate(currentDate.getDate()-currentDate.getDay());
      const weekEnd=new Date(weekStart);
      weekEnd.setDate(weekStart.getDate()+6);
      title=`${weekStart.toLocaleDateString(i18n.locale)} - ${weekEnd.toLocaleDateString(i18n.locale)}`;
      prevAction=() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate()-7)));
      nextAction=() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate()+7)));
      break;

    case viewModes.monthly:
      title=`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      prevAction=() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)));
      nextAction=() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)));
      break;

    case viewModes.yearly:
      title=currentDate.getFullYear().toString();
      prevAction=() => setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear()-1)));
      nextAction=() => setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear()+1)));
      break;
    }

    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={prevAction}>
          <Text style={styles.title}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={nextAction}>
          <Text style={styles.title}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent=() => {
    switch(viewMode) {
    case viewModes.daily:
      return renderDailyView();
    case viewModes.weekly:
      return renderWeeklyView();
    case viewModes.monthly:
      return renderMonthlyView();
    case viewModes.yearly:
      return renderYearlyView();
    default:
      return renderYearlyView(); // or whatever default view you prefer
    }
  };



  return (
    <View style={styles.container}>
      {renderViewModeSelector()}
      {renderNavigationHeader()}
      {renderContent()}
    </View>
  );
};

export default Calendar;