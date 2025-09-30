import { Colors, Fonts } from '@/constants';
import { RecyclingItem, TrashScanResult } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import LoadingOverlay from '@/components/Screens/LoadingComponent';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecyclingItemCard } from '../Cards/RecyclingItemCard';

interface ScanResultModalProps {
  visible: boolean;
  onClose: () => void;
  scanResult: TrashScanResult | null;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  visible,
  onClose,
  scanResult,
}) => {
  const [isCreatingGreenprint, setIsCreatingGreenprint] = useState(false);
  
  if (!scanResult) return null;

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

  const renderRecyclingItem = (item: RecyclingItem, index: number) => (
    <RecyclingItemCard 
      key={`modal-${item.id || index}-${index}`} 
      item={item} 
      index={index}
      getValueColor={getValueColor}
      getValueText={getValueText}
      hideGreenprintButton={true}
      onLoadingChange={handleLoadingChange}
    />
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.header}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesome5 name="times" size={20} color="white" />
              </TouchableOpacity>
              
              <View style={styles.headerTitleContainer}>
                <FontAwesome5 name="search" size={20} color="white" style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Hasil Scan</Text>
              </View>
              
              <View style={styles.headerSpacer} />
            </View>
          </LinearGradient>
        </MotiView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Scan Result Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            style={styles.resultCard}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
              style={styles.cardGradient}
            >
              {/* Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: scanResult.image_key }}
                  style={styles.scanImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <FontAwesome5 name="check-circle" size={24} color="white" />
                  <Text style={styles.scanSuccessText}>Scan Berhasil!</Text>
                </View>
              </View>

              {/* Title and Description */}
              <View style={styles.contentContainer}>
                <Text style={styles.scanTitle}>{scanResult.title}</Text>
                <Text style={styles.scanDescription}>{scanResult.description}</Text>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <FontAwesome5 name="lightbulb" size={16} color={Colors.primary} />
                  <Text style={styles.statText}>
                    {scanResult.items.length} ide daur ulang
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <FontAwesome5 name="leaf" size={16} color={Colors.secondary} />
                  <Text style={styles.statText}>
                    {scanResult.items.filter(item => item.having_greenprint).length} greenprint
                  </Text>
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
                <Text style={styles.badgeText}>{scanResult.items.length}</Text>
              </View>
            </View>

            <View style={styles.ideasContainer}>
              {scanResult.items.map(renderRecyclingItem)}
            </View>
          </MotiView>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
        
        {/* Full Screen Loading Overlay */}
        <LoadingOverlay visible={isCreatingGreenprint} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  headerIcon: {
    marginRight: 4,
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: 'white',
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
  resultCard: {
    marginBottom: 24,
  },
  cardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
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
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 12,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
