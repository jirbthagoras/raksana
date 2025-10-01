import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Activity {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  features: string[];
  color: string;
}

const activities: Activity[] = [
  {
    id: 'quest',
    title: 'Quest',
    subtitle: 'Monthly Quest',
    icon: 'map-marked-alt',
    description: 'Tantangan unik yang bersifat terbatas. Jika Quest sudah dikerjakan oleh seseorang atau grup, maka tidak tersedia lagi. Kamu harus keluar ruangan dan menjelajahi lingkungan untuk menemukan pos-pos Raksana yang dijaga Guide.',
    features: [
      'Tantangan bulanan yang terbatas',
      'Harus keluar ruangan untuk berpartisipasi',
      'Pos-pos Raksana dengan Guide',
      'Scanning QR code untuk mendapat poin',
      'Otomatis tercatat di journal'
    ],
    color: Colors.primary,
  },
  {
    id: 'challenge',
    title: 'Challenge',
    subtitle: 'Daily Challenge',
    icon: 'trophy',
    description: 'Setiap tengah malam sistem menghasilkan challenge baru. Konten challenge berbeda-beda dan di-generate oleh AI. Kamu berpartisipasi dengan mengupload foto sesuai konteks challenge ke Album.',
    features: [
      'Challenge harian yang di-generate AI',
      'Konten unik dan variatif',
      'Upload foto ke Album untuk berpartisipasi',
      'Poin ditentukan oleh AI',
      'Notifikasi saat challenge di-refresh'
    ],
    color: Colors.secondary,
  },
  {
    id: 'event',
    title: 'Event',
    subtitle: 'Community Events',
    icon: 'calendar-alt',
    description: 'Aktivitas yang dilakukan bersama pengguna lain. Dengan digitalisasi dan fleksibilitas, kami bekerjasama dengan pihak ketiga untuk menjalankan event di platform kami, menyediakan berbagai Event yang bervariasi.',
    features: [
      'Aktivitas bersama pengguna lain',
      'Kerjasama dengan pihak ketiga',
      'Registrasi melalui halaman Event',
      'Berbagai jenis event yang bervariasi',
      'QR code scanning saat event berakhir'
    ],
    color: Colors.tertiary,
  },
];

export default function ActivitiesSection() {
  const [selectedActivity, setSelectedActivity] = useState<string>('quest');

  const selectedActivityData = activities.find(activity => activity.id === selectedActivity) || activities[0];

  const renderActivityTab = (activity: Activity, index: number) => {
    const isSelected = selectedActivity === activity.id;

    return (
      <MotiView
        key={activity.id}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ 
          opacity: 1, 
          translateY: 0
        }}
        transition={{ 
          type: 'spring', 
          delay: 200 + (index * 100),
          damping: 15,
          stiffness: 150
        }}
        style={[
          styles.activityTab,
          isSelected && styles.activityTabSelected
        ]}
      >
        <TouchableOpacity
          onPress={() => setSelectedActivity(activity.id)}
          activeOpacity={0.8}
          style={styles.activityTabButton}
        >
          <View
            style={[
              styles.activityTabGradient,
              {
                backgroundColor: isSelected ? activity.color + '20' : Colors.surface
              }
            ]}
          >
            <FontAwesome5 
              name={activity.icon} 
              size={24} 
              color={activity.color} 
            />
            <Text style={[
              styles.activityTabTitle,
              { color: activity.color }
            ]}>
              {activity.title}
            </Text>
            <Text style={[
              styles.activityTabSubtitle,
              { color: isSelected ? activity.color + 'CC' : Colors.onSurfaceVariant }
            ]}>
              {activity.subtitle}
            </Text>
          </View>
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
        <Text style={styles.introTitle}>Activities</Text>
        <Text style={styles.introDescription}>
          Berbagai kegiatan menarik untuk mengumpulkan poin dan membangun gaya hidup ramah lingkungan.
        </Text>
      </MotiView>

      {/* Activity Tabs */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 800, delay: 200 }}
        style={styles.activitiesContainer}
      >
        {activities.map((activity, index) => renderActivityTab(activity, index))}
      </MotiView>

      {/* Selected Activity Details */}
      <MotiView
        key={`details-${selectedActivity}`}
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.detailsContainer}
      >
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: selectedActivityData.color + '08'
            }
          ]}
        >
          {/* Header */}
          <View style={styles.detailsHeader}>
            <View style={[styles.detailsIcon, { backgroundColor: selectedActivityData.color + '20' }]}>
              <FontAwesome5 
                name={selectedActivityData.icon} 
                size={28} 
                color={selectedActivityData.color} 
              />
            </View>
            <View style={styles.detailsHeaderText}>
              <Text style={[styles.detailsTitle, { color: selectedActivityData.color }]}>
                {selectedActivityData.title}
              </Text>
              <Text style={styles.detailsSubtitle}>
                {selectedActivityData.subtitle}
              </Text>
            </View>
          </View>
          
          {/* Description */}
          <Text style={styles.detailsDescription}>
            {selectedActivityData.description}
          </Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Cara Kerja:</Text>
            {selectedActivityData.features.map((feature, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 300, delay: index * 100 }}
                style={styles.featureItem}
              >
                <View style={[styles.featureBullet, { backgroundColor: selectedActivityData.color }]} />
                <Text style={styles.featureText}>{feature}</Text>
              </MotiView>
            ))}
          </View>
        </View>
      </MotiView>

      {/* Bottom Tips */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 800 }}
        style={styles.tipsContainer}
      >
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <FontAwesome5 name="lightbulb" size={16} color={Colors.primary} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tips</Text>
            <Text style={styles.tipText}>
              Kombinasikan ketiga aktivitas untuk memaksimalkan poin dan pengalaman ramah lingkungan kamu!
            </Text>
          </View>
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
  activitiesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  activityTab: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityTabSelected: {
    // shadowColor: Colors.primary,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
    // elevation: 6,
  },
  activityTabButton: {
    width: '100%',
  },
  activityTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
  },
  activityTabTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
  },
  activityTabSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    marginLeft: 'auto',
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
    marginBottom: 16,
    gap: 16,
  },
  detailsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    marginBottom: 4,
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
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 8,
  },
  featuresTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  featureText: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 18,
  },
  tipsContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryContainer,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onPrimaryContainer,
    marginBottom: 4,
  },
  tipText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onPrimaryContainer,
    lineHeight: 18,
  },
});
