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
import { Colors, Fonts } from '../constants';
import { MonthlyRecap, WeeklyRecap } from '../types/auth';

const { width } = Dimensions.get('window');

interface RecapDetailModalProps {
  visible: boolean;
  onClose: () => void;
  recap: WeeklyRecap | MonthlyRecap | null;
  type: 'weekly' | 'monthly';
}

export const RecapDetailModal: React.FC<RecapDetailModalProps> = ({
  visible,
  onClose,
  recap,
  type,
}) => {
  if (!recap) return null;

  const isWeekly = type === 'weekly';
  const weeklyRecap = isWeekly ? recap as WeeklyRecap : null;
  const monthlyRecap = !isWeekly ? recap as MonthlyRecap : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const getGrowthRatingColor = (rating: string) => {
    const numRating = parseInt(rating);
    if (numRating >= 4) return Colors.secondary;
    if (numRating >= 3) return Colors.primary;
    if (numRating >= 2) return '#FF9800';
    return '#F44336';
  };

  const getGrowthRatingIcon = (rating: string) => {
    const numRating = parseInt(rating);
    if (numRating >= 4) return 'star';
    if (numRating >= 3) return 'thumbs-up';
    if (numRating >= 2) return 'meh';
    return 'thumbs-down';
  };

  const getCompletionRateColor = (rate: string) => {
    const numRate = parseFloat(rate.replace('%', ''));
    if (numRate >= 80) return Colors.secondary;
    if (numRate >= 60) return Colors.primary;
    if (numRate >= 40) return '#FF9800';
    return '#F44336';
  };

  const getRatingDescription = (rating: string) => {
    const numRating = parseInt(rating);
    if (numRating >= 4) return 'Luar Biasa';
    if (numRating >= 3) return 'Baik';
    if (numRating >= 2) return 'Cukup';
    return 'Perlu Perbaikan';
  };

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
            <View style={[styles.headerIcon, isWeekly ? styles.weeklyHeaderIcon : styles.monthlyHeaderIcon]}>
              <FontAwesome5 
                name={isWeekly ? 'calendar-week' : 'calendar-alt'} 
                size={32} 
                color={Colors.onPrimary} 
              />
            </View>
            <Text style={styles.title}>
              {isWeekly ? 'Recap Mingguan' : 'Recap Bulanan'}
            </Text>
            <Text style={styles.subtitle}>
              {formatDate(recap.created_at)}
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Growth Rating Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="chart-line" size={16} color={getGrowthRatingColor(recap.growth_rating)} />
                <Text style={styles.sectionTitle}>Rating Pertumbuhan</Text>
              </View>
              
              <View style={[styles.ratingCard, { borderColor: getGrowthRatingColor(recap.growth_rating) + '40' }]}>
                <View style={styles.ratingHeader}>
                  <View style={[styles.ratingIcon, { backgroundColor: getGrowthRatingColor(recap.growth_rating) }]}>
                    <FontAwesome5 
                      name={getGrowthRatingIcon(recap.growth_rating)} 
                      size={24} 
                      color={Colors.onPrimary} 
                    />
                  </View>
                  <View style={styles.ratingContent}>
                    <Text style={styles.ratingScore}>
                      {recap.growth_rating}/5
                    </Text>
                    <Text style={[styles.ratingDescription, { color: getGrowthRatingColor(recap.growth_rating) }]}>
                      {getRatingDescription(recap.growth_rating)}
                    </Text>
                  </View>
                  <View style={[styles.completionBadge, { backgroundColor: getCompletionRateColor(recap.completion_rate) + '20' }]}>
                    <Text style={[styles.completionText, { color: getCompletionRateColor(recap.completion_rate) }]}>
                      {recap.completion_rate}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Statistics Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="chart-bar" size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Statistik</Text>
              </View>
              
              {isWeekly && weeklyRecap && (
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <FontAwesome5 name="tasks" size={20} color={Colors.primary} />
                    <Text style={styles.statValue}>{weeklyRecap.assigned_task}</Text>
                    <Text style={styles.statLabel}>Tugas Diberikan</Text>
                  </View>
                  <View style={styles.statCard}>
                    <FontAwesome5 name="check-circle" size={20} color={Colors.secondary} />
                    <Text style={styles.statValue}>{weeklyRecap.completed_task}</Text>
                    <Text style={styles.statLabel}>Tugas Selesai</Text>
                  </View>
                </View>
              )}

              {!isWeekly && monthlyRecap && (
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <FontAwesome5 name="trophy" size={20} color={Colors.primary} />
                    <Text style={styles.statValue}>{monthlyRecap.challenges}</Text>
                    <Text style={styles.statLabel}>Tantangan</Text>
                  </View>
                  <View style={styles.statCard}>
                    <FontAwesome5 name="calendar-check" size={20} color={Colors.secondary} />
                    <Text style={styles.statValue}>{monthlyRecap.events}</Text>
                    <Text style={styles.statLabel}>Event</Text>
                  </View>
                  <View style={styles.statCard}>
                    <FontAwesome5 name="map" size={20} color='#FF9800' />
                    <Text style={styles.statValue}>{monthlyRecap.quests}</Text>
                    <Text style={styles.statLabel}>Quest</Text>
                  </View>
                  <View style={styles.statCard}>
                    <FontAwesome5 name="gem" size={20} color='#9C27B0' />
                    <Text style={styles.statValue}>{monthlyRecap.treasures}</Text>
                    <Text style={styles.statLabel}>Treasure</Text>
                  </View>
                </View>
              )}

              {!isWeekly && monthlyRecap && (
                <View style={styles.streakCard}>
                  <FontAwesome5 name="fire" size={24} color={Colors.secondary} />
                  <View style={styles.streakContent}>
                    <Text style={styles.streakValue}>{monthlyRecap.longest_streak} Hari</Text>
                    <Text style={styles.streakLabel}>Streak Terpanjang</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Summary Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="file-alt" size={16} color={Colors.secondary} />
                <Text style={styles.sectionTitle}>Ringkasan</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>{recap.summary}</Text>
              </View>
            </View>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <View style={styles.tipsHeader}>
                <FontAwesome5 name="lightbulb" size={18} color={Colors.onPrimary} />
                <Text style={styles.tipsTitle}>Tips & Saran</Text>
              </View>
              <Text style={styles.tipsText}>{recap.tips}</Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Tutup</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyHeaderIcon: {
    backgroundColor: Colors.primary,
  },
  monthlyHeaderIcon: {
    backgroundColor: Colors.secondary,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  ratingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingContent: {
    flex: 1,
  },
  ratingScore: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  ratingDescription: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
  },
  completionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  statValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  streakContent: {
    marginLeft: 16,
  },
  streakValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.secondary,
    marginBottom: 2,
  },
  streakLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  summaryText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
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
  tipsText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onPrimary,
    lineHeight: 20,
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
