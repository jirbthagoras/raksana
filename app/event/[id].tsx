import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
// import { ExpoMap } from 'expo-maps'; // TODO: Fix expo-maps import
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  
  // Parse the event data from params
  const event: Event = {
    id: Number(params.id),
    location: params.location as string,
    latitude: Number(params.latitude),
    longitude: Number(params.longitude),
    contact: params.contact as string,
    starts_at: params.starts_at as string,
    ends_at: params.ends_at as string,
    cover_url: params.cover_url as string,
    name: params.name as string,
    description: params.description as string,
    point_gain: Number(params.point_gain),
    created_at: params.created_at as string,
    Participated: params.Participated === 'true',
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.starts_at);
    const endDate = new Date(event.ends_at);

    if (now < startDate) {
      return { status: 'upcoming', text: 'Akan Datang', color: Colors.primary };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'ongoing', text: 'Sedang Berlangsung', color: '#FF9800' };
    } else {
      return { status: 'ended', text: 'Telah Berakhir', color: Colors.onSurfaceVariant };
    }
  };

  const eventStatus = getEventStatus();

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
          <Text style={styles.headerTitle}>Detail Event</Text>
        </View>
        <View style={styles.headerSpacer} />
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Cover Image */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.coverContainer}
        >
          <Image source={{ uri: event.cover_url }} style={styles.coverImage} />
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: eventStatus.color }]}>
              {eventStatus.text}
            </Text>
          </View>
          {event.Participated && (
            <View style={styles.participatedBadge}>
              <FontAwesome5 name="check-circle" size={16} color={Colors.onPrimary} />
              <Text style={styles.participatedText}>Sudah Berpartisipasi</Text>
            </View>
          )}
        </MotiView>

        {/* Event Information */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.infoContainer}
        >
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>

          {/* Event Details Cards */}
          <View style={styles.detailsContainer}>
            {/* Date & Time Card */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <FontAwesome5 name="calendar-alt" size={18} color={Colors.primary} />
                <Text style={styles.detailTitle}>Waktu Event</Text>
              </View>
              <View style={styles.detailContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mulai:</Text>
                  <Text style={styles.detailValue}>{formatDate(event.starts_at)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Berakhir:</Text>
                  <Text style={styles.detailValue}>{formatDate(event.ends_at)}</Text>
                </View>
              </View>
            </View>

            {/* Location Card */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <FontAwesome5 name="map-marker-alt" size={18} color={Colors.secondary} />
                <Text style={styles.detailTitle}>Lokasi</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.locationText}>{event.location}</Text>
                <Text style={styles.coordinatesText}>
                  {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            {/* Contact & Points Card */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <FontAwesome5 name="info-circle" size={18} color={Colors.tertiary} />
                <Text style={styles.detailTitle}>Informasi Lainnya</Text>
              </View>
              <View style={styles.detailContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kontak:</Text>
                  <Text style={styles.detailValue}>{event.contact}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Poin Reward:</Text>
                  <Text style={[styles.detailValue, styles.pointsText]}>
                    {event.point_gain} poin
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Map Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={styles.mapSection}
        >
          <View style={styles.mapHeader}>
            <FontAwesome5 name="map" size={18} color={Colors.primary} />
            <Text style={styles.mapTitle}>Lokasi di Peta</Text>
          </View>
          <View style={styles.mapContainer}>
            {/* Map Placeholder - TODO: Implement expo-maps when import is fixed */}
            <View style={styles.mapPlaceholder}>
              <FontAwesome5 name="map-marked-alt" size={48} color={Colors.primary} />
              <Text style={styles.mapPlaceholderTitle}>Lokasi Event</Text>
              <Text style={styles.mapPlaceholderText}>{event.location}</Text>
              <Text style={styles.mapPlaceholderCoords}>
                {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity 
                style={styles.openMapButton}
                onPress={() => {
                  // Open in external map app
                  const url = `https://maps.google.com/?q=${event.latitude},${event.longitude}`;
                  console.log('Open map:', url);
                }}
              >
                <FontAwesome5 name="external-link-alt" size={14} color={Colors.onPrimary} />
                <Text style={styles.openMapButtonText}>Buka di Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  coverContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.surfaceVariant,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
  },
  participatedBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  participatedText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onPrimary,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  eventName: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  eventDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    gap: 16,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  detailContent: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  detailValue: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 2,
    textAlign: 'right',
  },
  locationText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  coordinatesText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  pointsText: {
    color: Colors.primary,
    fontFamily: Fonts.text.bold,
  },
  mapSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mapTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  map: {
    width: '100%',
    height: 250,
  },
  mapPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mapPlaceholderTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  mapPlaceholderText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  mapPlaceholderCoords: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  openMapButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  bottomSpacing: {
    height: 20,
  },
});
