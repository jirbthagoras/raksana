import { Colors, Fonts } from '@/constants';
import { RecyclingItem, TrashScan } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecyclingItemCard } from '@/components/Cards/RecyclingItemCard';

interface TrashScanCardProps {
  item: TrashScan;
  index: number;
}

export const TrashScanCard: React.FC<TrashScanCardProps> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.surface, Colors.surfaceContainerHigh]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with image and title */}
        <View style={styles.header}>
          <Image
            source={{ uri: item.image_key }}
            style={styles.trashImage}
            resizeMode="cover"
          />
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {item.title}
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <FontAwesome5 name="lightbulb" size={12} color={Colors.primary} />
                <Text style={styles.statText}>
                  {item.items.length} ide
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <FontAwesome5 name="leaf" size={12} color={Colors.secondary} />
                <Text style={styles.statText}>
                  {item.items.filter(i => i.having_greenprint).length} greenprint
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.expandButton}
          >
            <FontAwesome5 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={14} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {item.description}
        </Text>

        {/* Recycling Items - Expandable */}
        {isExpanded && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.recyclingItemsContainer}
          >
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="recycle" size={14} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Ide Daur Ulang</Text>
            </View>
            
            {item.items.map((recyclingItem: RecyclingItem, itemIndex: number) => (
              <RecyclingItemCard 
                key={recyclingItem.id} 
                item={recyclingItem} 
                index={itemIndex}
                getValueColor={getValueColor}
                getValueText={getValueText}
              />
            ))}
          </MotiView>
        )}

        {/* Footer with expand hint */}
        {!isExpanded && (
          <TouchableOpacity
            onPress={() => setIsExpanded(true)}
            style={styles.expandHint}
          >
            <Text style={styles.expandHintText}>
              Tap untuk melihat {item.items.length} ide daur ulang
            </Text>
            <FontAwesome5 name="chevron-down" size={10} color={Colors.secondary} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trashImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 8,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  expandButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 12,
  },
  recyclingItemsContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 14,
    color: Colors.primary,
  },
  expandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
    marginTop: 4,
  },
  expandHintText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
  },
});
