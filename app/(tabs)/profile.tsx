import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
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
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileTab() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <FloatingElements count={4} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profil</Text>
          </View>

          {/* Profile Info */}
          <View style={styles.section}>
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.userName}>{user?.name || user?.username || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistik Eco</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>1,247</Text>
                <Text style={styles.statLabel}>Total Poin</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>23</Text>
                <Text style={styles.statLabel}>Hari Aktif</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>45.2 kg</Text>
                <Text style={styles.statLabel}>CO₂ Dikurangi</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Tantangan Selesai</Text>
              </View>
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pengaturan</Text>
            <View style={styles.menuList}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="person-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuText}>Edit Profil</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuText}>Notifikasi</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="shield-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuText}>Privasi</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuText}>Bantuan</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuText}>Tentang</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="red" />
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
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
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 106, 100, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'center',
  },
  menuList: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuText: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: "red",
    marginLeft: 8,
  },
});
