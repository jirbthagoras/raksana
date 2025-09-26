import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LogEntry {
  text: string;
  is_system: boolean;
  is_private: boolean;
  created_at: string;
}

interface LogCardProps {
  item: LogEntry;
  index: number;
}

const LogCard = React.memo(({ item, index }: LogCardProps) => {
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

const styles = StyleSheet.create({
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
});

export default LogCard;
export type { LogEntry, LogCardProps };
