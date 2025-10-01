import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface TrilokaPhase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  angle: number;
}

const phases: TrilokaPhase[] = [
  {
    id: 'collect',
    title: 'Collect',
    subtitle: 'Kumpulkan Kebiasaan',
    description: 'Melibatkan kegiatan aktif yang membantu membentuk gaya hidup baru dimulai dengan kebiasaan, aksi nyata, dan event. Di sisi lain, kamu juga akan mendapatkan poin yang dapat digunakan nantinya.',
    icon: 'hand-holding-heart',
    color: Colors.primary,
    angle: 0,
  },
  {
    id: 'convert',
    title: 'Convert',
    subtitle: 'Tukar Poin',
    description: 'Fase dimana kamu dapat menukar poin menjadi bibit tanaman. Fase ini dilaksanakan oleh pihak Raksana untuk memastikan dampak nyata dari usaha kamu.',
    icon: 'exchange-alt',
    color: Colors.secondary,
    angle: 120,
  },
  {
    id: 'contribute',
    title: 'Contribute',
    subtitle: 'Berkontribusi Nyata',
    description: 'Langkah dimana kamu akan terlibat langsung dalam kegiatan lingkungan dan memberikan dampak eksternal. Fase ini akan lebih terasa saat Lintangfest berlangsung.',
    icon: 'seedling',
    color: Colors.tertiary,
    angle: 240,
  },
];

