import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import MemoryCard from '../../components/Cards/MemoryCard';
import { ChallengesInfoModal } from '../../components/Modals/ChallengesInfoModal';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';
import { useChallengeParticipants, useChallenges } from '../../hooks/useApiQueries';
import { Challenge, ChallengeParticipant } from '../../types/auth';

const { width } = Dimensions.get('window');

// Separate component for modal management to prevent main component re-renders
function ChallengesWithModal() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleInfoPress = useCallback(() => setShowInfoModal(true), []);
  const handleCloseModal = useCallback(() => setShowInfoModal(false), []);

  return (
    <>
      <ChallengesScreenContent onInfoPress={handleInfoPress} />
      <ChallengesInfoModal
        visible={showInfoModal}
        onClose={handleCloseModal}
      />
    </>
  );
}

function ChallengesScreenContent({ onInfoPress }: { onInfoPress: () => void }) {
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  
  const {
    data: challengesData,
    isLoading: challengesLoading,
    error: challengesError,
    refetch: refetchChallenges,
  } = useChallenges();

  const challenges = challengesData?.data?.challenges || [];
  const { showApiError } = useError();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchChallenges();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleTabPress = useCallback((index: number) => {
    setSelectedChallengeIndex(index);
    pagerRef.current?.setPage(index);
  }, []);

  const handlePageSelected = (event: any) => {
    const { position } = event.nativeEvent;
    setSelectedChallengeIndex(position);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': 
      case 'normal': return '#FF9800';
      case 'hard': return '#F44336';
      default: return Colors.primary;
    }
  };

  const renderParticipant = useCallback(({ item, index }: { item: ChallengeParticipant; index: number }) => (
    <MemoryCard 
      item={item} 
      index={index} 
      showDeleteButton={false}
    />
  ), []);

  // Create a separate component for challenge pages to use hooks properly
  const ChallengePage = React.memo(({ challenge }: { challenge: Challenge }) => {
    const {
      data: participantsData,
      isLoading: participantsLoading,
      error: participantsError,
    } = useChallengeParticipants(challenge.id);

    const participants = participantsData?.data?.participants || [];

    const renderHeader = () => (
      <View style={styles.challengeContent}>
        {/* Challenge Description */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.descriptionContainer}
        >
          <LinearGradient
            colors={[Colors.primary + '08', Colors.secondary + '05']}
            style={styles.descriptionGradient}
          >
            <View style={styles.descriptionHeader}>
              <FontAwesome5 name="info-circle" size={18} color={Colors.primary} />
              <Text style={styles.descriptionTitle}>Description</Text>
            </View>
            <Text style={styles.descriptionText}>
              {challenge.description}
            </Text>
          </LinearGradient>
        </MotiView>

        {/* Participants Header */}
        <View style={styles.participantsHeaderContainer}>
          <FontAwesome5 name="users" size={18} color={Colors.primary} />
          <Text style={styles.participantsHeaderTitle}>
            Participants ({participants.length})
          </Text>
        </View>
      </View>
    );

    if (participantsLoading) {
      return (
        <View style={styles.challengePage}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading participants...</Text>
          </View>
        </View>
      );
    }

    if (participantsError) {
      return (
        <View style={styles.challengePage}>
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-triangle" size={32} color={Colors.error} />
            <Text style={styles.errorTitle}>Failed to load participants</Text>
            <Text style={styles.errorSubtitle}>Please try again</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.challengePage}>
        <FlatList
          key={`challenge-${challenge.id}`}
          data={participants}
          renderItem={renderParticipant}
          keyExtractor={(item, index) => `${item.user_id}-${index}`}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="user-plus" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>No participants yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to participate!
              </Text>
            </View>
          }
        />
      </View>
    );
  });

  const renderTabButton = useCallback((challenge: Challenge, index: number) => {
    const isSelected = selectedChallengeIndex === index;
    const difficultyColor = getDifficultyColor(challenge.difficulty);
    
    return (
      <TouchableOpacity
        key={challenge.id}
        style={[
          styles.tabButton,
          isSelected && styles.tabButtonActive
        ]}
        onPress={() => handleTabPress(index)}
        activeOpacity={0.7}
      >
        <View style={styles.tabContainer}>
          <LinearGradient
            colors={isSelected 
              ? [Colors.primary + '15', Colors.secondary + '10'] 
              : [Colors.surface, Colors.surface + 'E0']
            }
            style={styles.tabGradient}
          >
            <View style={styles.tabContent}>
              <View style={styles.tabHeader}>
                <View style={styles.tabDayContainer}>
                  <FontAwesome5 
                    name="calendar-day" 
                    size={12} 
                    color={isSelected ? Colors.primary : Colors.onSurfaceVariant} 
                  />
                  <Text style={[
                    styles.tabDay,
                    isSelected && styles.tabDayActive
                  ]}>
                    Day {challenge.day}
                  </Text>
                </View>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: difficultyColor }
                ]}>
                  <Text style={styles.difficultyText}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.tabTitle,
                isSelected && styles.tabTitleActive
              ]} numberOfLines={2}>
                {challenge.name}
              </Text>
            </View>
          </LinearGradient>
          {isSelected && (
            <View style={[styles.tabIndicator, { backgroundColor: difficultyColor }]} />
          )}
        </View>
      </TouchableOpacity>
    );
  }, [selectedChallengeIndex, handleTabPress]);

  if (challengesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Challenge</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat challenges...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (challengesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Challenges</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Gagal memuat challenges</Text>
          <Text style={styles.errorSubtitle}>{challengesError.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (challenges.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Challenges</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="trophy" size={64} color={Colors.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>Belum ada challenges</Text>
          <Text style={styles.emptySubtitle}>
            Challenges akan tersedia segera
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Challenges</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerInfoButton}
          onPress={onInfoPress}
        >
          <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </MotiView>

      {/* Tabs */}
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
        style={styles.tabsSection}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScrollView}
        >
          {challenges.map((challenge, index) => renderTabButton(challenge, index))}
        </ScrollView>
      </MotiView>

      {/* PagerView for Challenge Pages */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 400 }}
        style={styles.pagerContainer}
      >
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          {challenges.map((challenge) => (
            <View key={challenge.id}>
              <ChallengePage challenge={challenge} />
            </View>
          ))}
        </PagerView>
      </MotiView>
    </SafeAreaView>
  );
}

export default function ChallengesScreen() {
  return (
    <ErrorProvider>
      <ChallengesWithModal />
    </ErrorProvider>
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
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '15',
  },
  tabsSection: {
    paddingBottom: 8,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  // Tab Styles
  tabsScrollView: {
    maxHeight: 120,
    zIndex: 10,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    zIndex: 10,
  },
  tabButton: {
    minWidth: 200,
  },
  tabButtonActive: {
    // Handled by container styles
  },
  tabContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  tabGradient: {
    padding: 16,
  },
  tabContent: {
    gap: 8,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabDay: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  tabDayActive: {
    color: Colors.primary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    fontFamily: Fonts.text.bold,
    fontSize: 9,
    color: Colors.onPrimary,
  },
  tabTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 18,
  },
  tabTitleActive: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  // Challenge Page Styles
  challengePage: {
    flex: 1,
  },
  challengeContent: {
    padding: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline + '15',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  descriptionGradient: {
    padding: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  descriptionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  descriptionText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  participantsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 4,
  },
  participantsHeaderTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
    marginTop: 40,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Pager Styles
  pagerContainer: {
    flex: 1,
    zIndex: 1,
  },
  pagerView: {
    flex: 1,
  },
});
