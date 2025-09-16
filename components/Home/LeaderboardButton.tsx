import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function LeaderboardButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const trophyFloat = useRef(new Animated.Value(0)).current;
  const crownFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2600,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Trophy floating animation
    const floatAnimation = () => {
      Animated.sequence([
        Animated.timing(trophyFloat, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(trophyFloat, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => floatAnimation());
    };
    floatAnimation();

    // Crown floating animation (offset timing)
    const crownAnimation = () => {
      Animated.sequence([
        Animated.timing(crownFloat, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(crownFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => crownAnimation(), 1000);
      });
    };
    crownAnimation();
  }, []);

  const handlePress = () => {
    // Victory celebration animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Pop back with triumph
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 200,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const trophyTranslate = trophyFloat.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -3, 0],
  });

  const crownTranslate = crownFloat.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -2, 0],
  });

  const crownRotation = crownFloat.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
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

        {/* Leaderboard Icon */}
        <View style={styles.leaderboardContainer}>
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
              colors={['#FFD700', '#FFA500']}
              style={styles.trophyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Trophy cup */}
            <View style={styles.trophyCup}>
              <FontAwesome5 name="trophy" size={18} color="white" />
            </View>
            
            {/* Trophy handles */}
            <View style={styles.trophyHandleLeft} />
            <View style={styles.trophyHandleRight} />
            
            {/* Trophy base stand */}
            <View style={styles.trophyStand} />
          </Animated.View>

          {/* Floating crown */}
          <Animated.View
            style={[
              styles.floatingCrown,
              {
                transform: [
                  { translateY: crownTranslate },
                  { rotate: crownRotation },
                ],
              },
            ]}
          >
            <FontAwesome5 name="crown" size={8} color={Colors.secondary} />
          </Animated.View>

          {/* Ranking numbers */}
          <View style={styles.rankNumber1}>
            <Text style={styles.rankText}>1</Text>
          </View>
          <View style={styles.rankNumber2}>
            <Text style={styles.rankText}>2</Text>
          </View>
          <View style={styles.rankNumber3}>
            <Text style={styles.rankText}>3</Text>
          </View>

          {/* Victory sparkles */}
          <View style={styles.sparkle1}>
            <FontAwesome5 name="star" size={4} color="#FFD700" />
          </View>
          <View style={styles.sparkle2}>
            <FontAwesome5 name="star" size={5} color="#FFA500" />
          </View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Leaderboard</Text>
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
    shadowColor: '#FFD700',
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
    top: 8,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 45,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    opacity: 0.2,
  },
  leaderboardContainer: {
    position: 'relative',
    width: 50,
    height: 38,
    marginBottom: 8,
  },
  trophyBase: {
    width: 36,
    height: 28,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#FFD700',
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -9,
    marginLeft: -9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyHandleLeft: {
    position: 'absolute',
    left: -2,
    top: 8,
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#B8860B',
  },
  trophyHandleRight: {
    position: 'absolute',
    right: -2,
    top: 8,
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#B8860B',
  },
  trophyStand: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#B8860B',
  },
  floatingCrown: {
    position: 'absolute',
    top: -4,
    right: -2,
  },
  rankNumber1: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber2: {
    position: 'absolute',
    top: 8,
    left: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber3: {
    position: 'absolute',
    bottom: 2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CD7F32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 4,
    fontWeight: 'bold',
    color: 'white',
  },
  sparkle1: {
    position: 'absolute',
    top: 0,
    left: 8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 0,
    right: 8,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'center',
  },
});
