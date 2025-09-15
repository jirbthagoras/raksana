import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Skeleton, SkeletonCircle, SkeletonText } from './SkeletonLoader';
import GradientBackground from './GradientBackground';
import FloatingElements from './FloatingElements';
import { Colors } from '../constants';

const { width } = Dimensions.get('window');

export default function HomePageSkeleton() {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <FloatingElements count={6} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section Skeleton */}
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
              <Skeleton width={200} height={30} />
            </View>
            <View style={styles.headerButtons}>
              {/* Streak Button Skeleton */}
              <View style={styles.streakSkeleton}>
                <Skeleton width={55} height={55} borderRadius={10} />
              </View>
              {/* Progress Bar Skeleton */}
              <View style={styles.progressSkeleton}>
                <Skeleton width="100%" height={55} borderRadius={10} />
              </View>
            </View>
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Dashboard Cards Skeleton */}
            <View style={styles.dashboardSection}>
              {/* Pocket Card Skeleton */}
              <View style={styles.pocketCardSkeleton}>
                <Skeleton width="100%" height={120} borderRadius={16} />
              </View>

              {/* Quick Actions Section Skeleton */}
              <View style={styles.quickActionsSection}>
                <View style={[styles.sectionHeader, { paddingHorizontal: 24 }]}>
                  <Skeleton width={120} height={20} />
                  <View style={styles.scrollIndicator}>
                    <SkeletonCircle size={6} style={{ marginRight: 4 }} />
                    <SkeletonCircle size={6} style={{ marginRight: 4 }} />
                    <SkeletonCircle size={6} />
                  </View>
                </View>
                <View style={styles.scrollWrapper}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    style={styles.horizontalScroll}
                  >
                    {/* Quick Action Button Skeletons */}
                    {Array.from({ length: 8 }).map((_, index) => (
                      <View key={index} style={styles.actionButtonSkeleton}>
                        <Skeleton width={100} height={100} borderRadius={16} />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
              
              {/* Daily Challenge Skeleton */}
              <View style={styles.dailyChallengeSkeleton}>
                <Skeleton width="100%" height={180} borderRadius={16} />
              </View>
              
              {/* Nearby Quest Locator Skeleton */}
              <View style={styles.nearbyQuestSkeleton}>
                <Skeleton width="100%" height={120} borderRadius={16} />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    gap: 16,
    paddingTop: 60,
    paddingBottom: 15,
  },
  welcomeSection: {
    flex: 1,
    marginBottom: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    width: '100%',
  },
  streakSkeleton: {
    width: 55,
    height: 55,
  },
  progressSkeleton: {
    flex: 1,
    marginLeft: 12,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 28,
  },
  dashboardSection: {
    gap: 12,
  },
  pocketCardSkeleton: {
    marginBottom: 12,
  },
  quickActionsSection: {
    marginVertical: 20,
    marginHorizontal: -24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  scrollIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  scrollWrapper: {
    position: 'relative',
    height: 120,
  },
  horizontalScroll: {
    height: 120,
  },
  scrollContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 12,
    alignItems: 'center',
    height: 120,
  },
  actionButtonSkeleton: {
    width: 100,
    height: 100,
  },
  dailyChallengeSkeleton: {
    marginVertical: 12,
  },
  nearbyQuestSkeleton: {
    marginVertical: 12,
  },
});
