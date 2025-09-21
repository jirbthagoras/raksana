import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JournalInfoModal } from '../../components/JournalInfoModal';
import { useLogs } from '../../hooks/useApiQueries';

interface LogEntry {
  text: string;
  is_system: boolean;
  is_private: boolean;
  created_at: string;
}

interface LogsResponse {
  data: {
    logs: LogEntry[];
  };
}

const LogCard = React.memo(({ item, index }: { item: LogEntry; index: number }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.logCard}>
      <LinearGradient
        colors={[Colors.surface, Colors.surfaceContainerHigh]}
        style={styles.logGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with type indicator and timestamp */}
        <View style={styles.logHeader}>
          <View style={styles.logTypeContainer}>
            <View style={[
              styles.logTypeIndicator,
              { backgroundColor: item.is_system ? Colors.secondary + '20' : Colors.primary + '20' }
            ]}>
              <FontAwesome5 
                name={item.is_system ? 'cog' : 'user-edit'} 
                size={10} 
                color={item.is_system ? Colors.secondary : Colors.primary} 
              />
            </View>
            <Text style={[
              styles.logTypeText,
              { color: item.is_system ? Colors.secondary : Colors.primary }
            ]}>
              {item.is_system ? 'System' : 'Manual'}
            </Text>
          </View>
          <Text style={styles.logTimestamp}>
            {formatDate(item.created_at)}
          </Text>
        </View>

        {/* Log content */}
        <Text style={styles.logText}>
          {item.text}
        </Text>

        {/* Privacy indicator */}
        {item.is_private && (
          <View style={styles.privacyIndicator}>
            <FontAwesome5 name="lock" size={10} color={Colors.outline} />
            <Text style={styles.privacyText}>Private</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
});

export default function JournalScreen() {
  const [showPrivateLogs, setShowPrivateLogs] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const { 
    data: logsData, 
    isLoading, 
    error, 
    refetch 
  } = useLogs(showPrivateLogs);

  const logs = useMemo(() => {
    return (logsData as LogsResponse)?.data?.logs || [];
  }, [logsData]);

  const renderLogItem = useCallback(({ item, index }: { item: LogEntry; index: number }) => (
    <LogCard item={item} index={index} />
  ), []);

  const keyExtractor = useCallback((item: LogEntry, index: number) => 
    `${item.created_at}-${index}`, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120, // Approximate item height
    offset: 120 * index,
    index,
  }), []);

  const handleCreateJournal = () => {
    router.push('/journal/create');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="book-open" size={48} color={Colors.outline} />
      <Text style={styles.emptyTitle}>No Journal Entries</Text>
      <Text style={styles.emptyDescription}>
        Start documenting your journey by creating your first journal entry.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCreateJournal}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <FontAwesome5 name="plus" size={14} color="white" />
          <Text style={styles.emptyButtonText}>Create Entry</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
      <Text style={styles.errorTitle}>Failed to Load Journal</Text>
      <Text style={styles.errorDescription}>
        {error?.message || 'Something went wrong while loading your journal entries.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[Colors.surface, Colors.surfaceContainerLow]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Journal</Text>
              <TouchableOpacity 
                style={styles.infoButton} 
                onPress={() => setShowInfoModal(true)}
              >
                <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.headerSubtitle}>
                {logs.length} {logs.length === 1 ? 'entry' : 'entries'} • {showPrivateLogs ? 'Private' : 'Public'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={handleCreateJournal}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.createButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <FontAwesome5 name="plus" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Privacy Toggle */}
          <View style={styles.privacyToggleContainer}>
            <View style={styles.privacyToggleContent}>
              <View style={styles.privacyToggleLeft}>
                <FontAwesome5 
                  name={showPrivateLogs ? "lock" : "globe"} 
                  size={14} 
                  color={showPrivateLogs ? Colors.error : Colors.secondary} 
                />
                <Text style={[
                  styles.privacyToggleLabel,
                  { color: showPrivateLogs ? Colors.error : Colors.secondary }
                ]}>
                  {showPrivateLogs ? 'Private Logs' : 'Public Logs'}
                </Text>
              </View>
              <Switch
                value={showPrivateLogs}
                onValueChange={setShowPrivateLogs}
                trackColor={{ 
                  false: Colors.outline + '40', 
                  true: Colors.error + '40' 
                }}
                thumbColor={showPrivateLogs ? Colors.error : Colors.secondary}
                style={styles.privacySwitch}
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading journal entries...</Text>
        </View>
      ) : error ? (
        renderError()
      ) : logs.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
      
      {/* Journal Info Modal */}
      <JournalInfoModal
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  createButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Account for tab bar
  },
  logCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logTypeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logTypeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logTimestamp: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  logText: {
    fontFamily: Fonts.text.regular,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 22,
    marginBottom: 8,
  },
  privacyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  privacyText: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.primary,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: 'white',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.error,
    textAlign: 'center',
  },
  errorDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  privacyToggleContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  privacyToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  privacyToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyToggleLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
  },
  privacySwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  infoButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginLeft: 8,
  },
});
