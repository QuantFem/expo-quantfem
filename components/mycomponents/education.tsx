import useThemedStyles from "@/components/hooks/useThemedStyles";
import {useRouter} from "expo-router";
import React from "react";
import {View,Text,ScrollView,TouchableOpacity,Linking} from "react-native";


const stages=[
  {title: "Cycle Awareness",description: "Understanding hormonal changes and menstrual cycles."},
  {title: "Puberty",description: "Hormonal changes begin, leading to menstruation and body development."},
  {title: "Menarche",description: "First period, marking the start of the reproductive years."},
  {title: "Fertility",description: "Peak reproductive years, ovulation, and menstrual cycle regulation."},
  {title: "Pregnancy",description: "The phase of carrying a child, hormonal shifts, and body changes."},
  {title: "Postpartum",description: "Recovery after childbirth, hormonal shifts, and body adjustments."},
  {title: "Perimenopause",description: "Transition phase before menopause, with hormonal fluctuations."},
  {title: "Menopause",description: "The official end of menstruation (12 months without a period)."},
  {title: "Postmenopause",description: "Life after menopause, focusing on health and well-being."},
  {title: "Aging",description: "Later years with a focus on bone, heart, and cognitive health."},
];

export default function Educate() {
  const router=useRouter();
  const styles=useThemedStyles(); // ✅ Automatically gets updated styles

  const openWebsite=() => {
    Linking.openURL("https://quantfem.com");
  };

  return (
    <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]} 
        onPress={() => router.push("/history")}
      >
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]} 
        onPress={() => router.push("/reports")}
      >
        <Text style={styles.buttonText}>Share Data</Text>
      </TouchableOpacity>
    </View>
  
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {stages.map((stage, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardHeader}>{stage.title}</Text>
          <Text style={styles.text}>{stage.description}</Text>
        </View>
      ))}
  
      <TouchableOpacity onPress={openWebsite} style={[styles.button]}>
        <Text style={styles.buttonText}>Learn More at QuantFem</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
  
  );
}


