import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function RecyclopediaButton({ onPress }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const bookFlip = useRef(new Animated.Value(0)).current;
  const leafFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle glow animation
    const glowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2600,
          useNativeDriver: true,
        }),
      ]).start(() => glowAnimation());
    };
    glowAnimation();

    // Book flip animation
    const flipAnimation = () => {
      Animated.sequence([
        Animated.timing(bookFlip, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bookFlip, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => flipAnimation(), 2000);
      });
    };
    flipAnimation();

    // Leaf floating animation
    const floatAnimation = () => {
      Animated.sequence([
        Animated.timing(leafFloat, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(leafFloat, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => floatAnimation());
    };
    floatAnimation();
  }, []);

  const handlePress = () => {
    // Knowledge discovery animation
    Animated.sequence([
      // Press down
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Pop back with enlightenment
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 200,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const bookRotation = bookFlip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  const leafTranslate = leafFloat.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -4, 0],
  });

  const leafRotation = leafFloat.interpolate({
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
            styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Recyclopedia Icon */}
        <View style={styles.encyclopediaContainer}>
          {/* Book base */}
          <Animated.View
            style={[
              styles.bookBase,
              {
                transform: [{ rotateY: bookRotation }],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.tertiary, Colors.primary]}
              style={styles.bookGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Book spine */}
            <View style={styles.bookSpine} />
            
            {/* Recycle symbol on cover */}
            <View style={styles.recycleSymbol}>
              <FontAwesome5 name="recycle" size={16} color="white" />
            </View>
            
            {/* Book pages */}
            <View style={styles.bookPages}>
              <View style={styles.pageLines}>
                <View style={styles.pageLine} />
                <View style={styles.pageLine} />
                <View style={styles.pageLine} />
              </View>
            </View>
          </Animated.View>

          {/* Floating leaf */}
          <Animated.View
            style={[
              styles.floatingLeaf,
              {
                transform: [
                  { translateY: leafTranslate },
                  { rotate: leafRotation },
                ],
              },
            ]}
          >
            <FontAwesome5 name="leaf" size={8} color={Colors.tertiary} />
          </Animated.View>

          {/* Knowledge sparkles */}
          <View style={styles.sparkle1}>
            <FontAwesome5 name="star" size={4} color={Colors.secondary} />
          </View>
          <View style={styles.sparkle2}>
            <FontAwesome5 name="star" size={5} color={Colors.tertiary} />
          </View>
        </View>

        {/* Title below */}
        <Text style={styles.title}>Greenprints</Text>
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
    marginLeft: -30,
    width: 60,
    height: 45,
    borderRadius: 30,
    backgroundColor: Colors.tertiary,
    opacity: 0.2,
  },
  encyclopediaContainer: {
    position: 'relative',
    width: 50,
    height: 38,
    marginBottom: 8,
  },
  bookBase: {
    width: 40,
    height: 30,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.tertiary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bookGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
  },
  bookSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primary + '80',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  recycleSymbol: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookPages: {
    position: 'absolute',
    right: 2,
    top: 3,
    bottom: 3,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageLines: {
    width: '80%',
    gap: 2,
  },
  pageLine: {
    height: 1,
    backgroundColor: Colors.outline + '40',
    borderRadius: 0.5,
  },
  floatingLeaf: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  sparkle1: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: 'center',
  },
});
