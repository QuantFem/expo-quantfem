import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import Svg, { Circle, Line, Ellipse, Path } from 'react-native-svg';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function NotFoundScreen() {
  // Animation for floating effect
  const floating = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const floatingStyle = {
    transform: [{ translateY: floating }],
  };

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: 5000,
        useNativeDriver: false,
      })
    ).start();
  }, [rotation]);

  const rotatingStyle = {
    transform: [{ rotate: rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      }) }],
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Uh Oh!' }} />
      <View style={styles.container}>
        {/* Goofy Animated Shape */}
        <Animated.View style={[styles.illustration, floatingStyle]}>
          <Svg height="180" width="200" viewBox="0 0 200 200">
            {/* Planet */}
            <Circle cx="100" cy="120" r="40" fill="#001AD6" />
            <Ellipse cx="100" cy="125" rx="50" ry="15" fill="rgba(0,0,0,0.2)" />
            {/* Satellite */}
            <Animated.View style={rotatingStyle}>
              <Line x1="60" y1="80" x2="140" y2="80" stroke="#FDCB6E" strokeWidth="3" />
              <Circle cx="60" cy="80" r="5" fill="#FDCB6E" />
              <Circle cx="140" cy="80" r="5" fill="#FDCB6E" />
            </Animated.View>
            {/* Stars */}
            <Circle cx="20" cy="30" r="3" fill="#FFD700" />
            <Circle cx="180" cy="50" r="3" fill="#FFD700" />
            <Circle cx="50" cy="170" r="2" fill="#FFD700" />
            {/* Goofy Antenna */}
            <Path d="M50 50 Q 75 25, 100 50 T 150 50" stroke="#001AD6" fill="transparent" strokeWidth="4" strokeLinecap="round" />
          </Svg>
        </Animated.View>

        {/* Goofy Error Message */}
        <Text style={styles.title}>Whoopsie! Looks like we took a wrong turn. 🤪</Text>

        {/* Go Home Button */}
        <TouchableOpacity style={styles.button}>
          <Link href="/" style={styles.link}>
            <Text style={styles.buttonText}>Back to Safety! 🚀</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F0FA',
    padding: 20,
  },
  illustration: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#001AD6', // Specified Blue
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#001AD6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#001AD6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'none',
  },
});
