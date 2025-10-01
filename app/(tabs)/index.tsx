import { QuestCluePopup } from '@/components/Popups/QuestCluePopup';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { MotiText, MotiView } from 'moti';
import React, { useState } from 'react';
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
import FloatingElements from '../../components/Screens/FloatingElements';
import GradientBackground from '../../components/Screens/GradientBackground';

import MonthlyRecapButton from '@/components/Buttons/MonthlyRecapButton';
import StreakButton from '@/components/Buttons/StreakButton';
import WeeklyRecapButton from '@/components/Buttons/WeeklyRecapButton';
import BalanceCard from '@/components/Cards/PointCard';
import RegionCard from '@/components/Cards/RegionCard';
import DailyChallenge from '@/components/Screens/DailyChallenge';
import NearbyQuestLocator from '@/components/Screens/NearbyQuestLocator';
import ProgressBar from '@/components/Screens/ProgressBar';
import { useRouter } from 'expo-router';
import HomePageSkeleton from '../../components/Screens/HomePageSkeleton';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorProvider } from '../../contexts/ErrorContext';
import { useDailyChallenge, useProfileMe, useRegions } from '../../hooks/useApiQueries';

const { width } = Dimensions.get('window');

// Simple Wiggle Animation Component
interface WiggleButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  from?: any;
  animate?: any;
  transition?: any;
  buttonStyle?: any;
}

