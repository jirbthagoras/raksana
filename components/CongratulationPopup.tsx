import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

const { width } = Dimensions.get('window');

interface CongratulationPopupProps {
  visible: boolean;
  onClose: () => void;
  type: 'levelUp' | 'packetComplete' | 'unlock';
  level?: number;
  packetName?: string;
  difficulty?: string;
  zIndex?: number;
}

export const CongratulationPopup: React.FC<CongratulationPopupProps> = ({
  visible,
  onClose,
  type,
  level,
  packetName,
  difficulty,
  zIndex = 1000,
}) => {
  const isLevelUp = type === 'levelUp';
  const isPacketComplete = type === 'packetComplete';
  const isUnlock = type === 'unlock';
  
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
          <View style={[
            styles.iconContainer,
            isLevelUp ? styles.levelUpIconContainer : 
            isPacketComplete ? styles.packetCompleteIconContainer : 
            styles.unlockIconContainer
          ]}>
            <FontAwesome5 
              name={isLevelUp ? "star" : isPacketComplete ? "trophy" : "unlock-alt"} 
              size={48} 
              color={Colors.onPrimary} 
            />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>
            {isLevelUp ? 'Selamat!' : isPacketComplete ? 'Paket Selesai!' : 'Habit Terbuka!'}
          </Text>
          
          {/* Message */}
          <Text style={styles.message}>
            {isLevelUp 
              ? `Kamu naik ke level ${level}!`
              : isPacketComplete 
              ? `Kamu telah menyelesaikan paket "${packetName}"`
              : `Habit "${packetName}" berhasil dibuka!`
            }
          </Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {isLevelUp 
              ? 'Terus pertahankan konsistensimu!'
              : isPacketComplete 
              ? 'Luar biasa! Kamu semakin konsisten!'
              : `Tingkat kesulitan: ${difficulty || 'Sedang'}. Siap untuk tantangan baru?`
            }
          </Text>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Lanjutkan</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  levelUpIconContainer: {
    backgroundColor: Colors.primary,
  },
  packetCompleteIconContainer: {
    backgroundColor: Colors.secondary,
  },
  unlockIconContainer: {
    backgroundColor: '#FF6B35', // Orange color for unlock
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontFamily: Fonts.text.bold,
    fontSize: 18,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
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
