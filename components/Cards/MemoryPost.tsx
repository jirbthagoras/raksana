import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FullscreenImageModal from '../Modals/FullscreenImageModal';
import VideoPlayer from '../Screens/VideoPlayer';
import { Memory } from '../../types/auth';

interface MemoryPostProps {
  item: Memory;
  index: number;
  onDelete?: (memory: Memory) => void;
  isDeleting?: boolean;
}

const MemoryPost = React.memo(({ item, index, onDelete, isDeleting = false }: MemoryPostProps) => {
  const [fullscreenImageVisible, setFullscreenImageVisible] = useState(false);
  const isParticipation = item.is_participation;

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(extension || '');
    return isVideo ? 'video' : 'image';
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

  const fileType = getFileType(item.file_url);

  const handleImagePress = () => {
    if (fileType === 'image') {
      setFullscreenImageVisible(true);
    }
  };

  const closeFullscreenImage = () => {
    setFullscreenImageVisible(false);
  };

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
        
        <View style={styles.headerActions}>
          {isParticipation && (
            <View style={[styles.challengeBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
              <FontAwesome5 name="trophy" size={12} color={Colors.onPrimary} />
              <Text style={styles.challengeBadgeText}>
                +{item.point_gain}
              </Text>
            </View>
          )}
          
          {!isParticipation && onDelete && (
            <TouchableOpacity
              style={[
                styles.deleteButton,
                isDeleting && styles.deleteButtonDisabled
              ]}
              onPress={() => onDelete(item)}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={Colors.onSurfaceVariant} />
              ) : (
                <FontAwesome5 
                  name="trash" 
                  size={14} 
                  color={Colors.error} 
                />
              )}
            </TouchableOpacity>
          )}
        </View>
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
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
            <Image
              source={{ uri: item.file_url }}
              style={styles.media}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      {item.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )} 
      
      {/* Fullscreen Image Modal */}
      <FullscreenImageModal
        visible={fullscreenImageVisible}
        imageUrl={item.file_url}
        onClose={closeFullscreenImage}
      />
    </MotiView>
  );
});

const styles = StyleSheet.create({
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButtonDisabled: {
    backgroundColor: Colors.surfaceVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default MemoryPost;
export type { MemoryPostProps };
