{/**
    import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import i18n from '@/components/mycomponents/setup/localization/localization';
import { formatDistanceToNow, format } from 'date-fns';
import { useCustomColorScheme } from "@/components/useCustomColorScheme";
import { getThemedStyles } from "@/constants/Styles";
import { CalendarDataService } from '@/storage/CalendarService';
import { InsightsService, InsightsData, InsightsDataInput } from '@/storage/InsightsService';
import { useFocusEffect } from '@react-navigation/native';
import { exportData } from '@/app/history/exportData';
import Colors from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

export default function EnhancedInsightsScreen() {
    const [insights, setInsights] = useState<InsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const theme = useCustomColorScheme();
    const globalStyles = getThemedStyles(theme);
    
    // Create enhanced styles
    const styles = StyleSheet.create({
        ...globalStyles,
        centerContent: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            marginTop: 16,
            fontSize: 16,
            color: Colors[theme].buttonText,
        },
        
      
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        statNumber: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors[theme].tint,
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: Colors[theme].buttonText,
            opacity: 0.7,
            textAlign: 'center',
        },
        
       
        chartBackground: {
            backgroundColor: Colors[theme].cardBackground,
        },
        trendCard: {
            backgroundColor: Colors[theme].cardBackground,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: Colors[theme].shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        
        trendItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: Colors[theme].border,
        },
        trendLabel: {
            fontSize: 14,
            color: Colors[theme].buttonText,
            opacity: 0.7,
            flex: 1,
        },
        trendValue: {
            fontSize: 16,
            fontWeight: '500',
            color: Colors[theme].buttonText,
        },
       
        correlationsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -8,
        },
        correlationItem: {
            width: '50%',
            padding: 8,
        },
        
        correlationValue: {
            fontSize: 12,
            color: Colors[theme].buttonText,
            opacity: 0.7,
        },
        
       
        
        increase: {
            color: Colors[theme].tint,
        },
        decrease: {
            color: Colors[theme].button,
        },
        
       
        dateRange: {
            marginTop: 8,
            fontSize: 12,
            color: Colors[theme].buttonText,
            opacity: 0.7,
        },
        trendDetails: {
            marginTop: 16,
        },
        adherenceValue: {
            color: Colors[theme].tint,
        },
        section: {
            marginBottom: 16,
        },
        
        
        
        bpChanges: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        bpChange: {
            flex: 1,
        },
        
        correlationIcon: {
            marginRight: 8,
        },
        effectivenessBar: {
            height: 16,
            backgroundColor: Colors[theme].border,
            borderRadius: 8,
            overflow: 'hidden',
        },
        effectivenessFill: {
            height: '100%',
            backgroundColor: Colors[theme].tint,
        },
        weightChangeIndicator: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        weightChangeValue: {
            marginLeft: 8,
            fontSize: 12,
            fontWeight: 'bold',
        },
    });

    const loadInsights = async () => {
        try {
            setLoading(true);
            const items = await CalendarDataService.getAllCalendarItems();

            if (items.length === 0) {
                // Create empty insights
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

            // Calculate statistics
            const activitySummary = { count: 0, totalDuration: 0 };
            const symptomSummary: { [key: string]: number } = {};
            const moodSummary: { [key: string]: number } = {};
            const sleepSummary = {
                count: 0,
                totalHours: 0,
                totalQuality: 0
            };

            let cycleStartDate: string | null = null;
            let cycleEndDate: string | null = null;
            let medicationCount = 0;
            let medicationTakenCount = 0;

            const healthMetrics = {
                weight: [] as { date: Date; value: number }[],
                bloodPressure: [] as { date: Date; systolic: number; diastolic: number }[]
            };

            items.forEach(event => {
                if (event.type === 'activity') {
                    activitySummary.count++;
                    activitySummary.totalDuration += event.details?.duration ?? 0;
                } else if (event.type === 'sleep' && event.details?.bedTime && event.details?.wakeTime) {
                    sleepSummary.count++;

                    const baseDate = new Date().toISOString().split('T')[0];
                    const bedTime = new Date(`${baseDate}T${event.details.bedTime}`);
                    let wakeTime = new Date(`${baseDate}T${event.details.wakeTime}`);

                    if (wakeTime < bedTime) {
                        wakeTime.setDate(wakeTime.getDate() + 1);
                    }

                    const diffMs = wakeTime.getTime() - bedTime.getTime();
                    const hours = diffMs / (1000 * 60 * 60);
                    sleepSummary.totalHours += hours;

                    if (event.details.sleepQuality) {
                        sleepSummary.totalQuality += event.details.sleepQuality;
                    }
                } else if (event.type === 'symptom') {
                    symptomSummary[event.details?.name] = (symptomSummary[event.details?.name] || 0) + 1;
                } else if (event.type === 'cycle') {
                    const eventDate = event.date.toISOString();
                    if (event.id.startsWith('cycle-') && !event.id.startsWith('cycle-end-')) {
                        if (!cycleStartDate || eventDate < cycleStartDate) {
                            cycleStartDate = eventDate;
                        }
                    }
                    if (event.id.startsWith('cycle-end-')) {
                        if (!cycleEndDate || eventDate > cycleEndDate) {
                            cycleEndDate = eventDate;
                        }
                    }
                } else if (event.type === 'mood') {
                    moodSummary[event.details?.mood] = (moodSummary[event.details?.mood] || 0) + 1;
                } else if (event.type === 'medication') {
                    medicationCount++;
                    if (event.details?.taken) {
                        medicationTakenCount++;
                    }
                } else if (event.type === 'health') {
                    if (event.details?.weight) {
                        healthMetrics.weight.push({
                            date: event.date,
                            value: parseFloat(event.details.weight)
                        });
                    }
                    if (event.details?.systolic && event.details?.diastolic) {
                        healthMetrics.bloodPressure.push({
                            date: event.date,
                            systolic: parseFloat(event.details.systolic),
                            diastolic: parseFloat(event.details.diastolic)
                        });
                    }
                }
            });

            // Group items by date for correlation analysis
            const itemsByDate = items.reduce((acc, item) => {
                const date = item.date.toISOString().split('T')[0];
                if (!acc[date]) acc[date] = [];
                acc[date].push(item);
                return acc;
            }, {} as { [key: string]: typeof items });

            // Track correlations
            const cycleSymptomMap = new Map();
            const sleepNutritionMap = new Map();
            const moodSymptomMap = new Map();
            const activitySleepMap = new Map();
            const medicationEffectMap = new Map();
            const activityMoodMap = new Map();
            const healthSymptomMap = new Map();
            const healthMoodMap = new Map();
            const nutritionWeightMap = new Map();

            // Analyze correlations
            Object.values(itemsByDate).forEach(dayItems => {
                const cycleEvents = dayItems.filter(e => e.type === 'cycle');
                const symptoms = dayItems.filter(e => e.type === 'symptom');
                const moods = dayItems.filter(e => e.type === 'mood');
                const sleep = dayItems.find(e => e.type === 'sleep');
                const nutrition = dayItems.filter(e => e.type === 'nutrition');
                const activities = dayItems.filter(e => e.type === 'activity');
                const medications = dayItems.filter(e => e.type === 'medication');
                const health = dayItems.filter(e => e.type === 'health');

                // Cycle & Symptom Patterns
                if (cycleEvents.length > 0 && symptoms.length > 0) {
                    symptoms.forEach(symptom => {
                        const key = symptom.details?.name || '';
                        cycleSymptomMap.set(key, (cycleSymptomMap.get(key) || 0) + 1);
                    });
                }

                // Sleep & Nutrition Patterns
                if (sleep && nutrition.length > 0) {
                    nutrition.forEach(item => {
                        const key = item.details?.food || '';
                        const quality = sleep.details?.sleepQuality || 0;
                        const current = sleepNutritionMap.get(key) || { count: 0, totalQuality: 0 };
                        sleepNutritionMap.set(key, {
                            count: current.count + 1,
                            totalQuality: current.totalQuality + quality
                        });
                    });
                }

                // Mood & Symptom Patterns
                if (moods.length > 0 && symptoms.length > 0) {
                    moods.forEach(mood => {
                        symptoms.forEach(symptom => {
                            const key = `${mood.details?.mood}:${symptom.details?.name}`;
                            moodSymptomMap.set(key, (moodSymptomMap.get(key) || 0) + 1);
                        });
                    });
                }

                // Activity & Sleep Patterns
                if (sleep && activities.length > 0) {
                    activities.forEach(activity => {
                        const key = activity.details?.name || '';
                        const quality = sleep.details?.sleepQuality || 0;
                        const current = activitySleepMap.get(key) || { count: 0, totalQuality: 0 };
                        activitySleepMap.set(key, {
                            count: current.count + 1,
                            totalQuality: current.totalQuality + quality
                        });
                    });
                }

                // Medication Effectiveness
                if (medications.length > 0 && symptoms.length > 0) {
                    medications.forEach(med => {
                        const key = med.details?.name || '';
                        const severity = Math.max(...symptoms.map(s => s.details?.severity || 0));
                        const current = medicationEffectMap.get(key) || { count: 0, totalReduction: 0 };
                        medicationEffectMap.set(key, {
                            count: current.count + 1,
                            totalReduction: current.totalReduction + (1 - severity/10)
                        });
                    });
                }

                // Activity & Mood Patterns
                if (activities.length > 0 && moods.length > 0) {
                    activities.forEach(activity => {
                        moods.forEach(mood => {
                            const key = `${activity.details?.name}:${mood.details?.mood}`;
                            activityMoodMap.set(key, (activityMoodMap.get(key) || 0) + 1);
                        });
                    });
                }

                // Health & Symptoms
                if (health.length > 0 && symptoms.length > 0) {
                    health.forEach(h => {
                        symptoms.forEach(symptom => {
                            const key = `${h.details?.condition}:${symptom.details?.name}`;
                            healthSymptomMap.set(key, (healthSymptomMap.get(key) || 0) + 1);
                        });
                    });
                }

                // Health & Mood
                if (health.length > 0 && moods.length > 0) {
                    health.forEach(h => {
                        moods.forEach(mood => {
                            const key = `${h.details?.condition}:${mood.details?.mood}`;
                            healthMoodMap.set(key, (healthMoodMap.get(key) || 0) + 1);
                        });
                    });
                }

                // Nutrition & Weight
                if (nutrition.length > 0 && health.length > 0) {
                    const weightEvent = health.find(h => h.details?.type === 'weight');
                    if (weightEvent) {
                        nutrition.forEach(n => {
                            const key = n.details?.food || '';
                            const weight = weightEvent.details?.value || 0;
                            const current = nutritionWeightMap.get(key) || { count: 0, totalChange: 0 };
                            nutritionWeightMap.set(key, {
                                count: current.count + 1,
                                totalChange: current.totalChange + (weight - (current.lastWeight || weight))
                            });
                        });
                    }
                }
            });

            // Process correlation data
            const cycleSymptoms = Array.from(cycleSymptomMap.entries())
                .map(([symptom, frequency]) => ({ symptom, frequency }))
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 5);

            const sleepNutrition = Array.from(sleepNutritionMap.entries())
                .map(([food, data]) => ({
                    food,
                    avgSleepQuality: data.totalQuality / data.count
                }))
                .sort((a, b) => b.avgSleepQuality - a.avgSleepQuality)
                .slice(0, 5);

            const moodSymptoms = Array.from(moodSymptomMap.entries())
                .map(([key, frequency]) => {
                    const [mood, symptom] = key.split(':');
                    return { mood, symptom, frequency };
                })
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 5);

            const activitySleep = Array.from(activitySleepMap.entries())
                .map(([activity, data]) => ({
                    activity,
                    avgSleepQuality: data.totalQuality / data.count
                }))
                .sort((a, b) => b.avgSleepQuality - a.avgSleepQuality)
                .slice(0, 5);

            const medicationEffectiveness = Array.from(medicationEffectMap.entries())
                .map(([medication, data]) => ({
                    medication,
                    symptomReduction: data.totalReduction / data.count
                }))
                .sort((a, b) => b.symptomReduction - a.symptomReduction)
                .slice(0, 5);

            const activityMood = Array.from(activityMoodMap.entries())
                .map(([key, frequency]) => {
                    const [activity, mood] = key.split(':');
                    return { activity, mood, frequency };
                })
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 5);

            const healthSymptoms = Array.from(healthSymptomMap.entries())
                .map(([key, frequency]) => {
                    const [health, symptom] = key.split(':');
                    return { health, symptom, frequency };
                })
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 5);

            const healthMood = Array.from(healthMoodMap.entries())
                .map(([key, frequency]) => {
                    const [health, mood] = key.split(':');
                    return { health, mood, frequency };
                })
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 5);

            const nutritionWeight = Array.from(nutritionWeightMap.entries())
                .map(([food, data]) => ({
                    food,
                    weightChange: data.totalChange / data.count
                }))
                .sort((a, b) => Math.abs(b.weightChange) - Math.abs(a.weightChange))
                .slice(0, 5);

            // Calculate most tracked symptom
            const mostTrackedSymptom = Object.entries(symptomSummary)
                .sort(([, a], [, b]) => b - a)[0]?.[0] || i18n.t('COMMON.NO_DATA_YET');

            // Calculate most common mood
            const commonMoodPattern = Object.entries(moodSummary)
                .sort(([, a], [, b]) => b - a)[0]?.[0] || i18n.t('COMMON.NO_DATA_YET');

            // Calculate average sleep hours
            const averageSleepHours = sleepSummary.count > 0 ? sleepSummary.totalHours / sleepSummary.count : 0;

            // Calculate medication adherence
            const medicationAdherence = medicationCount > 0 ? medicationTakenCount / medicationCount : 0;

            // Calculate streaks
            const sortedDates = items
                .map(d => d.date.toISOString().split('T')[0])
                .sort()
                .filter((date, index, array) => array.indexOf(date) === index);

            let currentStreak = 1;
            let longestStreak = 1;
            let streak = 1;

            for (let i = 1; i < sortedDates.length; i++) {
                const prevDate = new Date(sortedDates[i - 1]);
                const currDate = new Date(sortedDates[i]);
                const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

                if (diffDays === 1) {
                    streak++;
                    if (streak > longestStreak) {
                        longestStreak = streak;
                    }
                } else {
                    streak = 1;
                }
            }

            // Calculate current streak
            const lastDate = new Date(sortedDates[sortedDates.length - 1]);
            const today = new Date();
            const diffDays = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

            if (diffDays <= 1) {
                currentStreak = streak;
            } else {
                currentStreak = 0;
            }

            // Calculate weight trend
            let weightTrend;
            if (healthMetrics.weight.length >= 2) {
                const sortedWeights = healthMetrics.weight.sort((a, b) => b.date.getTime() - a.date.getTime());
                const current = sortedWeights[0].value;
                const previous = sortedWeights[sortedWeights.length - 1].value;
                const change = current - previous;
                const period = formatDistanceToNow(sortedWeights[sortedWeights.length - 1].date);
                weightTrend = { current, change, period };
            }

            // Calculate blood pressure trend
            let bloodPressureTrend;
            if (healthMetrics.bloodPressure.length >= 2) {
                const sortedBP = healthMetrics.bloodPressure.sort((a, b) => b.date.getTime() - a.date.getTime());
                const currentSystolic = sortedBP[0].systolic;
                const currentDiastolic = sortedBP[0].diastolic;
                const previousSystolic = sortedBP[sortedBP.length - 1].systolic;
                const previousDiastolic = sortedBP[sortedBP.length - 1].diastolic;

                const avgSystolic = sortedBP.reduce((sum, bp) => sum + bp.systolic, 0) / sortedBP.length;
                const avgDiastolic = sortedBP.reduce((sum, bp) => sum + bp.diastolic, 0) / sortedBP.length;

                bloodPressureTrend = {
                    systolic: {
                        avg: avgSystolic,
                        change: currentSystolic - previousSystolic
                    },
                    diastolic: {
                        avg: avgDiastolic,
                        change: currentDiastolic - previousDiastolic
                    },
                    period: formatDistanceToNow(sortedBP[sortedBP.length - 1].date)
                };
            }

            const processedInsights: InsightsDataInput = {
                totalEntries: items.length,
                dateRange: {
                    start: items[0]?.date.toISOString() || new Date().toISOString(),
                    end: items[items.length - 1]?.date.toISOString() || new Date().toISOString(),
                },
                categories: {
                    symptoms: items.filter(d => d.type === 'symptom').length,
                    medications: items.filter(d => d.type === 'medication').length,
                    cycles: items.filter(d => d.type === 'cycle').length,
                    moods: items.filter(d => d.type === 'mood').length,
                    sleep: items.filter(d => d.type === 'sleep').length,
                    nutrition: items.filter(d => d.type === 'nutrition').length,
                    health: items.filter(d => d.type === 'health').length
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
                    lastActivity: sortedDates[sortedDates.length - 1] || new Date().toISOString(),
                },
                correlations: {
                    cycleSymptoms,
                    sleepNutrition,
                    moodSymptoms,
                    nutritionSymptoms: [], // Add if needed
                    activitySleep,
                    medicationEffectiveness,
                    activityMood,
                    healthSymptoms,
                    healthMood,
                    nutritionWeight
                }
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

        } catch (error) {
            console.error('Failed to load insights:', error);
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

    // Initial load and refresh on focus
    useEffect(() => {
        loadInsights();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadInsights();
        }, [])
    );

    if (loading || !insights) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={styles.text.color} />
                <Text style={[styles.text, styles.loadingText]}>
                    {i18n.t('ALERTS.LOADING')}
                </Text>
            </View>
        );
    }

    // Prepare data for charts
    const categoryData = {
        labels: ['Symptoms', 'Meds', 'Cycles', 'Moods', 'Sleep', 'Nutrition', 'Health'],
        datasets: [{
            data: [
                insights.categories.symptoms,
                insights.categories.medications,
                insights.categories.cycles,
                insights.categories.moods,
                insights.categories.sleep,
                insights.categories.nutrition,
                insights.categories.health
            ]
        }]
    };

    const pieData = [
        {
            name: 'Symptoms',
            population: insights.categories.symptoms,
            color: '#FF6384',
            legendFontColor: styles.text.color,
        },
        {
            name: 'Medications',
            population: insights.categories.medications,
            color: '#36A2EB',
            legendFontColor: styles.text.color,
        },
        {
            name: 'Cycles',
            population: insights.categories.cycles,
            color: '#FFCE56',
            legendFontColor: styles.text.color,
        },
        {
            name: 'Moods',
            population: insights.categories.moods,
            color: '#4BC0C0',
            legendFontColor: styles.text.color,
        },
        {
            name: 'Sleep',
            population: insights.categories.sleep,
            color: '#9966FF',
            legendFontColor: styles.text.color,
        }
    ];

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
               
                <View style={styles.card}>
                    <Text style={styles.title}>{i18n.t('INSIGHTS.OVERVIEW')}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{insights.totalEntries}</Text>
                            <Text style={styles.statLabel}>{i18n.t('INSIGHTS.TOTAL_ENTRIES')}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{insights.streaks.current}</Text>
                            <Text style={styles.statLabel}>{i18n.t('INSIGHTS.CURRENT_STREAK')}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{insights.streaks.longest}</Text>
                            <Text style={styles.statLabel}>{i18n.t('INSIGHTS.LONGEST_STREAK')}</Text>
                        </View>
                    </View>
                    <Text style={[styles.text, styles.dateRange]}>
                        {i18n.t('INSIGHTS.TRACKING_PERIOD', {
                            start: format(new Date(insights.dateRange.start), 'MMM d, yyyy'),
                            end: format(new Date(insights.dateRange.end), 'MMM d, yyyy')
                        })}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>{i18n.t('INSIGHTS.CATEGORIES')}</Text>
                    <PieChart
                        data={pieData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: styles.chartBackground.backgroundColor,
                            backgroundGradientFrom: styles.chartBackground.backgroundColor,
                            backgroundGradientTo: styles.chartBackground.backgroundColor,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: () => styles.text.color,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>{i18n.t('INSIGHTS.TRENDS')}</Text>
                    <BarChart
                        data={categoryData}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: styles.chartBackground.backgroundColor,
                            backgroundGradientFrom: styles.chartBackground.backgroundColor,
                            backgroundGradientTo: styles.chartBackground.backgroundColor,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                            labelColor: () => styles.text.color,
                            style: {
                                borderRadius: 16
                            },
                            propsForLabels: {
                                fontSize: 12,
                            }
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                    <View style={styles.trendDetails}>
                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>{i18n.t('INSIGHTS.MOST_TRACKED_SYMPTOM')}</Text>
                            <Text style={styles.trendValue}>{insights.trends.mostTrackedSymptom}</Text>
                        </View>
                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>{i18n.t('INSIGHTS.COMMON_MOOD')}</Text>
                            <Text style={styles.trendValue}>{insights.trends.commonMoodPattern}</Text>
                        </View>
                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>{i18n.t('INSIGHTS.AVG_SLEEP')}</Text>
                            <Text style={styles.trendValue}>
                                {insights.trends.averageSleepHours.toFixed(1)} {i18n.t('COMMON.HOURS')}
                            </Text>
                        </View>
                        <View style={styles.trendItem}>
                            <Text style={styles.trendLabel}>{i18n.t('INSIGHTS.MED_ADHERENCE')}</Text>
                            <Text style={[styles.trendValue, styles.adherenceValue]}>
                                {(insights.trends.medicationAdherence * 100).toFixed(0)}%
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>{i18n.t('INSIGHTS.CORRELATIONS.TITLE')}</Text>
                    <View style={styles.correlationsGrid}>
                        {insights.correlations.cycleSymptoms.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>🔄 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.CYCLE_HEADER')}
                                </Text>
                                {insights.correlations.cycleSymptoms.map((correlation, index) => (
                                    <View key={`cycle-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.symptom}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.CYCLE_SYMPTOMS', {
                                                symptom: correlation.symptom,
                                                frequency: correlation.frequency
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.sleepNutrition.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>😴 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.SLEEP_HEADER')}
                                </Text>
                                {insights.correlations.sleepNutrition.map((correlation, index) => (
                                    <View key={`sleep-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.food}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.SLEEP_NUTRITION', {
                                                food: correlation.food,
                                                quality: (correlation.avgSleepQuality * 100).toFixed(0)
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.moodSymptoms.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>😊 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.MOOD_HEADER')}
                                </Text>
                                {insights.correlations.moodSymptoms.map((correlation, index) => (
                                    <View key={`mood-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.mood}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.MOOD_SYMPTOMS', {
                                                mood: correlation.mood,
                                                symptom: correlation.symptom,
                                                frequency: correlation.frequency
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.activitySleep.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>🏃‍♀️ </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.ACTIVITY_SLEEP_HEADER')}
                                </Text>
                                {insights.correlations.activitySleep.map((correlation, index) => (
                                    <View key={`activity-sleep-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.activity}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.ACTIVITY_SLEEP', {
                                                activity: correlation.activity,
                                                quality: (correlation.avgSleepQuality * 100).toFixed(0)
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.medicationEffectiveness.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>💊 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.MEDICATION_HEADER')}
                                </Text>
                                {insights.correlations.medicationEffectiveness.map((correlation, index) => (
                                    <View key={`medication-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.medication}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.MEDICATION_EFFECT', {
                                                medication: correlation.medication,
                                                reduction: (correlation.symptomReduction * 100).toFixed(0)
                                            })}
                                        </Text>
                                        <View style={styles.effectivenessBar}>
                                            <View 
                                                style={[
                                                    styles.effectivenessFill,
                                                    { width: `${Math.floor((correlation.symptomReduction * 100))}%` as any }
                                                ]} 
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.activityMood.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>🎯 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.ACTIVITY_MOOD_HEADER')}
                                </Text>
                                {insights.correlations.activityMood.map((correlation, index) => (
                                    <View key={`activity-mood-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.activity}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.ACTIVITY_MOOD', {
                                                activity: correlation.activity,
                                                mood: correlation.mood,
                                                frequency: correlation.frequency
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.healthSymptoms.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>🏥 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.HEALTH_SYMPTOMS_HEADER')}
                                </Text>
                                {insights.correlations.healthSymptoms.map((correlation, index) => (
                                    <View key={`health-symptom-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.health}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.HEALTH_SYMPTOMS', {
                                                condition: correlation.health,
                                                symptom: correlation.symptom,
                                                frequency: correlation.frequency
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.healthMood.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>🫀 </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.HEALTH_MOOD_HEADER')}
                                </Text>
                                {insights.correlations.healthMood.map((correlation, index) => (
                                    <View key={`health-mood-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.health}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.HEALTH_MOOD', {
                                                condition: correlation.health,
                                                mood: correlation.mood,
                                                frequency: correlation.frequency
                                            })}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {insights.correlations.nutritionWeight.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.cardHeader}>
                                    <Text style={styles.correlationIcon}>⚖️ </Text>
                                    {i18n.t('INSIGHTS.CORRELATIONS.WEIGHT_NUTRITION_HEADER')}
                                </Text>
                                {insights.correlations.nutritionWeight.map((correlation, index) => (
                                    <View key={`weight-nutrition-${index}`} style={styles.card}>
                                        <Text style={styles.text}>{correlation.food}</Text>
                                        <Text style={styles.correlationValue}>
                                            {i18n.t('INSIGHTS.CORRELATIONS.WEIGHT_NUTRITION', {
                                                food: correlation.food,
                                                change: correlation.weightChange.toFixed(1)
                                            })}
                                        </Text>
                                        <View style={styles.weightChangeIndicator}>
                                            <Text style={[
                                                styles.weightChangeValue,
                                                correlation.weightChange > 0 ? styles.increase : styles.decrease
                                            ]}>
                                                {correlation.weightChange > 0 ? '↑' : '↓'} {Math.abs(correlation.weightChange).toFixed(1)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {(insights.trends.weightTrend || insights.trends.bloodPressureTrend) && (
                    <View style={styles.card}>
                        <Text style={styles.title}>{i18n.t('INSIGHTS.HEALTH_METRICS.TITLE')}</Text>
                        {insights.trends.weightTrend && (
                            <View style={styles.card}>
                                <Text style={styles.title}>
                                    {i18n.t('INSIGHTS.HEALTH_METRICS.WEIGHT_CURRENT', {
                                        weight: insights.trends.weightTrend.current.toFixed(1)
                                    })}
                                </Text>
                                <Text style={[
                                    styles.cardHeader,
                                    insights.trends.weightTrend.change > 0 ? styles.increase : styles.decrease
                                ]}>
                                    {insights.trends.weightTrend.change > 0 ? '+' : ''}
                                    {insights.trends.weightTrend.change.toFixed(1)}
                                    {i18n.t('INSIGHTS.HEALTH_METRICS.WEIGHT_CHANGE', {
                                        period: insights.trends.weightTrend.period
                                    })}
                                </Text>
                            </View>
                        )}

                        {insights.trends.bloodPressureTrend && (
                            <View style={styles.card}>
                                <Text style={styles.title}>
                                    {i18n.t('INSIGHTS.HEALTH_METRICS.BP_AVERAGE', {
                                        systolic: Math.round(insights.trends.bloodPressureTrend.systolic.avg),
                                        diastolic: Math.round(insights.trends.bloodPressureTrend.diastolic.avg)
                                    })}
                                </Text>
                                <Text style={styles.text}>
                                    {i18n.t('INSIGHTS.HEALTH_METRICS.BP_CHANGE', {
                                        period: insights.trends.bloodPressureTrend.period
                                    })}
                                </Text>
                                <View style={styles.bpChanges}>
                                    <Text style={[
                                        styles.bpChange,
                                        insights.trends.bloodPressureTrend.systolic.change > 0 ? styles.increase : styles.decrease
                                    ]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.BP_SYSTOLIC', {
                                            change: insights.trends.bloodPressureTrend.systolic.change > 0 ?
                                                `+${Math.round(insights.trends.bloodPressureTrend.systolic.change)}` :
                                                Math.round(insights.trends.bloodPressureTrend.systolic.change)
                                        })}
                                    </Text>
                                    <Text style={[
                                        styles.bpChange,
                                        insights.trends.bloodPressureTrend.diastolic.change > 0 ? styles.increase : styles.decrease
                                    ]}>
                                        {i18n.t('INSIGHTS.HEALTH_METRICS.BP_DIASTOLIC', {
                                            change: insights.trends.bloodPressureTrend.diastolic.change > 0 ?
                                                `+${Math.round(insights.trends.bloodPressureTrend.diastolic.change)}` :
                                                Math.round(insights.trends.bloodPressureTrend.diastolic.change)
                                        })}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={exportData}
                    >
                        <Text style={styles.buttonText}>
                            {i18n.t('SETTINGS.DATA_MANAGEMENT.EXPORT_DATA')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={handleDeleteAllEntries}
                    >
                        <Text style={styles.buttonText}>
                            {i18n.t('ALERTS.CONFIRM.DELETE_ALL')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
} 
    
    
    */}