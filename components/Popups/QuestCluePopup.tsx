import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface QuestCluePopupProps {
  visible: boolean;
  onClose: () => void;
  clue: string;
  zIndex?: number;
}

export const QuestCluePopup: React.FC<QuestCluePopupProps> = ({
  visible,
  onClose,
  clue,
  zIndex = 1000,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { zIndex }]}>
        <View style={styles.popup}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <FontAwesome5 
              name="map-marked-alt" 
              size={48} 
              color={Colors.onPrimary} 
            />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>
            Clue ditemukan!
          </Text>
          
          {/* Clue Message */}
          <View style={styles.clueContainer}>
            <Text style={styles.clueText}>"{clue}"</Text>
          </View>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Manfaatkan clue ini untuk mencari quest!
          </Text>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Mengerti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 20,
  },
  clueContainer: {
    backgroundColor: Colors.primaryContainer,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  clueLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clueText: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 120,
  },
  closeButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
    textAlign: 'center',
  },
});
