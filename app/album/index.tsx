import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MemoryPost from '../../components/Cards/MemoryPost';
import { AlbumInfoModal } from '../../components/Modals/AlbumInfoModal';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';
import { useDeleteMemory, useMemories } from '../../hooks/useApiQueries';
import { Memory } from '../../types/auth';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40;

function AlbumScreenContent() {
  const [refreshing, setRefreshing] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  const {
    data: memoriesData,
    isLoading,
    error,
    refetch,
  } = useMemories();

  const deleteMemoryMutation = useDeleteMemory();
  const { showPopUp, showApiError } = useError();

  const memories = memoriesData?.data?.memories || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };


  const handleDeleteMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    setDeleteModalVisible(true);
  };

  const confirmDeleteMemory = () => {
    if (!selectedMemory) return;
    
    deleteMemoryMutation.mutate(selectedMemory.memory_id, {
      onSuccess: () => {
        setDeleteModalVisible(false);
        setSelectedMemory(null);
        showPopUp(
          'Memory berhasil dihapus dari album Anda.',
          'Berhasil!',
          'info'
        );
        // Refresh the page
        refetch();
      },
      onError: (error) => {
        setDeleteModalVisible(false);
        setSelectedMemory(null);
        showApiError(error);
      },
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedMemory(null);
  };

  const renderMemoryPost = useCallback(({ item, index }: { item: Memory; index: number }) => (
    <MemoryPost 
      item={item} 
      index={index} 
      onDelete={handleDeleteMemory}
      isDeleting={deleteMemoryMutation.isPending}
    />
  ), [handleDeleteMemory, deleteMemoryMutation.isPending]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Album</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerInfoButton} 
            onPress={() => setInfoModalVisible(true)}
          >
            <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat kenangan...</Text>
        </View>
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
          <Text style={styles.headerTitle}>Album</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerInfoButton} 
          onPress={() => setInfoModalVisible(true)}
        >
          <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </MotiView>

      {error ? (
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Gagal memuat kenangan</Text>
          <Text style={styles.errorSubtitle}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : memories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="camera" size={64} color={Colors.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>Belum ada kenangan</Text>
          <Text style={styles.emptySubtitle}>
            Mulai berbagi momen berharga Anda dengan komunitas
          </Text>
          <TouchableOpacity 
            style={styles.createMemoryButton}
            onPress={() => router.push('/album/create')}
          >
            <FontAwesome5 name="plus" size={16} color={Colors.onPrimary} />
            <Text style={styles.createMemoryButtonText}>Buat Memory Pertama</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={memories}
          renderItem={renderMemoryPost}
          keyExtractor={(item) => item.memory_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={10}
          initialNumToRender={3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {/* Floating Action Button */}
      {memories.length > 0 && (
        <MotiView 
          style={styles.floatingButton}
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <TouchableOpacity 
            style={styles.fabButton}
            onPress={() => router.push('/album/create')}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="plus" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </MotiView>
      )}

      {/* Album Info Modal */}
      <AlbumInfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteMemory}
        message="Apakah Anda yakin ingin menghapus memory ini?"
        userName={selectedMemory?.user_name}
        description={selectedMemory?.description}
        isLoading={deleteMemoryMutation.isPending}
      />
    </SafeAreaView>
  );
}

export default function AlbumScreen() {
  return (
    <ErrorProvider>
      <AlbumScreenContent />
    </ErrorProvider>
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
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 16,
  },
  createMemoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    marginTop: 16,
  },
  createMemoryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  listContent: {
    paddingVertical: 20,
  },
});
