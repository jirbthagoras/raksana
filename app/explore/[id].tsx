import GradientBackground from '@/components/Screens/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileView from '../../components/Profile/ProfileView';
import FloatingElements from '../../components/Screens/FloatingElements';
import { useUserProfile } from '../../hooks/useApiQueries';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userId = parseInt(id as string, 10);
  
  console.log('UserProfileScreen - ID from params:', id);
  console.log('UserProfileScreen - Parsed userId:', userId);
  
  const { data: profileData, isLoading, error, refetch } = useUserProfile(userId);
  
  console.log('UserProfileScreen - Profile data:', profileData);
  console.log('UserProfileScreen - Loading:', isLoading);
  console.log('UserProfileScreen - Error:', error);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <GradientBackground>
          <FloatingElements />
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>User Profile</Text>
            <View style={styles.headerSpacer} />
          </View>
          
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
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>User Profile</Text>
            <View style={styles.headerSpacer} />
          </View>
          
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
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{profileData.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Content */}
        <View style={styles.contentContainer}>
          <ProfileView 
            profileData={profileData} 
            isOwnProfile={false}
          />
        </View>
      </GradientBackground>
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
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface + '80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
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
});
