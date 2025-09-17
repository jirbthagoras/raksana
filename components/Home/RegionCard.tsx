import { Colors, Fonts } from "@/constants";
import { Region } from "@/types/auth";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  region: Region;
  onPress?: (region: Region) => void;
};

export default function RegionCard({ region, onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const floatAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Floating animation
    const floatAnim = () => {
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]).start(() => floatAnim());
    };
    floatAnim();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress?.(region);
  };

  const floatTranslate = floatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }], opacity: fadeValue }]}>
      {/* Glow effect */}
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={[Colors.primary + '20', 'transparent']}
          style={styles.glow}
        />
      </Animated.View>
      
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {/* Header with Icon */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ translateY: floatTranslate }],
                },
              ]}
            >
              <View style={styles.iconBackground}>
                <MaterialIcons 
                  name="park" 
                  size={20} 
                  color={Colors.primary} 
                />
              </View>
            </Animated.View>
            <Text style={styles.regionName} numberOfLines={1}>
              {region.name}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <FontAwesome5 
              name="map-marker-alt" 
              size={12} 
              color={Colors.onSurfaceVariant} 
              style={styles.locationIcon}
            />
            <Text style={styles.regionLocation} numberOfLines={1}>
              {region.location}
            </Text>
          </View>

          {/* Tree Count - Main Focus */}
          <View style={styles.treeCountContainer}>
            <Text style={styles.treeCount}>
              {region.tree_amount?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.treeLabel}>Trees Planted</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    position: "relative",
    marginRight: 12,
  },
  glowContainer: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    zIndex: -1,
  },
  glow: {
    flex: 1,
    borderRadius: 24,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.primary + "10",
    minHeight: 140,
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  iconBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  regionName: {
    fontSize: 14,
    fontFamily: Fonts.display.bold,
    color: Colors.onSurface,
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 6,
  },
  regionLocation: {
    fontSize: 12,
    fontFamily: Fonts.display.medium,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  treeCountContainer: {
    alignItems: "center",
  },
  treeCount: {
    fontSize: 20,
    fontFamily: Fonts.display.bold,
    color: Colors.primary,
    textAlign: "center",
  },
  treeLabel: {
    fontSize: 11,
    fontFamily: Fonts.display.medium,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: 2,
  },
});
