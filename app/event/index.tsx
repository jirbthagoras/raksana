import { EventCard } from '@/components/Cards/EventCard';
import { EventsInfoModal } from '@/components/Screens/EventsInfoModal';
import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../../hooks/useApiQueries';

export default function EventScreen() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { data: eventsData, isLoading, error, refetch } = useEvents();

  const events: Event[] = eventsData?.data?.events || [];

  // Debug log to check API response and participated field
  console.log('Events API Response:', eventsData);
  console.log('Parsed Events:', events.map(e => ({ id: e.id, name: e.name, participated: e.participated })));

  const handleBack = () => {
    router.back();
  };

  const handleEventPress = (event: Event) => {
    // Navigate to event detail screen with event data as params
    router.push({
      pathname: `/event/[id]` as any,
      params: {
        id: event.id?.toString() || '',
        location: event.location || '',
        latitude: event.latitude?.toString() || '0',
        longitude: event.longitude?.toString() || '0',
        contact: event.contact || '',
        starts_at: event.starts_at || '',
        ends_at: event.ends_at || '',
        cover_url: event.cover_url || '',
        name: event.name || '',
        description: event.description || '',
        point_gain: event.point_gain?.toString() || '0',
        created_at: event.created_at || '',
        participated: event.participated?.toString() || 'false',
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Events</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerInfoButton}
            onPress={() => setShowInfoModal(true)}
          >
            <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Memuat events...</Text>
          </View>
        </ScrollView>
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
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerInfoButton}
          onPress={() => setShowInfoModal(true)}
        >
          <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-alt" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Semua Events</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{events.length}</Text>
            </View>
          </View>

          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="calendar-times" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Belum Ada Event</Text>
              <Text style={styles.emptySubtitle}>
                Event menarik akan segera hadir!
              </Text>
            </View>
          ) : (
            <View style={styles.eventsContainer}>
              {events.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  index={index} 
                  onPress={handleEventPress} 
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Floating Action Button for Pending Attendances */}
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 600, damping: 15, stiffness: 100 }}
        style={styles.floatingButton}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/event/pending')}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="hourglass-half" size={20} color={Colors.onSecondary} />
        </TouchableOpacity>
      </MotiView>

      {/* Events Info Modal */}
      <EventsInfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 18,
    color: Colors.onSurface,
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onPrimary,
  },
  eventsContainer: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 18,
    color: Colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
