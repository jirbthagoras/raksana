import FloatingElements from '@/components/Screens/FloatingElements';
import GradientBackground from '@/components/Screens/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Authentication guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <FloatingElements count={6} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Selamat Datang,</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Dashboard Cards */}
            <View style={styles.dashboardSection}>
              <Text style={styles.sectionTitle}>Dashboard Eco Lifestyle</Text>
              
              <View style={styles.cardGrid}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Jejak Karbon Hari Ini</Text>
                  <Text style={styles.cardValue}>2.4 kg CO₂</Text>
                  <Text style={styles.cardSubtext}>15% lebih rendah dari kemarin</Text>
                </View>
                
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Poin Eco</Text>
                  <Text style={styles.cardValue}>1,247</Text>
                  <Text style={styles.cardSubtext}>+50 poin hari ini</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Aksi Cepat</Text>
              
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🌱</Text>
                  <Text style={styles.actionText}>Catat Aktivitas Hijau</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>♻️</Text>
                  <Text style={styles.actionText}>Daur Ulang</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🚲</Text>
                  <Text style={styles.actionText}>Transportasi Hijau</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>💡</Text>
                  <Text style={styles.actionText}>Tips Hemat Energi</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Activities */}
            <View style={styles.activitiesSection}>
              <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
              
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🚶‍♂️</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Berjalan kaki ke kantor</Text>
                    <Text style={styles.activityTime}>2 jam yang lalu</Text>
                  </View>
                  <Text style={styles.activityPoints}>+25 poin</Text>
                </View>
                
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>♻️</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Mendaur ulang botol plastik</Text>
                    <Text style={styles.activityTime}>5 jam yang lalu</Text>
                  </View>
                  <Text style={styles.activityPoints}>+15 poin</Text>
                </View>
                
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>🌿</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Menggunakan tas belanja kain</Text>
                    <Text style={styles.activityTime}>1 hari yang lalu</Text>
                  </View>
                  <Text style={styles.activityPoints}>+10 poin</Text>
                </View>
              </View>
            </View>

            {/* Weekly Challenge */}
            <View style={styles.challengeSection}>
              <Text style={styles.sectionTitle}>Tantangan Minggu Ini</Text>
              
              <View style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>Kurangi Penggunaan Plastik</Text>
                <Text style={styles.challengeDescription}>
                  Hindari penggunaan plastik sekali pakai selama 7 hari
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
                <Text style={styles.progressText}>4/7 hari tercapai</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  userName: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.primary,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  logoutText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 16,
  },
  dashboardSection: {
    marginBottom: 8,
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  cardValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 4,
  },
  cardSubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.primary,
  },
  actionsSection: {
    marginBottom: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onBackground,
    textAlign: 'center',
  },
  activitiesSection: {
    marginBottom: 8,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onBackground,
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  activityPoints: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  challengeSection: {
    marginBottom: 8,
  },
  challengeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 8,
  },
  challengeDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
