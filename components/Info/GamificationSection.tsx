import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface GamificationFeature {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

const features: GamificationFeature[] = [
  {
    id: 'points',
    title: 'Poin',
    icon: 'coins',
    description: 'Poin bisa dikumpulkan melalui berbagai aktivitas seperti Quest, Challenge, dan Event. Poin berguna saat fase Convert dan Contribute, serta saat LintangFest berlangsung. Tersedia history screen untuk melihat pertukaran dan penambahan poin.',
    color: Colors.secondary,
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    icon: 'crown',
    description: 'Ajang kompetisi sehat antar pengguna berdasarkan poin yang dikumpulkan. Lihat posisi kamu di antara pengguna lain dan raih peringkat teratas!',
    color: Colors.secondary,
  },
  {
    id: 'level',
    title: 'Level',
    icon: 'chart-line',
    description: 'Didapat dengan mengerjakan daily routine dari Ecoach. Setiap routine memberikan exp. Saat exp mencapai angka tertentu, kamu naik level dan mendapat point multiplier.',
    color: Colors.tertiary,
  },
  {
    id: 'badge',
    title: 'Badge',
    icon: 'medal',
    description: 'Pencapaian khusus yang bisa kamu raih dengan menyelesaikan tantangan tertentu. Setiap badge menunjukkan keahlian dan dedikasi kamu dalam berbagai aspek lingkungan.',
    color: '#FF6B35',
  },
  {
    id: 'streak',
    title: 'Streak',
    icon: 'fire',
    description: 'Konsistensi adalah kunci! Streak menghitung berapa hari berturut-turut kamu aktif melakukan kegiatan ramah lingkungan. Jaga streak kamu untuk bonus poin!',
    color: '#E74C3C',
  },
];

export default function GamificationSection() {
  const [selectedFeature, setSelectedFeature] = useState<string>('points');

  const selectedFeatureData = features.find(feature => feature.id === selectedFeature) || features[0];

  const renderFeatureCard = (feature: GamificationFeature, index: number) => {
    const isSelected = selectedFeature === feature.id;

    return (
      <MotiView
        key={feature.id}
        from={{ opacity: 0, translateY: 20, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          translateY: 0, 
          scale: isSelected ? 1.05 : 1 
        }}
        transition={{ 
          type: 'spring', 
          delay: 200 + (index * 100),
          damping: 15,
          stiffness: 150
        }}
        style={[
          styles.featureCard,
          isSelected && styles.featureCardSelected
        ]}
      >
        <TouchableOpacity
          onPress={() => setSelectedFeature(feature.id)}
          activeOpacity={0.8}
          style={styles.featureCardButton}
        >
          <LinearGradient
            colors={isSelected ? [feature.color + '20', feature.color + '10'] : [Colors.surface, Colors.surfaceContainerHigh]}
            style={styles.featureCardGradient}
          >
            <View style={[
              styles.featureIcon,
              { backgroundColor: feature.color + (isSelected ? '20' : '15') }
            ]}>
              <FontAwesome5 
                name={feature.icon} 
                size={20} 
                color={feature.color} 
              />
            </View>
            <Text style={[
              styles.featureTitle,
              { color: isSelected ? feature.color : Colors.onSurface }
            ]}>
              {feature.title}
            </Text>
            {isSelected && (
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 300 }}
                style={styles.selectedIndicator}
              >
                <FontAwesome5 name="check-circle" size={16} color={feature.color} />
              </MotiView>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Intro */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.introContainer}
      >
        <Text style={styles.introTitle}>Sistem Gamifikasi</Text>
        <Text style={styles.introDescription}>
          Membuat perjalanan ramah lingkungan menjadi menyenangkan dengan berbagai komponen reward dan pencapaian.
        </Text>
      </MotiView>

      {/* Feature Grid */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 800, delay: 200 }}
        style={styles.featuresGrid}
      >
        {features.map((feature, index) => renderFeatureCard(feature, index))}
      </MotiView>

      {/* Selected Feature Details */}
      <MotiView
        key={`details-${selectedFeature}`}
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.detailsContainer}
      >
        <LinearGradient
          colors={[selectedFeatureData.color + '10', selectedFeatureData.color + '05']}
          style={styles.detailsCard}
        >
          <View style={styles.detailsHeader}>
            <View style={[styles.detailsIcon, { backgroundColor: selectedFeatureData.color + '20' }]}>
              <FontAwesome5 
                name={selectedFeatureData.icon} 
                size={24} 
                color={selectedFeatureData.color} 
              />
            </View>
            <Text style={[styles.detailsTitle, { color: selectedFeatureData.color }]}>
              {selectedFeatureData.title}
            </Text>
          </View>
          
          <Text style={styles.detailsDescription}>
            {selectedFeatureData.description}
          </Text>
        </LinearGradient>
      </MotiView>

      {/* Benefits Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 800 }}
        style={styles.benefitsContainer}
      >
        <Text style={styles.benefitsTitle}>Mengapa Gamifikasi?</Text>
        
        <View style={styles.benefitsList}>
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 900 }}
            style={styles.benefitItem}
          >
            <View style={[styles.benefitIcon, { backgroundColor: Colors.primary + '15' }]}>
              <FontAwesome5 name="heart" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.benefitText}>
              Membuat kegiatan ramah lingkungan lebih menyenangkan
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 1000 }}
            style={styles.benefitItem}
          >
            <View style={[styles.benefitIcon, { backgroundColor: Colors.secondary + '15' }]}>
              <FontAwesome5 name="users" size={16} color={Colors.secondary} />
            </View>
            <Text style={styles.benefitText}>
              Membangun komunitas yang kompetitif dan supportif
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 1100 }}
            style={styles.benefitItem}
          >
            <View style={[styles.benefitIcon, { backgroundColor: Colors.tertiary + '15' }]}>
              <FontAwesome5 name="rocket" size={16} color={Colors.tertiary} />
            </View>
            <Text style={styles.benefitText}>
              Memberikan motivasi untuk konsisten berkegiatan
            </Text>
          </MotiView>
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
    marginBottom: 24,
  },
  introTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  introDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureCardSelected: {
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  featureCardButton: {
    width: '100%',
  },
  featureCardGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  detailsContainer: {
    marginBottom: 24,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    flex: 1,
  },
  detailsDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 18,
  },
});
