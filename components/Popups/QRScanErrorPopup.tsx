import { Colors, Fonts } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import {
     Dimensions,
     Modal,
     StyleSheet,
     Text,
     TouchableOpacity,
     View,
} from 'react-native';

interface QRScanErrorPopupProps {
  visible: boolean;
  onClose: () => void;
  onScanAgain: () => void;
  error: any;
}

const { width } = Dimensions.get('window');

export const QRScanErrorPopup: React.FC<QRScanErrorPopupProps> = ({
  visible,
  onClose,
  onScanAgain,
  error
}) => {
  const getErrorMessage = () => {
    if (error?.message) {
      return error.message;
    }
    return 'Terjadi kesalahan saat memindai QR code. Silakan coba lagi.';
  };

  const getErrorTitle = () => {
    return 'Scan QR Gagal';
  };

  const getErrorIcon = () => {
    if (error?.status === 404) {
      return 'qr-code';
    } else if (error?.status === 400) {
      return 'scan';
    } else if (error?.status === 0) {
      return 'wifi';
    }
    return 'alert-circle';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.container}
        >
          <LinearGradient
            colors={['#FF525220', '#FF525210'] as const}
            style={styles.gradient}
          >
            {/* Error Icon */}
            <MotiView
              from={{ scale: 0, rotate: '-180deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{ type: 'spring', damping: 12, delay: 200 }}
              style={[styles.iconContainer, { backgroundColor: '#FF525220' }]}
            >
              <Ionicons 
                name={getErrorIcon()} 
                size={32} 
                color="#FF5252" 
              />
            </MotiView>

            {/* Title */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 400 }}
            >
              <Text style={styles.title}>
                {getErrorTitle()}
              </Text>
            </MotiView>

            {/* Error Message */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 500 }}
            >
              <Text style={styles.message}>
                {getErrorMessage()}
              </Text>
            </MotiView>

            {/* Suggestions */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 700 }}
              style={styles.suggestionsContainer}
            >
              <Text style={styles.suggestionsTitle}>Saran:</Text>
              <View style={styles.suggestionsList}>
                <View style={styles.suggestionItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                  <Text style={styles.suggestionText}>Pastikan QR code jelas dan tidak rusak</Text>
                </View>
                <View style={styles.suggestionItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                  <Text style={styles.suggestionText}>Periksa koneksi internet Anda</Text>
                </View>
                <View style={styles.suggestionItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                  <Text style={styles.suggestionText}>Coba scan QR code lain yang valid</Text>
                </View>
              </View>
            </MotiView>

            {/* Action Buttons */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 800 }}
              style={styles.buttonsContainer}
            >
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={onScanAgain}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={16} color="white" />
                <Text style={styles.scanAgainButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </MotiView>

            {/* Decorative Error Elements */}
            <MotiView
              from={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 900 }}
              style={styles.decorativeContainer}
            >
              <Ionicons name="warning" size={14} color="#FF8A80" style={styles.warning1} />
              <Ionicons name="warning" size={10} color="#FF8A80" style={styles.warning2} />
              <Ionicons name="warning" size={12} color="#FF8A80" style={styles.warning3} />
            </MotiView>
          </LinearGradient>
        </MotiView>
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
    padding: 20,
  },
  container: {
    width: width * 0.9,
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  gradient: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  errorCode: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FF525210',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  suggestionsList: {
    gap: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
  },
  scanAgainButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: 'white',
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.outline,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  warning1: {
    position: 'absolute',
    top: 60,
    right: 40,
    opacity: 0.6,
  },
  warning2: {
    position: 'absolute',
    top: 120,
    left: 30,
    opacity: 0.4,
  },
  warning3: {
    position: 'absolute',
    bottom: 120,
    right: 50,
    opacity: 0.5,
  },
});
