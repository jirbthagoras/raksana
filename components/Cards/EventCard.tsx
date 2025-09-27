import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
          event.Participated && styles.participatedCard,
        ]}
        onPress={() => onPress(event)}
        activeOpacity={0.8}
      >
        {/* Cover Image */}
        <View style={styles.imageContainer}>
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
          {event.Participated && (
            <View style={styles.participationBadge}>
              <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
              <Text style={styles.participationText}>Participated</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
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
  participatedCard: {
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primaryContainer + '10',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
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
});
