import { MotiText, MotiView } from 'moti';
import React from 'react';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FloatingElements from '../../components/FloatingElements';
import GradientBackground from '../../components/GradientBackground';
import { Colors, Fonts } from '../../constants';

import BackyardButton from '@/components/Home/BackyardButton';
import ChallengesButton from '@/components/Home/ChallengesButton';
import DailyChallenge from '@/components/Home/DailyChallenge';
import EventsButton from '@/components/Home/EventsButton';
import JournalButton from '@/components/Home/JournalButton';
import LeaderboardButton from '@/components/Home/LeaderboardButton';
import MemoryButton from '@/components/Home/MemoryButton';
import MonthlyRecapButton from '@/components/Home/MonthlyRecapButton';
import NearbyQuestLocator from '@/components/Home/NearbyQuestLocator';
import PacketsButton from '@/components/Home/PacketsButton';
import BalanceCard from '@/components/Home/PointCard';
import ProgressBar from '@/components/Home/ProgressBar';
import RecapsButton from '@/components/Home/RecapsButton';
import RecyclopediaButton from '@/components/Home/RecyclopediaButton';
import RegionCard from '@/components/Home/RegionCard';
import StreakButton from '@/components/Home/StreakButton';
import WeeklyRecapButton from '@/components/Home/WeeklyRecapButton';
import HomePageSkeleton from '../../components/HomePageSkeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileMe, useRegions } from '../../hooks/useApiQueries';

const { width } = Dimensions.get('window');

interface ProfileData {
  id: number;
  name: string;
  username: string;
  email: string;
  current_exp: number;
  exp_needed: number;
  level: number;
  points: number;
  profile_url: string;
  challenges: number;
  events: number;
  quests: number;
  treasures: number;
  longest_streak: number;
  current_Streak: number;
  tree_grown: number;
  completed_task: number;
  assigend_task: number;
  task_completion_rate: string;
  rank: number;
  badges: Array<{
    category: string;
    name: string;
    frequency: number;
  }>;
}

