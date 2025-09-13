import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function BackyardButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const leafSway = useRef(new Animated.Value(0)).current;
  const sunRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Leaf swaying animation
    const leafAnimation = () => {
      Animated.sequence([
        Animated.timing(leafSway, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(leafSway, {
          toValue: -1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(leafSway, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => leafAnimation());
    };
    leafAnimation();

    // Sun rotation animation
    const sunAnimation = () => {
      Animated.timing(sunRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }).start(() => {
        sunRotation.setValue(0);
        sunAnimation();
      });
    };
    sunAnimation();
  }, []);

  const handlePress = () => {
    // Garden growth animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Spring back with life
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 200,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const leafSwayInterpolate = leafSway.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  const sunRotationInterpolate = sunRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
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
          //   styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Garden Scene */}
        <View style={styles.gardenContainer}>
          {/* Sky background */}
          <LinearGradient
            colors={[Colors.tertiary + '40', Colors.secondary + '20']}
            style={styles.skyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Sun */}
          <Animated.View
            style={[
              styles.sun,
              {
                transform: [{ rotate: sunRotationInterpolate }],
              },
            ]}
          >
            <FontAwesome5 name="sun" size={12} color={Colors.secondary} />
          </Animated.View>

          {/* Ground */}
          <View style={styles.ground}>
            <LinearGradient
              colors={[Colors.tertiary + '60', Colors.primary + '40']}
              style={styles.groundGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </View>

          {/* Plants */}
          <View style={styles.plantsContainer}>
            {/* Tree */}
            <View style={styles.tree}>
              <View style={styles.treeTrunk} />
              <Animated.View
                style={[
                  styles.treeLeaves,
                  {
                    transform: [{ rotate: leafSwayInterpolate }],
                  },
                ]}
              >
                <FontAwesome5 name="tree" size={16} color={Colors.tertiary} />
              </Animated.View>
            </View>

            {/* Flowers */}
            <View style={styles.flowersContainer}>
              <FontAwesome5 name="seedling" size={10} color={Colors.tertiary} style={styles.flower1} />
              <FontAwesome5 name="leaf" size={8} color={Colors.primary} style={styles.flower2} />
              <FontAwesome5 name="seedling" size={6} color={Colors.secondary} style={styles.flower3} />
            </View>
          </View>

          {/* Fence */}
          <View style={styles.fence}>
            <View style={styles.fencePost} />
            <View style={styles.fencePost} />
            <View style={styles.fencePost} />
            <View style={styles.fenceRail} />
          </View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Backyards</Text>
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
    shadowColor: Colors.tertiary,
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
    marginLeft: -40,
    width: 80,
    height: 50,
    borderRadius: 40,
    backgroundColor: Colors.tertiary,
    opacity: 0.2,
  },
  gardenContainer: {
    position: 'relative',
    width: 60,
    height: 45,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  skyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sun: {
    position: 'absolute',
    top: 4,
    right: 6,
    zIndex: 2,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  groundGradient: {
    flex: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  plantsContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 1,
  },
  tree: {
    position: 'absolute',
    left: 8,
    bottom: 0,
    alignItems: 'center',
  },
  treeTrunk: {
    width: 2,
    height: 6,
    backgroundColor: Colors.primary + '80',
    borderRadius: 1,
    marginBottom: -1,
  },
  treeLeaves: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowersContainer: {
    position: 'absolute',
    bottom: 0,
    right: 6,
    flexDirection: 'row',
    gap: 3,
    alignItems: 'flex-end',
  },
  flower1: {
    marginBottom: 2,
  },
  flower2: {
    marginBottom: 4,
  },
  flower3: {
    marginBottom: 1,
  },
  fence: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    width: 20,
    height: 12,
  },
  fencePost: {
    position: 'absolute',
    width: 1.5,
    height: 10,
    backgroundColor: Colors.outline + '60',
    borderRadius: 0.75,
  },
  fenceRail: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.outline + '60',
    borderRadius: 0.5,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
