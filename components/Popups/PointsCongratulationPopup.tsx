import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Colors, Fonts } from '@/constants';

interface PointsCongratulationPopupProps {
  visible: boolean;
  onClose: () => void;
  points: number;
  title?: string;
  subtitle?: string;
  activityName?: string;
  activityType?: 'challenge' | 'task' | 'memory' | 'general';
}

const { width } = Dimensions.get('window');

export const PointsCongratulationPopup: React.FC<PointsCongratulationPopupProps> = ({
  visible,
  onClose,
  points,
  title,
  subtitle,
  activityName,
  activityType = 'general'
}) => {
  const getActivityIcon = () => {
    switch (activityType) {
      case 'challenge':
        return 'trophy';
      case 'task':
        return 'tasks';
      case 'memory':
        return 'camera';
      default:
        return 'star';
    }
  };

  const getActivityColor = () => {
    switch (activityType) {
      case 'challenge':
        return Colors.primary;
      case 'task':
        return Colors.secondary;
      case 'memory':
        return Colors.tertiary;
      default:
        return Colors.primary;
    }
  };

  const getDefaultTitle = () => {
    switch (activityType) {
      case 'challenge':
        return 'Challenge Berhasil!';
      case 'task':
        return 'Task Selesai!';
      case 'memory':
        return 'Memory Tersimpan!';
      default:
        return 'Selamat!';
    }
  };

  const getDefaultSubtitle = () => {
    if (activityName) {
      switch (activityType) {
        case 'challenge':
          return `Anda berhasil berpartisipasi dalam challenge "${activityName}"`;
        case 'task':
          return `Anda berhasil menyelesaikan task "${activityName}"`;
        case 'memory':
          return `Memory "${activityName}" berhasil disimpan`;
        default:
          return `Aktivitas "${activityName}" berhasil diselesaikan`;
      }
    }
    return 'Anda telah menyelesaikan aktivitas dengan baik!';
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
            colors={[getActivityColor() + '10', getActivityColor() + '05']}
            style={styles.gradient}
          >
            {/* Celebration Icon */}
            <MotiView
              from={{ scale: 0, rotate: '-180deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{ type: 'spring', damping: 12, delay: 200 }}
              style={[styles.iconContainer, { backgroundColor: getActivityColor() + '20' }]}
            >
              <FontAwesome5 
                name={getActivityIcon()} 
                size={32} 
                color={getActivityColor()} 
              />
            </MotiView>

            {/* Points Display */}
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 400 }}
              style={styles.pointsContainer}
            >
              <Text style={styles.pointsPrefix}>+</Text>
              <Text style={[styles.pointsText, { color: getActivityColor() }]}>
                {points}
              </Text>
              <Text style={styles.pointsSuffix}>poin</Text>
            </MotiView>

            {/* Title */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 600 }}
            >
              <Text style={styles.title}>
                {title || getDefaultTitle()}
              </Text>
            </MotiView>

            {/* Subtitle */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 700 }}
            >
              <Text style={styles.subtitle}>
                {subtitle || getDefaultSubtitle()}
              </Text>
            </MotiView>

            {/* Decorative Stars */}
            <MotiView
              from={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 800 }}
              style={styles.starsContainer}
            >
              <FontAwesome5 name="star" size={16} color="#FFD700" style={styles.star1} />
              <FontAwesome5 name="star" size={12} color="#FFD700" style={styles.star2} />
              <FontAwesome5 name="star" size={14} color="#FFD700" style={styles.star3} />
            </MotiView>

            {/* Close Button */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 900 }}
            >
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: getActivityColor() }]}
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
    width: width * 0.85,
    maxWidth: 400,
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
    marginBottom: 20,
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
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
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
  closeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 140,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
});
