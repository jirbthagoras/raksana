import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl
} from 'react-native';
import { useUserLogs, useUserMemories } from '@/hooks/useApiQueries';
import LogCard from '@/components/Cards/LogCard';
import MemoryCard from '@/components/Cards/MemoryCard';

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
  badges: Badge[];
}

interface ProfileViewProps {
  profileData: ProfileData;
  isOwnProfile?: boolean;
  children?: React.ReactNode; // For additional buttons like logout
}

interface ProfileTab {
  id: string;
  name: string;
  icon: string;
}

export default function ProfileView({ profileData, isOwnProfile = false, children }: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState('statistics');

  // Fetch user logs and memories only for other users' profiles
  const { 
    data: userLogsData, 
    isLoading: logsLoading, 
    refetch: refetchLogs 
  } = useUserLogs(isOwnProfile ? 0 : profileData.id);
  
  const { 
    data: userMemoriesData, 
    isLoading: memoriesLoading, 
    refetch: refetchMemories 
  } = useUserMemories(isOwnProfile ? 0 : profileData.id);

  // Conditional tabs based on profile type
  const tabs: ProfileTab[] = isOwnProfile 
    ? [
        { id: 'statistics', name: 'Statistics', icon: 'chart-bar' },
      ]
    : [
        { id: 'statistics', name: 'Statistics', icon: 'chart-bar' },
        { id: 'journals', name: 'Journals', icon: 'book' },
        { id: 'albums', name: 'Albums', icon: 'images' },
      ];

  const renderProfileImage = () => {
    const imageUrl = profileData?.profile_url;
    const isValidUrl = imageUrl && imageUrl.trim() !== '' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

    if (isValidUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={[styles.profileImage, styles.profileImageFallback]}>
          <FontAwesome5 name="user" size={32} color={Colors.onSurfaceVariant} />
        </View>
      );
    }
  };

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

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'statistics':
        return (
          <>
            {/* Statistics */}
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
          </>
        );
      case 'journals':
        return (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 100 }}
            style={styles.tabContentList}
          >
            {logsLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading journals...</Text>
              </View>
            ) : userLogsData?.data?.logs?.length > 0 ? (
              <FlatList
                data={userLogsData.data.logs}
                keyExtractor={(item, index) => `log-${index}`}
                renderItem={({ item, index }) => (
                  <LogCard item={item} index={index} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={logsLoading}
                    onRefresh={refetchLogs}
                    tintColor={Colors.primary}
                    colors={[Colors.primary]}
                  />
                }
              />
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="book-open" size={48} color={Colors.onSurfaceVariant} />
                <Text style={styles.emptyText}>No journals yet</Text>
                <Text style={styles.emptySubtext}>This user hasn't written any journals</Text>
              </View>
            )}
          </MotiView>
        );
      case 'albums':
        return (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 100 }}
            style={styles.tabContentList}
          >
            {memoriesLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading albums...</Text>
              </View>
            ) : userMemoriesData?.data?.memories?.length > 0 ? (
              <FlatList
                data={userMemoriesData.data.memories}
                keyExtractor={(item) => `memory-${item.memory_id}`}
                renderItem={({ item, index }) => (
                  <MemoryCard 
                    item={item} 
                    index={index} 
                    showDeleteButton={false}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={memoriesLoading}
                    onRefresh={refetchMemories}
                    tintColor={Colors.primary}
                    colors={[Colors.primary]}
                  />
                }
              />
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="images" size={48} color={Colors.onSurfaceVariant} />
                <Text style={styles.emptyText}>No memories yet</Text>
                <Text style={styles.emptySubtext}>This user hasn't shared any memories</Text>
              </View>
            )}
          </MotiView>
        );
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoonText}>Coming Soon!</Text>
          </View>
        );
    }
  };

  // Render profile header component
  const renderProfileHeader = () => (
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
          <View style={styles.profileImageContainer}>
            {renderProfileImage()}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileUsername}>@{profileData.username}</Text>
            <View style={styles.levelContainer}>
              <View style={styles.levelBadge}>
                <FontAwesome5 name="star" size={12} color={Colors.secondary} />
                <Text style={styles.levelText}>Level {profileData.level}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesInProfile}>
          <View style={styles.badgesInProfileContainer}>
            {profileData.badges.slice(0, 3).map((badge: Badge, index: number) => (
              <View key={index} style={styles.badgeInProfileItem}>
                <View style={[styles.badgeInProfileIcon, { backgroundColor: getBadgeColor(badge.category) + '20' }]}>
                  <FontAwesome5 name={getBadgeIcon(badge.category)} size={12} color={getBadgeColor(badge.category)} />
                </View>
                <Text style={styles.badgeInProfileName}>{badge.name}</Text>
              </View>
            ))}
            {profileData.badges.length > 3 && (
              <View style={styles.badgeInProfileMore}>
                <Text style={styles.badgeInProfileMoreText}>+{profileData.badges.length - 3}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsContainer}>
          <FontAwesome5 name="coins" size={16} color={Colors.secondary} />
          <Text style={styles.pointsText}>{profileData.points.toLocaleString()} Points</Text>
        </View>

        {/* Additional buttons (logout for own profile) */}
        {children}
      </LinearGradient>
    </MotiView>
  );

  // Render tab navigation
  const renderTabNavigation = () => (
    <View style={styles.tabHeader}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabItem,
            selectedTab === tab.id && styles.activeTabItem,
          ]}
          onPress={() => setSelectedTab(tab.id)}
        >
          <FontAwesome5 
            name={tab.icon} 
            size={16} 
            color={selectedTab === tab.id ? Colors.primary : Colors.secondary} 
            style={{ marginBottom: 4 }}
          />
          <Text style={[
            styles.tabText,
            selectedTab === tab.id && styles.activeTabText,
          ]}>
            {tab.name}
          </Text>
          {selectedTab === tab.id && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  // For tabs with FlatList (Journals, Albums), use FlatList as the main container
  if (selectedTab === 'journals') {
    const logs = userLogsData?.data?.logs || [];
    
    return (
      <FlatList
        data={logs}
        keyExtractor={(item, index) => `log-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.listItemContainer}>
            <LogCard item={item} index={index} />
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            {renderProfileHeader()}
            {renderTabNavigation()}
          </>
        )}
        ListEmptyComponent={() => (
          logsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading journals...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="book-open" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>No journals yet</Text>
              <Text style={styles.emptySubtext}>This user hasn't written any journals</Text>
            </View>
          )
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.flatListStyle}
        refreshControl={
          <RefreshControl
            refreshing={logsLoading}
            onRefresh={refetchLogs}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListFooterComponent={() => <View style={styles.bottomSpacing} />}
      />
    );
  }

  if (selectedTab === 'albums') {
    const memories = userMemoriesData?.data?.memories || [];
    
    return (
      <FlatList
        data={memories}
        keyExtractor={(item) => `memory-${item.memory_id}`}
        renderItem={({ item, index }) => (
          <MemoryCard 
            item={item} 
            index={index} 
            showDeleteButton={false}
          />
        )}
        ListHeaderComponent={() => (
          <>
            {renderProfileHeader()}
            {renderTabNavigation()}
          </>
        )}
        ListEmptyComponent={() => (
          memoriesLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading albums...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="images" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>No memories yet</Text>
              <Text style={styles.emptySubtext}>This user hasn't shared any memories</Text>
            </View>
          )
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.flatListStyle}
        refreshControl={
          <RefreshControl
            refreshing={memoriesLoading}
            onRefresh={refetchMemories}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListFooterComponent={() => <View style={styles.bottomSpacing} />}
      />
    );
  }

  // For Statistics tab, use ScrollView
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {}}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {renderProfileHeader()}
      {renderTabNavigation()}
      
      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>
      
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
  profileImageFallback: {
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.outline + '40',
  },
  profileImageContainer: {
    position: 'relative',
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
    gap: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.secondary + '40',
  },
  levelText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.secondary,
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
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  badgesInProfile: {
    marginBottom: 16,
  },
  badgesInProfileContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badgeInProfileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  badgeInProfileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInProfileName: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.onSurface,
    flex: 1,
  },
  badgeInProfileMore: {
    backgroundColor: Colors.outline + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInProfileMoreText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.secondary,
  },
  bottomSpacing: {
    height: 100,
  },
  // Tab Styles
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 17,
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
  comingSoonText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 40,
  },
  tabContentList: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 30,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  flatListStyle: {
    flex: 1,
  },
  listItemContainer: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
  },
});
