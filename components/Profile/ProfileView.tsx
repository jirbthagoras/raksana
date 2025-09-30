import LogCard from '@/components/Cards/LogCard';
import MemoryCard from '@/components/Cards/MemoryCard';
import TreasureCard from '@/components/Cards/TreasureCard';
import { TimelineScreen } from '@/components/Timeline';
import { Colors, Fonts } from '@/constants';
import { useProfilePictureUpload, useUserActivity, useUserActivityById, useUserLogs, useUserMemories, useUserTreasures, useUserTreasuresById } from '@/hooks/useApiQueries';
import apiService from '@/services/api';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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
  onProfileUpdate?: () => void; // Callback for profile updates
  onMapInteractionChange?: (isInteracting: boolean) => void; // Callback for map interaction state
  onRefresh?: () => void; // Callback for pull-to-refresh
  isRefreshing?: boolean; // Loading state for refresh
  disabledTabs?: string[]; // Array of tab IDs to disable
}

interface ProfileTab {
  id: string;
  name: string;
  icon: string;
}

export default function ProfileView({ profileData, isOwnProfile = false, children, onProfileUpdate, onMapInteractionChange, onRefresh, isRefreshing = false, disabledTabs = [] }: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState('statistics');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const profilePictureUploadMutation = useProfilePictureUpload();

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

  // Conditional API calls based on profile type
  const { 
    data: userActivityData, 
    isLoading: activityLoading, 
    refetch: refetchActivity 
  } = useUserActivity();

  const { 
    data: otherUserActivityData, 
    isLoading: otherActivityLoading, 
    refetch: refetchOtherActivity 
  } = useUserActivityById(isOwnProfile ? 0 : profileData.id);

  const { 
    data: userTreasuresData, 
    isLoading: treasuresLoading, 
    refetch: refetchTreasures 
  } = useUserTreasures();

  const { 
    data: otherUserTreasuresData, 
    isLoading: otherTreasuresLoading, 
    refetch: refetchOtherTreasures 
  } = useUserTreasuresById(isOwnProfile ? 0 : profileData.id);

  // Use appropriate data based on profile type
  const finalActivityData = isOwnProfile ? userActivityData : otherUserActivityData;
  const finalActivityLoading = isOwnProfile ? activityLoading : otherActivityLoading;
  const finalActivityRefetch = isOwnProfile ? refetchActivity : refetchOtherActivity;

  const finalTreasuresData = isOwnProfile ? userTreasuresData : otherUserTreasuresData;
  const finalTreasuresLoading = isOwnProfile ? treasuresLoading : otherTreasuresLoading;
  const finalTreasuresRefetch = isOwnProfile ? refetchTreasures : refetchOtherTreasures;


  // All tabs available for both profile types
  const allTabs: ProfileTab[] = [
    { id: 'statistics', name: 'Stats', icon: 'chart-bar' },
    { id: 'journals', name: 'Journals', icon: 'book' },
    { id: 'albums', name: 'Albums', icon: 'images' },
    { id: 'treasures', name: 'Treasures', icon: 'gem' },
    { id: 'timeline', name: 'Timeline', icon: 'map-marker-alt' },
  ];

  // Filter out disabled tabs
  const tabs = allTabs.filter(tab => !disabledTabs.includes(tab.id));

  const handleEditProfilePicture = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Camera roll permissions not granted');
        return;
      }

      // Show custom image picker modal
      setShowImagePicker(true);
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Camera permissions not granted');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  const uploadProfilePicture = async (imageAsset: any) => {
    try {
      setIsUploadingImage(true);

      // Get file extension
      const fileExtension = imageAsset.uri.split('.').pop() || 'jpg';
      const filename = `profile_${Date.now()}.${fileExtension}`;
      const contentType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

      // Get presigned URL
      const response = await profilePictureUploadMutation.mutateAsync(filename);
      const presignedUrl = response.data.presigned_url;

      // Upload to S3 using the API service method
      await apiService.uploadToPresignedUrl(presignedUrl, imageAsset, contentType);

      // Call the profile update callback to refresh data
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const renderProfileImage = () => {
    const imageUrl = profileData?.profile_url;
    const isValidUrl = imageUrl && imageUrl.trim() !== '' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

    return (
      <View style={styles.profileImageContainer}>
        {isValidUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.profileImage, styles.profileImageFallback]}>
            <FontAwesome5 name="user" size={32} color={Colors.onSurfaceVariant} />
          </View>
        )}
        
        {/* Edit button for own profile */}
        {isOwnProfile && (
          <TouchableOpacity 
            style={styles.editImageButton}
            onPress={handleEditProfilePicture}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <FontAwesome5 name="camera" size={12} color={Colors.surface} />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'challenge': return 'trophy';
      case 'quest': return 'compass';
      case 'treasure': return 'gem';
      case 'event': return 'calendar-alt';
      case 'streak': return 'fire';
      case 'task': return 'tasks';
      default: return 'award';
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'challenge': return Colors.secondary;
      case 'quest': return Colors.primary;
      case 'treasure': return Colors.tertiary;
      case 'event': return Colors.primary;
      case 'streak': return Colors.error;
      case 'task': return Colors.secondary;
      default: return Colors.primary;
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
          <View style={styles.tabContent}>
            <Text style={styles.comingSoonText}>Loading journals...</Text>
          </View>
        );
      case 'albums':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoonText}>Loading albums...</Text>
          </View>
        );
      case 'treasures':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoonText}>Loading treasures...</Text>
          </View>
        );
      case 'timeline':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoonText}>Loading timeline...</Text>
          </View>
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
          {renderProfileImage()}
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
        {profileData.badges && profileData.badges.length > 0 && (
          <View style={styles.badgesInProfile}>
            <Text style={styles.badgesSectionTitle}>Badges</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesScrollContainer}
            >
              {profileData.badges.map((badge: Badge, index: number) => (
                <View key={index} style={styles.badgeInProfileItem}>
                  <View style={[styles.badgeInProfileIcon, { backgroundColor: getBadgeColor(badge.category) + '15' }]}>
                    <FontAwesome5 
                      name={getBadgeIcon(badge.category)} 
                      size={14} 
                      color={getBadgeColor(badge.category)} 
                    />
                  </View>
                  <Text style={styles.badgeInProfileName}>{badge.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

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
    <View style={styles.tabHeaderContainer}>
      <View style={styles.tabContainer}>
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
              size={18} 
              color={selectedTab === tab.id ? Colors.primary : Colors.secondary} 
              style={{ marginBottom: 6 }}
            />

            {selectedTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // For tabs with FlatList (Journals, Albums), use full-screen FlatList
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
        style={styles.fullScreenList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || logsLoading}
            onRefresh={() => {
              onRefresh?.();
              refetchLogs();
            }}
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
        style={styles.fullScreenList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || memoriesLoading}
            onRefresh={() => {
              onRefresh?.();
              refetchMemories();
            }}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListFooterComponent={() => <View style={styles.bottomSpacing} />}
      />
    );
  }

  if (selectedTab === 'treasures') {
    const treasures = finalTreasuresData?.data?.treasures || finalTreasuresData?.data || [];
    
    return (
      <FlatList
        data={treasures}
        keyExtractor={(item, index) => `treasure-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.listItemContainer}>
            <TreasureCard item={item} index={index} />
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            {renderProfileHeader()}
            {renderTabNavigation()}
          </>
        )}
        ListEmptyComponent={() => (
          finalTreasuresLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading treasures...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="gem" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>No treasures yet</Text>
              <Text style={styles.emptySubtext}>Complete activities to find treasures</Text>
            </View>
          )
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.fullScreenList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || finalTreasuresLoading}
            onRefresh={() => {
              onRefresh?.();
              finalTreasuresRefetch();
            }}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListFooterComponent={() => <View style={styles.bottomSpacing} />}
      />
    );
  }

  if (selectedTab === 'timeline') {
    return (
      <TimelineScreen
        activityData={finalActivityData}
        isLoading={finalActivityLoading}
        onRefresh={() => {
          onRefresh?.();
          finalActivityRefetch();
        }}
        isRefreshing={isRefreshing}
        profileHeader={renderProfileHeader()}
        tabNavigation={renderTabNavigation()}
      />
    );
  }

  // For Statistics tab, use full-screen ScrollView
  return (
    <>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.fullScreenList}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh?.()}
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
      
      {/* Image Picker Modal - only for own profile */}
      {isOwnProfile && (
        <Modal
          visible={showImagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImagePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowImagePicker(false)}
          >
            <TouchableOpacity 
              style={styles.imagePickerSheet}
              activeOpacity={1}
              onPress={() => {}}
            >
              <View style={styles.imagePickerHeader}>
                <View style={styles.imagePickerHandle} />
                <Text style={styles.imagePickerTitle}>Change Profile Picture</Text>
                <Text style={styles.imagePickerSubtitle}>Choose how you want to update your profile picture</Text>
              </View>
              
              <View style={styles.imagePickerButtons}>
                <TouchableOpacity 
                  style={styles.imagePickerButton}
                  onPress={() => {
                    setShowImagePicker(false);
                    pickImageFromCamera();
                  }}
                >
                  <View style={styles.imagePickerButtonIcon}>
                    <FontAwesome5 name="camera" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.imagePickerButtonContent}>
                    <Text style={styles.imagePickerButtonTitle}>Take Photo</Text>
                    <Text style={styles.imagePickerButtonSubtitle}>Use camera to take a new photo</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imagePickerButton}
                  onPress={() => {
                    setShowImagePicker(false);
                    pickImageFromGallery();
                  }}
                >
                  <View style={styles.imagePickerButtonIcon}>
                    <FontAwesome5 name="images" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.imagePickerButtonContent}>
                    <Text style={styles.imagePickerButtonTitle}>Choose from Gallery</Text>
                    <Text style={styles.imagePickerButtonSubtitle}>Select from your photo library</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.imagePickerCancelButton}
                onPress={() => setShowImagePicker(false)}
              >
                <Text style={styles.imagePickerCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenList: {
    flex: 1,
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
  badgesSectionTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  badgesScrollContainer: {
    paddingRight: 20,
    gap: 8,
  },
  badgeInProfileItem: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 70,
    maxWidth: 90,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  badgeInProfileIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeInProfileName: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 12,
  },
  badgeFrequency: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeFrequencyText: {
    fontFamily: Fonts.text.bold,
    fontSize: 8,
    color: Colors.onPrimary,
  },
  badgeInProfileMore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.outline + '15',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    borderStyle: 'dashed',
  },
  badgeInProfileMoreText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  bottomSpacing: {
    height: 100,
  },
  // Tab Styles
  tabHeaderContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 70,
  },
  activeTabItem: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  tabText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  activeTabText: {
    color: Colors.primary,
    fontSize: 13,
    fontFamily: Fonts.display.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
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
  // Edit Profile Image Button Styles
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Image Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imagePickerSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  imagePickerHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  imagePickerHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.onSurfaceVariant + '40',
    borderRadius: 2,
    marginBottom: 16,
  },
  imagePickerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  imagePickerSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  imagePickerButtons: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceVariant + '40',
    borderRadius: 16,
    marginBottom: 12,
  },
  imagePickerButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imagePickerButtonContent: {
    flex: 1,
  },
  imagePickerButtonTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  imagePickerButtonSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  imagePickerCancelButton: {
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: Colors.errorContainer,
    borderRadius: 16,
    alignItems: 'center',
  },
  imagePickerCancelButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.error,
  },
});