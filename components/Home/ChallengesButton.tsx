import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function ChallengesButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const trophyBounce = useRef(new Animated.Value(0)).current;
  const lightningPulse = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2400,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Trophy bounce animation
    const trophyAnimation = () => {
      Animated.sequence([
        Animated.timing(trophyBounce, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(trophyBounce, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => trophyAnimation(), 1200);
      });
    };
    trophyAnimation();

    // Lightning pulse animation
    const lightningAnimation = () => {
      Animated.sequence([
        Animated.timing(lightningPulse, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(lightningPulse, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => lightningAnimation(), 2000);
      });
    };
    lightningAnimation();

    // Sparkle animation
    const sparkleAnim = () => {
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => sparkleAnim(), 1800);
      });
    };
    sparkleAnim();
  }, []);

  const handlePress = () => {
    // Challenge accepted animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Victory bounce
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 280,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const trophyTranslate = trophyBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const lightningScale = lightningPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
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

        {/* Challenge Icon */}
        <View style={styles.challengeContainer}>
          {/* Trophy base */}
          <Animated.View
            style={[
              styles.trophyBase,
              {
                transform: [{ translateY: trophyTranslate }],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.secondary, Colors.primary]}
              style={styles.trophyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Trophy cup */}
            <View style={styles.trophyCup}>
              <View style={styles.trophyHandle1} />
              <View style={styles.trophyHandle2} />
              <View style={styles.trophyCenter}>
                <FontAwesome5 name="star" size={8} color="white" />
              </View>
            </View>
            
            {/* Trophy base */}
            <View style={styles.trophyStand} />
          </Animated.View>

          {/* Lightning bolt */}
          <Animated.View
            style={[
              styles.lightningBolt,
              {
                transform: [{ scale: lightningScale }],
              },
            ]}
          >
            <FontAwesome5 name="bolt" size={10} color={Colors.secondary} />
          </Animated.View>

          {/* Achievement sparkles */}
          <Animated.View
            style={[
              styles.sparkle1,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={4} color={Colors.primary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle2,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={5} color={Colors.secondary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle3,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={3} color={Colors.tertiary} />
          </Animated.View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Challenges</Text>
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
    shadowColor: Colors.secondary,
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
    backgroundColor: Colors.secondary,
    opacity: 0.2,
    zIndex: -1,
  },
  challengeContainer: {
    position: 'relative',
    width: 50,
    height: 38,
    marginBottom: 8,
  },
  trophyBase: {
    width: 40,
    height: 30,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  trophyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
  },
  trophyCup: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyHandle1: {
    position: 'absolute',
    left: -2,
    top: '30%',
    width: 4,
    height: 8,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  trophyHandle2: {
    position: 'absolute',
    right: -2,
    top: '30%',
    width: 4,
    height: 8,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  trophyCenter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyStand: {
    position: 'absolute',
    bottom: -2,
    left: '25%',
    right: '25%',
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  lightningBolt: {
    position: 'absolute',
    top: -1,
    right: 2,
    zIndex: 2,
  },
  sparkle1: {
    position: 'absolute',
    top: 3,
    left: 4,
    zIndex: 2,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    zIndex: 2,
  },
  sparkle3: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
