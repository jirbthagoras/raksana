import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants';

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
          paddingTop: 12,
          paddingHorizontal: Math.max(insets.left, 24),
          paddingRight: Math.max(insets.right, 24),
          height: 70 + Math.max(insets.bottom, Platform.OS === 'ios' ? 25 : 15),
          position: 'absolute',
          bottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 10),
          left: 24,
          right: 24,
          elevation: 0,
          shadowColor: 'transparent',
          borderRadius: 28,
          marginHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.text.bold,
          fontSize: 11,
          marginTop: 4,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 6,
          borderRadius: 18,
          marginHorizontal: 6,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
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
          title: 'Beranda',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="packet"
        options={{
          title: 'Packets',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="folder" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Tersimpan',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon name="bookmark" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
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
});
