import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface User {
  id: number;
  level: number;
  profile_url?: string;
  username: string;
  email: string;
  streak: number;
}

interface UserCardProps {
  user: User;
  index: number;
  onPress?: (user: User) => void;
}

export default function UserCard({ user, index, onPress }: UserCardProps) {

  const formatEmail = (email: string) => {
    if (email.length > 25) {
      return email.substring(0, 22) + '...';
    }
    return email;
  };

  const handlePress = () => {
    onPress?.(user);
  };

  const renderProfileImage = () => {
    const imageUrl = user.profile_url;
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
      // Fallback avatar
      return (
        <View style={[styles.profileImage, styles.profileImageFallback]}>
          <FontAwesome5 name="user" size={24} color={Colors.onSurfaceVariant} />
        </View>
      );
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 600,
        delay: index * 100,
      }}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.surface, Colors.surfaceContainerHigh]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          {/* Header with Profile and Basic Info */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              {renderProfileImage()}
              <View style={styles.basicInfo}>
                <Text style={styles.username} numberOfLines={1}>
                  {user.username}
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {formatEmail(user.email)}
                </Text>
                <View style={styles.idContainer}>
                  <FontAwesome5 name="hashtag" size={10} color={Colors.onSurfaceVariant} />
                  <Text style={styles.idText}>ID: {user.id}</Text>
                </View>
              </View>
            </View>
            
            {/* Level Badge */}
            <View style={styles.levelBadge}>
              <FontAwesome5 name="star" size={14} color={Colors.secondary} />
              <Text style={styles.levelText}>{user.level}</Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.stat}>
              <View style={styles.statIcon}>
                <FontAwesome5 name="fire" size={12} color={user.streak > 0 ? Colors.error : Colors.onSurfaceVariant} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Streak</Text>
                <Text style={[styles.statValue, { color: user.streak > 0 ? Colors.error : Colors.onSurfaceVariant }]}>
                  {user.streak} day{user.streak !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            
            <View style={styles.stat}>
              <View style={styles.statIcon}>
                <FontAwesome5 name="trophy" size={12} color={Colors.primary} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Level</Text>
                <Text style={styles.statValue}>{user.level}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  cardContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  profileImageFallback: {
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicInfo: {
    flex: 1,
  },
  username: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 2,
  },
  email: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: 4,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idText: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  levelText: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.secondary,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onSurface,
  },
});
