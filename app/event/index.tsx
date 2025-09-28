import { EventCard } from '@/components/Cards/EventCard';
import { EventsInfoModal } from '@/components/Screens/EventsInfoModal';
import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../../hooks/useApiQueries';

const { width } = Dimensions.get('window');

type EventTab = 'all' | 'upcoming' | 'ongoing' | 'ended';

export default function EventScreen() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<EventTab>('all');
  const { data: eventsData, isLoading, error, refetch } = useEvents();

  const events: Event[] = eventsData?.data?.events || [];

  // Filter events based on selected tab
  const getFilteredEvents = () => {
    const now = new Date();
    
    switch (selectedTab) {
      case 'upcoming':
        return events.filter(event => new Date(event.starts_at) > now);
      case 'ongoing':
        return events.filter(event => {
          const startDate = new Date(event.starts_at);
          const endDate = new Date(event.ends_at);
          return now >= startDate && now <= endDate;
        });
      case 'ended':
        return events.filter(event => new Date(event.ends_at) < now);
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

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

  const getTabInfo = (tab: EventTab) => {
    const now = new Date();
    let count = 0;
    let icon = '';
    let label = '';
    let color = '';

    switch (tab) {
      case 'all':
        count = events.length;
        icon = 'calendar-alt';
        label = 'Semua';
        color = Colors.primary;
        break;
      case 'upcoming':
        count = events.filter(event => new Date(event.starts_at) > now).length;
        icon = 'clock';
        label = 'Akan Datang';
        color = Colors.secondary;
        break;
      case 'ongoing':
        count = events.filter(event => {
          const startDate = new Date(event.starts_at);
          const endDate = new Date(event.ends_at);
          return now >= startDate && now <= endDate;
        }).length;
        icon = 'play-circle';
        label = 'Berlangsung';
        color = '#FF9800';
        break;
      case 'ended':
        count = events.filter(event => new Date(event.ends_at) < now).length;
        icon = 'check-circle';
        label = 'Selesai';
        color = Colors.onSurfaceVariant;
        break;
    }

    return { count, icon, label, color };
  };

  const renderTabButton = (tab: EventTab) => {
    const isSelected = selectedTab === tab;
    const tabInfo = getTabInfo(tab);
    
    return (
      <TouchableOpacity
        key={tab}
        style={[
          styles.tabButton,
          isSelected && styles.tabButtonActive,
        ]}
        onPress={() => setSelectedTab(tab)}
        activeOpacity={0.7}
      >
        {isSelected && (
          <LinearGradient
            colors={[tabInfo.color + '25', tabInfo.color + '15']}
            style={styles.tabGradient}
          />
        )}
        <View style={styles.tabContent}>
          <View style={styles.tabHeader}>
            <FontAwesome5 
              name={tabInfo.icon as any} 
              size={16} 
              color={isSelected ? tabInfo.color : Colors.onSurfaceVariant} 
            />
            <View style={[
              styles.tabBadge,
              { backgroundColor: isSelected ? tabInfo.color : Colors.surfaceVariant }
            ]}>
              <Text style={[
                styles.tabBadgeText,
                { color: isSelected ? Colors.onPrimary : Colors.onSurfaceVariant }
              ]}>
                {tabInfo.count}
              </Text>
            </View>
          </View>
          <Text 
            style={[
              styles.tabLabel,
              { color: isSelected ? tabInfo.color : Colors.onSurfaceVariant }
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {tabInfo.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
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

      {/* Tabs */}
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScrollView}
        >
          {(['all', 'upcoming', 'ongoing', 'ended'] as EventTab[]).map(renderTabButton)}
        </ScrollView>
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Events Section */}
        <View style={styles.section}>
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="calendar-times" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>
                {selectedTab === 'all' ? 'Belum Ada Event' : `Tidak Ada Event ${getTabInfo(selectedTab).label}`}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedTab === 'all' 
                  ? 'Event menarik akan segera hadir!' 
                  : 'Coba pilih kategori lain atau cek lagi nanti'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={({ item, index }) => (
                <EventCard 
                  event={item} 
                  index={index} 
                  onPress={handleEventPress} 
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.eventsContainer}
              showsVerticalScrollIndicator={false}
            />
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
  // Tab Styles
  tabsScrollView: {
    maxHeight: 120,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  tabButton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    padding: 16,
    width: 120,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  tabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: -1,
  },
  tabContent: {
    gap: 8,
    position: 'relative',
    zIndex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
  },
  tabLabel: {
    fontFamily: Fonts.display.bold,
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 16,
  },
});
