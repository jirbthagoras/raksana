import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
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

interface QRScanResultPopupProps {
  visible: boolean;
  onClose: () => void;
  onScanAgain: () => void;
  type: 'treasures' | 'quest' | 'event';
  data: any;
}

const { width } = Dimensions.get('window');

export const QRScanResultPopup: React.FC<QRScanResultPopupProps> = ({
  visible,
  onClose,
  onScanAgain,
  type,
  data
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'treasures':
        return {
          icon: 'gem',
          title: 'Treasure Found!',
          color: '#FFD700',
          gradientColors: ['#FFD700', '#FFA500'] as const,
          bgGradient: ['#FFD70020', '#FFA50010'] as const,
        };
      case 'quest':
        return {
          icon: 'flag',
          title: 'Quest Contribution!',
          color: '#4CAF50',
          gradientColors: ['#4CAF50', '#2E7D32'] as const,
          bgGradient: ['#4CAF5020', '#2E7D3210'] as const,
        };
      case 'event':
        return {
          icon: 'calendar',
          title: 'Event Participation!',
          color: '#9C27B0',
          gradientColors: ['#9C27B0', '#673AB7'] as const,
          bgGradient: ['#9C27B020', '#673AB710'] as const,
        };
      default:
        return {
          icon: 'star',
          title: 'QR Scan Berhasil!',
          color: Colors.primary,
          gradientColors: [Colors.primary, Colors.secondary] as const,
          bgGradient: [Colors.primary + '20', Colors.secondary + '10'] as const,
        };
    }
  };

  const getContent = () => {
    switch (type) {
      case 'treasures':
        return {
          subtitle: `Selamat! Anda menemukan treasure "${data.treasure?.name}" dan mendapatkan ${data.treasure?.point_gain} poin!`,
          points: data.treasure?.point_gain || 0,
          itemName: data.treasure?.name || 'Unknown Treasure',
        };
      case 'quest':
        return {
          subtitle: `Terima kasih telah berkontribusi pada quest "${data.quest?.name}"!`,
          description: data.quest?.description || '',
          contributors: data.quest?.contributor || 0,
          points: data.quest?.point_gain || 0,
          itemName: data.quest?.name || 'Unknown Quest',
        };
      case 'event':
        return {
          subtitle: `Selamat! Anda telah berpartisipasi dalam event "${data.event?.name}"!`,
          description: data.event?.description || '',
          points: data.event?.point_gain || 0,
          itemName: data.event?.name || 'Unknown Event',
        };
      default:
        return {
          subtitle: data.message || 'QR code berhasil dipindai!',
          points: 0,
          itemName: 'QR Scan',
        };
    }
  };

  const config = getTypeConfig();
  const content = getContent();

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
            colors={config.bgGradient}
            style={styles.gradient}
          >
            {/* Icon */}
            <MotiView
              from={{ scale: 0, rotate: '-180deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{ type: 'spring', damping: 12, delay: 200 }}
              style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}
            >
              <FontAwesome5 
                name={config.icon} 
                size={32} 
                color={config.color} 
              />
            </MotiView>

            {/* Points Display */}
            {content.points > 0 && (
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, delay: 400 }}
                style={styles.pointsContainer}
              >
                <Text style={styles.pointsPrefix}>+</Text>
                <Text style={[styles.pointsText, { color: config.color }]}>
                  {content.points}
                </Text>
                <Text style={styles.pointsSuffix}>poin</Text>
              </MotiView>
            )}

            {/* Title */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 600 }}
            >
              <Text style={styles.title}>
                {config.title}
              </Text>
            </MotiView>

            {/* Item Name */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 700 }}
            >
              <Text style={[styles.itemName, { color: config.color }]}>
                {content.itemName}
              </Text>
            </MotiView>

            {/* Subtitle/Description */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 800 }}
            >
              <Text style={styles.subtitle}>
                {content.subtitle}
              </Text>
              {content.description && (
                <Text style={styles.description}>
                  {content.description}
                </Text>
              )}
              {type === 'quest' && content.contributors > 0 && (
                <Text style={styles.contributors}>
                  Kontributor: {content.contributors} orang
                </Text>
              )}
            </MotiView>

            {/* Decorative Stars */}
            <MotiView
              from={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 900 }}
              style={styles.starsContainer}
            >
              <FontAwesome5 name="star" size={16} color="#FFD700" style={styles.star1} />
              <FontAwesome5 name="star" size={12} color="#FFD700" style={styles.star2} />
              <FontAwesome5 name="star" size={14} color="#FFD700" style={styles.star3} />
            </MotiView>

            {/* Action Buttons */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 1000 }}
              style={styles.buttonsContainer}
            >
              <TouchableOpacity
                style={[styles.scanAgainButton]}
                onPress={onScanAgain}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="qrcode" size={16} color={Colors.primary} />
                <Text style={styles.scanAgainButtonText}>Scan Lagi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: config.color }]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>Lanjutkan</Text>
              </TouchableOpacity>
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
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  pointsPrefix: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    marginRight: 4,
  },
  pointsText: {
    fontFamily: Fonts.display.bold,
    fontSize: 48,
    lineHeight: 56,
  },
  pointsSuffix: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  contributors: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star1: {
    position: 'absolute',
    top: 60,
    right: 40,
    opacity: 0.8,
  },
  star2: {
    position: 'absolute',
    top: 120,
    left: 30,
    opacity: 0.6,
  },
  star3: {
    position: 'absolute',
    bottom: 120,
    right: 50,
    opacity: 0.7,
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
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  scanAgainButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
});
