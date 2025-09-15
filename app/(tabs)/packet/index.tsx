import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomPacketCard from '../../../components/CustomPacketCard';
import TaskCheckbox from '../../../components/TaskCheckbox';
import { useAuth } from '../../../contexts/AuthContext';
import { useMyPackets, useTodayTasks, useUpdateTaskCompletion } from '../../../hooks/useApiQueries';

export default function PacketScreen() {
  const { user } = useAuth();
  
  // Use TanStack Query hooks
  const { 
    data: packetsData, 
    isLoading: packetsLoading, 
    error: packetsError, 
    refetch: refetchPackets 
  } = useMyPackets();
  
  const { 
    data: tasksData, 
    isLoading: tasksLoading, 
    error: tasksError, 
    refetch: refetchTasks 
  } = useTodayTasks();
  
  const updateTaskMutation = useUpdateTaskCompletion();

  // Extract data from API responses
  const packets = packetsData?.packets || [];
  const tasks = tasksData?.tasks || [];
  const noActivePacket = tasksError?.status === 409;
  
  const loading = packetsLoading || tasksLoading;
  const error = packetsError || (tasksError && !noActivePacket ? tasksError : null);

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    updateTaskMutation.mutate({ taskId, completed });
  };

  const handleRefresh = async () => {
    await Promise.all([refetchPackets(), refetchTasks()]);
  };

  const handleAddPacket = () => {
    // TODO: Navigate to add packet screen
    console.log('Add packet pressed');
  };

  const completedTasksCount = tasks.filter((task: any) => task.completed).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat paket...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={updateTaskMutation.isPending}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Halo, {user?.username || 'Pengguna'}! 👋
              </Text>
              <Text style={styles.subtitle}>
                Kelola paket dan tugas harianmu
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <FontAwesome5 name="box-open" size={24} color={Colors.primary} />
            </View>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-triangle" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{error.message || 'Gagal memuat data'}</Text>
          </View>
        )}

        {/* My Packets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="box" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Paket Saya</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{packets.length}</Text>
            </View>
          </View>

          {packets.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="inbox" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Belum ada paket</Text>
              <Text style={styles.emptySubtitle}>
                Buat paket challenge pertamamu
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddPacket}>
                <FontAwesome5 name="plus" size={16} color={Colors.onPrimary} />
                <Text style={styles.addButtonText}>Tambah Paket</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.packetsScrollContainer}
              style={styles.packetsScroll}
            >
              {packets.map((packet: any, index: number) => (
                <View key={packet.id} style={styles.packetCardContainer}>
                  <View style={[
                    styles.packetCard,
                    packet.completed ? styles.packetCardCompleted : styles.packetCardActive
                  ]}>
                    <View style={styles.packetStatusIndicator}>
                      <View style={[
                        styles.statusDot,
                        packet.completed ? styles.statusDotInactive : styles.statusDotActive
                      ]} />
                      <Text style={[
                        styles.statusText,
                        packet.completed ? styles.statusTextInactive : styles.statusTextActive
                      ]}>
                        {packet.completed ? 'Selesai' : 'Aktif'}
                      </Text>
                    </View>
                    <CustomPacketCard 
                      packet={packet} 
                      onPress={(packetId) => {
                        console.log('Navigate to packet detail:', packetId);
                        // TODO: Add navigation to packet detail screen
                      }} 
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Today's Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="tasks" size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Tugas Hari Ini</Text>
            <View style={[styles.badge, { backgroundColor: Colors.secondary + '20' }]}>
              <Text style={[styles.badgeText, { color: Colors.secondary }]}>
                {completedTasksCount}/{tasks.length}
              </Text>
            </View>
          </View>

          {noActivePacket ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="box-open" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Tidak ada paket aktif</Text>
              <Text style={styles.emptySubtitle}>
                Aktifkan paket untuk mendapatkan tugas harian
              </Text>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="check-circle" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Tidak ada tugas hari ini</Text>
              <Text style={styles.emptySubtitle}>
                Selamat! Kamu sudah menyelesaikan semua tugas
              </Text>
            </View>
          ) : (
            tasks.map((task: any, index: number) => (
              <TaskCheckbox 
                key={task.id} 
                task={task} 
                index={index}
                onToggle={handleTaskToggle}
              />
            ))
          )}
        </View>

        {/* Bottom spacing */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    lineHeight: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.errorContainer,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  errorText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.error,
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  // Packets scroll styles
  packetsScroll: {
    marginHorizontal: -20,
  },
  packetsScrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  packetCardContainer: {
    marginRight: 16,
    // Fix shadow by ensuring proper container
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  packetCard: {
    borderRadius: 16,
    padding: 16,
    minWidth: 280,
    maxWidth: 320,
    // Remove any conflicting background or shadow here
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  packetCardActive: {
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primaryContainer + '10',
  },
  packetCardCompleted: {
    borderColor: Colors.onSurfaceVariant + '30',
    backgroundColor: Colors.surfaceVariant + '20',
    opacity: 0.8,
  },
  packetStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: Colors.primary,
  },
  statusDotInactive: {
    backgroundColor: Colors.onSurfaceVariant,
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
  },
  statusTextActive: {
    color: Colors.primary,
  },
  statusTextInactive: {
    color: Colors.onSurfaceVariant,
  },
});