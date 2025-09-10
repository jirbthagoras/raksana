import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface AnimatedLogoProps {
  size?: number;
  style?: any;
}

export default function AnimatedLogo({ size = 200, style }: AnimatedLogoProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance animation
    const entranceAnimation = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Start entrance animation first, then pulse
    entranceAnimation.start(() => {
      pulseAnimation.start();
    });

    return () => {
      entranceAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            width: size,
            height: size,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.Image
          source={require('../assets/images/raksana.png')}
          style={[
            styles.image,
            {
              width: size,
              height: size,
            },
          ]}
          resizeMode="contain"
        />
        
        {/* Eco-friendly glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              width: size * 1.2,
              height: size * 1.2,
              opacity: Animated.multiply(opacityAnim, 0.3),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    borderRadius: 20,
  },
  glowEffect: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#006A64',
    shadowColor: '#006A64',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
});
