import { Colors, Fonts } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function MemoryButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const lensRotation = useRef(new Animated.Value(0)).current;
  const shutterScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
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

    // Lens rotation animation
    const lensAnimation = () => {
      Animated.timing(lensRotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        lensRotation.setValue(0);
        lensAnimation();
      });
    };
    lensAnimation();
  }, []);

  const lensRotationInterpolate = lensRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePress = () => {
    // Camera snap animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Shutter animation
      Animated.parallel([
        // Flash effect
        Animated.sequence([
          Animated.timing(flashOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(flashOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Shutter scale
        Animated.sequence([
          Animated.timing(shutterScale, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(shutterScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        // Scale back to normal
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onPress?.();
  };

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

        {/* Flash effect */}
        <Animated.View
          style={[
            styles.flashEffect,
            {
              opacity: flashOpacity,
            },
          ]}
        />

        {/* Camera Icon */}
        <View style={styles.cameraContainer}>
          {/* Camera body */}
          <View style={styles.cameraBody}>
            <LinearGradient
              colors={[Colors.tertiary, Colors.secondary]}
              style={styles.bodyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Camera lens */}
            <View style={styles.lensOuter}>
              <Animated.View
                style={[
                  styles.lensInner,
                  {
                    transform: [{ rotate: lensRotationInterpolate }],
                  },
                ]}
              >
                <View style={styles.lensCenter}>
                  <Animated.View
                    style={[
                      styles.shutter,
                      {
                        transform: [{ scale: shutterScale }],
                      },
                    ]}
                  />
                </View>
              </Animated.View>
            </View>

            {/* Camera flash */}
            <View style={styles.cameraFlash} />
            
            {/* Camera viewfinder */}
            <View style={styles.viewfinder} />
          </View>
        </View>

        <Text style={styles.title}>Album</Text>
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
    top: 8,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 45,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    opacity: 0.2,
  },
  flashEffect: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  cameraContainer: {
    position: 'relative',
    width: 56,
    height: 42,
    marginBottom: 8,
  },
  cameraBody: {
    width: 56,
    height: 42,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bodyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
  },
  lensOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.outline + "60",
  },
  lensInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary + "40",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + "60",
  },
  lensCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cameraFlash: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 6,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.outline + "40",
  },
  viewfinder: {
    position: 'absolute',
    top: 4,
    left: 6,
    width: 8,
    height: 6,
    backgroundColor: Colors.outline + "20",
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.outline + "40",
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
