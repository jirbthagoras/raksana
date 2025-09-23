import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Skeleton, SkeletonCircle } from './SkeletonLoader';
import { Colors } from '../constants';

export default function LeaderboardSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SkeletonCircle size={40} />
          <View style={styles.headerTitleContainer}>
            <Skeleton width={150} height={28} style={{ marginBottom: 4 }} />
            <Skeleton width={120} height={14} />
          </View>
          <SkeletonCircle size={24} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Podium Skeleton */}
        <View style={styles.podiumSkeleton}>
          <Skeleton width="100%" height={20} style={{ marginBottom: 20, alignSelf: 'center' }} />
          <View style={styles.podiumRow}>
            {/* Second place */}
            <View style={[styles.podiumPosition, styles.secondPlace]}>
              <SkeletonCircle size={60} />
              <View style={styles.crownSkeleton}>
                <SkeletonCircle size={16} />
              </View>
              <Skeleton width={60} height={14} style={{ marginTop: 8 }} />
              <Skeleton width={40} height={12} style={{ marginTop: 2 }} />
            </View>

            {/* First place */}
            <View style={[styles.podiumPosition, styles.firstPlace]}>
              <SkeletonCircle size={80} />
              <View style={styles.crownSkeleton}>
                <SkeletonCircle size={20} />
              </View>
              <Skeleton width={80} height={16} style={{ marginTop: 8 }} />
              <Skeleton width={50} height={14} style={{ marginTop: 2 }} />
            </View>

            {/* Third place */}
            <View style={[styles.podiumPosition, styles.thirdPlace]}>
              <SkeletonCircle size={60} />
              <View style={styles.crownSkeleton}>
                <SkeletonCircle size={16} />
              </View>
              <Skeleton width={60} height={14} style={{ marginTop: 8 }} />
              <Skeleton width={40} height={12} style={{ marginTop: 2 }} />
            </View>
          </View>
        </View>

        {/* Leaderboard Cards Skeleton */}
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.leaderboardCardSkeleton}>
            <View style={styles.cardContent}>
              {/* Rank */}
              <SkeletonCircle size={40} />
              
              {/* User info */}
              <View style={styles.userInfo}>
                <SkeletonCircle size={50} />
                <View style={styles.userDetails}>
                  <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                  <Skeleton width={80} height={14} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  podiumSkeleton: {
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 16,
  },
  podiumPosition: {
    alignItems: 'center',
    position: 'relative',
  },
  firstPlace: {
    marginBottom: 0,
  },
  secondPlace: {
    marginBottom: 20,
  },
  thirdPlace: {
    marginBottom: 30,
  },
  crownSkeleton: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  leaderboardCardSkeleton: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    borderRadius: 16,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
});
