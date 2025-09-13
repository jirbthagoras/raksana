import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function JournalButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const bookRotation = useRef(new Animated.Value(0)).current;
  const pageRotation = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();
  }, []);

  const handlePress = () => {
    // Book opening animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Book opens
      Animated.parallel([
        Animated.timing(bookRotation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pageRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Book closes
      Animated.parallel([
        Animated.timing(bookRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pageRotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onPress?.();
  };

  const bookRotationInterpolate = bookRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-15deg'],
  });

  const pageRotationInterpolate = pageRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
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

        {/* Book Icon */}
        <View style={styles.bookContainer}>
          {/* Book spine */}
          <Animated.View
            style={[
              styles.bookSpine,
              {
                transform: [{ rotateY: bookRotationInterpolate }],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.spineGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Book pages */}
          <Animated.View
            style={[
              styles.bookPages,
              {
                transform: [{ rotateY: pageRotationInterpolate }],
              },
            ]}
          >
            <View style={styles.pagesContent}>
              <View style={styles.pageLine} />
              <View style={styles.pageLine} />
              <View style={styles.pageLine} />
              <View style={styles.pageLine} />
            </View>
          </Animated.View>

          {/* Book cover */}
          <View style={styles.bookCover}>
            <FontAwesome5 name="feather-alt" size={20} color={Colors.primary} />
          </View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Journal</Text>
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
    shadowColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  bookContainer: {
    position: 'relative',
    width: 50,
    height: 38,
    marginBottom: 8,
  },
  bookSpine: {
    position: 'absolute',
    width: 44,
    height: 32,
    borderRadius: 3,
    overflow: 'hidden',
  },
  spineGradient: {
    flex: 1,
    borderRadius: 3,
  },
  bookPages: {
    position: 'absolute',
    right: 0,
    width: 38,
    height: 29,
    backgroundColor: 'white',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.outline + "40",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pagesContent: {
    width: '75%',
    gap: 2,
  },
  pageLine: {
    height: 1.5,
    backgroundColor: Colors.outline + "50",
    borderRadius: 0.5,
  },
  bookCover: {
    position: 'absolute',
    width: 44,
    height: 32,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary + "40",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
