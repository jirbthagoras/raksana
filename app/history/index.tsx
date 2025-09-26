import { HistoryInfoModal } from '@/components/HistoryInfoModal';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCircle, SkeletonText } from '../../components/SkeletonLoader';
import { usePointHistory } from '../../hooks/useApiQueries';
import { PointHistoryItem } from '../../types/auth';

export default function HistoryScreen() {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const {
    data: historyData,
    isLoading,
    error,
    refetch
  } = usePointHistory();

  const balance = historyData?.data?.balance || 0;
  const histories = historyData?.data?.histories || [];

  const handleRefresh = async () => {
    await refetch();
  };

  const handleBack = () => {
    router.back();
  };

  const formatBalance = (amount: number) => {
    return amount.toLocaleString('id-ID');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHistoryIcon = (type: string, category: string) => {
    if (type === 'output') {
      switch (category) {
        case 'Convert':
          return { name: 'seedling', color: Colors.tertiary };
        case 'Transfer':
          return { name: 'exchange-alt', color: Colors.secondary };
        default:
          return { name: 'minus-circle', color: Colors.error };
      }
    } else {
      switch (category) {
        case 'Challenge':
          return { name: 'trophy', color: Colors.primary };
        case 'Task':
          return { name: 'tasks', color: Colors.secondary };
        case 'Memory':
          return { name: 'camera', color: Colors.tertiary };
        default:
          return { name: 'plus-circle', color: Colors.primary };
      }
    }
  };

  const renderHistoryItem = ({ item, index }: { item: PointHistoryItem; index: number }) => {
    const icon = getHistoryIcon(item.type, item.category);
    const isOutput = item.type === 'output';

    return (
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ 
          type: 'timing', 
          duration: 400, 
          delay: index * 100 
        }}
        style={styles.historyItem}
      >
        <View style={styles.historyContent}>
          <View style={[styles.historyIconContainer, { backgroundColor: icon.color + '20' }]}>
            <FontAwesome5 name={icon.name} size={20} color={icon.color} />
          </View>
          
          <View style={styles.historyDetails}>
            <Text style={styles.historyName}>
              {item.name}
            </Text>
            <View style={styles.historyMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: icon.color + '15' }]}>
                <Text style={[styles.categoryText, { color: icon.color }]}>
                  {item.category}
                </Text>
              </View>
              <Text style={styles.historyDate}>
                {formatDate(item.created_at)}
              </Text>
            </View>
          </View>

          <View style={styles.historyAmount}>
            <Text style={[
              styles.amountText,
              { color: isOutput ? Colors.error : Colors.primary }
            ]}>
              {isOutput ? '-' : '+'}{formatBalance(item.amount)}
            </Text>
            <Text style={styles.pointsLabel}>poin</Text>
          </View>
        </View>
      </MotiView>
    );
  };

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.emptyState}
    >
      <FontAwesome5 name="history" size={64} color={Colors.onSurfaceVariant} />
      <Text style={styles.emptyTitle}>Belum ada riwayat poin</Text>
      <Text style={styles.emptySubtitle}>
        Riwayat poin akan muncul setelah Anda melakukan aktivitas yang menghasilkan atau menggunakan poin
      </Text>
    </MotiView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonCircle size={40} />
          <View style={styles.headerTitleContainer}>
            <SkeletonText lines={1} lineHeight={18} lastLineWidth="60%" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Balance Card Skeleton */}
        <View style={styles.balanceCardSkeleton}>
          <SkeletonText lines={1} lineHeight={14} lastLineWidth="40%" />
          <SkeletonText lines={1} lineHeight={32} lastLineWidth="60%" />
        </View>

        {/* History Items Skeleton */}
        <View style={styles.historyList}>
          {[1, 2, 3, 4, 5].map((index) => (
            <View key={index} style={styles.historyItemSkeleton}>
              <SkeletonCircle size={48} />
              <View style={styles.historyDetailsSkeleton}>
                <SkeletonText lines={2} lineHeight={16} lastLineWidth="80%" />
                <SkeletonText lines={1} lineHeight={12} lastLineWidth="50%" />
              </View>
              <SkeletonText lines={1} lineHeight={16} lastLineWidth="30%" />
            </View>
          ))}
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
          <Text style={styles.headerTitle}>Riwayat Poin</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerInfoButton}
          onPress={() => setInfoModalVisible(true)}
        >
          <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </MotiView>

      {/* Balance Card */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 200 }}
        style={styles.balanceCard}
      >
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.primaryContainer + 'E0']}
          style={styles.balanceGradient}
        >
          <View style={styles.balanceHeader}>
            <FontAwesome5 name="wallet" size={24} color={Colors.primary} />
            <Text style={styles.balanceLabel}>Saldo Poin Saat Ini</Text>
          </View>
          <Text style={styles.balanceAmount}>
            {formatBalance(balance)} poin
          </Text>
          
          {/* Convert Button */}
          <TouchableOpacity 
            style={styles.convertButton}
            onPress={() => {
              // TODO: Implement convert points functionality
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.secondary, Colors.tertiary]}
              style={styles.convertButtonGradient}
            >
              <FontAwesome5 name="seedling" size={16} color={Colors.onSecondary} />
              <Text style={styles.convertButtonText}>Konversi Poin</Text>
              <FontAwesome5 name="arrow-right" size={14} color={Colors.onSecondary} />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </MotiView>

      {error && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.errorContainer}
        >
          <FontAwesome5 name="exclamation-triangle" size={20} color={Colors.error} />
          <Text style={styles.errorText}>{error.message || 'Gagal memuat riwayat poin'}</Text>
        </MotiView>
      )}

      {/* History List */}
      <FlatList
        data={histories}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => `${item.created_at}-${index}`}
        style={styles.historyList}
        contentContainerStyle={styles.historyListContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          histories.length > 0 ? (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 400 }}
              style={styles.historyHeader}
            >
              <FontAwesome5 name="history" size={18} color={Colors.primary} />
              <Text style={styles.historyHeaderTitle}>Riwayat Poin</Text>
              <View style={styles.historyCount}>
                <Text style={styles.historyCountText}>{histories.length}</Text>
              </View>
            </MotiView>
          ) : null
        }
      />

      {/* History Info Modal */}
      <HistoryInfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
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
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  balanceGradient: {
    padding: 20,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onPrimaryContainer,
    marginLeft: 12,
  },
  balanceAmount: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.primary,
    marginTop: 8,
  },
  convertButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  convertButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  convertButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSecondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
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
  historyList: {
    flex: 1,
    marginTop: 20,
  },
  historyListContent: {
    paddingBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  historyHeaderTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginLeft: 12,
    flex: 1,
  },
  historyCount: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  historyCountText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  historyItem: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    minHeight: 64,
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  historyDetails: {
    flex: 1,
    paddingRight: 8,
  },
  historyName: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 6,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  historyDate: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  historyAmount: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  amountText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
  },
  pointsLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  // Skeleton loading styles
  balanceCardSkeleton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  historyItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  historyDetailsSkeleton: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
});
