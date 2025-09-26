import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { apiService } from "../../services/api";

interface ChallengeData {
  id: number;
  day: number;
  difficulty: "easy" | "medium" | "hard";
  name: string;
  description: string;
  point_gain: number;
  participants: number;
}

type Props = {
  onPress?: () => void;
};

export default function WeeklyChallenge({ onPress }: Props) {
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const expandAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    if (challengeData) {
      // Initial entrance animation
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing animation for reward
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [challengeData]);

  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDailyChallenge();
      setChallengeData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch daily challenge');
      console.error('Error fetching daily challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to album/create with challenge parameters
    if (challengeData) {
      router.push({
        pathname: '/album/create',
        params: {
          challengeMode: 'true',
          challengeId: challengeData.id.toString(),
          challengeName: challengeData.name,
          challengeDifficulty: challengeData.difficulty,
          challengeDay: challengeData.day.toString(),
          challengePoints: challengeData.point_gain.toString()
        }
      });
    }
    
    onPress?.();
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.spring(expandAnimation, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const progressPercentage = challengeData ? Math.round((challengeData.day / 7) * 100) : 0;
  
  const getDifficultyColor = () => {
    if (!challengeData) return Colors.primary;
    switch (challengeData.difficulty) {
      case 'easy': return Colors.tertiary;
      case 'medium': return Colors.secondary;
      case 'hard': return Colors.error;
      default: return Colors.primary;
    }
  };
  
  const getDifficultyIcon = () => {
    if (!challengeData) return 'star';
    switch (challengeData.difficulty) {
      case 'easy': return 'leaf';
      case 'medium': return 'mountain';
      case 'hard': return 'fire';
      default: return 'star';
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.loadingCard]}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error || !challengeData) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorText}>{error || 'No challenge available'}</Text>
          <TouchableOpacity onPress={fetchDailyChallenge} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
          opacity: fadeValue,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handlePress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={[Colors.surface, Colors.surfaceContainerHigh]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Compact Header - Always Visible */}
          <TouchableOpacity onPress={toggleExpanded} style={styles.compactHeader}>
            <View style={styles.compactLeft}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() + '20' }]}>
                <FontAwesome5 name={getDifficultyIcon()} size={12} color={getDifficultyColor()} />
              </View>
              <Text style={styles.compactTitle}>Daily Challenge</Text>
            </View>
            <View style={styles.compactRight}>
              <Animated.View
                style={[
                  styles.compactReward,
                  { transform: [{ scale: pulseValue }] },
                ]}
              >
                <FontAwesome5 name="coins" size={10} color={Colors.secondary} />
                <Text style={styles.compactRewardText}>+{challengeData.point_gain}</Text>
              </Animated.View>
              <FontAwesome5 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={12} 
                color={Colors.secondary} 
              />
            </View>
          </TouchableOpacity>

          {/* Expandable Content */}
          <Animated.View
            style={[
              styles.expandableContent,
              {
                maxHeight: expandAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 400],
                }),
                opacity: expandAnimation.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ]}
          >
            {/* Full Header with difficulty and reward */}
            <View style={styles.header}>
              <View style={styles.leftHeader}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() + '20' }]}>
                  <FontAwesome5 name={getDifficultyIcon()} size={14} color={getDifficultyColor()} />
                  <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                    {challengeData.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.dayText}>Hari {challengeData.day}</Text>
              </View>
              <Animated.View
                style={[
                  styles.rewardBadge,
                  { transform: [{ scale: pulseValue }] },
                ]}
              >
                <LinearGradient
                  colors={[Colors.secondary, Colors.tertiary]}
                  style={styles.rewardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <FontAwesome5 name="coins" size={12} color="white" />
                  <Text style={styles.rewardText}>+{challengeData.point_gain}</Text>
                </LinearGradient>
              </Animated.View>
            </View>

            {/* Challenge content */}
            <View style={styles.content}>
              <Text style={styles.challengeLabel}>Challenge</Text>
              <Text style={styles.title}>{challengeData.name}</Text>
              <Text style={styles.description}>{challengeData.description}</Text>
            </View>

            {/* Progress section */}
            <View style={styles.progressSection}>
              {/* Participants and day counter */}
              <View style={styles.daysCounter}>
                <View style={styles.streakIndicator}>
                  <FontAwesome5 name="users" size={12} color={Colors.primary} />
                  <Text style={styles.streakText}>{challengeData.participants}</Text>
                </View>
              </View>
            </View>

            {/* Action button */}
            <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
              <LinearGradient
                colors={[Colors.primary + '20', Colors.secondary + '20']}
                style={styles.actionButtonGradient}
              >
                <FontAwesome5 name="play" size={12} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Participate</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  touchable: {
    borderRadius: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + "20",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardBadge: {
    borderRadius: 16,
    overflow: "hidden",
  },
  rewardGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rewardText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: "white",
  },
  content: {
    marginBottom: 20,
  },
  challengeLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  progressPercentage: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.secondary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.outline + "30",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 4,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.outline + "40",
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  daysCounter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  daysText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.secondary,
  },
  streakIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.error,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  compactReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compactRewardText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.secondary,
  },
  expandableContent: {
    overflow: 'hidden',
    marginTop: 8,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 60,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  errorCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 60,
  },
  errorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
});
