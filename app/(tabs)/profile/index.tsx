import GradientBackground from '@/components/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
     Dimensions,
     Image,
     Pressable,
     RefreshControl,
     SafeAreaView,
     ScrollView,
     StatusBar,
     StyleSheet,
     Text,
     TouchableOpacity,
     View
} from 'react-native';
import FloatingElements from '../../../components/FloatingElements';
import { useProfileMe } from '../../../hooks/useApiQueries';

const { width } = Dimensions.get('window');

interface Badge {
  category: string;
  name: string;
  frequency: number;
}

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
  badges: Badge[];
}

export default function ProfileScreen() {
  const { data: profileData, isLoading, error, refetch } = useProfileMe();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Statistics', 'Badges'];

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'challenge': return 'trophy';
      case 'quest': return 'compass';
      case 'treasure': return 'gem';
      default: return 'award';
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'challenge': return Colors.secondary;
      case 'quest': return Colors.tertiary;
      case 'treasure': return Colors.primary;
      default: return Colors.outline;
    }
  };

  const StatCard = ({ icon, label, value, color = Colors.primary }: {
    icon: string;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <FontAwesome5 name={icon} size={16} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const BadgeItem = ({ badge }: { badge: Badge }) => (
    <View style={styles.badgeItem}>
      <View style={[styles.badgeIcon, { backgroundColor: getBadgeColor(badge.category) + '20' }]}>
        <FontAwesome5 name={getBadgeIcon(badge.category)} size={14} color={getBadgeColor(badge.category)} />
      </View>
      <View style={styles.badgeInfo}>
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeFrequency}>×{badge.frequency}</Text>
      </View>
    </View>
  );

  const TabHeader = () => (
    <View style={styles.tabHeader}>
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          style={[styles.tabItem, activeTab === index && styles.activeTabItem]}
          onPress={() => setActiveTab(index)}
        >
          <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
            {tab}
          </Text>
          {activeTab === index && <View style={styles.tabIndicator} />}
        </Pressable>
      ))}
    </View>
  );

  const StatisticsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Statistics Grid */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 100 }}
        style={styles.tabContent}
      >
        <View style={styles.statsGrid}>
          <StatCard icon="trophy" label="Challenges" value={profileData?.challenges || 0} color={Colors.secondary} />
          <StatCard icon="calendar" label="Events" value={profileData?.events || 0} color={Colors.tertiary} />
          <StatCard icon="compass" label="Quests" value={profileData?.quests || 0} color={Colors.primary} />
          <StatCard icon="gem" label="Treasures" value={profileData?.treasures || 0} color={Colors.error} />
        </View>
      </MotiView>

      {/* Activity Stats */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 200 }}
        style={styles.tabContent}
      >
        <View style={styles.activityGrid}>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <FontAwesome5 name="fire" size={16} color={Colors.error} />
              <Text style={styles.activityLabel}>Longest Streak</Text>
            </View>
            <Text style={styles.activityValue}>{profileData?.longest_streak || 0} days</Text>
            <Text style={styles.activitySubtext}>Personal best</Text>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <FontAwesome5 name="seedling" size={16} color={Colors.tertiary} />
              <Text style={styles.activityLabel}>Trees Grown</Text>
            </View>
            <Text style={styles.activityValue}>{profileData?.tree_grown || 0}</Text>
            <Text style={styles.activitySubtext}>Environmental impact</Text>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <FontAwesome5 name="fire" size={16} color={Colors.error} />
              <Text style={styles.activityLabel}>Current Streak</Text>
            </View>
            <Text style={styles.activityValue}>{profileData?.current_Streak || 0} days</Text>
            <Text style={styles.activitySubtext}>Keep it up!</Text>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <FontAwesome5 name="tasks" size={16} color={Colors.primary} />
              <Text style={styles.activityLabel}>Tasks</Text>
            </View>
            <Text style={styles.activityValue}>{profileData?.completed_task || 0}/{profileData?.assigend_task || 0}</Text>
            <Text style={styles.activitySubtext}>{profileData?.task_completion_rate || '0%'} completion</Text>
          </View>
        </View>
      </MotiView>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const BadgesTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 100 }}
        style={styles.tabContent}
      >
        <Text style={styles.badgesCount}>{profileData?.badges.length || 0} Badges Earned</Text>
        <View style={styles.badgesContainer}>
          {profileData?.badges.map((badge: Badge, index: number) => (
            <BadgeItem key={index} badge={badge} />
          )) || []}
        </View>
      </MotiView>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <GradientBackground>
          <FloatingElements />
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  if (error || !profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <GradientBackground>
          <FloatingElements />
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load profile</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground>
        <FloatingElements />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
          >
            <Text style={styles.headerTitle}>Profile</Text>
          </MotiView>
        </View>

        {/* Profile Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.profileCard}
        >
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceContainerHigh]}
            style={styles.profileCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileHeader}>
              <Image source={{ uri: profileData.profile_url }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileData.name}</Text>
                <Text style={styles.profileUsername}>@{profileData.username}</Text>
                <View style={styles.levelContainer}>
                  <FontAwesome5 name="star" size={12} color={Colors.secondary} />
                  <Text style={styles.levelText}>Level {profileData.level}</Text>
                  <Text style={styles.rankText}>Rank #{profileData.rank}</Text>
                </View>
              </View>
            </View>

            {/* Experience Progress */}
            <View style={styles.expSection}>
              <View style={styles.expHeader}>
                <Text style={styles.expLabel}>Experience</Text>
                <Text style={styles.expText}>
                  {profileData.current_exp} / {profileData.exp_needed} XP
                </Text>
              </View>
              <View style={styles.expBarContainer}>
                <View style={styles.expBarBackground}>
                  <LinearGradient
                    colors={[Colors.secondary, Colors.tertiary]}
                    style={[
                      styles.expBarFill,
                      { width: `${(profileData.current_exp / profileData.exp_needed) * 100}%` }
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            </View>

            {/* Points */}
            <View style={styles.pointsContainer}>
              <FontAwesome5 name="coins" size={16} color={Colors.secondary} />
              <Text style={styles.pointsText}>{profileData.points.toLocaleString()} Points</Text>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Tab Header */}
        <TabHeader />

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {activeTab === 0 ? <StatisticsTab /> : <BadgesTab />}
        </View>
      </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 32,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileCardGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  profileUsername: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
  },
  rankText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 8,
  },
  expSection: {
    marginBottom: 16,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  expText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
  },
  expBarContainer: {
    height: 8,
    backgroundColor: Colors.outline + '30',
    borderRadius: 4,
    overflow: 'hidden',
  },
  expBarBackground: {
    flex: 1,
  },
  expBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.secondaryContainer,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  pointsText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.secondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'center',
  },
  activityGrid: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  activityLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  activityValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 4,
  },
  activitySubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
  },
  badgesContainer: {
    gap: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeName: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  badgeFrequency: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bottomSpacing: {
    height: 100,
  },
  // Tab Styles
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  activeTabItem: {
    backgroundColor: Colors.primary + '10',
  },
  tabText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.secondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  tabContentContainer: {
    flex: 1,
    marginTop: 0,
  },
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  badgesCount: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
});
