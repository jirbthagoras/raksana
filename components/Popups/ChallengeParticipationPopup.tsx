import React, { useEffect, useRef } from 'react';
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
import { MotiView, MotiText } from 'moti';
import { Colors, Fonts } from '@/constants';

interface ChallengeParticipationPopupProps {
  visible: boolean;
  onClose: () => void;
  challengeName: string;
  points: number;
  difficulty: string;
  day: number;
}

const { width } = Dimensions.get('window');

export const ChallengeParticipationPopup: React.FC<ChallengeParticipationPopupProps> = ({
  visible,
  onClose,
  challengeName,
  points,
  difficulty,
  day,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Pulse animation for trophy
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Sparkle animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'mudah':
        return '#4CAF50';
      case 'sedang':
        return '#FF9800';
      case 'sulit':
        return '#F44336';
      default:
        return Colors.secondary;
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty.toLowerCase()) {
      case 'mudah':
        return 'leaf';
      case 'sedang':
        return 'star';
      case 'sulit':
        return 'fire';
      default:
        return 'star';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Background Sparkles */}
        <Animated.View style={[styles.sparkleContainer, { opacity: sparkleAnim }]}>
          <FontAwesome5 name="star" size={12} color="#FFD700" style={styles.sparkle1} />
          <FontAwesome5 name="star" size={8} color="#FFD700" style={styles.sparkle2} />
          <FontAwesome5 name="star" size={10} color="#FFD700" style={styles.sparkle3} />
          <FontAwesome5 name="star" size={14} color="#FFD700" style={styles.sparkle4} />
          <FontAwesome5 name="star" size={6} color="#FFD700" style={styles.sparkle5} />
          <FontAwesome5 name="star" size={16} color="#FFD700" style={styles.sparkle6} />
        </Animated.View>

        <MotiView
          from={{ scale: 0.5, opacity: 0, rotate: '-10deg' }}
          animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
          exit={{ scale: 0.5, opacity: 0, rotate: '10deg' }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          style={styles.container}
        >
          <LinearGradient
            colors={[Colors.surface, Colors.background + 'F0']}
            style={styles.gradient}
          >
            {/* Header with Trophy */}
            <MotiView
              from={{ scale: 0, rotate: '-180deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{ type: 'spring', damping: 10, delay: 300 }}
              style={styles.headerContainer}
            >
              <Animated.View style={[styles.trophyContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                  colors={['#FFD700', '#FFA000']}
                  style={styles.trophyGradient}
                >
                  <FontAwesome5 name="trophy" size={40} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>
              
              {/* Challenge Badge */}
              <MotiView
                from={{ scale: 0, translateX: 50 }}
                animate={{ scale: 1, translateX: 0 }}
                transition={{ type: 'spring', damping: 15, delay: 500 }}
                style={styles.challengeBadge}
              >
                <LinearGradient
                  colors={[getDifficultyColor() + '20', getDifficultyColor() + '10']}
                  style={styles.challengeBadgeGradient}
                >
                  <FontAwesome5 name={getDifficultyIcon()} size={12} color={getDifficultyColor()} />
                  <Text style={[styles.challengeBadgeText, { color: getDifficultyColor() }]}>
                    {difficulty.toUpperCase()}
                  </Text>
                </LinearGradient>
              </MotiView>
            </MotiView>

            {/* Success Title */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 700 }}
            >
              <Text style={styles.successTitle}>Challenge Berhasil!</Text>
            </MotiView>

            {/* Challenge Name */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 800 }}
              style={styles.challengeNameContainer}
            >
              <Text style={styles.challengeName} numberOfLines={2}>
                {challengeName}
              </Text>
            </MotiView>

            {/* Points Display */}
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 8, delay: 900 }}
              style={styles.pointsDisplay}
            >
              <LinearGradient
                colors={[Colors.primary + '15', Colors.secondary + '10']}
                style={styles.pointsGradient}
              >
                <FontAwesome5 name="coins" size={24} color={Colors.primary} />
                <View style={styles.pointsTextContainer}>
                  <Text style={styles.pointsPrefix}>+</Text>
                  <MotiText
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 6, delay: 1100 }}
                    style={styles.pointsValue}
                  >
                    {points}
                  </MotiText>
                  <Text style={styles.pointsSuffix}>poin</Text>
                </View>
              </LinearGradient>
            </MotiView>

            {/* Challenge Details */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 1000 }}
              style={styles.detailsContainer}
            >
              <View style={styles.detailItem}>
                <FontAwesome5 name="calendar-day" size={14} color={Colors.onSurfaceVariant} />
                <Text style={styles.detailText}>Hari {day}</Text>
              </View>
              <View style={styles.detailSeparator} />
              <View style={styles.detailItem}>
                <FontAwesome5 name="layer-group" size={14} color={getDifficultyColor()} />
                <Text style={styles.detailText}>{difficulty}</Text>
              </View>
            </MotiView>

            {/* Congratulation Message */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 1200 }}
            >
              <Text style={styles.congratsMessage}>
                Luar biasa! Anda telah berhasil berpartisipasi dalam challenge ini. 
                Terus pertahankan semangat eco-centric Anda!
              </Text>
            </MotiView>

            {/* Action Buttons */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 1400 }}
              style={styles.actionsContainer}
            >
              <TouchableOpacity
                style={styles.continueButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.secondary]}
                  style={styles.continueButtonGradient}
                >
                  <FontAwesome5 name="check" size={18} color={Colors.onPrimary} />
                  <Text style={styles.continueButtonText}>Lanjutkan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>

            {/* Floating Elements */}
            <MotiView
              from={{ scale: 0, rotate: '0deg' }}
              animate={{ scale: 1, rotate: '360deg' }}
              transition={{ type: 'timing', duration: 2000, delay: 1600, loop: true }}
              style={styles.floatingElement1}
            >
              <FontAwesome5 name="seedling" size={16} color={Colors.tertiary} />
            </MotiView>

            <MotiView
              from={{ scale: 0, rotate: '0deg' }}
              animate={{ scale: 1, rotate: '-360deg' }}
              transition={{ type: 'timing', duration: 3000, delay: 1800, loop: true }}
              style={styles.floatingElement2}
            >
              <FontAwesome5 name="leaf" size={14} color={Colors.secondary} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sparkleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle1: { position: 'absolute', top: '15%', left: '20%' },
  sparkle2: { position: 'absolute', top: '25%', right: '15%' },
  sparkle3: { position: 'absolute', top: '45%', left: '10%' },
  sparkle4: { position: 'absolute', top: '60%', right: '25%' },
  sparkle5: { position: 'absolute', top: '75%', left: '30%' },
  sparkle6: { position: 'absolute', top: '35%', right: '40%' },
  container: {
    width: width * 0.9,
    maxWidth: 420,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    elevation: 12,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  gradient: {
    padding: 32,
    borderRadius: 28,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  trophyContainer: {
    marginBottom: 16,
  },
  trophyGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  challengeBadge: {
    position: 'absolute',
    top: -8,
    right: -20,
  },
  challengeBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  challengeBadgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
  },
  successTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  challengeNameContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  challengeName: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pointsDisplay: {
    marginBottom: 20,
  },
  pointsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 12,
  },
  pointsTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsPrefix: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginRight: 4,
  },
  pointsValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 36,
    color: Colors.primary,
    lineHeight: 40,
  },
  pointsSuffix: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailSeparator: {
    width: 1,
    height: 16,
    backgroundColor: Colors.outline + '40',
    marginHorizontal: 16,
  },
  detailText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  congratsMessage: {
    fontFamily: Fonts.text.regular,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  actionsContainer: {
    width: '100%',
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  continueButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  floatingElement1: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: 60,
    right: 40,
  },
});
