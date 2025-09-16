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
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const floatAnimation = useRef(new Animated.Value(0)).current;

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

    // Floating animation
    const floatAnim = () => {
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => floatAnim());
    };
    floatAnim();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 400,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.(region);
  };

  const floatTranslate = floatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
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
        {/* Background Gradient */}
        <LinearGradient
          colors={['#E8F5E8', '#F0F9F0']}
          style={styles.backgroundGradient}
        />

        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Tree Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ translateY: floatTranslate }],
            },
          ]}
        >
          <View style={styles.iconBackground}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <MaterialIcons 
              name="park" 
              size={28} 
              color="#FFFFFF" 
              style={styles.icon}
            />
          </View>
        </Animated.View>

        {/* Tree Count - Main Focus */}
        <View style={styles.treeCountContainer}>
          <Text style={styles.treeCount}>
            {region.tree_amount.toLocaleString()}
          </Text>
          <Text style={styles.treeLabel}>Trees</Text>
        </View>

        {/* Region Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.regionName} numberOfLines={1}>
            {region.name}
          </Text>
          <View style={styles.locationRow}>
            <FontAwesome5 
              name="map-marker-alt" 
              size={10} 
              color={Colors.tertiary} 
              style={styles.locationIcon}
            />
            <Text style={styles.regionLocation} numberOfLines={1}>
              {region.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 200,
    maxHeight: 150,
    marginRight: 12,
    overflow: 'hidden',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  glowEffect: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    opacity: 0.2,
  },
  iconContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
  icon: {
    zIndex: 1,
  },
  treeCountContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  treeCount: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '800',
  },
  treeLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  regionName: {
    fontFamily: Fonts.display.bold,
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  regionLocation: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.tertiary,
    textAlign: 'center',
    flex: 1,
  },
});
