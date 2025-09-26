import { Colors, Fonts } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const getContainerColor = () => {
    switch (type) {
      case 'warning': return Colors.errorContainer;
      case 'info': return Colors.primaryContainer || `${Colors.primary}20`; // Use primaryContainer or primary with opacity
      default: return Colors.primaryContainer || `${Colors.primary}20`;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
      supportedOrientations={['portrait']}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.popup}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: getContainerColor() }]}>
                <Ionicons 
                  name={getIconName()} 
                  size={32} 
                  color={getIconColor()} 
                />
              </View>
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
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    width: width - 40,
    maxWidth: 340,
  },
  popup: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.display.bold,
    color: Colors.onBackground,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.display.regular,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.display.medium,
    color: Colors.onPrimary,
  },
});
