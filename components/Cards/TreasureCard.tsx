import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Treasure {
  name: string;
  point_gain: number;
  claimed_at: string;
}

interface TreasureCardProps {
  item: Treasure;
  index: number;
}

const TreasureCard = React.memo(({ item, index }: TreasureCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
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
    <View style={styles.treasureCard}>
      <LinearGradient
        colors={[Colors.surface, Colors.surfaceContainerHigh]}
        style={styles.treasureGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with treasure icon and points */}
        <View style={styles.treasureHeader}>
          <View style={styles.treasureIconContainer}>
            <View style={styles.treasureIcon}>
              <FontAwesome5 name="gem" size={14} color={Colors.tertiary} />
            </View>
            <Text style={styles.treasureName} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
          <View style={styles.pointsContainer}>
            <FontAwesome5 name="coins" size={12} color={Colors.secondary} />
            <Text style={styles.pointsText}>+{item.point_gain}</Text>
          </View>
        </View>

        {/* Claimed date */}
        <View style={styles.claimedContainer}>
          <FontAwesome5 name="calendar-check" size={10} color={Colors.onSurfaceVariant} />
          <Text style={styles.claimedText}>
            Claimed on {formatDate(item.claimed_at)}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  treasureCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  treasureGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  treasureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  treasureIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  treasureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tertiary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treasureName: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 20,
    flex: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pointsText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
  },
  claimedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  claimedText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
});

export default TreasureCard;
export type { Treasure, TreasureCardProps };
