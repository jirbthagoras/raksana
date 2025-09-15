import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  level: number;
  currentExp: number;
  neededExp: number;
};

export default function LevelBar({ level, currentExp, neededExp }: Props) {
  // For journey-like experience where progress resets each level
  // We'll use modulo to get the experience within the current level
  // This assumes neededExp represents the experience required per level
  const expInCurrentLevel = currentExp % neededExp;
  const progress = Math.min(expInCurrentLevel / neededExp, 1);
  const progressPercentage = Math.round(progress * 100);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animate progress when it changes
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);

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
    <MotiView 
      style={styles.container}
      from={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 150,
      }}
    >
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
        </View>
      </View>

      {/* Compact Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <MotiView 
            style={[StyleSheet.absoluteFill, styles.progressGradient]}
            from={{ width: '0%' }}
            animate={{ width: `${animatedProgress * 100}%` }}
            transition={{
              type: 'timing',
              duration: 800,
            }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary, "#4CAF50"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </MotiView>
        </View>
        <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
      </View>

      {/* Compact XP Info */}
      <Text style={styles.expText}>
        {expInCurrentLevel} / {neededExp} XP
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    minHeight: 85,
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
  multiplierText: {
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
