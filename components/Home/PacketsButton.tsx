import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function PacketsButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const floatAnimation = useRef(new Animated.Value(0)).current;
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

    // Sparkle animation
    const sparkleAnim = () => {
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => sparkleAnim(), 1000);
      });
    };
    sparkleAnim();
  }, []);

  const handlePress = () => {
    // Package opening animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Pop back with excitement
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 400,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
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
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Package Icon */}
        <Animated.View
          style={[
            styles.packageContainer,
            {
              transform: [{ translateY: floatTranslate }],
            },
          ]}
        >
          {/* Package box */}
          <View style={styles.packageBox}>
            <LinearGradient
              colors={[Colors.error + '80', Colors.tertiary + '80']}
              style={styles.boxGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Package ribbon */}
            <View style={styles.ribbon} />
            <View style={[styles.ribbon, styles.ribbonVertical]} />
            
            {/* Package bow */}
            <View style={styles.bow}>
              <View style={styles.bowLeft} />
              <View style={styles.bowRight} />
              <View style={styles.bowCenter} />
            </View>
          </View>

          {/* Sparkles */}
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle1,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={6} color={Colors.secondary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle2,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={4} color={Colors.tertiary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle3,
              { opacity: sparkleOpacity },
            ]}
          >
            <FontAwesome5 name="star" size={5} color={Colors.error} />
          </Animated.View>
        </Animated.View>

        {/* Title below */}
        <Text style={styles.title}>Packets</Text>
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
    shadowColor: Colors.error,
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
    backgroundColor: Colors.error,
    opacity: 0.2,
  },
  packageContainer: {
    position: 'relative',
    width: 48,
    height: 36,
    marginBottom: 8,
  },
  packageBox: {
    width: 40,
    height: 28,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  boxGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
  },
  ribbon: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: Colors.primary,
    top: '50%',
    marginTop: -2,
  },
  ribbonVertical: {
    width: 4,
    height: '100%',
    left: '50%',
    marginLeft: -2,
    top: 0,
    marginTop: 0,
  },
  bow: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 8,
  },
  bowLeft: {
    position: 'absolute',
    width: 5,
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    left: 0,
    top: 1,
    transform: [{ rotate: '-15deg' }],
  },
  bowRight: {
    position: 'absolute',
    width: 5,
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    right: 0,
    top: 1,
    transform: [{ rotate: '15deg' }],
  },
  bowCenter: {
    position: 'absolute',
    width: 3,
    height: 4,
    backgroundColor: Colors.secondary,
    borderRadius: 1.5,
    left: '50%',
    marginLeft: -1.5,
    top: 2,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 2,
    right: 4,
  },
  sparkle2: {
    bottom: 8,
    left: 2,
  },
  sparkle3: {
    top: 8,
    left: -2,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
