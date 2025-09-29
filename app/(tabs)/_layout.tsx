import { Colors, Fonts } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom animated tab icon component
const AnimatedTabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
  const scaleValue = React.useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const opacityValue = React.useRef(new Animated.Value(focused ? 1 : 0.7)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1 : 0.9,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        focused && styles.activeIconContainer,
        {
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
      ]}
    >
      <Ionicons
        name={focused ? name : `${name}-outline` as any}
        size={24}
        color={focused ? Colors.primary : color}
      />
    </Animated.View>
  );
};

// Simple Floating QR button component
const FloatingQRButton = ({ focused }: { focused: boolean }) => {
  return (
    <View style={styles.floatingButtonContainer}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={[styles.floatingButton, focused && styles.floatingButtonFocused]}
      >
        <Ionicons
          name="qr-code"
          size={28}
          color="white"
        />
      </LinearGradient>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant + '70',
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 10 : 8),
          paddingTop: 12, // Reduced to make tab bar shorter
          paddingHorizontal: Math.max(insets.left, 16),
          paddingRight: Math.max(insets.right, 16),
          height: 70 + Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 12), // Reduced height
          position: 'absolute',
          bottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 10),
          left: 16,
          right: 16,
          elevation: 0,
          shadowColor: 'transparent',
          borderRadius: 28,
          marginHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.text.bold,
          fontSize: 10, // Reduced font size
          marginTop: 2,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          paddingHorizontal: 4, // Reduced horizontal padding
          borderRadius: 16,
          marginHorizontal: 3, // Reduced margin
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0, // Allow shrinking
        },
        tabBarBackground: () => (
          <View style={styles.tabBarContainer}>
            <View style={styles.tabBarBackground} />
            <View style={styles.tabBarBorder} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="packet"
        options={{
          title: 'Habit',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="folder" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <FloatingQRButton focused={focused} />
          ),
          tabBarItemStyle: {
            ...styles.floatingTabItem,
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="compass" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Yard',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="person" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.outline + '25',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: Colors.primaryContainer + '40',
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonFocused: {
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  floatingTabItem: {
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 0,
    height: 60, // Reduced height for more compact tab bar
  },
});
