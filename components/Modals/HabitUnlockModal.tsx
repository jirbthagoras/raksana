import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface HabitUnlockModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HabitUnlockModal: React.FC<HabitUnlockModalProps> = ({
  visible,
  onClose,
}) => {
  const unlockRequirements = [
    {
      difficulty: 'Mudah',
      difficultyKey: 'easy',
      color: '#4CAF50',
      icon: 'leaf',
      requirements: 'Habit mudah terbuka secara otomatis',
      completionRate: 'Tidak ada syarat khusus',
      streak: 'Tidak ada syarat streak',
      description: 'Habit dengan tingkat kesulitan mudah dapat langsung diakses tanpa persyaratan tambahan.'
    },
    {
      difficulty: 'Sedang',
      difficultyKey: 'normal',
      color: '#FF9800',
      icon: 'star',
      requirements: 'Completion Rate ≥ 50% + Streak ≥ 3 hari',
      completionRate: '≥ 50%',
      streak: '≥ 3 hari berturut-turut',
      description: 'Untuk membuka habit sedang, kamu perlu menunjukkan konsistensi dengan tingkat penyelesaian minimal 50% dan streak 3 hari berturut-turut.'
    },
    {
      difficulty: 'Sulit',
      difficultyKey: 'hard',
      color: '#F44336',
      icon: 'fire',
      requirements: 'Completion Rate ≥ 70% + Streak ≥ 5 hari',
      completionRate: '≥ 70%',
      streak: '≥ 5 hari berturut-turut',
      description: 'Habit sulit membutuhkan dedikasi tinggi dengan tingkat penyelesaian minimal 70% dan streak 5 hari berturut-turut.'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <FontAwesome5 name="unlock-alt" size={32} color={Colors.onPrimary} />
            </View>
            <Text style={styles.title}>Ketentuan Unlock Habit</Text>
            <Text style={styles.subtitle}>
              Setiap habit memiliki persyaratan berbeda untuk dapat dibuka berdasarkan tingkat kesulitannya
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

            {unlockRequirements.map((requirement, index) => (
              <View key={requirement.difficultyKey} style={styles.requirementCard}>
                <View style={styles.requirementHeader}>
                  <View style={[styles.difficultyIcon, { backgroundColor: requirement.color }]}>
                    <FontAwesome5 name={requirement.icon} size={20} color={Colors.onPrimary} />
                  </View>
                  <View style={styles.requirementTitleContainer}>
                    <Text style={styles.difficultyTitle}>{requirement.difficulty}</Text>
                    <Text style={styles.requirementSummary}>{requirement.requirements}</Text>
                  </View>
                </View>

                <Text style={styles.requirementDescription}>
                  {requirement.description}
                </Text>

                {requirement.difficultyKey !== 'easy' && (
                  <View style={styles.requirementDetails}>
                    <View style={styles.requirementRow}>
                      <FontAwesome5 name="percentage" size={14} color={requirement.color} />
                      <Text style={styles.requirementLabel}>Completion Rate:</Text>
                      <Text style={[styles.requirementValue, { color: requirement.color }]}>{requirement.completionRate}</Text>
                    </View>
                    <View style={styles.requirementRow}>
                      <FontAwesome5 name="calendar-check" size={14} color={requirement.color} />
                      <Text style={styles.requirementLabel}>Streak:</Text>
                      <Text style={[styles.requirementValue, { color: requirement.color }]}>{requirement.streak}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <View style={styles.tipsHeader}>
                <FontAwesome5 name="lightbulb" size={18} color={Colors.onPrimary} />
                <Text style={styles.tipsTitle}>Tips Unlock Habit</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Konsisten menyelesaikan tugas harian</Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Jaga streak dengan tidak melewatkan hari</Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Fokus pada completion rate yang tinggi</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Mengerti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    width: width - 40,
    maxWidth: 400,
    maxHeight: '85%',
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onBackground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 24,
  },
  requirementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  requirementTitleContainer: {
    flex: 1,
  },
  difficultyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  requirementSummary: {
    fontFamily: Fonts.text.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  requirementDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
  },
  requirementDetails: {
    gap: 12,
    backgroundColor: Colors.surfaceVariant + '30',
    padding: 12,
    borderRadius: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  requirementValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
  },
  tipsSection: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onPrimary,
    flex: 1,
    lineHeight: 18,
  },
  closeModalButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 24,
  },
  closeModalButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
});
