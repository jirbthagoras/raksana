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

interface WeeklyRecapData {
  assigned_tasks: number;
  completed_tasks: number;
  date: string;
  growth_rating: string;
  summary: string;
  task_completion_rate: string;
  tips: string;
}

interface WeeklyRecapModalProps {
  visible: boolean;
  onClose: () => void;
  recapData: WeeklyRecapData | null;
  loading?: boolean;
}

export const WeeklyRecapModal: React.FC<WeeklyRecapModalProps> = ({
  visible,
  onClose,
  recapData,
  loading = false,
}) => {
  const handleNavigateToRecaps = () => {
    onClose();
    router.push('/recaps');
  };

  console.log(recapData)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
                <FontAwesome5 name="calendar-week" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Weekly Recap</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome5 name="times" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {recapData ? (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Date */}
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  Minggu {formatDate(recapData.date)}
                </Text>
              </View>

              {/* Stats Cards */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <FontAwesome5 name="tasks" size={24} color={Colors.primary} />
                  <Text style={styles.statNumber}>{recapData.completed_tasks}/{recapData.assigned_tasks}</Text>
                  <Text style={styles.statLabel}>Tugas Selesai</Text>
                </View>
                
                <View style={styles.statCard}>
                  <FontAwesome5 name="percentage" size={24} color={Colors.secondary} />
                  <Text style={styles.statNumber}>{recapData.task_completion_rate}</Text>
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
              </View>

              {/* Summary */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="chart-line" size={16} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Ringkasan Minggu Ini</Text>
                </View>
                <Text style={styles.summaryText}>{recapData.summary}</Text>
              </View>

              {/* Tips */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="lightbulb" size={16} color="#FF9500" />
                  <Text style={styles.sectionTitle}>Tips untuk Minggu Depan</Text>
                </View>
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsText}>{recapData.tips}</Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <FontAwesome5 name="exclamation-triangle" size={32} color={Colors.error} />
              <Text style={styles.errorText}>Gagal memuat recap mingguan</Text>
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
    backgroundColor: Colors.primaryContainer,
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
    backgroundColor: Colors.primary,
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
