import React,{useState,useEffect} from 'react';
import {View,Text,ScrollView,TouchableOpacity} from 'react-native';
import {CalendarDataService,CalendarItem} from '@/storage/CalendarService';
import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import useThemedStyles from '@/components/hooks/useThemedStyles';
import i18n from '@/components/mycomponents/setup/localization/localization';
import LocalFormatter from '@/components/mycomponents/setup/formatDate';
import {useNavigation} from '@react-navigation/native';
import BackButton from '@/components/mycomponents/setup/BackButton';


const DoctorReports: React.FC=() => {
  const [calendarItems,setCalendarItems]=useState<CalendarItem[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const styles=useThemedStyles();
  const navigation=useNavigation();


  useEffect(() => {
    loadCalendarData();
  },[]);

  const loadCalendarData=async () => {
    try {
      setIsLoading(true);
      const items=await CalendarDataService.getAllCalendarItems();
      setCalendarItems(items);
    } catch(error) {
      console.error('Error loading calendar data:',error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDoctorReport=() => {
    const report: {[key: string]: string[]}={};
    const activitySummary={count: 0,totalDuration: 0};
    const symptomSummary: {[key: string]: number}={};
    const moodSummary: {[key: string]: number}={};
    const nutritionSummary={calories: 0,protein: 0,carbs: 0,fat: 0};
    const sleepSummary={
      count: 0,
      totalHours: 0,
      totalQuality: 0  // Add this to track total quality score
    };

    let cycleStartDate: Date|null=null as Date|null;
    let cycleEndDate: Date|null=null as Date|null;

    calendarItems.forEach(event => {
      if(event.type==='activity') {
        activitySummary.count++;
        activitySummary.totalDuration+=event.details?.duration??0;
      }
      // Update the sleep section to match activity's simplicity


      else if(event.type==='sleep') {
        if(event.details?.bedTime&&event.details?.wakeTime) {
          sleepSummary.count++;

          // Calculate sleep hours
          const baseDate=new Date().toISOString().split('T')[0];
          const bedTime=new Date(`${baseDate}T${event.details.bedTime}`);
          let wakeTime=new Date(`${baseDate}T${event.details.wakeTime}`);

          if(wakeTime<bedTime) {
            wakeTime.setDate(wakeTime.getDate()+1);
          }

          const diffMs=wakeTime.getTime()-bedTime.getTime();
          const hours=diffMs/(1000*60*60);
          sleepSummary.totalHours+=hours;

          // Add sleep quality calculation
          if(event.details.sleepQuality) {
            sleepSummary.totalQuality+=event.details.sleepQuality;
          }
        }
      }

      else if(event.type==='symptom') {
        symptomSummary[event.details?.name]=(symptomSummary[event.details?.name]||0)+1;
      } else if(event.type==='cycle') {
        const eventDate=new Date(event.date);
        if(event.id.startsWith('cycle-')&&!event.id.startsWith('cycle-end-')) {
          if(!cycleStartDate||eventDate<cycleStartDate) {
            cycleStartDate=eventDate;
          }
        }
        if(event.id.startsWith('cycle-end-')) {
          if(!cycleEndDate||eventDate>cycleEndDate) {
            cycleEndDate=eventDate;
          }
        }
      } else if(event.type==='mood') {
        moodSummary[event.details?.mood]=(moodSummary[event.details?.mood]||0)+1;
      } else if(event.type==='nutrition') {
        nutritionSummary.calories+=event.details?.calories??0;
        nutritionSummary.protein+=event.details?.protein??0;
        nutritionSummary.carbs+=event.details?.carbs??0;
        nutritionSummary.fat+=event.details?.fat??0;
      } else {
        if(!report[event.type]) {
          report[event.type]=[];
        }
        let entry=LocalFormatter({date: new Date(event.date)});

        if(event.type==='health') {
          entry+=i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.HEALTH_ENTRY",{
            weight: event.details?.weight??i18n.t('COMMON.NA'),
            systolic: event.details?.systolic??i18n.t('COMMON.NA'),
            diastolic: event.details?.diastolic??i18n.t('COMMON.NA'),
            bloodSugar: event.details?.bloodSugar??i18n.t('COMMON.NA'),
            notes: event.details?.note? ` | Notes: ${event.details.note}`:''
          });
        }
        if(event.type==='medication') {
          const frequencyObj=event.details?.frequency? JSON.parse(event.details.frequency):null;
          let formattedFrequency=i18n.t('COMMON.NA');

          if(frequencyObj&&typeof frequencyObj==='object'&&frequencyObj.value&&frequencyObj.unit) {
            // ✅ Always remove the "s" at the end of the unit (e.g., "weeks" → "week", "days" → "day")
            const unit=frequencyObj.unit.replace(/s$/,'');
            formattedFrequency=`${frequencyObj.value} / ${unit}`;
          }

          entry+=i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.MEDICATION_ENTRY",{
            name: event.details?.name??i18n.t('COMMON.NA'),
            dosage: event.details?.dosage??i18n.t('COMMON.NA'),
            frequency: formattedFrequency
          });
        }


        report[event.type].push(entry);


      }
    });

    report['cycle']=[
      i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.CYCLE_START",{
        date: cycleStartDate? LocalFormatter({date: cycleStartDate}):i18n.t('COMMON.NA')
      }),
      i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.CYCLE_END",{
        date: cycleEndDate? LocalFormatter({date: cycleEndDate}):i18n.t('COMMON.NA')
      })
    ];




    report['sleep']=[
      i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.SLEEP_SUMMARY",{
        count: sleepSummary.count,
        total: sleepSummary.totalHours.toFixed(1),
        average: sleepSummary.count>0? (sleepSummary.totalHours/sleepSummary.count).toFixed(1):i18n.t('COMMON.NA'),
        averageQuality: sleepSummary.count>0? (sleepSummary.totalQuality/sleepSummary.count).toFixed(1):i18n.t('COMMON.NA')
      })
    ];


    report['activity']=[i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.ACTIVITY_SUMMARY",{
      count: activitySummary.count,
      duration: activitySummary.totalDuration
    })];


    report['symptom']=Object.entries(symptomSummary).map(([symptom,count]) =>
      i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.SYMPTOM_ENTRY",{symptom,count}));
    report['mood']=Object.entries(moodSummary).map(([mood,count]) =>
      i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.MOOD_ENTRY",{mood,count}));
    report['nutrition']=[i18n.t("HISTORY.DR_REPORTS.REPORT_ENTRIES.NUTRITION_SUMMARY",nutritionSummary)];

    return report;
  };

  const generatePDF=async () => {
    const reportData=generateDoctorReport();

    // ✅ Get today's date in local time format instead of UTC
    const todayDate=new Date();
    const formattedDate=LocalFormatter({date: todayDate,includeTime: false});

    const fileName=i18n.t("HISTORY.DR_REPORTS.PDF.FILENAME",{date: formattedDate});

    let reportHTML=`
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Open Sans', sans-serif; padding: 20px; color: #343A40; }
            h1 { text-align: center; color: #001AD6; }
            h2 { border-bottom: 2px solid #001AD6; padding-bottom: 5px; }
            p { font-size: 14px; line-height: 1.6; }
            .container { max-width: 800px; margin: auto; padding: 20px;  }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { width: 120px; height: auto; margin-bottom: 10px; }
            .footer { text-align: center; font-size: 12px; margin-top: 30px; color: #6C757D; }
            .highlight { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${i18n.t("HISTORY.DR_REPORTS.TITLE")}</h1>
              <p>${i18n.t("HISTORY.DR_REPORTS.DATE",{date: formattedDate})}</p>
            </div>
    `;

    Object.entries(reportData).forEach(([category,entries]) => {
      reportHTML+=`<h2>${i18n.t(`HISTORY.DR_REPORTS.CATEGORIES.${category.toUpperCase()}`)}</h2>`;
      entries.forEach(entry => {
        reportHTML+=`<p class="highlight">${entry}</p>`;
      });
    });

    reportHTML+=`
          <div class="footer">
            <p>${i18n.t("HISTORY.DR_REPORTS.PDF.FOOTER")}</p>
          </div>
          </div>
        </body>
      </html>
    `;

    const {uri}=await Print.printToFileAsync({html: reportHTML});
    const newUri=uri? `${uri.replace('print',fileName)}`:"";

    await shareAsync(newUri,{
      mimeType: 'application/pdf',
      dialogTitle: i18n.t("HISTORY.DR_REPORTS.PDF.SHARE_DIALOG_TITLE"),
      UTI: 'com.adobe.pdf',
    });
  };


  const reportData=generateDoctorReport();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <BackButton />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button]} onPress={generatePDF}>
            <Text style={styles.buttonText}>{i18n.t("HISTORY.DR_REPORTS.SHARE_BUTTON")}</Text>
          </TouchableOpacity>

        </View>

        {isLoading? (
          <Text style={styles.textSmall}>{i18n.t("HISTORY.DR_REPORTS.LOADING")}</Text>
        ):Object.keys(reportData).length===0? (
          <Text style={styles.textSmall}>{i18n.t("HISTORY.DR_REPORTS.NO_RECORDS")}</Text>
        ):(
          Object.entries(reportData).map(([category,entries]) => (
            <View key={category} style={styles.card}>
              <Text style={styles.cardHeader}>{i18n.t(`HISTORY.DR_REPORTS.CATEGORIES.${category.toUpperCase()}`)}</Text>
              {entries.map((entry,index) => (
                <Text key={index} style={styles.text}>{entry}</Text>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default DoctorReports;
