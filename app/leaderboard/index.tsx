import LeaderboardSkeleton from '@/components/Screens/LeaderboardSkeleton';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLeaderboard } from '../../hooks/useApiQueries';
import { LeaderboardEntry, LeaderboardResponse } from '../../types/auth';

const UserAvatar = React.memo(({ imageUrl, size = 50, style }: { imageUrl: string; size?: number; style?: any }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = (error: any) => {
    console.log('Image loading error for URL:', imageUrl, error);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageLoadStart = () => {
    console.log('Starting to load image:', imageUrl);
    setImageLoading(true);
    setImageError(false);
  };

  // Check if imageUrl is valid
  const isValidUrl = imageUrl && imageUrl.trim() !== '' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

  return (
    <View style={[{ width: size, height: size, position: 'relative' }, style]}>
      {!imageError && isValidUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            // borderWidth: 2,
            borderColor: Colors.outline + '40',
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadStart={handleImageLoadStart}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: Colors.primaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: Colors.outline + '40',
          }}
        >
          <FontAwesome5 name="user" size={size * 0.4} color={Colors.primary} />
        </View>
      )}
      {imageLoading && !imageError && isValidUrl && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: size / 2,
            backgroundColor: Colors.surface + '80',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
    </View>
  );
});

const LeaderboardCard = React.memo(({ item, index }: { item: LeaderboardEntry; index: number }) => {
  const getRankIcon = () => {
    switch (item.rank) {
      case 1: return 'crown';
      case 2: return 'medal';
      case 3: return 'award';
      default: return null;
    }
  };

  const getRankColor = () => {
    switch (item.rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return Colors.outline;
    }
  };

  const formatPoints = (points: number) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  return (
    <View style={[styles.leaderboardCard, item.is_user && styles.userCard]}>
      <LinearGradient
        colors={item.is_user ? [Colors.primaryContainer, Colors.secondaryContainer] : [Colors.surface, Colors.surfaceContainerHigh]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Rank indicator */}
        <View style={styles.rankContainer}>
          {item.rank <= 3 ? (
            <View style={[styles.rankBadge, { backgroundColor: getRankColor() + '20' }]}>
              <FontAwesome5 name={getRankIcon()!} size={16} color={getRankColor()} />
            </View>
          ) : (
            <View style={styles.rankNumber}>
              <Text style={styles.rankText}>#{item.rank}</Text>
            </View>
          )}
        </View>

        {/* User info */}
        <View style={styles.userInfo}>
          <UserAvatar
            imageUrl={item.image_url}
            size={50}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={[styles.userName, item.is_user && styles.currentUserName]}>
              {item.name}
              {item.is_user && (
                <Text style={styles.youIndicator}> (Anda)</Text>
              )}
            </Text>
            <View style={styles.pointsContainer}>
              <FontAwesome5 name="coins" size={12} color={Colors.secondary} />
              <Text style={styles.pointsText}>{formatPoints(item.points)} points</Text>
            </View>
          </View>
        </View>

        {/* Current user glow effect */}
        {item.is_user && (
          <View style={styles.userGlow} />
        )}
      </LinearGradient>
    </View>
  );
});

