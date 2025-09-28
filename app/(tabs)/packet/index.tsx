import CustomPacketCard from '@/components/Cards/CustomPacketCard';
import { EcoachInfoModal } from '@/components/Modals/EcoachInfoModal';
import { CongratulationPopup } from '@/components/Popups/CongratulationPopup';
import { SkeletonCircle, SkeletonText } from '@/components/Screens/SkeletonLoader';
import TaskCheckbox from '@/components/Screens/TaskCheckbox';
import { Colors, Fonts } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyPackets, useTodayTasks, useUpdateTaskCompletion } from '../../../hooks/useApiQueries';
import { TaskCompletionResponse } from '../../../types/auth';

export default function PacketScreen() {
  const { user } = useAuth();
  
  // Modal states
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Congratulation popup queue system
  const [congratulationQueue, setCongratulationQueue] = useState<Array<{
    id: string;
    type: 'levelUp' | 'packetComplete' | 'unlock';
    data: TaskCompletionResponse;
  }>>([]);
  const [currentPopup, setCurrentPopup] = useState<{
    id: string;
    type: 'levelUp' | 'packetComplete' | 'unlock';
    data: TaskCompletionResponse;
  } | null>(null);
  
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
  
  const updateTaskMutation = useUpdateTaskCompletion((response: TaskCompletionResponse) => {
    console.log('Task completion response:', response);
    
    // Create congratulation items based on response
    const newCongratulations: Array<{
      id: string;
      type: 'levelUp' | 'packetComplete' | 'unlock';
      data: TaskCompletionResponse;
    }> = [];
    
    // Add unlock popup if habit is unlocked
    if (response.unlock && response.unlock.is_unlocked) {
      newCongratulations.push({
        id: `unlock-${Date.now()}`,
        type: 'unlock',
        data: response
      });
    }
    
    // Add packet completion popup
    if (response.packet_completed) {
      newCongratulations.push({
        id: `packet-${Date.now()}`,
        type: 'packetComplete',
        data: response
      });
    }
    
    // Add level up popup
    if (response.leveled_up) {
      newCongratulations.push({
        id: `level-${Date.now()}`,
        type: 'levelUp',
        data: response
      });
    }
    
    // Add to queue
    setCongratulationQueue(prev => [...prev, ...newCongratulations]);
  });

  // Extract data from API responses
  const packets = packetsData?.packets || [];
  const tasks = tasksData?.tasks || [];
  const noActivePacket = tasksError?.status === 409;
  
  const loading = packetsLoading || tasksLoading;
  const error = packetsError || (tasksError && !noActivePacket ? tasksError : null);

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    updateTaskMutation.mutate({ taskId, completed });
  };
  
  // Effect to manage popup queue
  useEffect(() => {
    if (congratulationQueue.length > 0 && !currentPopup) {
      const nextPopup = congratulationQueue[0];
      setCurrentPopup(nextPopup);
      setCongratulationQueue(prev => prev.slice(1));
    }
  }, [congratulationQueue, currentPopup]);
  
  const handleCloseCongratulation = () => {
    setCurrentPopup(null);
  };

  const handleRefresh = async () => {
    await Promise.all([refetchPackets(), refetchTasks()]);
  };

  const handleAddPacket = () => {
    router.push('/packet/create');
  };

  const completedTasksCount = tasks.filter((task: any) => task.completed).length;
  
  // Check if all packets are completed hahayayaya
  const allPacketsCompleted = packets.length > 0 && packets.every((packet: any) => packet.completed);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Skeleton */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={{ flex: 1 }}>
                <SkeletonText lines={1} lineHeight={24} lastLineWidth="60%" />
                <View style={{ height: 8 }} />
                <SkeletonText lines={1} lineHeight={16} lastLineWidth="80%" />
              </View>
              <SkeletonCircle size={48} />
            </View>
          </View>

          {/* Packets Section Skeleton */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonCircle size={18} />
              <SkeletonText lines={1} lineHeight={18} lastLineWidth="30%" />
              <SkeletonCircle size={24} />
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.packetsScrollContainer}
              style={styles.packetsScroll}
            >
              {[1, 2, 3].map((index) => (
                <View key={index} style={styles.packetSkeletonContainer}>
                  <View style={styles.packetSkeleton}>
                    <View style={styles.packetSkeletonHeader}>
                      <SkeletonText lines={1} lineHeight={12} lastLineWidth="40%" />
                    </View>
                    <View style={styles.packetSkeletonContent}>
                      <SkeletonText lines={2} lineHeight={16} lastLineWidth="70%" />
                      <View style={{ height: 12 }} />
                      <View style={styles.packetSkeletonStats}>
                        <SkeletonCircle size={60} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                          <SkeletonText lines={2} lineHeight={14} lastLineWidth="60%" />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Tasks Section Skeleton */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonCircle size={18} />
              <SkeletonText lines={1} lineHeight={18} lastLineWidth="40%" />
              <SkeletonCircle size={24} />
            </View>
            {[1, 2, 3, 4].map((index) => (
              <View key={index} style={styles.taskSkeletonContainer}>
                <SkeletonCircle size={24} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <SkeletonText lines={2} lineHeight={16} lastLineWidth="80%" />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
            refreshing={false}
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
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>
                Halo, {user?.username || 'Pengguna'}!
              </Text>
              <Text style={styles.subtitle}>
                Kelola paket dan tugas harianmu
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerInfoButton}
                onPress={() => setShowInfoModal(true)}
              >
                <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.headerIcon}>
                <FontAwesome5 name="box-open" size={24} color={Colors.primary} />
              </View>
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
                        router.push(`/packet/${packetId}`);
                      }} 
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
          
          {/* Create New Packet Button - Show when all packets are completed */}
          {allPacketsCompleted && (
            <View style={styles.createPacketSection}>
              <View style={styles.completionBadge}>
                <FontAwesome5 name="trophy" size={16} color={Colors.primary} />
                <Text style={styles.completionText}>Semua paket selesai!</Text>
              </View>
              <TouchableOpacity style={styles.createPacketButton} onPress={handleAddPacket}>
                <FontAwesome5 name="plus-circle" size={20} color={Colors.onPrimary} />
                <Text style={styles.createPacketButtonText}>Buat Paket Baru</Text>
              </TouchableOpacity>
            </View>
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
              <FontAwesome5 name="check-circle" size={48} color={Colors.primary} />
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
      
      {/* Congratulation Popup */}
      {currentPopup && (
        <CongratulationPopup
          visible={true}
          onClose={handleCloseCongratulation}
          type={currentPopup.type}
          level={currentPopup.data.current_level}
          packetName={currentPopup.type === 'unlock' ? currentPopup.data.unlock?.packet_name : currentPopup.data.packet_name}
          difficulty={currentPopup.type === 'unlock' ? currentPopup.data.unlock?.difficulty : undefined}
          zIndex={1000}
        />
      )}
      
      {/* Queue indicator for multiple popups */}
      {congratulationQueue.length > 0 && (
        <View style={styles.queueIndicator}>
          <Text style={styles.queueText}>
            +{congratulationQueue.length} lagi
          </Text>
        </View>
      )}
      
      {/* Ecoach Info Modal */}
      <EcoachInfoModal
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 50,
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
  // Skeleton loading styles
  packetSkeletonContainer: {
    marginRight: 16,
    minWidth: 280,
    maxWidth: 320,
  },
  packetSkeleton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  packetSkeletonHeader: {
    marginBottom: 12,
  },
  packetSkeletonContent: {
    gap: 8,
  },
  packetSkeletonStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskSkeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  // Create packet section styles
  createPacketSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.primaryContainer + '30',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '10',
    borderRadius: 20,
  },
  completionText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  createPacketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createPacketButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  // Queue indicator styles
  queueIndicator: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 999,
  },
  queueText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onPrimary,
  },
});