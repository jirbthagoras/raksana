import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoPlayer from '../../components/VideoPlayer';
import { useMemories } from '../../hooks/useApiQueries';
import { Memory } from '../../types/auth';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40;

export default function AlbumScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    data: memoriesData,
    isLoading,
    error,
    refetch,
  } = useMemories();

  const memories = memoriesData?.data?.memories || [];

  const getFileType = (url: string) => {
    console.log('Checking file type for URL:', url);
    const extension = url.split('.').pop()?.toLowerCase();
    console.log('Extracted extension:', extension);
    const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(extension || '');
    console.log('Is video:', isVideo);
    return isVideo ? 'video' : 'image';
  };

  // Create video players for video memories at component level
  const videoPlayers = useMemo(() => {
    const players: { [key: number]: any } = {};
    memories.forEach((memory: Memory) => {
      const fileType = getFileType(memory.file_url);
      if (fileType === 'video') {
        // We'll create the player when needed, not here to avoid hooks rule violation
        players[memory.memory_id] = memory.file_url;
      }
    });
    return players;
  }, [memories]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return Colors.primary;
    }
  };

  const renderMemoryPost = ({ item, index }: { item: Memory; index: number }) => {
    const isParticipation = item.is_participation;
    const fileType = getFileType(item.file_url);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ 
          type: 'timing', 
          duration: 400, 
          delay: index * 100 
        }}
        style={[
          styles.memoryPost,
          isParticipation && styles.participationPost
        ]}
      >
        {/* Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, isParticipation && styles.participationAvatar]}>
              <FontAwesome5 
                name="user" 
                size={16} 
                color={isParticipation ? Colors.onPrimary : Colors.primary} 
              />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.user_name}</Text>
              <Text style={styles.postDate}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
          
          {isParticipation && (
            <View style={[styles.challengeBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
              <FontAwesome5 name="trophy" size={12} color={Colors.onPrimary} />
              <Text style={styles.challengeBadgeText}>
                +{item.point_gain}
              </Text>
            </View>
          )}
        </View>

        {/* Challenge Info for Participation Posts */}
        {isParticipation && (
          <View style={styles.challengeInfo}>
            <View style={styles.challengeHeader}>
              <FontAwesome5 name="flag-checkered" size={14} color={Colors.primary} />
              <Text style={styles.challengeTitle} numberOfLines={2}>
                {item.challenge_name}
              </Text>
            </View>
            <View style={styles.challengeMeta}>
              <View style={styles.challengeMetaItem}>
                <FontAwesome5 name="calendar-day" size={10} color={Colors.onSurfaceVariant} />
                <Text style={styles.challengeMetaText}>Hari {item.day}</Text>
              </View>
              <View style={styles.challengeMetaItem}>
                <FontAwesome5 name="layer-group" size={10} color={getDifficultyColor(item.difficulty)} />
                <Text style={[styles.challengeMetaText, { color: getDifficultyColor(item.difficulty) }]}>
                  {item.difficulty?.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Media Content */}
        <View style={styles.mediaContainer}>
          {fileType === 'video' ? (
            <VideoPlayer
              videoUrl={item.file_url}
              style={styles.media}
            />
          ) : (
            <Image
              source={{ uri: item.file_url }}
              style={styles.media}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Description */}
        {item.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )} 
      </MotiView>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Album</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat kenangan...</Text>
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
        <Text style={styles.headerTitle}>Album</Text>
        <View style={styles.headerSpacer} />
      </MotiView>

      {error ? (
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Gagal memuat kenangan</Text>
          <Text style={styles.errorSubtitle}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : memories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="camera" size={64} color={Colors.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>Belum ada kenangan</Text>
          <Text style={styles.emptySubtitle}>
            Mulai berbagi momen berharga Anda dengan komunitas
          </Text>
        </View>
      ) : (
        <FlatList
          data={memories}
          renderItem={renderMemoryPost}
          keyExtractor={(item) => item.memory_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
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
    opacity: 0.7,
  },
  listContent: {
    paddingVertical: 20,
  },
  memoryPost: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  participationPost: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.primaryContainer + '10',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participationAvatar: {
    backgroundColor: Colors.primary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  postDate: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  challengeBadgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.onPrimary,
  },
  challengeInfo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.primaryContainer + '20',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingTop: 12,
  },
  challengeTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 13,
    color: Colors.primary,
    flex: 1,
  },
  challengeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  challengeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  challengeMetaText: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  mediaContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.surfaceVariant,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  engagementBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
    gap: 24,
  },
  engagementButton: {
    padding: 8,
  },
});