export default function LeaderboardScreen() {
  const { 
    data: leaderboardData, 
    isLoading, 
    error, 
    refetch 
  } = useLeaderboard();

  const leaderboard = useMemo(() => {
    return (leaderboardData as LeaderboardResponse)?.data?.leaderboard || [];
  }, [leaderboardData]);

  const currentUser = useMemo(() => {
    return leaderboard.find(entry => entry.is_user);
  }, [leaderboard]);

  const renderLeaderboardItem = useCallback(({ item, index }: { item: LeaderboardEntry; index: number }) => (
    <LeaderboardCard item={item} index={index} />
  ), []);

  const keyExtractor = useCallback((item: LeaderboardEntry) => item.id, []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="trophy" size={48} color={Colors.outline} />
      <Text style={styles.emptyTitle}>No Leaderboard Data</Text>
      <Text style={styles.emptyDescription}>
        The leaderboard is currently empty. Start completing tasks to climb the ranks!
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
      <Text style={styles.errorTitle}>Failed to Load Leaderboard</Text>
      <Text style={styles.errorDescription}>
        {error?.message || 'Something went wrong while loading the leaderboard.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTopThree = () => {
    const topThree = leaderboard.slice(0, 3);
    if (topThree.length === 0) return null;

    return (
      <View style={styles.podiumContainer}>
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.secondaryContainer]}
          style={styles.podiumGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.podiumTitle}>Big Tree</Text>
          <View style={styles.podiumRow}>
            {/* Second place */}
            {topThree[1] && (
              <View style={[styles.podiumPosition, styles.secondPlace]}>
                <UserAvatar
                  imageUrl={topThree[1].image_url}
                  size={60}
                />
                <View style={styles.silverCrown}>
                  <FontAwesome5 name="medal" size={16} color="#C0C0C0" />
                </View>
                <Text style={styles.podiumName}>{topThree[1].name}</Text>
                <Text style={styles.podiumPoints}>{(topThree[1].points / 1000).toFixed(1)}K</Text>
              </View>
            )}

            {/* First place */}
            {topThree[0] && (
              <View style={[styles.podiumPosition, styles.firstPlace]}>
                <UserAvatar
                  imageUrl={topThree[0].image_url}
                  size={80}
                  style={styles.winnerAvatar}
                />
                <View style={styles.goldCrown}>
                  <FontAwesome5 name="crown" size={20} color="#FFD700" />
                </View>
                <Text style={[styles.podiumName, styles.winnerName]}>{topThree[0].name}</Text>
                <Text style={[styles.podiumPoints, styles.winnerPoints]}>{(topThree[0].points / 1000).toFixed(1)}K</Text>
              </View>
            )}

            {/* Third place */}
            {topThree[2] && (
              <View style={[styles.podiumPosition, styles.thirdPlace]}>
                <UserAvatar
                  imageUrl={topThree[2].image_url}
                  size={60}
                />
                <View style={styles.bronzeCrown}>
                  <FontAwesome5 name="award" size={16} color="#CD7F32" />
                </View>
                <Text style={styles.podiumName}>{topThree[2].name}</Text>
                <Text style={styles.podiumPoints}>{(topThree[2].points / 1000).toFixed(1)}K</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  if (isLoading) {
    return <LeaderboardSkeleton />;
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Leaderboard</Text>
        </View>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="trophy" size={24} color={Colors.primary} />
        </View>
      </MotiView>
      
      {/* Stats Bar */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
        style={styles.statsBar}
      >
        <Text style={styles.statsText}>
          {leaderboard.length} players competing
        </Text>
      </MotiView>

      {/* Content */}
      {error ? (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          {renderError()}
        </MotiView>
      ) : leaderboard.length === 0 ? (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          {renderEmptyState()}
        </MotiView>
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderTopThree}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
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
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceVariant + '30',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '10',
  },
  statsText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  podiumContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  podiumGradient: {
    padding: 20,
  },
  podiumTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
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
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.outline + '40',
  },
  winnerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#FFD700',
  },
  goldCrown: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 4,
  },
  silverCrown: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
  },
  bronzeCrown: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
  },
  podiumName: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 16,
    color: Colors.secondary,
  },
  podiumPoints: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  winnerPoints: {
    fontSize: 14,
    fontFamily: Fonts.text.bold,
  },
  leaderboardCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userCard: {
    shadowColor: Colors.secondary,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    position: 'relative',
  },
  userGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.secondary + '40',
  },
  rankContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.outline + '40',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 4,
  },
  currentUserName: {
    color: Colors.secondary,
  },
  youIndicator: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.tertiary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.primary,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.error,
    textAlign: 'center',
  },
  errorDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
});
