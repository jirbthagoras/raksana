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
import PagerView from 'react-native-pager-view';
import React, { useRef, useState, useCallback, useMemo } from 'react';
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
  children?: React.ReactNode;
  onProfileUpdate?: () => void;
  onMapInteractionChange?: (isInteracting: boolean) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

interface ProfileTab {
  id: string;
  name: string;
  icon: string;
}

export default function ProfileView({ profileData, isOwnProfile = false, children, onProfileUpdate, onMapInteractionChange, onRefresh, isRefreshing = false }: ProfileViewProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const tabScrollViewRef = useRef<ScrollView>(null);
  
  const profilePictureUploadMutation = useProfilePictureUpload();

  // Optimized API calls - only fetch what's needed
  const { 
    data: userLogsData, 
    isLoading: logsLoading, 
    refetch: refetchLogs 
  } = useUserLogs(!isOwnProfile ? profileData.id : 0);
  
  const { 
    data: userMemoriesData, 
    isLoading: memoriesLoading, 
    refetch: refetchMemories 
  } = useUserMemories(!isOwnProfile ? profileData.id : 0);

  // Activity data - conditional based on profile type
  const { 
    data: ownActivityData, 
    isLoading: ownActivityLoading, 
    refetch: refetchOwnActivity 
  } = useUserActivity();

  const { 
    data: otherActivityData, 
    isLoading: otherActivityLoading, 
    refetch: refetchOtherActivity 
  } = useUserActivityById(!isOwnProfile ? profileData.id : 0);

  // Treasures data - conditional based on profile type
  const { 
    data: ownTreasuresData, 
    isLoading: ownTreasuresLoading, 
    refetch: refetchOwnTreasures 
  } = useUserTreasures();

  const { 
    data: otherTreasuresData, 
    isLoading: otherTreasuresLoading, 
    refetch: refetchOtherTreasures 
  } = useUserTreasuresById(!isOwnProfile ? profileData.id : 0);

  // Memoized data selection
  const activityData = useMemo(() => 
    isOwnProfile ? ownActivityData : otherActivityData, 
    [isOwnProfile, ownActivityData, otherActivityData]
  );
  
  const activityLoading = useMemo(() => 
    isOwnProfile ? ownActivityLoading : otherActivityLoading, 
    [isOwnProfile, ownActivityLoading, otherActivityLoading]
  );
  
  const activityRefetch = useMemo(() => 
    isOwnProfile ? refetchOwnActivity : refetchOtherActivity, 
    [isOwnProfile, refetchOwnActivity, refetchOtherActivity]
  );

  const treasuresData = useMemo(() => 
    isOwnProfile ? ownTreasuresData : otherTreasuresData, 
    [isOwnProfile, ownTreasuresData, otherTreasuresData]
  );
  
  const treasuresLoading = useMemo(() => 
    isOwnProfile ? ownTreasuresLoading : otherTreasuresLoading, 
    [isOwnProfile, ownTreasuresLoading, otherTreasuresLoading]
  );
  
  const treasuresRefetch = useMemo(() => 
    isOwnProfile ? refetchOwnTreasures : refetchOtherTreasures, 
    [isOwnProfile, refetchOwnTreasures, refetchOtherTreasures]
  );

  // Memoized tabs based on profile type
  const tabs: ProfileTab[] = useMemo(() => isOwnProfile 
    ? [
        { id: 'statistics', name: 'Statistics', icon: 'chart-bar' },
        { id: 'treasures', name: 'Treasures', icon: 'gem' },
        { id: 'timeline', name: 'Timeline', icon: 'map-marker-alt' },
      ]
    : [
        { id: 'statistics', name: 'Statistics', icon: 'chart-bar' },
        { id: 'journals', name: 'Journals', icon: 'book' },
        { id: 'albums', name: 'Albums', icon: 'images' },
        { id: 'treasures', name: 'Treasures', icon: 'gem' },
        { id: 'timeline', name: 'Timeline', icon: 'map-marker-alt' },
      ], [isOwnProfile]);

  // Handle page selection from PagerView
  const handlePageSelected = useCallback((event: any) => {
    const newIndex = event.nativeEvent.position;
    setSelectedTabIndex(newIndex);
    scrollToTab(newIndex);
  }, []);

  // Handle tab press
  const handleTabPress = useCallback((index: number) => {
    setSelectedTabIndex(index);
    pagerRef.current?.setPage(index);
    scrollToTab(index);
  }, []);

  // Scroll to selected tab
  const scrollToTab = useCallback((index: number) => {
    if (tabScrollViewRef.current) {
      const tabWidth = 120;
      const scrollX = Math.max(0, (index * tabWidth) - (width / 2) + (tabWidth / 2));
      tabScrollViewRef.current.scrollTo({ x: scrollX, animated: true });
    }
  }, []);

  // Rest of the component implementation would go here...
  // (Profile image handling, render functions, etc.)

  return (
    <View style={styles.container}>
      {/* Profile Header and Tab Navigation would go here */}
      
      {/* PagerView for smooth swiping */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        scrollEnabled={true}
      >
        {tabs.map((tab) => (
          <View key={tab.id} style={styles.page}>
            {/* Page content based on tab */}
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  // Other styles...
});
