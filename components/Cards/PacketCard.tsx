import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Packet {
  id: number;
  name: string;
  target: string;
  description: string;
  completed_task: number;
  expected_task: number;
  assigned_task: number;
  completion_rate: string;
  task_per_day: number;
  completed: boolean;
  created_at: string;
}

interface PacketCardProps {
  packet: Packet;
  index: number;
}

export default function PacketCard({ packet, index }: PacketCardProps) {
  const progress = packet.expected_task > 0 ? packet.completed_task / packet.expected_task : 0;
  const progressPercentage = Math.round(progress * 100);

  const getStatusColor = () => {
    if (packet.completed) return '#4CAF50';
    if (progressPercentage >= 75) return Colors.secondary;
    if (progressPercentage >= 50) return '#FF9800';
    return Colors.primary;
  };

  const getStatusIcon = () => {
    if (packet.completed) return 'check-circle';
    if (progressPercentage >= 75) return 'clock';
    if (progressPercentage >= 50) return 'play-circle';
    return 'circle';
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 600,
        delay: index * 100,
      }}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.mainBackground, Colors.surfaceVariant + '50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={2}>
              {packet.name}
            </Text>
            <Text style={styles.target} numberOfLines={1}>
              Target: {packet.target}
            </Text>
          </View>
          <View style={[styles.statusIcon, { backgroundColor: getStatusColor() + '20' }]}>
            <FontAwesome5 
              name={getStatusIcon()} 
              size={20} 
              color={getStatusColor()} 
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {packet.description}
        </Text>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {packet.completed_task} / {packet.expected_task} tugas
            </Text>
            <Text style={styles.progressPercentage}>
              {progressPercentage}%
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <MotiView
              from={{ width: '0%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{
                type: 'timing',
                duration: 1000,
                delay: index * 100 + 300,
              }}
              style={[styles.progressFill, { backgroundColor: getStatusColor() }]}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <FontAwesome5 name="calendar-day" size={12} color={Colors.onSurfaceVariant} />
            <Text style={styles.statText}>{packet.task_per_day}/hari</Text>
          </View>
          <View style={styles.stat}>
            <FontAwesome5 name="tasks" size={12} color={Colors.onSurfaceVariant} />
            <Text style={styles.statText}>{packet.assigned_task} ditugaskan</Text>
          </View>
          <View style={styles.stat}>
            <FontAwesome5 name="clock" size={12} color={Colors.onSurfaceVariant} />
            <Text style={styles.statText}>
              {new Date(packet.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 4,
  },
  target: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
    lineHeight: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: Fonts.text.bold,
    fontSize: 13,
    color: Colors.onSurface,
  },
  progressPercentage: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statText: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
});
