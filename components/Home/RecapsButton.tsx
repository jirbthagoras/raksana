import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function RecapsButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const chartAnimation = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2800,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Chart animation
    const chartAnim = () => {
      Animated.sequence([
        Animated.timing(chartAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(chartAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => chartAnim());
    };
    chartAnim();

    // Sparkle animation
    const sparkleAnim = () => {
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => sparkleAnim(), 1500);
      });
    };
    sparkleAnim();
  }, []);

  const handlePress = () => {
    // Data visualization animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Pop back with data effect
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 250,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const chartScale = chartAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.1],
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

        {/* Recap Chart Icon */}
        <View style={styles.recapContainer}>
          {/* Chart background */}
          <View style={styles.chartBackground}>
            <LinearGradient
              colors={[Colors.primary + '20', Colors.secondary + '20']}
              style={styles.chartGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Chart bars */}
            <View style={styles.chartBars}>
              <Animated.View 
                style={[
                  styles.chartBar, 
                  styles.bar1,
                  { transform: [{ scaleY: chartScale }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.chartBar, 
                  styles.bar2,
                  { transform: [{ scaleY: chartAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1.2],
                  }) }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.chartBar, 
                  styles.bar3,
                  { transform: [{ scaleY: chartAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1.0],
                  }) }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.chartBar, 
                  styles.bar4,
                  { transform: [{ scaleY: chartAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.3],
                  }) }] }
                ]} 
              />
            </View>

            {/* Chart trend line */}
            <View style={styles.trendLine} />
          </View>

          {/* Data sparkles */}
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle1,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={5} color={Colors.primary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle2,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={4} color={Colors.secondary} />
          </Animated.View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Recaps</Text>
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
    shadowColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    opacity: 0.2,
    zIndex: -1,
  },
  recapContainer: {
    position: 'relative',
    width: 50,
    height: 38,
    marginBottom: 8,
  },
  chartBackground: {
    width: 44,
    height: 32,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  chartGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
  },
  chartBars: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    height: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  chartBar: {
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  bar1: {
    height: 12,
    backgroundColor: Colors.primary,
  },
  bar2: {
    height: 16,
    backgroundColor: Colors.secondary,
  },
  bar3: {
    height: 10,
    backgroundColor: Colors.tertiary,
  },
  bar4: {
    height: 18,
    backgroundColor: Colors.primary,
  },
  trendLine: {
    position: 'absolute',
    top: 8,
    left: 6,
    right: 6,
    height: 1,
    backgroundColor: Colors.secondary + '60',
    transform: [{ rotate: '15deg' }],
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 5,
    right: 8,
    zIndex: 2,
  },
  sparkle2: {
    bottom: 8,
    left: 6,
    zIndex: 2,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
