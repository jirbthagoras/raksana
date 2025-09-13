import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type Props = {
  level: number;
  points: number;
  currentExp: number;
  neededExp: number;
};

export default function LevelBar({ level, points, currentExp, neededExp }: Props) {
  const progress = Math.min(currentExp / neededExp, 1);
  const progressPercentage = Math.round(progress * 100);

  // Animated value for smooth transition
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Scale animation on mount
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Progress animation
    Animated.timing(animValue, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const getLevelIcon = () => {
    if (level >= 20) return "crown";
    if (level >= 10) return "medal";
    if (level >= 5) return "star";
    return "seedling";
  };

  const getNextLevelExp = () => {
    return neededExp - currentExp;
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.levelIconContainer}>
          <FontAwesome5 
            name={getLevelIcon()} 
            size={14} 
            color={Colors.primary} 
          />
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.levelText}>Lv.{level}</Text>
          <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
        </View>
      </View>

      {/* Compact Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[StyleSheet.absoluteFill, { width }]}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary, "#4CAF50"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[StyleSheet.absoluteFill, styles.progressGradient]}
            />
          </Animated.View>
        </View>
        <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
      </View>

      {/* Compact XP Info */}
      <Text style={styles.expText}>
        {currentExp} / {neededExp} XP
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 250,
    height: 85,
    padding: 12,
    borderRadius: 16,
    backgroundColor: Colors.mainBackground,
    borderWidth: 1,
    borderColor: Colors.outline + "30",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  levelIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    flex: 1,
  },
  levelText: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 16,
  },
  pointsText: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.tertiary,
    lineHeight: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: Colors.surfaceVariant,
  },
  progressGradient: {
    borderRadius: 3,
  },
  progressPercentage: {
    fontFamily: Fonts.display.bold,
    fontSize: 9,
    color: Colors.primary,
    minWidth: 25,
    textAlign: "right",
  },
  expText: {
    fontFamily: Fonts.text.regular,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
});
