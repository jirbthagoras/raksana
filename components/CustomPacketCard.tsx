import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressRing from './ProgresRing';

interface PacketCardProps {
  packet: {
    id: number;
    name: string;
    completed_task: number;
    expected_task: number;
    assigned_task: number;
    completed: boolean;
  };
  onPress?: (packetId: number) => void;
}

const CustomPacketCard: React.FC<PacketCardProps> = ({ packet, onPress }) => {
  const completionRate = packet.assigned_task > 0 ? (packet.completed_task / packet.assigned_task) * 100 : 0;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress?.(packet.id)}
      activeOpacity={0.8}
    >
      {/* Header with ID */}
      <View style={styles.header}>
        <Text style={styles.packetId}>#{packet.id}</Text>
        <View style={[
          styles.statusBadge,
          packet.completed ? styles.statusBadgeCompleted : styles.statusBadgeActive
        ]}>
          <View style={[
            styles.statusDot,
            packet.completed ? styles.statusDotCompleted : styles.statusDotActive
          ]} />
          <Text style={[
            styles.statusText,
            packet.completed ? styles.statusTextCompleted : styles.statusTextActive
          ]}>
            {packet.completed ? 'Selesai' : 'Aktif'}
          </Text>
        </View>
      </View>

      {/* Packet Name */}
      <Text style={styles.packetName} numberOfLines={2}>
        {packet.name}
      </Text>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        {/* Progress Ring */}
        <View style={styles.chartWrapper}>
          <ProgressRing
            completed={packet.completed_task}
            total={packet.expected_task}
            size={70}
          />
        </View>

        {/* Progress Details */}
        <View style={styles.progressDetails}>
          <View style={styles.progressRow}>
            <FontAwesome5 name="check-circle" size={14} color={"black"} />
            <Text style={styles.progressLabel}>Dikerjakan</Text>
            <Text style={styles.progressValue}>{packet.completed_task}</Text>
          </View>
          <View style={styles.progressRow}>
            <FontAwesome5 name="tasks" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.progressLabel}>Total</Text>
            <Text style={styles.progressValue}>{packet.expected_task}</Text>
          </View>
        </View>
      </View>

      {/* Arrow Icon */}
      <View style={styles.arrowContainer}>
        <FontAwesome5 name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    minWidth: 280,
    maxWidth: 320,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packetId: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: Colors.primary + '15',
  },
  statusBadgeCompleted: {
    backgroundColor: Colors.onSurfaceVariant + '15',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusDotActive: {
    backgroundColor: Colors.primary,
  },
  statusDotCompleted: {
    backgroundColor: Colors.onSurfaceVariant,
  },
  statusText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
  },
  statusTextActive: {
    color: Colors.primary,
  },
  statusTextCompleted: {
    color: Colors.onSurfaceVariant,
  },
  packetName: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartContainer: {
    marginRight: 16,
  },
  progressDetails: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginLeft: 8,
    flex: 1,
  },
  progressValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  // Chart styles
  chartWrapper: {
    marginRight: 16,
  },
  // Progress ring styles
  progressRing: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringSegment: {
    // Individual ring segments
  },
  ringBackground: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  ringCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  ringText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
});

export default CustomPacketCard;
