import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  streak: number;
  onPress?: () => void;
};

export default function StreakButton({ streak, onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const fireRotateValue = useRef(new Animated.Value(0)).current;

  // Determine theme by streak level
  const getStreakTheme = () => {
    if (streak >= 30) {
      return {
        fireColor: "#FF3030",
        gradientColors: ["#FF6B6B", "#FF3030"],
        shadowColor: "#FF3030",
        bgColor: "#FFE5E5",
      };
    } else if (streak >= 15) {
      return {
        fireColor: "#FF8500",
        gradientColors: ["#FF9500", "#FF8500"],
        shadowColor: "#FF8500",
        bgColor: "#FFF0E5",
      };
    } else if (streak >= 7) {
      return {
        fireColor: "#FF9F0A",
        gradientColors: ["#FFCC02", "#FF9F0A"],
        shadowColor: "#FF9F0A",
        bgColor: "#FFF8E5",
      };
    } else {
      return {
        fireColor: "#FFB800",
        gradientColors: ["#FFD60A", "#FFB800"],
        shadowColor: "#FFB800",
        bgColor: "#FFFAE5",
      };
    }
  };

  const theme = getStreakTheme();

  // Multiple animations based on streak levels
  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    // Basic pulse for streaks 7+
    if (streak >= 7) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      animations.push(pulseAnimation);
    }

    // Glow effect for streaks 15+
    if (streak >= 15) {
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      animations.push(glowAnimation);
    }


    // Fire icon rotation for streaks 50+
    if (streak >= 50) {
      const fireRotateAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(fireRotateValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fireRotateValue, {
            toValue: -1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fireRotateValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      animations.push(fireRotateAnimation);
    }

    // Bounce effect for streaks 100+
    if (streak >= 100) {
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1.08,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 0.98,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
        ])
      );
      animations.push(bounceAnimation);
    }

    // Start all animations
    animations.forEach(animation => animation.start());

    // Cleanup
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [streak]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.button}
      onPress={handlePress}
    >
      <Animated.View 
        style={[
          styles.streakView, 
          {
            backgroundColor: theme.bgColor,
            shadowColor: theme.shadowColor,
            opacity: glowValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8],
            }),
            transform: [
              { scale: scaleValue },
              { scale: streak >= 7 ? pulseValue : 1 },
              { scale: streak >= 100 ? bounceValue : 1 }
            ]
          }
        ]}
      >
        {/* Fire Icon in Corner */}
        <Animated.View 
          style={[
            styles.fireCorner, 
            { 
              backgroundColor: theme.gradientColors[0],
              transform: [{
                rotate: streak >= 50 ? fireRotateValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ['-15deg', '0deg', '15deg'],
                }) : '0deg'
              }]
            }
          ]}
        >
          <FontAwesome5
            name="fire"
            size={16}
            color={theme.fireColor}
            style={styles.fireIcon}
          />
        </Animated.View>
        
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>Day{streak !== 1 ? 's' : ''}</Text>
        </View>
        
        {/* Decorative Elements */}
        <Animated.View 
          style={[
            styles.decorativeDot, 
            { 
              backgroundColor: theme.gradientColors[1],
              opacity: glowValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            }
          ]} 
        />
        
        {/* Extra glow effect for high streaks */}
        {streak >= 15 && (
          <Animated.View 
            style={[
              styles.glowRing,
              {
                borderColor: theme.shadowColor,
                opacity: glowValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
                transform: [{
                  scale: glowValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  })
                }]
              }
            ]}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
  },
  streakView: {
    width: 85,
    height: 85,
    borderRadius: 20,
    position: "relative",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.outline + "20",
  },
  fireCorner: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: "white",
  },
  fireIcon: {
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 4,
  },
  streakNumber: {
    fontSize: 26,
    fontFamily: Fonts.display.bold,
    color: Colors.primary,
    lineHeight: 30,
    textAlign: "center",
  },
  streakLabel: {
    fontSize: 10,
    fontFamily: Fonts.text.regular,
    color: Colors.tertiary,
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  decorativeDot: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  glowRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    borderWidth: 2,
  },
});