export default function HomeTab() {
  const { user } = useAuth();
  
  // Use TanStack Query for profile data
  const { 
    data: profileData, 
    isLoading: loading, 
    error, 
    refetch,
    isFetching
  } = useProfileMe();

  // Use TanStack Query for regions data
  const { 
    data: regionsData, 
    isLoading: regionsLoading, 
    error: regionsError,
    refetch: refetchRegions
  } = useRegions();

  // Handle refresh
  const handleRefresh = React.useCallback(async () => {
    await Promise.all([refetch(), refetchRegions()]);
  }, [refetch, refetchRegions]);

  // Loading state
  if (loading) {
    return <HomePageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          <FloatingElements count={6} />
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error.message || 'Failed to fetch profile data'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <FloatingElements count={6} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !loading}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.surface}
            />
          }
        >
          {/* Header Section */}
          <MotiView 
            style={styles.header}
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 200 }}
          >
            <MotiView 
              style={styles.welcomeSection}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', delay: 400, damping: 15, stiffness: 150 }}
            >
              <MotiText 
                style={styles.welcomeText}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 600, delay: 600 }}
              >
                Selamat Datang,
              </MotiText>
              <MotiText 
                style={styles.userName}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 800, damping: 12, stiffness: 100 }}
              >
                {user?.username || 'User'}
              </MotiText>
            </MotiView>
            <MotiView 
              style={styles.headerButtons}
              from={{ opacity: 0, translateX: 30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', delay: 600, damping: 15, stiffness: 150 }}
            >
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 1000, damping: 10, stiffness: 120 }}
              >
                <StreakButton 
                  streak={profileData?.current_Streak || 0} 
                  onPress={() => console.log('Streak pressed!')} 
                />
              </MotiView>
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 1200, damping: 10, stiffness: 120 }}
              >
                <ProgressBar 
                  level={profileData?.level || 1} 
                  currentExp={profileData?.current_exp || 0} 
                  neededExp={profileData?.exp_needed || 100} 
                />
              </MotiView>
            </MotiView>
          </MotiView>
          

          {/* Main Content Area */}
          <MotiView 
            style={styles.mainContent}
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 1000, damping: 15, stiffness: 100 }}
          >
            {/* Dashboard Cards */}
            <MotiView 
              style={styles.dashboardSection}
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 1200, damping: 12, stiffness: 120 }}
            >
              <MotiView
                from={{ opacity: 0, translateY: 30, scale: 0.9 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 1300, damping: 15, stiffness: 100 }}
              >
                <BalanceCard
                  balance={profileData?.points || 0}
                  currency="GP"
                  onPress={() => console.log('Balance card pressed!')}
                />
                <MotiView
                from={{ opacity: 0, translateY: 40, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 1500, damping: 15, stiffness: 100 }}
              >
                <WeeklyRecapButton onPress={() => console.log('Weekly Recap pressed!')} />
              </MotiView>
              
              <MotiView
                from={{ opacity: 0, translateY: 40, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 1700, damping: 15, stiffness: 100 }}
              >
                <MonthlyRecapButton onPress={() => console.log('Monthly Recap pressed!')} />
              </MotiView>
              </MotiView>

            <MotiView 
              style={styles.quickActionsSection}
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', delay: 1400, damping: 15, stiffness: 100 }}
            >
              <MotiView 
                style={[styles.sectionHeader, { paddingHorizontal: 24 }]}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 1600 }}
              >
                <MotiText 
                  style={styles.sectionTitle}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 1800, damping: 12, stiffness: 120 }}
                >
                  Quick Actions
                </MotiText>
                <MotiView
                  style={styles.scrollIndicator}
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'timing', duration: 400, delay: 2000 }}
                >
                  <MotiView 
                    style={styles.scrollDot}
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 2100, damping: 10, stiffness: 150 }}
                  />
                  <MotiView 
                    style={styles.scrollDot}
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 2200, damping: 10, stiffness: 150 }}
                  />
                  <MotiView 
                    style={styles.scrollDot}
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 2300, damping: 10, stiffness: 150 }}
                  />
                </MotiView>
              </MotiView>
              <MotiView 
                style={styles.scrollWrapper}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 2000, damping: 15, stiffness: 100 }}
              >
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                  style={styles.horizontalScroll}
                  decelerationRate="fast"
                  snapToInterval={132}
                  snapToAlignment="start"
                >
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2200, damping: 12, stiffness: 120 }}
                  >
                    <JournalButton onPress={() => console.log('Journal pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2300, damping: 12, stiffness: 120 }}
                  >
                    <MemoryButton onPress={() => console.log('Album pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2400, damping: 12, stiffness: 120 }}
                  >
                    <EventsButton onPress={() => console.log('Events pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2500, damping: 12, stiffness: 120 }}
                  >
                    <PacketsButton onPress={() => console.log('Packets pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2600, damping: 12, stiffness: 120 }}
                  >
                    <RecapsButton onPress={() => console.log('Recaps pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2700, damping: 12, stiffness: 120 }}
                  >
                    <RecyclopediaButton onPress={() => console.log('Recyclopedia pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2800, damping: 12, stiffness: 120 }}
                  >
                    <ChallengesButton onPress={() => console.log('Challenges pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 2900, damping: 12, stiffness: 120 }}
                  >
                    <LeaderboardButton onPress={() => console.log('Leaderboard pressed!')} />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 3000, damping: 12, stiffness: 120 }}
                  >
                    <BackyardButton onPress={() => console.log('Backyard pressed!')} />
                  </MotiView>
                </ScrollView>
                <View style={styles.scrollGradientLeft} />
                <View style={styles.scrollGradientRight} />
              </MotiView>
            </MotiView>

              {/* Daily Challenge */}
              <MotiView
                from={{ opacity: 0, translateY: 40, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 3000, damping: 15, stiffness: 100 }}
              >
                <Text style={styles.sectionTitle}>Daily Challenge</Text>
                <DailyChallenge
                  onPress={() => console.log('Daily Challenge pressed!')}
                />
              </MotiView>
              
              {/* Regions Section */}
              <MotiView
                from={{ opacity: 0, translateY: 40, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 3000, damping: 15, stiffness: 100 }}
              >
                <View style={styles.regionsSection}>
                  <MotiView 
                    style={[styles.sectionHeader, { paddingHorizontal: 24 }]}
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'timing', duration: 600, delay: 3200 }}
                  >
                    <MotiText 
                      style={styles.sectionTitle}
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', delay: 3400, damping: 12, stiffness: 120 }}
                    >
                      Green Regions
                    </MotiText>
                  </MotiView>
                  
                  <MotiView 
                    style={styles.regionsScrollWrapper}
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 3600, damping: 15, stiffness: 100 }}
                  >
                    {regionsLoading ? (
                      <View style={styles.regionsLoadingContainer}>
                        <Text style={styles.regionsLoadingText}>Loading regions...</Text>
                      </View>
                    ) : regionsError ? (
                      <View style={styles.regionsErrorContainer}>
                        <Text style={styles.regionsErrorText}>Failed to load regions</Text>
                        <TouchableOpacity 
                          style={styles.regionsRetryButton} 
                          onPress={() => refetchRegions()}
                        >
                          <Text style={styles.regionsRetryText}>Retry</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.regionsScrollContainer}
                        style={styles.regionsHorizontalScroll}
                        decelerationRate="fast"
                        snapToInterval={172}
                        snapToAlignment="start"
                      >
                        {regionsData?.regions?.map((region, index) => (
                          <MotiView
                            key={region.id}
                            from={{ opacity: 0, translateY: 20, scale: 0.8 }}
                            animate={{ opacity: 1, translateY: 0, scale: 1 }}
                            transition={{ type: 'spring', delay: 3800 + (index * 100), damping: 12, stiffness: 120 }}
                          >
                            <RegionCard
                              region={region}
                              onPress={(selectedRegion) => console.log('Region pressed:', selectedRegion.name)}
                            />
                          </MotiView>
                        ))}
                      </ScrollView>
                    )}
                  </MotiView>
                </View>
              </MotiView>

              {/* Nearby Quest Locator */}
              <MotiView
                from={{ opacity: 0, translateY: 40, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 4200, damping: 15, stiffness: 100 }}
              >
                <NearbyQuestLocator
                  onLocatePress={() => console.log('Locate quests pressed!')}
                />
              </MotiView>
            </MotiView>
            
          </MotiView>
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
    paddingBottom: 120, // Extra padding for tab bar
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
  welcomeText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.tertiary,
    marginBottom: 4,
  },
  userName: {
    fontFamily: Fonts.display.bold,
    fontSize: 30,
    color: Colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    width: '100%',
  },
  streakView: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    height: 55,
    width: 55,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    fontFamily: Fonts.display.bold,
    color: Colors.error,
    fontSize: 16,
  },
  logoutText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 28,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 16,
  },
  dashboardSection: {
    gap: 12,
  },
  actionsSection: {
    marginBottom: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  activitiesSection: {
    marginBottom: 8,
  },
  activityList: {
    gap: 12,
  },
  challengeSection: {
    marginBottom: 10,
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
  scrollDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outline + '40',
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
  scrollGradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
    pointerEvents: 'none',
  },
  scrollGradientRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
    pointerEvents: 'none',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.primary,
    marginTop: 16,
  },
  errorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.surface,
  },
  regionsSection: {
    marginVertical: 20,
    marginHorizontal: -24,
  },
  regionsScrollWrapper: {
    position: 'relative',
    height: 210,
  },
  regionsHorizontalScroll: {
    height: 400,
  },
  regionsScrollContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 12,
    alignItems: 'center',
    height: 200,
  },
  regionsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  regionsLoadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.tertiary,
  },
  regionsErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  regionsErrorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  regionsRetryButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  regionsRetryText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.surface,
  },
});
