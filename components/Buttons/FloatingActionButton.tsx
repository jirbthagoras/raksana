import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: string;
  label?: string;
  style?: any;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'camera',
  label = 'Scan',
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/scan');
    }
  };

  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 500, damping: 15, stiffness: 150 }}
      style={[styles.container, style]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.secondary, Colors.tertiary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 name={icon} size={20} color="white" />
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Shadow/Glow Effect */}
      <View style={styles.shadow} />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 35, // Above the tab bar (typically 80-90px height)
    right: 20,
    zIndex: 1000,
  },
  button: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
    minWidth: 56,
    height: 56,
  },
  label: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: 'white',
  },
  shadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    opacity: 0.2,
    zIndex: -1,
  },
});
