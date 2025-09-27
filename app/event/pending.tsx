import { Colors, Fonts } from '@/constants';
import { Event } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePendingAttendances } from '../../hooks/useApiQueries';

interface AttendanceDetailModalProps {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
}

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({ visible, event, onClose }) => {
  if (!event) return null;

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <FontAwesome5 name="times" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Detail Pendaftaran</Text>
          <View style={styles.modalSpacer} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.modalSection}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>

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

            {/* Status Card */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <FontAwesome5 name="clock" size={18} color={Colors.primary} />
                <Text style={styles.detailTitle}>Status Pendaftaran</Text>
              </View>
              <View style={styles.detailContent}>
                <View style={styles.statusContainer}>
                  <FontAwesome5 name="hourglass-half" size={16} color={Colors.secondary} />
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

interface AttendanceCardProps {
  event: Event;
  index: number;
  onPress: (event: Event) => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ event, index, onPress }) => {
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
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={styles.attendanceCard}
        onPress={() => onPress(event)}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {event.name}
            </Text>
            <View style={styles.pendingBadge}>
              <FontAwesome5 name="hourglass-half" size={12} color={Colors.onSecondary} />
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <FontAwesome5 name="coins" size={12} color={Colors.primary} />
            <Text style={styles.pointsText}>{event.point_gain}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
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

          {/* Contact */}
          <View style={styles.detailRow}>
            <FontAwesome5 name="phone" size={14} color={Colors.tertiary} />
            <Text style={styles.contactText} numberOfLines={1}>
              {event.contact}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default function PendingAttendancesScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: attendancesData, isLoading, error, refetch } = usePendingAttendances();

  const pendingEvents: Event[] = attendancesData?.data?.events || [];

  const handleBack = () => {
    router.back();
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Attendances</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Memuat pendaftaran...</Text>
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
          <Text style={styles.headerTitle}>Attendances</Text>
        </View>
        <View style={styles.headerSpacer} />
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
        {/* Pending Attendances Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="hourglass-half" size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Pending Attendances</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingEvents.length}</Text>
            </View>
          </View>

          {pendingEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="check-circle" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Tidak Ada Pendaftaran Pending</Text>
              <Text style={styles.emptySubtitle}>
                Semua pendaftaran event Anda sudah diproses!
              </Text>
            </View>
          ) : (
            <View style={styles.attendancesContainer}>
              {pendingEvents.map((event, index) => (
                <AttendanceCard 
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

      {/* Attendance Detail Modal */}
      <AttendanceDetailModal
        visible={showModal}
        event={selectedEvent}
        onClose={handleCloseModal}
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
  headerSpacer: {
    width: 40,
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
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onSecondary,
  },
  attendancesContainer: {
    gap: 12,
  },
  cardContainer: {
    marginBottom: 12,
  },
  attendanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.secondary + '40',
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 6,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  pendingText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.onSecondary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pointsText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  cardContent: {
    gap: 8,
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
  contactText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    flex: 1,
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  modalSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
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
    paddingHorizontal: 20,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.secondary,
  },
});
