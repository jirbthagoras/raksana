import { Colors, Fonts } from '@/constants';
import { useEventDetail, useQuestDetail } from '@/hooks/useApiQueries';
import { FontAwesome5 } from '@expo/vector-icons';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Activity {
  id: number;
  type: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  point_gain: number;
}

interface ActivityData {
  activities: Activity[];
}

interface TimelineProps {
  activityData?: { data: ActivityData };
  isLoading?: boolean;
  onMapInteractionChange?: (isInteracting: boolean) => void;
}

export default function Timeline({ 
  activityData, 
  isLoading = false, 
  onMapInteractionChange 
}: TimelineProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Determine activity type and fetch appropriate endpoint
  const activityId = selectedActivity?.id || null;
  const isContribution = selectedActivity?.type === 'contribution';
  const isAttendance = selectedActivity?.type === 'attendance';

  console.log(selectedActivity)
  
  // Fetch quest details only for contributions
  const { data: questDetail, isLoading: questLoading, error: questError } = useQuestDetail(
    isContribution ? activityId : null
  );
  
  // Fetch event details only for attendances
  const { data: eventDetail, isLoading: eventLoading, error: eventError } = useEventDetail(
    isAttendance ? activityId : null
  );

  const handleMapTouchStart = () => {
    onMapInteractionChange?.(true);
  };

  const handleMapTouchEnd = () => {
    onMapInteractionChange?.(false);
  };

  const handleMarkerClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDetail = () => {
    setSelectedActivity(null);
  };

  const renderContributionCard = (questData: any) => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={[styles.activityDetailContainer, styles.contributionCard]}
      >
        {/* Quest Header with Green Theme */}
        <View style={[styles.activityDetailHeader, styles.contributionHeader]}>
          <View style={styles.activityDetailTitleRow}>
            <View style={styles.contributionIcon}>
              <FontAwesome5 name="hands-helping" size={18} color="#4CAF50" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.contributionTitle}>Quest Contribution</Text>
              <Text style={styles.contributionSubtitle}>Community Quest</Text>
            </View>
            <TouchableOpacity onPress={handleCloseDetail} style={styles.closeButton}>
              <FontAwesome5 name="times" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quest Content */}
        <View style={styles.contributionContent}>
          <Text style={styles.contributionName}>{questData.name}</Text>
          <Text style={styles.contributionDescription}>{questData.description}</Text>
          
          {/* Quest Stats */}
          <View style={styles.contributionStats}>
            <View style={styles.statItem}>
              <FontAwesome5 name="map-marker-alt" size={14} color="#4CAF50" />
              <Text style={styles.statText}>{questData.location}</Text>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome5 name="coins" size={14} color="#FFB000" />
              <Text style={styles.statText}>+{questData.point_gain} points</Text>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome5 name="users" size={14} color="#4CAF50" />
              <Text style={styles.statText}>
                {questData.contributors?.length || 0}/{questData.max_contributors} contributors
              </Text>
            </View>
          </View>

          {/* Contributors Section */}
          {questData.contributors && questData.contributors.length > 0 && (
            <View style={styles.contributorsSection}>
              <Text style={styles.contributorsTitle}>
                <FontAwesome5 name="users" size={12} color="#4CAF50" /> Contributors
              </Text>
              <View style={styles.contributorsList}>
                {questData.contributors.map((contributor: any, index: number) => (
                  <View key={contributor.id} style={styles.contributorChip}>
                    <FontAwesome5 name="user-circle" size={12} color="#4CAF50" />
                    <Text style={styles.contributorName}>{contributor.username}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </MotiView>
    );
  };

  const renderAttendanceCard = (eventData: any) => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={[styles.activityDetailContainer, styles.attendanceCard]}
      >
        {/* Event Header with Blue Theme */}
        <View style={[styles.activityDetailHeader, styles.attendanceHeader]}>
          <View style={styles.activityDetailTitleRow}>
            <View style={styles.attendanceIcon}>
              <FontAwesome5 name="calendar-check" size={18} color="#2196F3" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.attendanceTitle}>Event Attendance</Text>
              <Text style={styles.attendanceSubtitle}>Community Event</Text>
            </View>
            <TouchableOpacity onPress={handleCloseDetail} style={styles.closeButton}>
              <FontAwesome5 name="times" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Content */}
        <View style={styles.attendanceContent}>
          <Text style={styles.attendanceName}>{eventData.name}</Text>
          <Text style={styles.attendanceDescription}>{eventData.description}</Text>
          
          {/* Event Details */}
          <View style={styles.attendanceDetails}>
            <View style={styles.detailRow}>
              <FontAwesome5 name="map-marker-alt" size={14} color="#2196F3" />
              <Text style={styles.detailText}>{eventData.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <FontAwesome5 name="coins" size={14} color="#FFB000" />
              <Text style={styles.detailText}>+{eventData.point_gain} points</Text>
            </View>
            
            {eventData.starts_at && (
              <View style={styles.detailRow}>
                <FontAwesome5 name="clock" size={14} color="#2196F3" />
                <Text style={styles.detailText}>
                  {new Date(eventData.starts_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            )}
            
            {eventData.attended_at && (
              <View style={styles.detailRow}>
                <FontAwesome5 name="check-circle" size={14} color="#4CAF50" />
                <Text style={styles.detailText}>
                  Attended on {new Date(eventData.attended_at).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </MotiView>
    );
  };

  const renderActivityDetail = () => {
    if (!selectedActivity) return null;

    const isLoading = questLoading || eventLoading;


    if (isLoading) {
      return (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.activityDetailContainer}
        >
          <View style={styles.detailLoadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.detailLoadingText}>Loading details...</Text>
          </View>
        </MotiView>
      );
    }

    // Render contribution card for quests
    if (isContribution && questDetail?.data && !questError) {
      return renderContributionCard(questDetail.data);
    }

    // Render attendance card for events
    if (isAttendance && eventDetail?.data && !eventError) {
      return renderAttendanceCard(eventDetail.data);
    }

    // Error state
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.activityDetailContainer}
      >
        <View style={styles.detailErrorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={16} color={Colors.error} />
          <Text style={styles.detailErrorText}>
            Failed to load {isContribution ? 'quest' : 'event'} details
          </Text>
        </View>
      </MotiView>
    );
  };

  const renderTimelineContent = () => {
    if (isLoading) {
      return (
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading timeline...</Text>
          </View>
        </ScrollView>
      );
    }

    if (!activityData?.data) {
      return (
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="map" size={48} color={Colors.onSurfaceVariant} />
            <Text style={styles.emptyText}>No activity yet</Text>
            <Text style={styles.emptySubtext}>Start participating in events and quests to see your timeline</Text>
          </View>
        </ScrollView>
      );
    }

    const activities = activityData.data.activities || [];
    
    return (
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.timelineContainer}>
          {/* Timeline Header */}
          <View style={styles.timelineHeader}>
            <FontAwesome5 name="map-marked-alt" size={24} color={Colors.primary} />
            <Text style={styles.timelineTitle}>Activity Timeline</Text>
            <Text style={styles.timelineSubtitle}>
              Klik marker-nya!
            </Text>
          </View>

          {/* Activity Map */}
          <View style={styles.mapContainer}>
          {(() => {
            
            // Use first activity as center, or default to Indonesia
            const centerCoords = activities.length > 0 
              ? { latitude: activities[0].latitude, longitude: activities[0].longitude }
              : { latitude: -6.2, longitude: 106.8 };

            // Create markers with activity data for click handling
            const markers = activities.map((activity, index) => {
              const isEvent = activity.type === 'attendance';
              const isQuest = activity.type === 'contribution';
            
              // Determine marker properties based on activity type
              let tintColor;
              if (isEvent) {
                tintColor = '#2196F3'; // Blue for events
              } else if (isQuest) {
                tintColor = '#4CAF50'; // Green for quests
              } else {
                tintColor = '#FF9800'; // Orange for unknown
              }

              // Create marker object with platform-specific properties
              const baseMarker = {
                coordinates: {
                  latitude: activity.latitude,
                  longitude: activity.longitude,
                },
                title: `${activity.name}`,
                snippet: `${activity.description} | +${activity.point_gain} pts`,
                id: `${activity.type}-${activity.id}`, // Unique ID combining type and ID
              };

              // Add platform-specific properties
              if (Platform.OS === 'ios') {
                return {
                  ...baseMarker,
                  tintColor: tintColor, // Apple Maps supports tintColor
                };
              } else {
                // For Google Maps, we'll use the base marker
                // Google Maps doesn't support direct color customization for default markers
                return {
                  ...baseMarker,
                  // Could add custom icon here if needed
                  // icon: customIconForType(activity.type)
                };
              }
            });

            return Platform.OS === 'ios' ? (
              <View
                style={styles.mapWrapper}
                onTouchStart={handleMapTouchStart}
                onTouchEnd={handleMapTouchEnd}
                onTouchCancel={handleMapTouchEnd}
              >
                <AppleMaps.View
                  style={[styles.map, { zIndex: 1 }]}
                  cameraPosition={{
                    coordinates: {
                      latitude: centerCoords.latitude,
                      longitude: centerCoords.longitude,
                    },
                    zoom: 10,
                  }}
                  markers={markers}
                  onMarkerClick={(marker) => {
                    // Parse marker ID to get type and activity ID
                    if (!marker.id) return;
                    
                    const [activityType, activityIdStr] = marker.id.split('-');
                    const activityId = parseInt(activityIdStr);
                    
                    // Find activity by both type and ID to ensure correct match
                    const activity = activities.find(a => 
                      a.type === activityType && a.id === activityId
                    );
                    
                    if (activity) {
                      handleMarkerClick(activity);
                    }
                  }}
                  uiSettings={{
                    compassEnabled: false,
                    myLocationButtonEnabled: false,
                    scaleBarEnabled: false,
                  }}
                  onCameraMove={(event) => {
                  }}
                />
              </View>
            ) : (
              <View
                style={styles.mapWrapper}
                onTouchStart={handleMapTouchStart}
                onTouchEnd={handleMapTouchEnd}
                onTouchCancel={handleMapTouchEnd}
              >
                <GoogleMaps.View
                  style={[styles.map, { zIndex: 1 }]}
                  cameraPosition={{
                    coordinates: {
                      latitude: centerCoords.latitude,
                      longitude: centerCoords.longitude,
                    },
                    zoom: 10,
                  }}
                  markers={markers}
                  onMarkerClick={(marker) => {
                    // Parse marker ID to get type and activity ID
                    if (!marker.id) return;
                    
                    const [activityType, activityIdStr] = marker.id.split('-');
                    const activityId = parseInt(activityIdStr);
                    
                    // Find activity by both type and ID to ensure correct match
                    const activity = activities.find(a => 
                      a.type === activityType && a.id === activityId
                    );
                    
                    if (activity) {
                      handleMarkerClick(activity);
                    }
                  }}
                  uiSettings={{
                    compassEnabled: false,
                    myLocationButtonEnabled: false,
                    zoomControlsEnabled: true,
                    zoomGesturesEnabled: true,
                    scrollGesturesEnabled: true,
                    rotationGesturesEnabled: false,
                    tiltGesturesEnabled: false,
                    scaleBarEnabled: false,
                  }}
                  onCameraMove={(event) => {
                  }}
                />
              </View>
            );
          })()}
        </View>

        {/* Activity Summary */}
        <View style={styles.activitySummary}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, { backgroundColor: '#2196F3' + '20' }]}>
              <FontAwesome5 name="calendar-check" size={16} color="#2196F3" />
            </View>
            <Text style={styles.summaryText}>
              {activities.filter((activity: Activity) => activity.type === 'attendance').length} Events
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, { backgroundColor: '#4CAF50' + '20' }]}>
              <FontAwesome5 name="hands-helping" size={16} color="#4CAF50" />
            </View>
            <Text style={styles.summaryText}>
              {activities.filter((activity: Activity) => activity.type === 'contribution').length} Quests
            </Text>
          </View>
        </View>

          {/* Activity Detail Section */}
          {renderActivityDetail()}
        </View>
        
        {/* Bottom spacing for scroll */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  return renderTimelineContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
  },
  timelineContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timelineHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  timelineTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginTop: 8,
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  mapWrapper: {
    width: '100%',
    height: 300,
  },
  map: {
    width: '100%',
    height: 300,
    backgroundColor: 'transparent',
  },
  activitySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 8,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  // Activity Detail Styles
  activityDetailContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityDetailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
    paddingBottom: 12,
  },
  activityDetailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  activityTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetailTitle: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant + '40',
  },
  detailLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  detailLoadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  activityDetailContent: {
    padding: 16,
  },
  activityDetailName: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  activityDetailDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
  },
  activityDetailInfo: {
    gap: 8,
    marginBottom: 16,
  },
  detailInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailInfoText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurface,
  },
  contributorsSection: {
    marginTop: 8,
  },
  contributorsTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  contributorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contributorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  contributorName: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.primary,
  },
  detailErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  detailErrorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.error,
  },
  // Contribution Card Styles
  contributionCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  contributionHeader: {
    backgroundColor: '#4CAF50' + '10',
  },
  contributionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  contributionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 2,
  },
  contributionSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  contributionContent: {
    padding: 16,
  },
  contributionName: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  contributionDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
  },
  contributionStats: {
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
  },
  contributorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50' + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  // Attendance Card Styles
  attendanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  attendanceHeader: {
    backgroundColor: '#2196F3' + '10',
  },
  attendanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendanceTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 2,
  },
  attendanceSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  attendanceContent: {
    padding: 16,
  },
  attendanceName: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  attendanceDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
  },
  attendanceDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
});
