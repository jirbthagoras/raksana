import { Colors } from '@/constants';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FloatingElementsProps {
  count?: number;
}

export default function FloatingElements({ count = 6 }: FloatingElementsProps) {
  const animations = useRef(
    Array.from({ length: count }, () => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.3),
      scale: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    const createFloatingAnimation = (index: number) => {
      const { translateY, opacity, scale } = animations[index];
      
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -30,
              duration: 3000 + index * 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1.2,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 3000 + index * 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const animationInstances = animations.map((_, index) => 
      createFloatingAnimation(index)
    );

    animationInstances.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 800);
    });

    return () => {
      animationInstances.forEach(animation => animation.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      {animations.map((animation, index) => (
        <Animated.View
          key={index}
          style={[
            styles.element,
            {
              left: (index * width) / count + (width / count) * 0.2,
              top: height * 0.1 + (index % 3) * 100,
              backgroundColor: index % 3 === 0 ? Colors.primary : 
                             index % 3 === 1 ? Colors.secondary : Colors.tertiary,
              transform: [
                { translateY: animation.translateY },
                { scale: animation.scale },
              ],
              opacity: animation.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  element: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