const WiggleButton: React.FC<WiggleButtonProps> = ({ 
  children, 
  onPress, 
  style, 
  from, 
  animate, 
  transition,
  buttonStyle
}) => {
  const [wiggle, setWiggle] = useState(false);

  const handlePress = () => {
    setWiggle(true);
    setTimeout(() => setWiggle(false), 200);
    onPress();
  };

  return (
    <MotiView
      from={from}
      animate={{
        ...animate,
        rotateZ: wiggle ? '2deg' : '0deg',
      }}
      transition={{
        ...transition,
        type: wiggle ? 'timing' : (transition?.type || 'spring'),
        duration: wiggle ? 100 : (transition?.duration || 300),
      }}
      style={style}
    >
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    </MotiView>
  );
};

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
  needed_exp_previous_level: number;
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
  const [questClue, setQuestClue] = useState<string>('');
  const [showQuestPopup, setShowQuestPopup] = useState(false);
  
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

  // Use TanStack Query for daily challenge data
  const { 
    refetch: refetchDailyChallenge
  } = useDailyChallenge();

  // Debug regions data
  React.useEffect(() => {
    console.log('🏠 Home - regionsData:', regionsData);
    console.log('🏠 Home - regionsLoading:', regionsLoading);
    console.log('🏠 Home - regionsError:', regionsError);
    console.log('🏠 Home - regions array:', regionsData?.data?.regions);
  }, [regionsData, regionsLoading, regionsError]);

  // Handle refresh
  const handleRefresh = React.useCallback(async () => {
    await Promise.all([refetch(), refetchRegions(), refetchDailyChallenge()]);
  }, [refetch, refetchRegions, refetchDailyChallenge]);

  // Handle quest found
  const handleQuestFound = (clue: string) => {
    setQuestClue(clue);
    setShowQuestPopup(true);
  };

  // Handle quest popup close
  const handleQuestPopupClose = () => {
    setShowQuestPopup(false);
    setQuestClue('');
  };

  // Loading state
  if (loading) {
    return <HomePageSkeleton />;
  }

  const router = useRouter();

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
    <ErrorProvider>
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
                  neededExpPreviousLevel={profileData?.needed_exp_previous_level || 0}
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
              <MotiText 
                style={styles.sectionTitle}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 1600, damping: 12, stiffness: 120 }}
              >
                Quick Actions
              </MotiText>
              
              {/* Primary Actions - Large Cards */}
              <MotiView 
                style={styles.primaryActionsContainer}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 1800, damping: 15, stiffness: 100 }}
              >
                <WiggleButton
                  from={{ opacity: 0, translateY: 20, scale: 0.9 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2000, damping: 12, stiffness: 120 }}
                  style={styles.primaryActionCard}
                  buttonStyle={styles.primaryActionButton}
                  onPress={() => router.push('/journal')}
                >
                  <View style={styles.primaryActionContent}>
                    <View style={[styles.primaryActionIcon, { backgroundColor: Colors.primary + '15' }]}>
                      <FontAwesome5 name="book" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.primaryActionText}>
                      <Text style={styles.primaryActionTitle}>Journal</Text>
                      <Text style={styles.primaryActionSubtitle}>Tuangkan pikiranmu</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
                  </View>
                </WiggleButton>
                
                <WiggleButton
                  from={{ opacity: 0, translateY: 20, scale: 0.9 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2100, damping: 12, stiffness: 120 }}
                  style={styles.primaryActionCard}
                  buttonStyle={styles.primaryActionButton}
                  onPress={() => router.push('/album')}
                >
                  <View style={styles.primaryActionContent}>
                    <View style={[styles.primaryActionIcon, { backgroundColor: Colors.secondary + '15' }]}>
                      <FontAwesome5 name="images" size={24} color={Colors.secondary} />
                    </View>
                    <View style={styles.primaryActionText}>
                      <Text style={styles.primaryActionTitle}>Memory</Text>
                      <Text style={styles.primaryActionSubtitle}>Tangkap momenmu</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
                  </View>
                </WiggleButton>
              </MotiView>
              
              {/* Secondary Actions - Medium Cards */}
              <MotiView 
                style={styles.secondaryActionsContainer}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 2200, damping: 15, stiffness: 100 }}
              >
                <WiggleButton
                  from={{ opacity: 0, translateX: -20, scale: 0.9 }}
                  animate={{ opacity: 1, translateX: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2300, damping: 12, stiffness: 120 }}
                  style={styles.secondaryActionCard}
                  buttonStyle={styles.secondaryActionButton}
                  onPress={() => router.push('/event')}
                >
                  <View style={[styles.secondaryActionIcon, { backgroundColor: Colors.tertiary + '15' }]}>
                    <FontAwesome5 name="calendar-alt" size={20} color={Colors.tertiary} />
                  </View>
                  <Text style={styles.secondaryActionTitle}>Events</Text>
                </WiggleButton>
                
                
                <WiggleButton
                  from={{ opacity: 0, translateX: 20, scale: 0.9 }}
                  animate={{ opacity: 1, translateX: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2400, damping: 12, stiffness: 120 }}
                  style={styles.secondaryActionCard}
                  buttonStyle={styles.secondaryActionButton}
                  onPress={() => router.push('/recaps')}
                >
                  <View style={[styles.secondaryActionIcon, { backgroundColor: Colors.tertiary + '15' }]}>
                    <FontAwesome5 name="chart-line" size={20} color={Colors.tertiary} />
                  </View>
                  <Text style={styles.secondaryActionTitle}>Recaps</Text>
                </WiggleButton>
                
                <WiggleButton
                  from={{ opacity: 0, translateX: 20, scale: 0.9 }}
                  animate={{ opacity: 1, translateX: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2450, damping: 12, stiffness: 120 }}
                  style={styles.secondaryActionCard}
                  buttonStyle={styles.secondaryActionButton}
                  onPress={() => router.push('/challenges' as any)}
                >
                  <View style={[styles.secondaryActionIcon, { backgroundColor: Colors.secondary + '15' }]}>
                    <FontAwesome5 name="trophy" size={20} color={Colors.secondary} />
                  </View>
                  <Text style={styles.secondaryActionTitle}>Challenges</Text>
                </WiggleButton>
              </MotiView>
              
              {/* Utility Actions - Consistent Medium Cards */}
              <MotiView 
                style={styles.utilityActionsContainer}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 2500, damping: 15, stiffness: 100 }}
              >
                <WiggleButton
                  from={{ opacity: 0, translateX: -20, scale: 0.9 }}
                  animate={{ opacity: 1, translateX: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2600, damping: 12, stiffness: 120 }}
                  style={styles.utilityActionCard}
                  buttonStyle={styles.utilityActionButton}
                  onPress={() => router.push('/leaderboard')}
                >
                  <View style={[styles.utilityActionIcon, { backgroundColor: Colors.primary + '15' }]}>
                    <FontAwesome5 name="crown" size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.utilityActionTitle}>Leaderboard</Text>
                </WiggleButton>
                
                <WiggleButton
                  from={{ opacity: 0, translateX: 20, scale: 0.9 }}
                  animate={{ opacity: 1, translateX: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 2700, damping: 12, stiffness: 120 }}
                  style={styles.utilityActionCard}
                  buttonStyle={styles.utilityActionButton}
                  onPress={() => router.push('/recyclopedia')}
                >
                  <View style={[styles.utilityActionIcon, { backgroundColor: Colors.primary + '15' }]}>
                    <FontAwesome5 name="recycle" size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.utilityActionTitle}>Recyclopedia</Text>
                </WiggleButton>
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
                        {regionsData?.data?.regions?.map((region, index) => (
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
                  onQuestFound={handleQuestFound}
                />
              </MotiView>
            </MotiView>
            
          </MotiView>
        </ScrollView>

        {/* Floating Info Popup */}
        <MotiView
          from={{ opacity: 0, scale: 0.5, rotate: '0deg' }}
          animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
          transition={{ 
            type: 'spring', 
            delay: 2000, 
            damping: 12, 
            stiffness: 150,
            scale: { type: 'spring', damping: 8, stiffness: 200 }
          }}
          style={styles.floatingInfoPopup}
        >
          <TouchableOpacity
            style={styles.floatingInfoButton}
            onPress={() => router.push('/info')}
            activeOpacity={0.8}
          >
            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '360deg' }}
              transition={{ 
                type: 'timing', 
                duration: 3000, 
                loop: true,
                repeatReverse: false
              }}
            >
              <FontAwesome5 name="info-circle" size={24} color={Colors.onPrimary} />
            </MotiView>
          </TouchableOpacity>
        
        </MotiView>
      </SafeAreaView>
      
        {/* Quest Clue Popup */}
        <QuestCluePopup
          visible={showQuestPopup}
          onClose={handleQuestPopupClose}
          clue={questClue}
        />
      </GradientBackground>
    </ErrorProvider>
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
  },
  // Primary Actions Styles
  primaryActionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  primaryActionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '10',
  },
  primaryActionButton: {
    padding: 16,
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  primaryActionSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  // Secondary Actions Styles
  secondaryActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  secondaryActionButton: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  secondaryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 14,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  // Utility Actions Styles - Consistent with Secondary
  utilityActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  utilityActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  utilityActionButton: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  utilityActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  utilityActionTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 14,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  floatingInfoPopup: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  floatingInfoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingInfoText: {
    marginLeft: 8,
    marginRight: 4,
  },
  floatingInfoLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
});
