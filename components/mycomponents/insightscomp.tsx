import React,{useEffect,useState} from 'react';
import {View,Text,ScrollView,Alert,TouchableOpacity} from 'react-native';
import i18n from '@/components/mycomponents/setup/localization/localization';
import {formatDistanceToNow,format} from 'date-fns';
import useThemedStyles from "@/components/hooks/useThemedStyles";
import {CalendarDataService,CalendarItem} from '@/storage/CalendarService';
import {InsightsService, InsightsData, InsightsDataInput} from '@/storage/InsightsService';
import { useFocusEffect } from '@react-navigation/native';
import {exportData} from '@/app/history/exportData';



export default function InsightsScreen() {
    const [insights,setInsights]=useState<InsightsData|null>(null);
    const [loading,setLoading]=useState(true);
    const styles=useThemedStyles();

    // Initial load
    useEffect(() => {
        loadInsights();
    },[]);

    // Refresh on focus
    useFocusEffect(
        React.useCallback(() => {
            loadInsights();
        }, [])
    );

    const loadInsights=async () => {
        try {
            setLoading(true);
            const items=await CalendarDataService.getAllCalendarItems();

            if (items.length === 0) {
                // If no items exist, create empty insights
                const emptyInsights: InsightsDataInput = {
                    totalEntries: 0,
                    dateRange: {
                        start: new Date().toISOString(),
                        end: new Date().toISOString(),
                    },
                    categories: {
                        symptoms: 0,
                        medications: 0,
                        cycles: 0,
                        moods: 0,
                        sleep: 0,
                        nutrition: 0,
                        health: 0
                    },
                    trends: {
                        mostTrackedSymptom: i18n.t('COMMON.NO_DATA_YET'),
                        commonMoodPattern: i18n.t('COMMON.NO_DATA_YET'),
                        averageSleepHours: 0,
                        medicationAdherence: 0
                    },
                    streaks: {
                        current: 0,
                        longest: 0,
                        lastActivity: new Date().toISOString()
                    },
                    correlations: {
                        cycleSymptoms: [],
                        sleepNutrition: [],
                        moodSymptoms: [],
                        nutritionSymptoms: [],
                        activitySleep: [],
                        medicationEffectiveness: [],
                        activityMood: [],
                        healthSymptoms: [],
                        healthMood: [],
                        nutritionWeight: []
                    }
                };
                await InsightsService.saveInsights(emptyInsights);
                setInsights(await InsightsService.getLatestInsights());
                setLoading(false);
                return;
            }

            // Calculate statistics similar to Dr Reports
            const activitySummary={count: 0,totalDuration: 0};
            const symptomSummary: {[key: string]: number}={};
            const moodSummary: {[key: string]: number}={};
            const sleepSummary={
                count: 0,
                totalHours: 0,
                totalQuality: 0
            };

            let cycleStartDate: string|null=null;
            let cycleEndDate: string|null=null;
            let medicationCount=0;
            let medicationTakenCount=0;

            const healthMetrics={
                weight: [] as {date: Date; value: number}[],
                bloodPressure: [] as {date: Date; systolic: number; diastolic: number}[]
            };

            items.forEach(event => {
                if(event.type==='activity') {
                    activitySummary.count++;
                    activitySummary.totalDuration+=event.details?.duration??0;
                } else if(event.type==='sleep'&&event.details?.bedTime&&event.details?.wakeTime) {
                    sleepSummary.count++;

                    const baseDate=new Date().toISOString().split('T')[0];
                    const bedTime=new Date(`${baseDate}T${event.details.bedTime}`);
                    let wakeTime=new Date(`${baseDate}T${event.details.wakeTime}`);

                    if(wakeTime<bedTime) {
                        wakeTime.setDate(wakeTime.getDate()+1);
                    }

                    const diffMs=wakeTime.getTime()-bedTime.getTime();
                    const hours=diffMs/(1000*60*60);
                    sleepSummary.totalHours+=hours;

                    if(event.details.sleepQuality) {
                        sleepSummary.totalQuality+=event.details.sleepQuality;
                    }
                } else if(event.type==='symptom') {
                    symptomSummary[event.details?.name]=(symptomSummary[event.details?.name]||0)+1;
                } else if(event.type==='cycle') {
                    const eventDate=event.date.toISOString();
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
                } else if(event.type==='medication') {
                    medicationCount++;
                    if(event.details?.taken) {
                        medicationTakenCount++;
                    }
                } else if(event.type==='health') {
                    if(event.details?.weight) {
                        healthMetrics.weight.push({
                            date: event.date,
                            value: parseFloat(event.details.weight)
                        });
                    }
                    if(event.details?.systolic&&event.details?.diastolic) {
                        healthMetrics.bloodPressure.push({
                            date: event.date,
                            systolic: parseFloat(event.details.systolic),
                            diastolic: parseFloat(event.details.diastolic)
                        });
                    }
                }
            });

            // Calculate most tracked symptom
            const mostTrackedSymptom=Object.entries(symptomSummary)
                .sort(([,a],[,b]) => b-a)[0]?.[0]||'None';

            // Calculate most common mood
            const commonMoodPattern=Object.entries(moodSummary)
                .sort(([,a],[,b]) => b-a)[0]?.[0]||'No patterns yet';

            // Calculate average sleep hours
            const averageSleepHours=sleepSummary.count>0
                ? sleepSummary.totalHours/sleepSummary.count
                :0;

            // Calculate medication adherence
            const medicationAdherence=medicationCount>0
                ? medicationTakenCount/medicationCount
                :0;

            // Calculate streaks
            const sortedDates=items
                .map(d => d.date.toISOString().split('T')[0])
                .sort()
                .filter((date,index,array) => array.indexOf(date)===index);

            let currentStreak=1;
            let longestStreak=1;
            let streak=1;

            for(let i=1; i<sortedDates.length; i++) {
                const prevDate=new Date(sortedDates[i-1]);
                const currDate=new Date(sortedDates[i]);
                const diffDays=(currDate.getTime()-prevDate.getTime())/(1000*60*60*24);

                if(diffDays===1) {
                    streak++;
                    if(streak>longestStreak) {
                        longestStreak=streak;
                    }
                } else {
                    streak=1;
                }
            }

            // Calculate current streak
            const lastDate=new Date(sortedDates[sortedDates.length-1]);
            const today=new Date();
            const diffDays=(today.getTime()-lastDate.getTime())/(1000*60*60*24);

            if(diffDays<=1) {
                currentStreak=streak;
            } else {
                currentStreak=0;
            }

            // Correlation Analysis
            const correlations={
                cycleSymptoms: [] as {symptom: string; frequency: number}[],
                sleepNutrition: [] as {food: string; avgSleepQuality: number}[],
                moodSymptoms: [] as {symptom: string; mood: string; frequency: number}[],
                nutritionSymptoms: [] as {food: string; symptom: string; frequency: number}[],
                activitySleep: [] as {activity: string; avgSleepQuality: number}[],
                medicationEffectiveness: [] as {medication: string; symptomReduction: number}[],
                activityMood: [] as {activity: string; mood: string; frequency: number}[],
                healthSymptoms: [] as {health: string; symptom: string; frequency: number}[],
                healthMood: [] as {health: string; mood: string; frequency: number}[],
                nutritionWeight: [] as {food: string; weightChange: number}[]
            };

            // Group items by date for correlation analysis
            const itemsByDate=items.reduce((acc,item) => {
                const date=item.date.toISOString().split('T')[0];
                if(!acc[date]) acc[date]=[];
                acc[date].push(item);
                return acc;
            },{} as {[key: string]: CalendarItem[]});

            // Analyze cycle correlations
            Object.values(itemsByDate).forEach(dayItems => {
                const hasCycle=dayItems.some(item => item.type==='cycle');
                if(hasCycle) {
                    const symptoms=dayItems
                        .filter(item => item.type==='symptom')
                        .map(item => item.details?.name)
                        .filter(Boolean) as string[];

                    symptoms.forEach(symptom => {
                        const existing=correlations.cycleSymptoms.find(s => s.symptom===symptom);
                        if(existing) {
                            existing.frequency++;
                        } else {
                            correlations.cycleSymptoms.push({symptom,frequency: 1});
                        }
                    });
                }
            });

            // Analyze sleep and nutrition correlations
            Object.values(itemsByDate).forEach(dayItems => {
                const sleepEntry=dayItems.find(item => item.type==='sleep');
                const nutritionEntries=dayItems.filter(item => item.type==='nutrition');

                if(sleepEntry?.details?.sleepQuality&&nutritionEntries.length>0) {
                    nutritionEntries.forEach(nutrition => {
                        const food=nutrition.details?.food;
                        if(food) {
                            const existing=correlations.sleepNutrition.find(s => s.food===food);
                            if(existing) {
                                existing.avgSleepQuality=(existing.avgSleepQuality+(sleepEntry.details?.sleepQuality||0))/2;
                            } else {
                                correlations.sleepNutrition.push({
                                    food,
                                    avgSleepQuality: sleepEntry.details?.sleepQuality||0
                                });
                            }
                        }
                    });
                }
            });

            // Analyze mood and symptom correlations
            Object.values(itemsByDate).forEach(dayItems => {
                const moodEntries=dayItems.filter(item => item.type==='mood');
                const symptoms=dayItems.filter(item => item.type==='symptom');

                moodEntries.forEach(mood => {
                    symptoms.forEach(symptom => {
                        if(mood.details?.mood&&symptom.details?.name) {
                            const key=`${symptom.details.name}-${mood.details.mood}`;
                            const existing=correlations.moodSymptoms.find(
                                ms => ms.symptom===symptom.details?.name&&ms.mood===mood.details?.mood
                            );
                            if(existing) {
                                existing.frequency++;
                            } else {
                                correlations.moodSymptoms.push({
                                    symptom: symptom.details.name,
                                    mood: mood.details.mood,
                                    frequency: 1
                                });
                            }
                        }
                    });
                });
            });

            // Analyze nutrition and symptom correlations
            Object.values(itemsByDate).forEach(dayItems => {
                const nutritionEntries=dayItems.filter(item => item.type==='nutrition');
                const symptoms=dayItems.filter(item => item.type==='symptom');

                nutritionEntries.forEach(nutrition => {
                    symptoms.forEach(symptom => {
                        if(nutrition.details?.food&&symptom.details?.name) {
                            const existing=correlations.nutritionSymptoms.find(
                                ns => ns.food===nutrition.details?.food&&ns.symptom===symptom.details?.name
                            );
                            if(existing) {
                                existing.frequency++;
                            } else {
                                correlations.nutritionSymptoms.push({
                                    food: nutrition.details.food,
                                    symptom: symptom.details.name,
                                    frequency: 1
                                });
                            }
                        }
                    });
                });
            });

            // Analyze activity and sleep quality
            Object.values(itemsByDate).forEach(dayItems => {
                const sleepEntry=dayItems.find(item => item.type==='sleep');
                const activityEntries=dayItems.filter(item => item.type==='activity');

                if(sleepEntry?.details?.sleepQuality&&activityEntries.length>0) {
                    activityEntries.forEach(activity => {
                        if(activity.details?.name) {
                            const existing=correlations.activitySleep.find(s => s.activity===activity.details?.name);
                            if(existing) {
                                existing.avgSleepQuality=(existing.avgSleepQuality+(sleepEntry.details?.sleepQuality||0))/2;
                            } else {
                                correlations.activitySleep.push({
                                    activity: activity.details.name,
                                    avgSleepQuality: sleepEntry.details?.sleepQuality||0
                                });
                            }
                        }
                    });
                }
            });

            // Analyze medication effectiveness
            Object.values(itemsByDate).forEach(dayItems => {
                const medications=dayItems.filter(item => item.type==='medication');
                const symptoms=dayItems.filter(item => item.type==='symptom');
                const nextDayItems=itemsByDate[
                    new Date(new Date(dayItems[0].date).getTime()+24*60*60*1000).toISOString().split('T')[0]
                ]||[];
                const nextDaySymptoms=nextDayItems.filter(item => item.type==='symptom');

                medications.forEach(medication => {
                    if(medication.details?.name&&medication.details?.taken) {
                        const beforeSymptomCount=symptoms.length;
                        const afterSymptomCount=nextDaySymptoms.length;
                        const reduction=beforeSymptomCount>0?
                            (beforeSymptomCount-afterSymptomCount)/beforeSymptomCount:0;

                        const existing=correlations.medicationEffectiveness.find(m => m.medication===medication.details?.name);
                        if(existing) {
                            existing.symptomReduction=(existing.symptomReduction+reduction)/2;
                        } else {
                            correlations.medicationEffectiveness.push({
                                medication: medication.details.name,
                                symptomReduction: reduction
                            });
                        }
                    }
                });
            });

            // Analyze activity and mood
            Object.values(itemsByDate).forEach(dayItems => {
                const activities=dayItems.filter(item => item.type==='activity');
                const moods=dayItems.filter(item => item.type==='mood');

                activities.forEach(activity => {
                    moods.forEach(mood => {
                        if(activity.details?.name&&mood.details?.mood) {
                            const existing=correlations.activityMood.find(
                                am => am.activity===activity.details?.name&&am.mood===mood.details?.mood
                            );
                            if(existing) {
                                existing.frequency++;
                            } else {
                                correlations.activityMood.push({
                                    activity: activity.details.name,
                                    mood: mood.details.mood,
                                    frequency: 1
                                });
                            }
                        }
                    });
                });
            });

            // Analyze health and symptoms
            Object.values(itemsByDate).forEach(dayItems => {
                const healthEntries=dayItems.filter(item => item.type==='health');
                const symptoms=dayItems.filter(item => item.type==='symptom');
                const moods=dayItems.filter(item => item.type==='mood');

                healthEntries.forEach(health => {
                    // Health and Symptoms
                    symptoms.forEach(symptom => {
                        if(health.details?.condition&&symptom.details?.name) {
                            const existing=correlations.healthSymptoms.find(
                                hs => hs.health===health.details?.condition&&hs.symptom===symptom.details?.name
                            );
                            if(existing) {
                                existing.frequency++;
                            } else {
                                correlations.healthSymptoms.push({
                                    health: health.details.condition,
                                    symptom: symptom.details.name,
                                    frequency: 1
                                });
                            }
                        }
                    });

                    // Health and Mood
                    moods.forEach(mood => {
                        if(health.details?.condition&&mood.details?.mood) {
                            const existing=correlations.healthMood.find(
                                hm => hm.health===health.details?.condition&&hm.mood===mood.details?.mood
                            );
                            if(existing) {
                                existing.frequency++;
                            } else {
                                correlations.healthMood.push({
                                    health: health.details.condition,
                                    mood: mood.details.mood,
                                    frequency: 1
                                });
                            }
                        }
                    });
                });
            });

            // Sort all correlations
            correlations.cycleSymptoms.sort((a,b) => b.frequency-a.frequency);
            correlations.sleepNutrition.sort((a,b) => b.avgSleepQuality-a.avgSleepQuality);
            correlations.moodSymptoms.sort((a,b) => b.frequency-a.frequency);
            correlations.nutritionSymptoms.sort((a,b) => b.frequency-a.frequency);
            correlations.activitySleep.sort((a,b) => b.avgSleepQuality-a.avgSleepQuality);
            correlations.medicationEffectiveness.sort((a,b) => b.symptomReduction-a.symptomReduction);
            correlations.activityMood.sort((a,b) => b.frequency-a.frequency);
            correlations.healthSymptoms.sort((a,b) => b.frequency-a.frequency);
            correlations.healthMood.sort((a,b) => b.frequency-a.frequency);

            // Take top 5 for each category
            correlations.cycleSymptoms=correlations.cycleSymptoms.slice(0,5);
            correlations.sleepNutrition=correlations.sleepNutrition.slice(0,5);
            correlations.moodSymptoms=correlations.moodSymptoms.slice(0,5);
            correlations.nutritionSymptoms=correlations.nutritionSymptoms.slice(0,5);
            correlations.activitySleep=correlations.activitySleep.slice(0,5);
            correlations.medicationEffectiveness=correlations.medicationEffectiveness.slice(0,5);
            correlations.activityMood=correlations.activityMood.slice(0,5);
            correlations.healthSymptoms=correlations.healthSymptoms.slice(0,5);
            correlations.healthMood=correlations.healthMood.slice(0,5);

            // Calculate weight trend
            let weightTrend;
            if(healthMetrics.weight.length>=2) {
                const sortedWeights=healthMetrics.weight.sort((a,b) => b.date.getTime()-a.date.getTime());
                const current=sortedWeights[0].value;
                const previous=sortedWeights[sortedWeights.length-1].value;
                const change=current-previous;
                const period=formatDistanceToNow(sortedWeights[sortedWeights.length-1].date);
                weightTrend={current,change,period};
            }

            // Calculate blood pressure trend
            let bloodPressureTrend;
            if(healthMetrics.bloodPressure.length>=2) {
                const sortedBP=healthMetrics.bloodPressure.sort((a,b) => b.date.getTime()-a.date.getTime());
                const currentSystolic=sortedBP[0].systolic;
                const currentDiastolic=sortedBP[0].diastolic;
                const previousSystolic=sortedBP[sortedBP.length-1].systolic;
                const previousDiastolic=sortedBP[sortedBP.length-1].diastolic;

                const avgSystolic=sortedBP.reduce((sum,bp) => sum+bp.systolic,0)/sortedBP.length;
                const avgDiastolic=sortedBP.reduce((sum,bp) => sum+bp.diastolic,0)/sortedBP.length;

                bloodPressureTrend={
                    systolic: {
                        avg: avgSystolic,
                        change: currentSystolic-previousSystolic
                    },
                    diastolic: {
                        avg: avgDiastolic,
                        change: currentDiastolic-previousDiastolic
                    },
                    period: formatDistanceToNow(sortedBP[sortedBP.length-1].date)
                };
            }

            const processedInsights: InsightsDataInput={
                totalEntries: items.length,
                dateRange: {
                    start: items[0]?.date.toISOString()||new Date().toISOString(),
                    end: items[items.length-1]?.date.toISOString()||new Date().toISOString(),
                },
                categories: {
                    symptoms: items.filter(d => d.type==='symptom').length,
                    medications: items.filter(d => d.type==='medication').length,
                    cycles: items.filter(d => d.type==='cycle').length,
                    moods: items.filter(d => d.type==='mood').length,
                    sleep: items.filter(d => d.type==='sleep').length,
                    nutrition: items.filter(d => d.type==='nutrition').length,
                    health: items.filter(d => d.type==='health').length
                },
                trends: {
                    mostTrackedSymptom,
                    commonMoodPattern,
                    averageSleepHours,
                    medicationAdherence,
                    weightTrend,
                    bloodPressureTrend
                },
                streaks: {
                    current: currentStreak,
                    longest: longestStreak,
                    lastActivity: sortedDates[sortedDates.length-1]||new Date().toISOString(),
                },
                correlations
            };

            // Save insights to database
            await InsightsService.saveInsights(processedInsights);
            
            // Clean up old insights, keeping only the last 10
            await InsightsService.deleteOldInsights(10);

            // Get the latest insights with timestamps
            const savedInsights = await InsightsService.getLatestInsights();
            if (!savedInsights) {
                throw new Error('Failed to retrieve saved insights');
            }
            setInsights(savedInsights);

        } catch(error) {
            console.error('Failed to load insights:',error);
            // Try to load the latest saved insights if current calculation fails
            try {
                const savedInsights = await InsightsService.getLatestInsights();
                if (savedInsights) {
                    setInsights(savedInsights);
                    return;
                }
            } catch (dbError) {
                console.error('Failed to load saved insights:', dbError);
            }
            Alert.alert(
                i18n.t('ALERTS.ERROR.TITLE'),
                i18n.t('ALERTS.ERROR.LOAD_INSIGHTS')
            );
        } finally {
            setLoading(false);
        }
    };

    const handleExport=async () => {
        try {
            await exportData();
            Alert.alert(
                i18n.t('ALERTS.SUCCESS.EXPORT'),
                i18n.t('ALERTS.SUCCESS.EXPORT_MESSAGE')
            );
        } catch(error) {
            console.error('Export failed:',error);
            Alert.alert(i18n.t('ALERTS.ERROR.EXPORT'));
        }
    };

    const handleDeleteAllEntries = async () => {
        Alert.alert(
            i18n.t('ALERTS.CONFIRM.DELETE_ALL'),
            i18n.t('ALERTS.CONFIRM.DELETE_ALL_MESSAGE'),
            [
                {
                    text: i18n.t('COMMON.CANCEL'),
                    style: 'cancel',
                },
                {
                    text: i18n.t('COMMON.CONFIRM'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Save current insights before deletion
                            if (insights) {
                                await InsightsService.saveInsights(insights);
                            }
                            
                            // Delete all calendar entries (preserves insights)
                            await CalendarDataService.deleteAllEntries();
                            
                            // Create empty insights for the new state
                            const emptyInsights: InsightsDataInput = {
                                totalEntries: 0,
                                dateRange: {
                                    start: new Date().toISOString(),
                                    end: new Date().toISOString(),
                                },
                                categories: {
                                    symptoms: 0,
                                    medications: 0,
                                    cycles: 0,
                                    moods: 0,
                                    sleep: 0,
                                    nutrition: 0,
                                    health: 0
                                },
                                trends: {
                                    mostTrackedSymptom: i18n.t('COMMON.NO_DATA_YET'),
                                    commonMoodPattern: i18n.t('COMMON.NO_DATA_YET'),
                                    averageSleepHours: 0,
                                    medicationAdherence: 0
                                },
                                streaks: {
                                    current: 0,
                                    longest: 0,
                                    lastActivity: new Date().toISOString()
                                },
                                correlations: {
                                    cycleSymptoms: [],
                                    sleepNutrition: [],
                                    moodSymptoms: [],
                                    nutritionSymptoms: [],
                                    activitySleep: [],
                                    medicationEffectiveness: [],
                                    activityMood: [],
                                    healthSymptoms: [],
                                    healthMood: [],
                                    nutritionWeight: []
                                }
                            };
                            
                            // Save the empty insights state
                            await InsightsService.saveInsights(emptyInsights);
                            
                            Alert.alert(
                                i18n.t('COMMON.SUCCESS'),
                                i18n.t('ALERTS.SUCCESS.DELETE_ALL')
                            );
                            
                            // Load the new empty insights
                            const savedInsights = await InsightsService.getLatestInsights();
                            if (savedInsights) {
                                setInsights(savedInsights);
                            }
                        } catch (error) {
                            console.error('Delete all entries failed:', error);
                            Alert.alert(
                                i18n.t('COMMON.ERROR'),
                                i18n.t('ALERTS.ERROR.DELETE_ALL')
                            );
                        }
                    },
                },
            ]
        );
    };

    if(loading||!insights) {
        return (
            <View style={[styles.container]}>
                <Text style={[styles.text]}>
                    {i18n.t('ALERTS.LOADING')}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.scrollContainer]}>
            <View style={styles.container}>
                {/* Export Button */}
                <TouchableOpacity
                    style={[styles.roundButton, styles.roundButtonActive]}
                    onPress={handleExport}
                >
                    <Text style={styles.buttonText}>
                        {i18n.t('SETTINGS.DATA_MANAGEMENT.EXPORT_DATA')}
                    </Text>
                </TouchableOpacity>

                {/* Delete All Entries Button */}
                <TouchableOpacity
                    style={[styles.roundButton, styles.roundButtonActive,styles.buttonPrimary]}
                    onPress={handleDeleteAllEntries}
                >
                    <Text style={styles.buttonText}>
                        {i18n.t('ALERTS.CONFIRM.DELETE_ALL')}
                    </Text>
                </TouchableOpacity>

                {/* Summary Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardHeader]}>
                            {i18n.t('INSIGHTS.OVERVIEW')}
                        </Text>
                    </View>
                    <Text style={[styles.text]}>
                        {i18n.t('INSIGHTS.TOTAL_ENTRIES',{count: insights.totalEntries})}
                    </Text>
                    <Text style={[styles.text]}>
                        {i18n.t('INSIGHTS.TRACKING_PERIOD',{
                            start: format(new Date(insights.dateRange.start),'MMM d, yyyy'),
                            end: format(new Date(insights.dateRange.end),'MMM d, yyyy')
                        })}
                    </Text>
                    
                </View>

                    {/* Streaks Section */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.cardHeader]}>
                                {i18n.t('INSIGHTS.STREAKS')}
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.CURRENT_STREAK',{days: insights.streaks.current})}
                            </Text>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.LONGEST_STREAK',{days: insights.streaks.longest})}
                            </Text>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.LAST_ACTIVITY',{
                                    time: formatDistanceToNow(new Date(insights.streaks.lastActivity),{addSuffix: true})
                                })}
                            </Text>
                        </View>
                    </View>

                    {/* Trends Section */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.cardHeader]}>
                                {i18n.t('INSIGHTS.TRENDS')}
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.MOST_TRACKED_SYMPTOM',{symptom: insights.trends.mostTrackedSymptom})}
                            </Text>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.COMMON_MOOD',{pattern: insights.trends.commonMoodPattern})}
                            </Text>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.AVG_SLEEP',{hours: insights.trends.averageSleepHours.toFixed(1)})}
                            </Text>
                            <Text style={[styles.text]}>
                                {i18n.t('INSIGHTS.MED_ADHERENCE',{percentage: (insights.trends.medicationAdherence*100).toFixed(0)})}
                            </Text>
                        </View>
                    </View>

                {/* Categories Summary */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardHeader]}>
                            {i18n.t('INSIGHTS.CATEGORIES')}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.SYMPTOMS',{count: insights.categories.symptoms})}
                        </Text>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.MEDICATIONS',{count: insights.categories.medications})}
                        </Text>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.CYCLES',{count: insights.categories.cycles})}
                        </Text>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.MOODS',{count: insights.categories.moods})}
                        </Text>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.SLEEP',{count: insights.categories.sleep})}
                        </Text>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.NUTRITION',{count: insights.categories.nutrition})}
                        </Text>
                        <Text style={[styles.text]}>
                            {i18n.t('INSIGHTS.CATEGORY_COUNT.HEALTH',{count: insights.categories.health})}
                        </Text>
                    </View>
                </View>



                {/* Health Metrics Section */}
                {(insights.trends.weightTrend||insights.trends.bloodPressureTrend)&&(
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.cardHeader]}>
                                {i18n.t('INSIGHTS.HEALTH_METRICS.TITLE')}
                            </Text>
                        </View>
                        <View style={styles.section}>
                            {insights.trends.weightTrend&&(
                                <>
                                    <Text style={[styles.text]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.WEIGHT_CURRENT',{
                                            weight: insights.trends.weightTrend.current.toFixed(1)
                                        })}
                                    </Text>
                                    <Text style={[styles.text]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.WEIGHT_CHANGE',{
                                            period: insights.trends.weightTrend.period,
                                            change: insights.trends.weightTrend.change>0?
                                                `+${insights.trends.weightTrend.change.toFixed(1)}`:
                                                insights.trends.weightTrend.change.toFixed(1)
                                        })}
                                    </Text>
                                </>
                            )}

                            {insights.trends.bloodPressureTrend&&(
                                <>
                                    <Text style={[styles.text]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.BP_AVERAGE',{
                                            systolic: Math.round(insights.trends.bloodPressureTrend.systolic.avg),
                                            diastolic: Math.round(insights.trends.bloodPressureTrend.diastolic.avg)
                                        })}
                                    </Text>
                                    <Text style={[styles.text]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.BP_CHANGE', {
                                            period: insights.trends.bloodPressureTrend.period
                                        })}
                                    </Text>
                                    <Text style={[styles.text]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.BP_SYSTOLIC',{
                                            change: insights.trends.bloodPressureTrend.systolic.change>0?
                                                `+${Math.round(insights.trends.bloodPressureTrend.systolic.change)}`:
                                                Math.round(insights.trends.bloodPressureTrend.systolic.change)
                                        })}
                                    </Text>
                                    <Text style={[styles.text]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.BP_DIASTOLIC',{
                                            change: insights.trends.bloodPressureTrend.diastolic.change>0?
                                                `+${Math.round(insights.trends.bloodPressureTrend.diastolic.change)}`:
                                                Math.round(insights.trends.bloodPressureTrend.diastolic.change)
                                        })}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                )}

                {/* Correlations Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardHeader]}>
                            {i18n.t('INSIGHTS.CORRELATIONS.TITLE')}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        {/* Cycle & Symptom Patterns */}
                        {insights.correlations.cycleSymptoms.length>0&&(
                            <>
                                {insights.correlations.cycleSymptoms.map((correlation,index) => (
                                    <Text key={`cycle-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.CYCLE_SYMPTOMS',{
                                            symptom: correlation.symptom,
                                            frequency: correlation.frequency
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Sleep & Nutrition Patterns */}
                        {insights.correlations.sleepNutrition.length>0&&(
                            <>
                                {insights.correlations.sleepNutrition.map((correlation,index) => (
                                    <Text key={`sleep-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.SLEEP_NUTRITION',{
                                            food: correlation.food,
                                            quality: (correlation.avgSleepQuality*100).toFixed(0)
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Mood & Symptom Patterns */}
                        {insights.correlations.moodSymptoms.length>0&&(
                            <>
                                {insights.correlations.moodSymptoms.map((correlation,index) => (
                                    <Text key={`mood-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.MOOD_SYMPTOMS',{
                                            mood: correlation.mood,
                                            symptom: correlation.symptom,
                                            frequency: correlation.frequency
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Activity & Sleep Patterns */}
                        {insights.correlations.activitySleep.length>0&&(
                            <>
                                {insights.correlations.activitySleep.map((correlation,index) => (
                                    <Text key={`activity-sleep-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.ACTIVITY_SLEEP',{
                                            activity: correlation.activity,
                                            quality: (correlation.avgSleepQuality*100).toFixed(0)
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Medication Effectiveness */}
                        {insights.correlations.medicationEffectiveness.length>0&&(
                            <>
                                {insights.correlations.medicationEffectiveness.map((correlation,index) => (
                                    <Text key={`medication-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.MEDICATION_EFFECT',{
                                            medication: correlation.medication,
                                            reduction: (correlation.symptomReduction*100).toFixed(0)
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Activity & Mood Patterns */}
                        {insights.correlations.activityMood.length>0&&(
                            <>
                                {insights.correlations.activityMood.map((correlation,index) => (
                                    <Text key={`activity-mood-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.ACTIVITY_MOOD',{
                                            activity: correlation.activity,
                                            mood: correlation.mood,
                                            frequency: correlation.frequency
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Health & Symptoms */}
                        {insights.correlations.healthSymptoms.length>0&&(
                            <>
                                {insights.correlations.healthSymptoms.map((correlation,index) => (
                                    <Text key={`health-symptom-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.HEALTH_SYMPTOMS',{
                                            condition: correlation.health,
                                            symptom: correlation.symptom,
                                            frequency: correlation.frequency
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Health & Mood */}
                        {insights.correlations.healthMood.length>0&&(
                            <>
                                {insights.correlations.healthMood.map((correlation,index) => (
                                    <Text key={`health-mood-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.HEALTH_MOOD',{
                                            condition: correlation.health,
                                            mood: correlation.mood,
                                            frequency: correlation.frequency
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}

                        {/* Weight Correlations */}
                        {insights.correlations.nutritionWeight.length>0&&(
                            <>
                                {insights.correlations.nutritionWeight.map((correlation,index) => (
                                    <Text key={`weight-nutrition-${index}`} style={[styles.text]}>
                                        {i18n.t('INSIGHTS.CORRELATIONS.WEIGHT_NUTRITION',{
                                            food: correlation.food,
                                            change: correlation.weightChange.toFixed(1)
                                        })}
                                    </Text>
                                ))}
                            </>
                        )}
                    </View>
                </View>


            </View>
        </ScrollView>
    );
}
