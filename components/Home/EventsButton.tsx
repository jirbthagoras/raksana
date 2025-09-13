import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function EventsButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const starRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Star rotation animation
    const starAnimation = () => {
      Animated.timing(starRotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        starRotation.setValue(0);
        starAnimation();
      });
    };
    starAnimation();
  }, []);

  const handlePress = () => {
    // Event celebration animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Bounce back with celebration
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 300,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const starRotationInterpolate = starRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.touchable}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Event Icon */}
        <View style={styles.eventContainer}>
          {/* Calendar base */}
          <View style={styles.calendar}>
            <LinearGradient
              colors={[Colors.tertiary, Colors.secondary]}
              style={styles.calendarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Calendar header */}
            <View style={styles.calendarHeader}>
              <View style={styles.calendarRing} />
              <View style={styles.calendarRing} />
            </View>
            
            {/* Calendar content */}
            <View style={styles.calendarContent}>
              <View style={styles.calendarRow}>
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
              </View>
              <View style={styles.calendarRow}>
                <View style={styles.calendarDot} />
                <View style={[styles.calendarDot, styles.calendarDotActive]} />
                <View style={styles.calendarDot} />
              </View>
            </View>
          </View>

          {/* Floating star */}
          <Animated.View
            style={[
              styles.floatingStar,
              {
                transform: [{ rotate: starRotationInterpolate }],
              },
            ]}
          >
            <FontAwesome5 name="star" size={12} color={Colors.secondary} />
          </Animated.View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Events</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: Colors.tertiary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 100,
    maxHeight: 110,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  glowEffect: {
    position: 'absolute',
    top: 6,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 50,
    borderRadius: 35,
    backgroundColor: Colors.tertiary,
    opacity: 0.2,
    zIndex: -1,
  },
  eventContainer: {
    position: 'relative',
    width: 50,
    height: 38,
    marginBottom: 8,
  },
  calendar: {
    width: 44,
    height: 32,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.tertiary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  calendarRing: {
    width: 4,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  calendarContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  calendarDotActive: {
    backgroundColor: Colors.primary,
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  floatingStar: {
    position: 'absolute',
    top: 2,
    right: 4,
    zIndex: 2,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
