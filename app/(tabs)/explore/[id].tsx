import ProfileView from '@/components/Profile/ProfileView';
import FloatingElements from '@/components/Screens/FloatingElements';
import GradientBackground from '@/components/Screens/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { useUserProfile } from '@/hooks/useApiQueries';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  // Handle id possibly being an array or undefined
  const rawId = Array.isArray(id) ? id[0] : id;
  const safeUserId = rawId ? Number(rawId) : NaN;
  
  const { 
    data: profileData, 
    isLoading: loading, 
    error, 
    refetch
  } = useUserProfile(Number.isFinite(safeUserId) ? safeUserId : 0);

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <FloatingElements count={6} />
          
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
            <TouchableOpacity 
              style={{ 
                width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
                justifyContent: 'center', alignItems: 'center', marginRight: 16
              }} 
              onPress={handleBack}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={{ fontFamily: Fonts.display.bold, fontSize: 20, color: Colors.onSurface }}>
              Profile
            </Text>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: Fonts.text.regular, fontSize: 16, color: Colors.onSurface }}>
              Loading profile...
            </Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Error/invalid state  
  if (!Number.isFinite(safeUserId) || safeUserId <= 0 || error || !profileData) {
    return (
      <GradientBackground>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <FloatingElements count={6} />
          
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
            <TouchableOpacity 
              style={{ 
                width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
                justifyContent: 'center', alignItems: 'center', marginRight: 16
              }} 
              onPress={handleBack}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={{ fontFamily: Fonts.display.bold, fontSize: 20, color: Colors.onSurface }}>
              Profile
            </Text>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <Text style={{ fontFamily: Fonts.text.regular, fontSize: 16, color: Colors.error, textAlign: 'center' }}>
              {!Number.isFinite(safeUserId) || safeUserId <= 0 ? 'Invalid user id' : (error?.message || 'User not found')}
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
              onPress={() => (error || (Number.isFinite(safeUserId) && safeUserId > 0 && !profileData)) ? refetch() : handleBack()}
            >
              <Text style={{ fontFamily: Fonts.text.bold, fontSize: 16, color: Colors.surface }}>
                {(error || (Number.isFinite(safeUserId) && safeUserId > 0 && !profileData)) ? 'Retry' : 'Go Back'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Success state - show the full profile using ProfileView component
  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <FloatingElements count={6} />
        
        {/* Header with back button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, marginTop: 20,}}>
          <TouchableOpacity 
            style={{ 
              width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface,
              justifyContent: 'center', alignItems: 'center', marginRight: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }} 
            onPress={handleBack}
          >
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={{ fontFamily: Fonts.display.bold, fontSize: 20, color: Colors.onSurface }}>
            {profileData.username}'s Yard
          </Text>
        </View>
        
        {/* Profile content using reusable ProfileView component */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          <ProfileView 
            profileData={profileData} 
            isOwnProfile={false}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
