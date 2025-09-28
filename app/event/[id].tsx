import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
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
  const scrollViewRef = useRef<ScrollView>(null);
  const [isMapInteracting, setIsMapInteracting] = useState(false);
  
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
    participated: params.participated === 'true',
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

  const handleRegisterPress = () => {
    router.push({
      pathname: '/event/register',
      params: { eventId: event.id.toString() }
    });
  };

  const isEventActive = eventStatus.status === 'upcoming' || eventStatus.status === 'ongoing';

  // Debug log to check participation status
  console.log(`Event Detail ${event.id} - participated: ${event.participated} (type: ${typeof event.participated}), Active: ${isEventActive}`);
  console.log('Event params:', params);
  console.log('Parsed event object:', event);

  const openInMaps = async () => {
    const latitude = event.latitude;
    const longitude = event.longitude;
    const label = encodeURIComponent(event.name);
    
    // Platform-specific map URLs
    const iosUrl = `maps:0,0?q=${latitude},${longitude}`;
    const androidUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    const webUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
    
    try {
      if (Platform.OS === 'ios') {
        // Try Apple Maps first
        const supported = await Linking.canOpenURL(iosUrl);
        if (supported) {
          await Linking.openURL(iosUrl);
        } else {
          // Fallback to Google Maps web
          await Linking.openURL(webUrl);
        }
      } else if (Platform.OS === 'android') {
        // Try native Android maps
        const supported = await Linking.canOpenURL(androidUrl);
        if (supported) {
          await Linking.openURL(androidUrl);
        } else {
          // Fallback to Google Maps web
          await Linking.openURL(webUrl);
        }
      } else {
        // Web fallback
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      // Final fallback - try Google Maps web URL
      try {
        await Linking.openURL(webUrl);
      } catch (fallbackError) {
        console.error('Failed to open maps:', fallbackError);
      }
    }
  };

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
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isMapInteracting}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
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
          {event.participated && (
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
            {Platform.OS === 'ios' ? (
              <View
                style={styles.mapWrapper}
                onTouchStart={() => setIsMapInteracting(true)}
                onTouchEnd={() => setIsMapInteracting(false)}
                onTouchCancel={() => setIsMapInteracting(false)}
              >
                <AppleMaps.View
                  style={[styles.map, { zIndex: 1 }]}
                  cameraPosition={{
                    coordinates: {
                      latitude: event.latitude,
                      longitude: event.longitude,
                    },
                    zoom: 15,
                  }}
                  markers={[
                    {
                      coordinates: {
                        latitude: event.latitude,
                        longitude: event.longitude,
                      },
                      title: event.name,
                    },
                  ]}
                  circles={[
                    {
                      center: {
                        latitude: event.latitude,
                        longitude: event.longitude,
                      },
                      radius: 2000, // 2km radius boundary
                      color: Colors.primary + '20',
                      lineColor: Colors.primary + '60',
                      lineWidth: 2,
                    },
                  ]}
                  uiSettings={{
                    compassEnabled: true,
                    myLocationButtonEnabled: false,
                    scaleBarEnabled: true,
                  }}
                  onCameraMove={(event) => {
                  }}
                />
              </View>
            ) : Platform.OS === 'android' ? (
              <View
                style={styles.mapWrapper}
                onTouchStart={() => setIsMapInteracting(true)}
                onTouchEnd={() => setIsMapInteracting(false)}
                onTouchCancel={() => setIsMapInteracting(false)}
              >
                <GoogleMaps.View
                  style={[styles.map, { zIndex: 1 }]}
                  cameraPosition={{
                    coordinates: {
                      latitude: event.latitude,
                      longitude: event.longitude,
                    },
                    zoom: 15,
                  }}
                  markers={[
                    {
                      coordinates: {
                        latitude: event.latitude,
                        longitude: event.longitude,
                      },
                      title: event.name,
                      snippet: event.location,
                    },
                  ]}
                  circles={[
                    {
                      center: {
                        latitude: event.latitude,
                        longitude: event.longitude,
                    },
                      radius: 2000, // 2km radius boundary
                      color: Colors.primary + '20',
                      lineColor: Colors.primary + '60',
                      lineWidth: 2,
                    },
                  ]}
                  uiSettings={{
                    compassEnabled: true,
                    myLocationButtonEnabled: false,
                    zoomControlsEnabled: true,
                    zoomGesturesEnabled: true,
                    scrollGesturesEnabled: true,
                    rotationGesturesEnabled: true,
                    tiltGesturesEnabled: true,
                  }}
                  onCameraMove={(event) => {
                  }}
                />
              </View>
            ) : (
              <View style={styles.mapPlaceholder}>
                <FontAwesome5 name="map-marked-alt" size={48} color={Colors.primary} />
                <Text style={styles.mapPlaceholderTitle}>Lokasi Event</Text>
                <Text style={styles.mapPlaceholderText}>{event.location}</Text>
                <Text style={styles.mapPlaceholderCoords}>
                  {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.openMapButton}
              onPress={openInMaps}
            >
              <FontAwesome5 name="external-link-alt" size={14} color={Colors.onPrimary} />
              <Text style={styles.openMapButtonText}>Buka di Maps</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Register Button Section */}
        {isEventActive && (
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 600 }}
            style={styles.registerSection}
          >
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
                size={18} 
                color={event.participated ? Colors.primary : Colors.onPrimary} 
              />
              <Text style={[
                styles.registerButtonText,
                event.participated && styles.registerButtonTextDisabled
              ]}>
                {event.participated ? 'Sudah Terdaftar' : 'Daftar Event'}
              </Text>
            </TouchableOpacity>
            
            {event.participated && (
              <Text style={styles.registeredNote}>
                Anda sudah terdaftar untuk event ini
              </Text>
            )}
          </MotiView>
        )}

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
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
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
    elevation: 5, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 4, // iOS
  },
  mapWrapper: {
    width: '100%',
    height: 250,
  },
  map: {
    width: '100%',
    height: 250,
    backgroundColor: 'transparent',
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
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  openMapButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  bottomSpacing: {
    height: 20,
  },
  registerSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.primaryContainer,
    borderWidth: 2,
    borderColor: Colors.primary + '60',
    opacity: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  registerButtonTextDisabled: {
    color: Colors.primary,
    fontFamily: Fonts.display.bold,
  },
  registeredNote: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
  },
});
