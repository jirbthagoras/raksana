import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MonthlyRecap, WeeklyRecap } from '../types/auth';

interface RecapCardProps {
  recap: WeeklyRecap | MonthlyRecap;
  type: 'weekly' | 'monthly';
  onPress: () => void;
}

export const RecapCard: React.FC<RecapCardProps> = ({ recap, type, onPress }) => {
  const isWeekly = type === 'weekly';
  const weeklyRecap = isWeekly ? recap as WeeklyRecap : null;
  const monthlyRecap = !isWeekly ? recap as MonthlyRecap : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
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

  return (
    <TouchableOpacity 
      style={[styles.card, isWeekly ? styles.weeklyCard : styles.monthlyCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.typeIcon, isWeekly ? styles.weeklyIcon : styles.monthlyIcon]}>
          <FontAwesome5 
            name={isWeekly ? 'calendar-week' : 'calendar-alt'} 
            size={16} 
            color={Colors.onPrimary} 
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.typeLabel}>
            {isWeekly ? 'Recap Mingguan' : 'Recap Bulanan'}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(recap.created_at)}
          </Text>
        </View>
        <View style={[styles.growthBadge, { backgroundColor: getGrowthRatingColor(recap.growth_rating) + '20' }]}>
          <FontAwesome5 
            name={getGrowthRatingIcon(recap.growth_rating)} 
            size={12} 
            color={getGrowthRatingColor(recap.growth_rating)} 
          />
          <Text style={[styles.growthText, { color: getGrowthRatingColor(recap.growth_rating) }]}>
            {recap.growth_rating}/5
          </Text>
        </View>
      </View>

      {/* Summary Preview */}
      <Text style={styles.summaryPreview} numberOfLines={3}>
        {recap.summary}
      </Text>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <FontAwesome5 name="percentage" size={12} color={getCompletionRateColor(recap.completion_rate)} />
          <Text style={styles.statLabel}>Completion Rate</Text>
          <Text style={[styles.statValue, { color: getCompletionRateColor(recap.completion_rate) }]}>
            {recap.completion_rate}
          </Text>
        </View>

        {isWeekly && weeklyRecap && (
          <View style={styles.statItem}>
            <FontAwesome5 name="tasks" size={12} color={Colors.primary} />
            <Text style={styles.statLabel}>Tasks</Text>
            <Text style={styles.statValue}>
              {weeklyRecap.completed_task}/{weeklyRecap.assigned_task}
            </Text>
          </View>
        )}

        {!isWeekly && monthlyRecap && (
          <View style={styles.statItem}>
            <FontAwesome5 name="fire" size={12} color={Colors.secondary} />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>
              {monthlyRecap.longest_streak} hari
            </Text>
          </View>
        )}
      </View>

      {/* Additional Stats for Monthly */}
      {!isWeekly && monthlyRecap && (
        <View style={styles.monthlyStats}>
          <View style={styles.monthlyStatRow}>
            <View style={styles.monthlyStatItem}>
              <FontAwesome5 name="trophy" size={10} color={Colors.primary} />
              <Text style={styles.monthlyStatText}>{monthlyRecap.challenges} Tantangan</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <FontAwesome5 name="calendar-check" size={10} color={Colors.secondary} />
              <Text style={styles.monthlyStatText}>{monthlyRecap.events} Event</Text>
            </View>
          </View>
          <View style={styles.monthlyStatRow}>
            <View style={styles.monthlyStatItem}>
              <FontAwesome5 name="map" size={10} color='#FF9800' />
              <Text style={styles.monthlyStatText}>{monthlyRecap.quests} Quest</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <FontAwesome5 name="gem" size={10} color='#9C27B0' />
              <Text style={styles.monthlyStatText}>{monthlyRecap.treasures} Treasure</Text>
            </View>
          </View>
        </View>
      )}

      {/* Arrow Icon */}
      <View style={styles.arrowContainer}>
        <FontAwesome5 name="chevron-right" size={14} color={Colors.onSurfaceVariant} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    minWidth: 300,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklyCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  monthlyCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  weeklyIcon: {
    backgroundColor: Colors.primary,
  },
  monthlyIcon: {
    backgroundColor: Colors.secondary,
  },
  headerContent: {
    flex: 1,
  },
  typeLabel: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  dateText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  growthText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
  },
  summaryPreview: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
    paddingHorizontal: 4,
  },
  statItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.surfaceVariant + '20',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 4,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 12,
  },
  statValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 13,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  monthlyStats: {
    backgroundColor: Colors.surfaceVariant + '30',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    gap: 6,
  },
  monthlyStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  monthlyStatText: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
