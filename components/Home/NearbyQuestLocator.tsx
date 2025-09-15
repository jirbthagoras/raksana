import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onLocatePress?: () => void;
};

export default function NearbyQuestLocator({ onLocatePress }: Props) {
  const [isActive, setIsActive] = useState(false);
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const radarAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    // Continuous radar animation
    const startRadarAnimation = () => {
      Animated.loop(
        Animated.timing(radarAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    };

    // Glow animation
    const startGlowAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startRadarAnimation();
    startGlowAnimation();
  }, []);

  const handleLocatePress = () => {
    setIsActive(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for active state
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onLocatePress?.();

    // Reset active state after animation
    setTimeout(() => setIsActive(false), 2000);
  };

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
      <LinearGradient
        colors={[Colors.surface, Colors.surfaceContainerHigh]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <Animated.View
                style={[
                  styles.radarContainer,
                  {
                    opacity: radarAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                    transform: [
                      {
                        scale: radarAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <FontAwesome5 name="map-marker-alt" size={16} color={Colors.primary} />
              </Animated.View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Nearby Quest Locator</Text>
              <Text style={styles.subtitle}>Temukan & Taklukkan</Text>
            </View>
          </View>
          <Animated.View
            style={[
              styles.statusIndicator,
              {
                opacity: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ]}
          >
          </Animated.View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.description}>
            Dapatkan clue mengenai quest terdekat dari lokasimu. Cari lokasinya, taklukkan questnya!
          </Text>
          
          {/* Quest Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <FontAwesome5 name="compass" size={12} color={Colors.secondary} />
              <Text style={styles.statText}>5km radius</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.locateButton} 
          onPress={handleLocatePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.locateButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Animated.View
              style={[
                styles.locateButtonContent,
                { transform: [{ scale: pulseValue }] },
              ]}
            >
              <FontAwesome5 
                name={"search-location"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.locateButtonText}>
                {'Locate Quests'}
              </Text>
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <Animated.View
            style={[
              styles.decorativeDot,
              {
                opacity: radarAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.2, 0.8, 0.2],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.decorativeDot,
              {
                opacity: radarAnimation.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0.8, 0.2, 0.8, 0.2],
                }),
              },
            ]}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline + "20",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: 'relative',
  },
  radarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    marginBottom: 20,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceContainer,
    padding: 12,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
  },
  locateButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  locateButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  locateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  locateButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: "white",
  },
  decorativeElements: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  decorativeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
