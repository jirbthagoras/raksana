import { Colors, Fonts } from '@/constants';
import { useError } from '@/contexts/ErrorContext';
import { useCreateGreenprint } from '@/hooks/useApiQueries';
import { RecyclingItem } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
     StyleSheet,
     Text,
     TouchableOpacity,
     View,
} from 'react-native';
import LoadingOverlay from '@/components/Screens/LoadingComponent';

interface RecyclingItemCardProps {
  item: RecyclingItem;
  index: number;
  getValueColor: (value: string) => string;
  getValueText: (value: string) => string;
  hideGreenprintButton?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
}

export const RecyclingItemCard: React.FC<RecyclingItemCardProps> = ({ 
  item, 
  index, 
  getValueColor, 
  getValueText,
  hideGreenprintButton = false,
  onLoadingChange
}) => {
  const createGreenprintMutation = useCreateGreenprint();
  const { showApiError, showPopUp } = useError();

  const handleCreateGreenprint = async () => {
    try {
      onLoadingChange?.(true);
      console.log('🌱 Creating greenprint for item:', item.id);
      await createGreenprintMutation.mutateAsync(item.id);
      
      // Show success message
      showPopUp(
        'Greenprint berhasil dibuat! Anda akan diarahkan ke halaman detail.',
        'Berhasil!',
        'info'
      );
      
      // Navigate to greenprint screen after successful creation
      setTimeout(() => {
        router.push(`/greenprint/${item.id}`);
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Failed to create greenprint:', error);
      
      // Use the app's error handling system
      if (error?.status) {
        showApiError(error);
      } else {
        // Custom error messages for specific scenarios
        if (error?.message?.includes('network') || error?.message?.includes('Network')) {
          showPopUp(
            'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.',
            'Koneksi Bermasalah',
            'warning'
          );
        } else if (error?.message?.includes('timeout')) {
          showPopUp(
            'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
            'Timeout',
            'warning'
          );
        } else {
          showPopUp(
            'Gagal membuat greenprint. Silakan coba lagi dalam beberapa saat.',
            'Gagal Membuat Greenprint',
            'error'
          );
        }
      }
    } finally {
      onLoadingChange?.(false);
    }
  };

  const handleViewGreenprint = () => {
    console.log('📖 Viewing existing greenprint for item:', item.id);
    router.push(`/greenprint/${item.id}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.surfaceContainerLow, Colors.surfaceContainer]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with title and badges */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name}
          </Text>
          
          <View style={styles.badgeContainer}>
            <View style={[styles.valueBadge, { backgroundColor: getValueColor(item.value) + '20' }]}>
              <Text style={[styles.valueBadgeText, { color: getValueColor(item.value) }]}>
                {getValueText(item.value)}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {item.description}
        </Text>

        {/* Greenprint Button - Hidden when hideGreenprintButton is true */}
        {!hideGreenprintButton && (
          <TouchableOpacity
            style={[
              styles.greenprintButton,
              item.having_greenprint && styles.greenprintButtonView,
              createGreenprintMutation.isPending && styles.disabledButton
            ]}
            disabled={createGreenprintMutation.isPending}
            onPress={item.having_greenprint ? handleViewGreenprint : handleCreateGreenprint}
          >
            <FontAwesome5 
              name={item.having_greenprint ? "eye" : "leaf"} 
              size={12} 
              color="white" 
            />
            <Text style={styles.greenprintButtonText}>
              {createGreenprintMutation.isPending 
                ? 'Membuat...' 
                : item.having_greenprint 
                  ? 'Lihat Greenprint' 
                  : 'Buat Greenprint'
              }
            </Text>
          </TouchableOpacity>
        )}
        
      </LinearGradient>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '15',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontFamily: Fonts.display.medium,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
    lineHeight: 18,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  valueBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  valueBadgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 18,
    marginBottom: 10,
  },
  greenprintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 8,
  },
  greenprintButtonView: {
    backgroundColor: Colors.tertiary,
  },
  greenprintButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: 'white',
  },
  disabledButton: {
    backgroundColor: Colors.surfaceVariant,
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '15',
  },
  footerText: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
});
