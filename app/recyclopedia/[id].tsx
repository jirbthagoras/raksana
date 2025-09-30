import { Colors, Fonts } from '@/constants';
import { RecyclingItem } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import {
     Image,
     ScrollView,
     StyleSheet,
     Text,
     TouchableOpacity,
     View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecyclingItemCard } from '../../components/Cards/RecyclingItemCard';
import LoadingOverlay from '../../components/Screens/LoadingComponent';
import { ErrorProvider } from '../../contexts/ErrorContext';
import { useTrashScans } from '../../hooks/useApiQueries';
import { TrashScansResponse } from '../../types/auth';

function ScanDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isCreatingGreenprint, setIsCreatingGreenprint] = useState(false);
  
  const { 
    data: trashScansData, 
    isLoading, 
    error 
  } = useTrashScans();

  const scanDetail = useMemo(() => {
    const scans = (trashScansData as TrashScansResponse)?.data?.scans || [];
    const scanIndex = parseInt(id || '0', 10);
    return scans[scanIndex] || null;
  }, [trashScansData, id]);

  const handleBack = () => {
    router.back();
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setIsCreatingGreenprint(isLoading);
  };

  const getValueColor = (value: string) => {
    switch (value) {
      case 'high':
        return Colors.primary;
      case 'mid':
        return Colors.secondary;
      case 'low':
        return Colors.tertiary;
      default:
        return Colors.onSurfaceVariant;
    }
  };

  const getValueText = (value: string) => {
    switch (value) {
      case 'high':
        return 'Tinggi';
      case 'mid':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return 'Unknown';
    }
  };

  if (isLoading || !scanDetail) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="search" size={18} color={Colors.primary} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Detail Scan</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? 'Loading scan details...' : 'Scan tidak ditemukan'}
          </Text>
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
          <FontAwesome5 name="search" size={18} color={Colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Detail Scan</Text>
        </View>
        <View style={{ width: 32 }} />
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Image and Info */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.scanInfoSection}
        >
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceContainerHigh]}
            style={styles.scanInfoCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Large Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: scanDetail.image_key }}
                style={styles.scanImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <FontAwesome5 name="check-circle" size={20} color="white" />
                <Text style={styles.scanSuccessText}>Scan Berhasil</Text>
              </View>
            </View>

            {/* Title and Description */}
            <View style={styles.contentContainer}>
              <Text style={styles.scanTitle}>{scanDetail.title}</Text>
              <Text style={styles.scanDescription}>{scanDetail.description}</Text>
              
              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <FontAwesome5 name="lightbulb" size={16} color={Colors.primary} />
                  <Text style={styles.statText}>
                    {scanDetail.items.length} ide daur ulang
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <FontAwesome5 name="leaf" size={16} color={Colors.secondary} />
                  <Text style={styles.statText}>
                    {scanDetail.items.filter(item => item.having_greenprint).length} greenprint
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Recycling Ideas Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={styles.ideasSection}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="recycle" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Ide Daur Ulang</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{scanDetail.items.length}</Text>
            </View>
          </View>

          <View style={styles.ideasContainer}>
            {scanDetail.items.map((recyclingItem: RecyclingItem, itemIndex: number) => (
              <MotiView
                key={`${scanDetail.title}-${recyclingItem.id || itemIndex}-${itemIndex}`}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: 600 + (itemIndex * 100) }}
              >
                <RecyclingItemCard 
                  item={recyclingItem} 
                  index={itemIndex}
                  getValueColor={getValueColor}
                  getValueText={getValueText}
                  onLoadingChange={handleLoadingChange}
                />
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Full Screen Loading Overlay */}
      <LoadingOverlay visible={isCreatingGreenprint} />
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
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    textAlign: 'center',
  },
  scanInfoSection: {
    marginBottom: 24,
  },
  scanInfoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  imageContainer: {
    position: 'relative',
    height: 240,
  },
  scanImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  scanSuccessText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: 'white',
  },
  contentContainer: {
    padding: 20,
  },
  scanTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 12,
    lineHeight: 24,
  },
  scanDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
  },
  ideasSection: {
    marginBottom: 24,
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
  ideasContainer: {
    gap: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default function ScanDetailScreen() {
  return (
    <ErrorProvider>
      <ScanDetailContent />
    </ErrorProvider>
  );
}
