import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/SkeletonLoader';
import { Colors, Fonts } from '@/constants';
import { usePacketDetail } from '@/hooks/useApiQueries';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

interface Habit {
  name: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard';
  locked: boolean;
  exp_gain: number;
}

interface PacketDetailData {
  packet_id: number;
  username: string;
  packet_name: string;
  target: string;
  description: string;
  completed_task: number;
  expected_task: number;
  assigned_task: number;
  task_completion_rate: string;
  task_per_day: number;
  completed: boolean;
  created_at: string;
  habits: Habit[];
}

const HabitCard: React.FC<{ habit: Habit; index: number }> = ({ habit, index }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'normal': return '#FF9800';
      case 'hard': return '#F44336';
      default: return Colors.onSurfaceVariant;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Mudah';
      case 'normal': return 'Sedang';
      case 'hard': return 'Sulit';
      default: return difficulty;
    }
  };

  return (
    <View style={[
      styles.habitCard,
      habit.locked && styles.habitCardLocked
    ]}>
      <View style={styles.habitHeader}>
        <View style={styles.habitTitleRow}>
          <Text style={[
            styles.habitName,
            habit.locked && styles.habitNameLocked
          ]}>
            {habit.name}
          </Text>
          {habit.locked && (
            <FontAwesome5 name="lock" size={14} color={Colors.onSurfaceVariant} />
          )}
        </View>
        <View style={styles.habitMeta}>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(habit.difficulty) + '20' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: getDifficultyColor(habit.difficulty) }
            ]}>
              {getDifficultyText(habit.difficulty)}
            </Text>
          </View>
          <View style={styles.expBadge}>
            <FontAwesome5 name="star" size={10} color={Colors.primary} />
            <Text style={styles.expText}>{habit.exp_gain} EXP</Text>
          </View>
        </View>
      </View>
      <Text style={[
        styles.habitDescription,
        habit.locked && styles.habitDescriptionLocked
      ]}>
        {habit.description}
      </Text>
    </View>
  );
};

