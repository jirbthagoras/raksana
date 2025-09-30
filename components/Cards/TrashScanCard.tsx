import { Colors, Fonts } from '@/constants';
import { TrashScan } from '@/types/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TrashScanCardProps {
  item: TrashScan;
  index: number;
}

export const TrashScanCard: React.FC<TrashScanCardProps> = ({ item, index }) => {
  const handleCardPress = () => {
    router.push(`/recyclopedia/${index}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCardPress} activeOpacity={0.8}>
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
            <Text style={styles.title} numberOfLines={2}>
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

          <View style={styles.chevronContainer}>
            <FontAwesome5 
              name="chevron-right" 
              size={14} 
              color={Colors.primary} 
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Footer with tap hint */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap untuk melihat {item.items.length} ide daur ulang
          </Text>
          <FontAwesome5 name="arrow-right" size={10} color={Colors.secondary} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
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
  chevronContainer: {
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  footerText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
    flex: 1,
  },
});
