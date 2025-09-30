import { GreenprintInfoModal } from '@/components/Modals/GreenprintInfoModal';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FloatingActionButton } from '@/components/Buttons/FloatingActionButton';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrashScanCard } from '@/components/Cards/TrashScanCard';
import { useTrashScans } from '../../hooks/useApiQueries';
import { TrashScan, TrashScansResponse } from '../../types/auth';
import { ErrorProvider } from '@/contexts/ErrorContext';

function RecyclopediaContent() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const { 
    data: trashScansData, 
    isLoading, 
    error, 
    refetch 
  } = useTrashScans();

  const trashScans = useMemo(() => {
    return (trashScansData as TrashScansResponse)?.data?.scans || [];
  }, [trashScansData]);

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="recycle" size={18} color={Colors.primary} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Recyclopedia</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading recycling data...</Text>
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
          <FontAwesome5 name="recycle" size={18} color={Colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Recyclopedia</Text>
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
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.errorContainer}
          >
            <FontAwesome5 name="exclamation-triangle" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{error.message || 'Gagal memuat data recyclopedia'}</Text>
          </MotiView>
        )}

        {/* Recycling Ideas Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="lightbulb" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Ide Daur Ulang</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{trashScans.length}</Text>
            </View>
          </View>

          {trashScans.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="recycle" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>Belum ada scan sampah</Text>
              <Text style={styles.emptySubtitle}>
                Mulai scan sampah untuk melihat ide-ide daur ulang kreatif di sini
              </Text>
            </View>
          ) : (
            <View style={styles.trashScansContainer}>
              {trashScans.map((scan, index) => (
                <TrashScanCard key={`${scan.title}-${index}`} item={scan} index={index} />
              ))}
            </View>
          )}
        </MotiView>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="camera"
        label="Scan"
        onPress={() => router.push('/scan')}
      />

      {/* Recyclopedia Info Modal */}
      <GreenprintInfoModal
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
    gap: 8,
  },
  headerIcon: {
    marginRight: 4,
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
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
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
    paddingHorizontal: 20,
  },
  trashScansContainer: {
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
    marginTop: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default function RecyclopediaScreen() {
  return (
    <ErrorProvider>
      <RecyclopediaContent />
    </ErrorProvider>
  );
}