export default function PacketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const packetId = parseInt(id || '0');

  const {
    data: packetData,
    isLoading,
    error,
    refetch
  } = usePacketDetail(packetId);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonCircle size={40} />
          <Skeleton width={120} height={18} style={{ marginHorizontal: 16 }} />
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Packet Card Skeleton */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.packetCard}
          >
            <View style={styles.packetHeader}>
              <View style={styles.packetTitleContainer}>
                <Skeleton width="80%" height={22} style={{ marginBottom: 8 }} />
                <Skeleton width="60%" height={16} />
              </View>
              <Skeleton width={60} height={28} borderRadius={16} />
            </View>
            <SkeletonText lines={3} lineHeight={16} spacing={6} />
            
            <View style={[styles.progressSection, { marginTop: 20 }]}>
              <SkeletonCircle size={120} />
              <View style={styles.statsContainer}>
                <View style={styles.statRow}>
                  <Skeleton width="45%" height={60} borderRadius={8} />
                  <Skeleton width="45%" height={60} borderRadius={8} />
                </View>
                <View style={styles.statRow}>
                  <Skeleton width="45%" height={60} borderRadius={8} />
                  <Skeleton width="45%" height={60} borderRadius={8} />
                </View>
              </View>
            </View>
          </MotiView>

          {/* Habits Section Skeleton */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonCircle size={18} />
              <Skeleton width={140} height={18} style={{ marginLeft: 12 }} />
              <SkeletonCircle size={24} />
            </View>
            
            {Array.from({ length: 4 }).map((_, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ 
                  type: 'timing', 
                  duration: 500, 
                  delay: index * 100 
                }}
                style={styles.habitCard}
              >
                <View style={styles.habitHeader}>
                  <View style={styles.habitTitleRow}>
                    <Skeleton width="70%" height={16} />
                    <SkeletonCircle size={14} />
                  </View>
                  <View style={styles.habitMeta}>
                    <Skeleton width={50} height={20} borderRadius={6} />
                    <Skeleton width={60} height={20} borderRadius={6} />
                  </View>
                </View>
                <SkeletonText lines={2} lineHeight={14} spacing={4} />
              </MotiView>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !packetData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Gagal memuat data</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Terjadi kesalahan saat memuat detail paket'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const data = packetData as PacketDetailData;
  const completionPercentage = data.expected_task > 0 ? (data.completed_task / data.expected_task) * 100 : 0;
  const taskCompletionRate = parseFloat(data.task_completion_rate.replace('%', ''));

  // Prepare pie chart data for completion rate
  const pieData = [
    {
      name: 'Completed',
      population: completionPercentage,
      color: '#4CAF50',
      legendFontColor: Colors.onSurface,
      legendFontSize: 12,
    },
    {
      name: 'Remaining',
      population: 100 - completionPercentage,
      color: '#E0E0E0',
      legendFontColor: Colors.onSurface,
      legendFontSize: 12,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Paket</Text>
        <View style={styles.headerSpacer} />
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Packet Info Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.95, translateY: 30 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.packetCard}
        >
          <View style={styles.packetHeader}>
            <View style={styles.packetTitleContainer}>
              <Text style={styles.packetName} numberOfLines={2}>{data.packet_name}</Text>
              <Text style={styles.packetTarget} numberOfLines={2}>{data.target}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              data.completed ? styles.statusBadgeCompleted : styles.statusBadgeActive
            ]}>
              <View style={[
                styles.statusDot,
                data.completed ? styles.statusDotCompleted : styles.statusDotActive
              ]} />
              <Text style={[
                styles.statusText,
                data.completed ? styles.statusTextCompleted : styles.statusTextActive
              ]}>
                {data.completed ? 'Selesai' : 'Aktif'}
              </Text>
            </View>
          </View>

          <Text style={styles.packetDescription}>{data.description}</Text>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData.filter(item => item.population > 0)}
                width={200}
                height={200}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: 'transparent',
                  backgroundGradientTo: 'transparent',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="45"
                center={[0, 0]}
                absolute={true}
                hasLegend={false}
              />
              <View style={styles.chartCenterText}>
                <Text style={styles.completionPercentage}>
                  {Math.round(completionPercentage)}%
                </Text>
                <Text style={styles.completionLabel}>Selesai</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{data.completed_task}</Text>
                  <Text style={styles.statLabel}>Dikerjakan</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{data.expected_task}</Text>
                  <Text style={styles.statLabel}>Total Tugas</Text>
                </View>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{data.task_completion_rate}</Text>
                  <Text style={styles.statLabel}>Win Rate</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{data.task_per_day}</Text>
                  <Text style={styles.statLabel}>Per Hari</Text>
                </View>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Habits Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="list" size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Daftar Habits</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.habits.length}</Text>
            </View>
          </View>

          {data.habits.map((habit, index) => (
            <HabitCard key={index} habit={habit} index={index} />
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.error,
    textAlign: 'center',
  },
  errorMessage: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  packetCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  packetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  packetTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  packetName: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    lineHeight: 22,
    marginBottom: 4,
  },
  packetTarget: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeActive: {
    backgroundColor: Colors.primary + '15',
  },
  statusBadgeCompleted: {
    backgroundColor: Colors.onSurfaceVariant + '15',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: Colors.primary,
  },
  statusDotCompleted: {
    backgroundColor: Colors.onSurfaceVariant,
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
  },
  statusTextActive: {
    color: Colors.primary,
  },
  statusTextCompleted: {
    color: Colors.onSurfaceVariant,
  },
  packetDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 20,
  },
  progressSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionPercentage: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  completionLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: Colors.surfaceVariant + '30',
    borderRadius: 8,
  },
  statValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
  },
  habitCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    marginBottom: 10,
    marginHorizontal: 2,
  },
  habitCardLocked: {
    opacity: 0.6,
    backgroundColor: Colors.surfaceVariant + '50',
  },
  habitHeader: {
    marginBottom: 8,
  },
  habitTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  habitName: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
    marginRight: 8,
  },
  habitNameLocked: {
    color: Colors.onSurfaceVariant,
  },
  habitMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontFamily: Fonts.text.bold,
    fontSize: 9,
  },
  expBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: Colors.primary + '15',
    borderRadius: 6,
  },
  expText: {
    fontFamily: Fonts.text.bold,
    fontSize: 9,
    color: Colors.primary,
  },
  habitDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
  habitDescriptionLocked: {
    color: Colors.onSurfaceVariant + '80',
  },
  bottomSpacing: {
    height: 50,
  },
});
