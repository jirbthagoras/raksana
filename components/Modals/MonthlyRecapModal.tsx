import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
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

const { width, height } = Dimensions.get('window');

interface MonthlyRecapData {
  summary: string;
  tips: string;
  completion_rate: string;
  growth_rating: string;
  type: string;
  created_at: string;
  challenges: number;
  events: number;
  quests: number;
  treasures: number;
  longest_streak: number;
}

interface MonthlyRecapModalProps {
  visible: boolean;
  onClose: () => void;
  recapData: MonthlyRecapData | null;
  loading?: boolean;
}

export const MonthlyRecapModal: React.FC<MonthlyRecapModalProps> = ({
  visible,
  onClose,
  recapData,
  loading = false,
}) => {
  const handleNavigateToRecaps = () => {
    onClose();
    router.push('/recaps');
  };

  const formatDate = (dateString: string) => {
    // Format "2025-09" to "September 2025"
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getRatingColor = (rating: string) => {
    const numRating = parseInt(rating);
    if (numRating >= 4) return Colors.primary;
    if (numRating >= 3) return '#FF9500'; // Orange
    return '#FF6B35'; // Red-orange
  };

  const getRatingIcon = (rating: string) => {
    const numRating = parseInt(rating);
    if (numRating >= 4) return 'star';
    if (numRating >= 3) return 'star-half-alt';
    return 'star';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'challenges': return 'trophy';
      case 'events': return 'calendar-check';
      case 'quests': return 'map-marked-alt';
      case 'treasures': return 'gem';
      default: return 'circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'challenges': return '#FF6B35';
      case 'events': return Colors.primary;
      case 'quests': return '#8B5CF6';
      case 'treasures': return '#F59E0B';
      default: return Colors.onSurfaceVariant;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="calendar-alt" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.title}>Monthly Recap</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome5 name="times" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <FontAwesome5 name="spinner" size={32} color={Colors.secondary} />
              <Text style={styles.loadingText}>Memuat recap bulanan...</Text>
            </View>
          ) : recapData ? (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Date */}
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {formatDate(recapData.created_at)}
                </Text>
              </View>

              {/* Stats Cards */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <FontAwesome5 name="percentage" size={24} color={Colors.secondary} />
                  <Text style={styles.statNumber}>{recapData.completion_rate}</Text>
                  <Text style={styles.statLabel}>Completion Rate</Text>
                </View>
                
                <View style={styles.statCard}>
                  <FontAwesome5 
                    name={getRatingIcon(recapData.growth_rating)} 
                    size={24} 
                    color={getRatingColor(recapData.growth_rating)} 
                  />
                  <Text style={[styles.statNumber, { color: getRatingColor(recapData.growth_rating) }]}>
                    {recapData.growth_rating}/5
                  </Text>
                  <Text style={styles.statLabel}>Growth Rating</Text>
                </View>
                
                <View style={styles.statCard}>
                  <FontAwesome5 name="fire" size={24} color="#FF6B35" />
                  <Text style={styles.statNumber}>{recapData.longest_streak}</Text>
                  <Text style={styles.statLabel}>Longest Streak</Text>
                </View>
              </View>

              {/* Activity Stats */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="chart-bar" size={16} color={Colors.secondary} />
                  <Text style={styles.sectionTitle}>Aktivitas Bulan Ini</Text>
                </View>
                <View style={styles.activityGrid}>
                  <View style={styles.activityCard}>
                    <FontAwesome5 name={getActivityIcon('challenges')} size={20} color={getActivityColor('challenges')} />
                    <Text style={styles.activityNumber}>{recapData.challenges}</Text>
                    <Text style={styles.activityLabel}>Challenges</Text>
                  </View>
                  <View style={styles.activityCard}>
                    <FontAwesome5 name={getActivityIcon('events')} size={20} color={getActivityColor('events')} />
                    <Text style={styles.activityNumber}>{recapData.events}</Text>
                    <Text style={styles.activityLabel}>Events</Text>
                  </View>
                  <View style={styles.activityCard}>
                    <FontAwesome5 name={getActivityIcon('quests')} size={20} color={getActivityColor('quests')} />
                    <Text style={styles.activityNumber}>{recapData.quests}</Text>
                    <Text style={styles.activityLabel}>Quests</Text>
                  </View>
                  <View style={styles.activityCard}>
                    <FontAwesome5 name={getActivityIcon('treasures')} size={20} color={getActivityColor('treasures')} />
                    <Text style={styles.activityNumber}>{recapData.treasures}</Text>
                    <Text style={styles.activityLabel}>Treasures</Text>
                  </View>
                </View>
              </View>

              {/* Summary */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="chart-line" size={16} color={Colors.secondary} />
                  <Text style={styles.sectionTitle}>Ringkasan Bulan Ini</Text>
                </View>
                <Text style={styles.summaryText}>{recapData.summary}</Text>
              </View>

              {/* Tips */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="lightbulb" size={16} color="#FF9500" />
                  <Text style={styles.sectionTitle}>Tips untuk Bulan Depan</Text>
                </View>
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsText}>{recapData.tips}</Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <FontAwesome5 name="exclamation-triangle" size={32} color={Colors.error} />
              <Text style={styles.errorText}>Gagal memuat recap bulanan</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.understandButton} onPress={onClose}>
              <Text style={styles.understandButtonText}>Saya Mengerti</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recapButton} onPress={handleNavigateToRecaps}>
              <FontAwesome5 name="arrow-right" size={16} color={Colors.onPrimary} />
              <Text style={styles.recapButtonText}>Ke Recap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 600,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 60,
  },
  errorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.error,
  },
  dateContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  dateText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  activityNumber: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  activityLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  summaryText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 22,
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
  tipsContainer: {
    backgroundColor: '#FF9500' + '10',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  tipsText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 22,
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  understandButton: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  understandButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  recapButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recapButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
});
