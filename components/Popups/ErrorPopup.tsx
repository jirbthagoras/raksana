import { Colors, Fonts } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorPopupProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
}

const { width } = Dimensions.get('window');

export function ErrorPopup({ 
  visible, 
  title = 'Error', 
  message, 
  onClose, 
  type = 'error' 
}: ErrorPopupProps) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const glowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Icon pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation for icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconName = () => {
    switch (type) {
      case 'warning': return 'warning-outline';
      case 'info': return 'information-circle-outline';
      default: return 'alert-circle-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning': return Colors.error;
      case 'info': return Colors.primary;
      default: return Colors.primary;
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (type) {
      case 'warning': return [Colors.error + '20', Colors.error + '10'];
      case 'info': return [Colors.primary + '20', Colors.secondary + '10'];
      default: return [Colors.primary + '20', Colors.secondary + '10'];
    }
  };

  const getButtonGradient = (): [string, string] => {
    switch (type) {
      case 'warning': return [Colors.error, Colors.error + 'CC'];
      case 'info': return [Colors.primary, Colors.secondary];
      default: return [Colors.primary, Colors.secondary];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}
      supportedOrientations={['portrait']}
      presentationStyle="overFullScreen"
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeValue,
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ scale: scaleValue }],
            }
          ]}
        >
          <LinearGradient
            colors={[Colors.background, Colors.surface]}
            style={styles.popup}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <Animated.View 
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: pulseValue }],
                  }
                ]}
              >
                <LinearGradient
                  colors={getGradientColors()}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View
                    style={[
                      styles.iconGlow,
                      {
                        opacity: glowValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 0.8],
                        }),
                      }
                    ]}
                  />
                  <Ionicons 
                    name={getIconName()} 
                    size={32} 
                    color={getIconColor()} 
                  />
                </LinearGradient>
              </Animated.View>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{message}</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={onClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getButtonGradient()}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: width - 40,
    maxWidth: 340,
  },
  popup: {
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '40',
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.display.bold,
    color: Colors.onBackground,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 28,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.display.regular,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.display.medium,
    color: Colors.onPrimary,
  },
});
