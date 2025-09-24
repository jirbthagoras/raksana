import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecapCard } from '../../components/RecapCard';
import { RecapDetailModal } from '../../components/RecapDetailModal';
import { RecapsInfoModal } from '../../components/RecapsInfoModal';
import { SkeletonCircle, SkeletonText } from '../../components/SkeletonLoader';
import { useMonthlyRecaps, useWeeklyRecaps } from '../../hooks/useApiQueries';
import { MonthlyRecap, WeeklyRecap } from '../../types/auth';

export default function RecapsScreen() {
  const [selectedRecap, setSelectedRecap] = useState<WeeklyRecap | MonthlyRecap | null>(null);
  const [selectedRecapType, setSelectedRecapType] = useState<'weekly' | 'monthly'>('weekly');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const {
    data: weeklyRecapsData,
    isLoading: weeklyLoading,
    error: weeklyError,
    refetch: refetchWeekly
  } = useWeeklyRecaps();

  const {
    data: monthlyRecapsData,
    isLoading: monthlyLoading,
    error: monthlyError,
    refetch: refetchMonthly
  } = useMonthlyRecaps();

  const weeklyRecaps = weeklyRecapsData?.data?.recaps || [];
  const monthlyRecaps = monthlyRecapsData?.data?.monthly_recaps || [];

  const loading = weeklyLoading || monthlyLoading;
  const error = weeklyError || monthlyError;

  const handleRefresh = async () => {
    await Promise.all([refetchWeekly(), refetchMonthly()]);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRecapPress = (recap: WeeklyRecap | MonthlyRecap, type: 'weekly' | 'monthly') => {
    setSelectedRecap(recap);
    setSelectedRecapType(type);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRecap(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonCircle size={40} />
          <View style={styles.headerTitleContainer}>
            <SkeletonText lines={1} lineHeight={18} lastLineWidth="60%" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Weekly Section Skeleton */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonCircle size={18} />
              <SkeletonText lines={1} lineHeight={18} lastLineWidth="40%" />
              <SkeletonCircle size={24} />
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recapsScrollContainer}
              style={styles.recapsScroll}
            >
              {[1, 2, 3].map((index) => (
                <View key={index} style={styles.recapSkeletonContainer}>
                  <View style={styles.recapSkeleton}>
                    <View style={styles.recapSkeletonHeader}>
                      <SkeletonCircle size={32} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <SkeletonText lines={2} lineHeight={14} lastLineWidth="70%" />
                      </View>
                      <SkeletonCircle size={24} />
                    </View>
                    <SkeletonText lines={3} lineHeight={16} spacing={6} />
                    <View style={styles.recapSkeletonStats}>
                      <SkeletonText lines={2} lineHeight={12} lastLineWidth="60%" />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Monthly Section Skeleton */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonCircle size={18} />
              <SkeletonText lines={1} lineHeight={18} lastLineWidth="40%" />
              <SkeletonCircle size={24} />
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recapsScrollContainer}
              style={styles.recapsScroll}
            >
              {[1, 2].map((index) => (
                <View key={index} style={styles.recapSkeletonContainer}>
                  <View style={styles.recapSkeleton}>
                    <View style={styles.recapSkeletonHeader}>
                      <SkeletonCircle size={32} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <SkeletonText lines={2} lineHeight={14} lastLineWidth="70%" />
                      </View>
                      <SkeletonCircle size={24} />
                    </View>
                    <SkeletonText lines={3} lineHeight={16} spacing={6} />
                    <View style={styles.recapSkeletonStats}>
                      <SkeletonText lines={3} lineHeight={12} lastLineWidth="80%" />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Recaps</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerInfoButton}
          onPress={() => setShowInfoModal(true)}
        >
          <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.errorContainer}
          >
            <FontAwesome5 name="exclamation-triangle" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{error.message || 'Gagal memuat data recap'}</Text>
          </MotiView>
        )}

        {/* Weekly Recaps Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-week" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Recap Mingguan</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{weeklyRecaps.length}</Text>
            </View>
          </View>

          {weeklyRecaps.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="calendar-times" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Belum ada recap mingguan</Text>
              <Text style={styles.emptySubtitle}>
                Recap mingguan akan muncul setelah Anda aktif selama seminggu
              </Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recapsScrollContainer}
              style={styles.recapsScroll}
            >
              {weeklyRecaps.map((recap, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateX: 50 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ 
                    type: 'timing', 
                    duration: 400, 
                    delay: 300 + (index * 100) 
                  }}
                  style={styles.recapCardContainer}
                >
                  <RecapCard
                    recap={recap}
                    type="weekly"
                    onPress={() => handleRecapPress(recap, 'weekly')}
                  />
                </MotiView>
              ))}
            </ScrollView>
          )}
        </MotiView>

        {/* Monthly Recaps Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-alt" size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Recap Bulanan</Text>
            <View style={[styles.badge, { backgroundColor: Colors.secondary + '20' }]}>
              <Text style={[styles.badgeText, { color: Colors.secondary }]}>
                {monthlyRecaps.length}
              </Text>
            </View>
          </View>

          {monthlyRecaps.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="calendar-times" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Belum ada recap bulanan</Text>
              <Text style={styles.emptySubtitle}>
                Recap bulanan akan muncul setelah Anda aktif selama sebulan
              </Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recapsScrollContainer}
              style={styles.recapsScroll}
            >
              {monthlyRecaps.map((recap, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateX: 50 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ 
                    type: 'timing', 
                    duration: 400, 
                    delay: 500 + (index * 100) 
                  }}
                  style={styles.recapCardContainer}
                >
                  <RecapCard
                    recap={recap}
                    type="monthly"
                    onPress={() => handleRecapPress(recap, 'monthly')}
                  />
                </MotiView>
              ))}
            </ScrollView>
          )}
        </MotiView>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Recap Detail Modal */}
      <RecapDetailModal
        visible={showDetailModal}
        onClose={handleCloseModal}
        recap={selectedRecap}
        type={selectedRecapType}
      />
      
      {/* Recaps Info Modal */}
      <RecapsInfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
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
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.errorContainer,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  errorText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.error,
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  recapsScroll: {
    marginHorizontal: -20,
  },
  recapsScrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  recapCardContainer: {
    marginRight: 16,
  },
  bottomSpacing: {
    height: 20,
  },
  // Skeleton loading styles
  recapSkeletonContainer: {
    marginRight: 16,
    minWidth: 300,
    maxWidth: 340,
  },
  recapSkeleton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  recapSkeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recapSkeletonStats: {
    marginTop: 16,
  },
});
