import React from 'react';
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
import FloatingElements from '../../components/FloatingElements';
import GradientBackground from '../../components/GradientBackground';
import { Colors, Fonts } from '../../constants';

import PocketCard from '@/components/Home/BalanceCard';
import ProgressBar from '@/components/Home/ProgressBar';
import StreakButton from '@/components/Home/StreakButton';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeTab() {
  const { user, logout } = useAuth();

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
              <Text style={styles.userName}>{user?.name || user?.username || 'User'}</Text>
            </View>
            <View style={styles.headerButtons}>
              <StreakButton 
                streak={100} 
                onPress={() => console.log('Streak pressed!')} 
              />
              <ProgressBar 
                level={5} 
                points={1247} 
                currentExp={750} 
                neededExp={1000} 
              />
            </View>
          </View>
          

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Dashboard Cards */}
            <View style={styles.dashboardSection}>
              <Text style={styles.sectionTitle}>Dashboard</Text>
              <PocketCard 
                balance={125000}
                currency="GP"
                changePercent={12}
                changeAmount={15000}
                onHistoryPress={() => console.log('History pressed!')}
              />
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
    paddingBottom: 120, // Extra padding for tab bar
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    gap: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.tertiary,
    marginBottom: 4,
  },
  userName: {
    fontFamily: Fonts.display.bold,
    fontSize: 30,
    color: Colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    width: '100%',
  },
  streakView: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    height: 55,
    width: 55,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    fontFamily: Fonts.display.bold,
    color: Colors.error,
    fontSize: 16,
  },
  logoutText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 28,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 16,
  },
  dashboardSection: {
    marginBottom: 12,
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
    shadowColor: Colors.primary,
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
    color: Colors.primary,
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
    shadowColor: Colors.primary,
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
    color: Colors.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
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
    shadowColor: Colors.primary,
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
    color: Colors.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 106, 100, 0.2)',
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
    color: Colors.secondary,
    textAlign: 'center',
  },
});
