import useThemedStyles from "@/components/hooks/useThemedStyles";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Text, Image } from "react-native";
import Svg, { Circle, Path, Ellipse } from "react-native-svg";


export default function SplashScreen() {

  const styles = useThemedStyles();
  // Floating animation
  const floating = useRef(new Animated.Value(0)).current;

  // Rotation animation
  const rotation = useRef(new Animated.Value(0)).current;

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startFloatingAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floating, {
          toValue: 5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floating, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floating]);

  const startRotationAnimation = useCallback(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const startFadeAnimation = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    startFloatingAnimation();
    startRotationAnimation();
    startFadeAnimation();
  }, [startFloatingAnimation, startRotationAnimation, startFadeAnimation]);

  const floatingStyle = {
    transform: [{ translateY: floating }],
  };

  const rotatingStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, justifyContent: "center", alignItems: "center" }]}>
      <Image
        source={require('@/assets/images/transparent.png')}
        style={styles.logo}
        accessibilityLabel="App Logo"
      />

      <Animated.View style={[styles.illustration, floatingStyle]}>
        <Svg height="180" width="200" viewBox="0 0 200 200">
          <Path
            d="M60,100 Q100,40 140,100"
            stroke="#001AD6"
            strokeWidth={4}
            fill="transparent"
            strokeLinecap="round"
          />
          <Circle cx={60} cy={100} r={8} fill="#FF85A2" />
          <Circle cx={140} cy={100} r={8} fill="#FF85A2" />

          <Animated.View style={rotatingStyle}>
            <Circle cx={100} cy={70} r={30} fill="rgba(0,26,214,0.1)" />
            <Circle cx={100} cy={70} r={20} fill="#001AD6" />
          </Animated.View>

          <Ellipse cx={100} cy={170} rx={50} ry={10} fill="rgba(0,0,0,0.2)" />
        </Svg>
      </Animated.View>
      <Text style={[styles.title, { fontSize: 26 }]}>
        Menarche ➡️ Menopause </Text>

    </Animated.View>
  );
}

