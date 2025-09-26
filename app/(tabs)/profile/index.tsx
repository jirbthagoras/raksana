import GradientBackground from '@/components/Screens/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingElements from '../../../components/Screens/FloatingElements';
import { useProfileMe } from '../../../hooks/useApiQueries';
import apiService from '../../../services/api';

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
  const tabs = ['Statistics'];
  const insets = useSafeAreaInsets();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleEditProfilePicture = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to change your profile picture.');
        return;
      }

      // Show custom image picker modal
      setShowImagePicker(true);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to open image picker');
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to select image');
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
      const response = await apiService.getProfilePictureUploadUrl(filename);
      const presignedUrl = response.data.presigned_url;

      // Upload to S3 using fetch with blob
      const fileResponse = await fetch(imageAsset.uri);
      const blob = await fileResponse.blob();
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3');
      }

      // Refresh profile data to get updated image
      await refetch();
      setImageError(false); // Reset image error state

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const renderProfileImage = () => {
    const imageUrl = profileData?.profile_url;
    const isValidUrl = imageUrl && imageUrl.trim() !== '' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

    const handleImageError = (error: any) => {
      console.log('Profile image loading error:', imageUrl, error);
      setImageError(true);
      setImageLoading(false);
    };

    const handleImageLoad = () => {
      console.log('Profile image loaded successfully:', imageUrl);
      setImageLoading(false);
      setImageError(false);
    };

    const handleImageLoadStart = () => {
      console.log('Starting to load profile image:', imageUrl);
      setImageLoading(true);
      setImageError(false);
    };

    if (!imageError && isValidUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={styles.profileImage}
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadStart={handleImageLoadStart}
          resizeMode="cover"
        />
      );
    } else {
      // Fallback avatar
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


  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
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
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
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
              <View style={styles.profileImageContainer}>
                {renderProfileImage()}
                <TouchableOpacity 
                  style={styles.editImageButton}
                  onPress={handleEditProfilePicture}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary} />
                  ) : (
                    <Ionicons name="camera" size={16} color={Colors.onPrimary} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileData.name}</Text>
                <Text style={styles.profileUsername}>@{profileData.username}</Text>
                <View style={styles.levelContainer}>
                  <View style={styles.levelBadge}>
                    <FontAwesome5 name="star" size={12} color={Colors.secondary} />
                    <Text style={styles.levelText}>Level {profileData.level}</Text>
                  </View>
                  <View style={styles.rankBadge}>
                    <FontAwesome5 name="trophy" size={12} color={Colors.primary} />
                    <Text style={styles.rankText}>Rank #{profileData.rank}</Text>
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
                    <Text style={styles.badgeInProfileFreq}>×{badge.frequency}</Text>
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
          </LinearGradient>
        </MotiView>

        {/* Tab Header */}
        <TabHeader />

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          <StatisticsTab />
        </View>
      </ScrollView>
      </GradientBackground>

      {/* Custom Image Picker Modal */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  },
  profileImageFallback: {
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.outline + '40',
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
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  rankText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.primary,
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
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  badgesCount: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  // Badges in Profile Styles
  badgesInProfile: {
    marginBottom: 16,
  },
  badgesInProfileTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 12,
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
  badgeInProfileFreq: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.secondary,
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
  // Profile Image Container Styles
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
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
    color: Colors.onErrorContainer,
  },
});