export default function TrilokaSection() {
  const [selectedPhase, setSelectedPhase] = useState<string>('collect');

  const selectedPhaseData = phases.find(phase => phase.id === selectedPhase) || phases[0];

  const renderCircularPhase = (phase: TrilokaPhase, index: number) => {
    const isSelected = selectedPhase === phase.id;
    
    // Perfect circular positioning - evenly distributed around center
    const containerSize = 280; // Fixed container size for consistency
    const centerX = containerSize / 2; // Perfect center
    const centerY = containerSize / 2; // Perfect center
    const radius = 90; // Fixed radius for consistent spacing
    
    // Calculate evenly distributed angles (120 degrees apart for 3 items)
    const baseAngle = -90; // Start from top (-90 degrees)
    const angleStep = 120; // 360/3 = 120 degrees between each phase
    const angle = baseAngle + (index * angleStep);
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate precise positions
    const x = centerX + radius * Math.cos(angleRad) - 28; // -28 to center the 56px button
    const y = centerY + radius * Math.sin(angleRad) - 28; // -28 to center the 56px button

    return (
      <MotiView
        key={phase.id}
        from={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: isSelected ? 1.08 : 1,
          translateY: isSelected ? -3 : 0
        }}
        transition={{ 
          type: 'spring', 
          delay: 600 + (index * 200),
          damping: 15,
          stiffness: 120
        }}
        style={[
          styles.phaseButton,
          {
            position: 'absolute',
            left: x,
            top: y,
            zIndex: isSelected ? 5 : 2,
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => setSelectedPhase(phase.id)}
          activeOpacity={0.7}
          style={styles.phaseButtonTouchable}
        >
          <LinearGradient
            colors={isSelected 
              ? [phase.color, phase.color + 'CC']
              : [Colors.surface, Colors.surfaceContainerHigh]
            }
            style={[
              styles.phaseButtonGradient,
              isSelected && styles.phaseButtonSelected,
              { 
                borderColor: phase.color + (isSelected ? '60' : '30'),
                borderWidth: isSelected ? 2 : 1
              }
            ]}
          >
            <FontAwesome5 
              name={phase.icon} 
              size={isSelected ? 20 : 18}
              color={isSelected ? Colors.onPrimary : phase.color} 
            />
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Phase Label */}
        <MotiView
          from={{ opacity: 0, translateY: 5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 800 + (index * 200) }}
          style={[
            styles.phaseLabelContainer,
            {
              // Position labels outside the circle based on angle
              marginTop: angle < -30 && angle > -150 ? 12 : // Top
                       angle >= -30 && angle <= 90 ? 8 : // Right
                       8, // Bottom/Left
            }
          ]}
        >
        </MotiView>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Intro Text */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.introContainer}
      >
        <Text style={styles.introTitle}>Triloka</Text>
        <Text style={styles.introSubtitle}>Samsara atau siklus utama dalam aplikasi</Text>
        <Text style={styles.introDescription}>
          Triloka adalah proses yang terus diulang dan menjadi garis besar aplikasi. 
          Terdiri dari tiga fase: Collect, Convert, dan Contribute.
        </Text>
      </MotiView>

      {/* Circular Interface */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 800, delay: 200 }}
        style={styles.circularContainer}
      >
        {/* Center Circle - Bigger and more prominent */}
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1000, delay: 300 }}
          style={styles.centerCircle}
        >
          <LinearGradient
            colors={[Colors.primary + '30', Colors.secondary + '30']}
            style={styles.centerCircleGradient}
          >
            <FontAwesome5 name="leaf" size={32} color={Colors.primary} />
            <Text style={styles.centerText}>Triloka</Text>
          </LinearGradient>
        </MotiView>

        {/* Connection Lines - Perfect radial lines */}
        {phases.map((phase, index) => {
          const isSelected = selectedPhase === phase.id;
          const containerSize = 280;
          const centerX = containerSize / 2;
          const centerY = containerSize / 2;
          
          // Calculate line angles (same as phase positions)
          const baseAngle = -90;
          const angleStep = 120;
          const angle = baseAngle + (index * angleStep);
          
          return (
            <MotiView
              key={`line-${phase.id}`}
              from={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: isSelected ? 0.7 : 0.3, 
                scaleY: 1 
              }}
              transition={{ 
                type: 'timing', 
                duration: 500, 
                delay: 1000 + (index * 150) 
              }}
            />
          );
        })}

        {/* Phase Buttons */}
        {phases.map((phase, index) => renderCircularPhase(phase, index))}
      </MotiView>

      {/* Selected Phase Details */}
      <MotiView
        key={`details-${selectedPhase}`}
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.detailsContainer}
      >
        <LinearGradient
          colors={[selectedPhaseData.color + '10', selectedPhaseData.color + '05']}
          style={styles.detailsCard}
        >
          <View style={styles.detailsHeader}>
            <View style={[styles.detailsIcon, { backgroundColor: selectedPhaseData.color + '20' }]}>
              <FontAwesome5 
                name={selectedPhaseData.icon} 
                size={20} 
                color={selectedPhaseData.color} 
              />
            </View>
            <View style={styles.detailsHeaderText}>
              <Text style={[styles.detailsTitle, { color: selectedPhaseData.color }]}>
                {selectedPhaseData.title}
              </Text>
              <Text style={styles.detailsSubtitle}>
                {selectedPhaseData.subtitle}
              </Text>
            </View>
          </View>
          
          <Text style={styles.detailsDescription}>
            {selectedPhaseData.description}
          </Text>
        </LinearGradient>
      </MotiView>

      {/* Bottom Info */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 800 }}
        style={styles.bottomInfo}
      >
        <View style={styles.infoItem}>
          <FontAwesome5 name="info-circle" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>
            Ketuk lingkaran untuk melihat detail setiap fase
          </Text>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introContainer: {
    marginBottom: 30,
  },
  introTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  introSubtitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  introDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  circularContainer: {
    width: 280, // Fixed width for consistent layout
    height: 280, // Perfect square container
    position: 'relative',
    marginBottom: 32,
    alignSelf: 'center', // Center the entire circular layout
  },
  centerCircle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -70, // Half of width (140px) for perfect centering
    marginTop: -70, // Half of height (140px) for perfect centering
    borderRadius: 70,
    overflow: 'hidden',
  },
  centerCircleGradient: {
    width: 140, // Bigger center circle for prominence
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
  },
  centerText: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  centerSubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'center',
  },
  phaseButton: {
    alignItems: 'center',
  },
  phaseButtonTouchable: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  phaseButtonGradient: {
    width: 56, // Slightly smaller for better spacing
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  phaseButtonSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  phaseLabelContainer: {
    marginTop: 10,
    alignItems: 'center',
    minWidth: 60, // Ensure consistent label width
  },
  phaseLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  detailsSubtitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  detailsDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  bottomInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onPrimaryContainer,
  },
});
