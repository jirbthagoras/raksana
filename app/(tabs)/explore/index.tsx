import GradientBackground from '@/components/Screens/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserCard from '../../../components/Cards/UserCard';
import { ExploreInfoModal } from '../../../components/Modals/ExploreInfoModal';
import FloatingElements from '../../../components/Screens/FloatingElements';
import { useProfileMe, useUsers } from '../../../hooks/useApiQueries';

const { width } = Dimensions.get('window');

interface User {
  id: number;
  level: number;
  profile_url?: string;
  username: string;
  email: string;
  streak: number;
}

export default function ExploreScreen() {
  const { data: usersData, isLoading: usersLoading, error, refetch } = useUsers();
  const { data: currentUserData, isLoading: profileLoading } = useProfileMe();
  const insets = useSafeAreaInsets();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const router = useRouter();

  // Filter out current user from the users list
  const allUsers: User[] = usersData?.data?.users || [];
  const currentUserId = currentUserData?.id;
  
  const users: User[] = allUsers.filter(user => {
    if (!currentUserId) {
      return true;
    }
    
    const isCurrentUser = user.id === currentUserId;
    if (isCurrentUser) {
      return false;
    }
  
    return true;
  });

  console.log(users);

  const handleUserPress = (user: User) => {
    console.log('User pressed:', user.username);
    console.log(user.id);
    router.push(`/explore/${user.id}`);
  };

  const renderUserCard = ({ item, index }: { item: User; index: number }) => (
    <UserCard user={item} index={index} onPress={handleUserPress} />
  );

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 300 }}
      style={styles.emptyContainer}
    >
      <View style={styles.emptyIconContainer}>
        <FontAwesome5 name="users" size={48} color={Colors.onSurfaceVariant} />
      </View>
      <Text style={styles.emptyTitle}>No Users Found</Text>
      <Text style={styles.emptySubtitle}>
        Check back later to discover other users in the community
      </Text>
    </MotiView>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading users...</Text>
    </View>
  );

  const renderErrorState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 300 }}
      style={styles.errorContainer}
    >
      <View style={styles.errorIconContainer}>
        <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
      </View>
      <Text style={styles.errorTitle}>Failed to Load Users</Text>
      <Text style={styles.errorSubtitle}>
        Please check your connection and try again
      </Text>
    </MotiView>
  );

  const isLoading = usersLoading || profileLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <GradientBackground>
          <FloatingElements />
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          {renderLoadingState()}
        </GradientBackground>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <GradientBackground>
          <FloatingElements />
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          {renderErrorState()}
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
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 100, damping: 15, stiffness: 100 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Jelajahi banyak Yards!</Text>
              <Text style={styles.headerSubtitle}>
                Jelajahi dan Kunjungi Yard Pengguna lain! 
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerInfoButton}
                onPress={() => setShowInfoModal(true)}
              >
                <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.headerIcon}>
                <FontAwesome5 name="compass" size={24} color={Colors.primary} />
              </View>
            </View>
          </View>
        </MotiView>

        {/* Users Grid */}
        <View style={styles.contentContainer}>
          <FlatList
            data={users}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={usersLoading}
                onRefresh={refetch}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        </View>

        {/* Info Modal */}
        <ExploreInfoModal
          visible={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 32,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 12,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
});
