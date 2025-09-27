import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EventCardProps {
  event: Event;
  index: number;
  onPress: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateRange = () => {
    const startDate = formatDate(event.starts_at);
    const endDate = formatDate(event.ends_at);
    return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  };

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.starts_at);
    const endDate = new Date(event.ends_at);
    
    if (now >= startDate && now <= endDate) {
      return { text: 'Berlangsung', color: Colors.primary };
    } else if (now < startDate) {
      return { text: 'Akan Datang', color: Colors.secondary };
    } else {
      return { text: 'Selesai', color: Colors.onSurfaceVariant };
    }
  };

  const status = getEventStatus();

  const handleRegisterPress = (e: any) => {
    e.stopPropagation(); // Prevent triggering the card's onPress
    router.push({
      pathname: '/event/register',
      params: { eventId: event.id.toString() }
    });
  };

  const isEventActive = status.text === 'Berlangsung' || status.text === 'Akan Datang';

  // Debug log to check participation status
  console.log(`Event ${event.id} - participated: ${event.participated} (type: ${typeof event.participated}), Active: ${isEventActive}`);
  console.log('Full event object:', event);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 30, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'spring',
        delay: index * 100,
        damping: 15,
        stiffness: 100,
      }}
      style={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.card,
          event.participated && styles.participatedCardBorder,
        ]}
        onPress={() => onPress(event)}
        activeOpacity={0.8}
      >
        {/* Participated Gradient Overlay */}
        {event.participated && (
          <LinearGradient
            colors={[Colors.primary + '25', Colors.secondary + '20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.participatedGradient}
          />
        )}
        {/* Cover Image */}
        <View style={[styles.imageContainer, { zIndex: 2 }]}>
          <Image
            source={{ uri: event.cover_url }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>

          {/* Participation Badge */}
          {event.participated && (
            <View style={styles.participationBadge}>
              <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
              <Text style={styles.participationText}>Terdaftar</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={[styles.content, { zIndex: 2 }]}>
          {/* Event Name and Points */}
          <View style={styles.headerRow}>
            <Text style={styles.eventName} numberOfLines={1}>
              {event.name}
            </Text>
            <View style={styles.pointsContainer}>
              <FontAwesome5 name="coins" size={12} color={Colors.primary} />
              <Text style={styles.pointsText}>{event.point_gain}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailRow}>
            <FontAwesome5 name="map-marker-alt" size={14} color={Colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          {/* Date Range */}
          <View style={styles.detailRow}>
            <FontAwesome5 name="calendar" size={14} color={Colors.secondary} />
            <Text style={styles.dateText}>
              {formatDateRange()}
            </Text>
          </View>

          {/* Register Button */}
          {isEventActive && (
            <TouchableOpacity
              style={[
                styles.registerButton,
                event.participated && styles.registerButtonDisabled
              ]}
              onPress={event.participated ? undefined : handleRegisterPress}
              disabled={event.participated}
              activeOpacity={event.participated ? 1 : 0.8}
            >
              <FontAwesome5 
                name={event.participated ? "check-circle" : "user-plus"} 
                size={12} 
                color={event.participated ? Colors.primary : Colors.onPrimary} 
              />
              <Text style={[
                styles.registerButtonText,
                event.participated && styles.registerButtonTextDisabled
              ]}>
                {event.participated ? 'Terdaftar' : 'Daftar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  participatedCardBorder: {
    borderColor: Colors.primary + '60',
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  participatedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    zIndex: 2,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.onPrimary,
  },
  participationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  participationText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.onPrimary,
  },
  content: {
    padding: 12,
    gap: 8,
    zIndex: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventName: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    flex: 1,
    marginRight: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  pointsText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  dateText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.primaryContainer,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    opacity: 1,
  },
  registerButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onPrimary,
  },
  registerButtonTextDisabled: {
    color: Colors.primary,
    fontFamily: Fonts.text.bold,
  },
});
