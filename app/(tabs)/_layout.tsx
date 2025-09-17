import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.outline + '30',
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 10 : 8),
          paddingTop: 8,
          paddingHorizontal: Math.max(insets.left, 20),
          paddingRight: Math.max(insets.right, 20),
          height: 60 + Math.max(insets.bottom, Platform.OS === 'ios' ? 25 : 15),
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 12,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          borderRadius: 0,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.display.medium,
          fontSize: 12,
          marginTop: 4,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 12,
          marginHorizontal: 2,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceContainerLowest]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="packet"
        options={{
          title: 'Packet',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "folder" : "folder-outline"} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Tersimpan',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "bookmark" : "bookmark-outline"} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
