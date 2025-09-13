import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FloatingElements from '../../components/FloatingElements';
import GradientBackground from '../../components/GradientBackground';
import { Colors, Fonts } from '../../constants';

import BackyardButton from '@/components/Home/BackyardButton';
import DailyChallenge from '@/components/Home/DailyChallenge';
import EventsButton from '@/components/Home/EventsButton';
import JournalButton from '@/components/Home/JournalButton';
import MemoryButton from '@/components/Home/MemoryButton';
import PacketsButton from '@/components/Home/PacketsButton';
import PocketCard from '@/components/Home/PointCard';
import ProgressBar from '@/components/Home/ProgressBar';
import RecapsButton from '@/components/Home/RecapsButton';
import RecyclopediaButton from '@/components/Home/RecyclopediaButton';
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
                streak={1} 
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
              <PocketCard
                balance={125000}
                currency="GP"
                onHistoryPress={() => console.log('History pressed!')}
                onConvertPress={() => console.log('Convert pressed!')}
              />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.scrollIndicator}>
                  <View style={styles.scrollDot} />
                  <View style={styles.scrollDot} />
                  <View style={styles.scrollDot} />
                </View>
              </View>
              <View style={styles.scrollWrapper}>
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                  style={styles.horizontalScroll}
                  decelerationRate="fast"
                  snapToInterval={132}
                  snapToAlignment="start"
                >
                  <JournalButton onPress={() => console.log('Journal pressed!')} />
                  <MemoryButton onPress={() => console.log('Album pressed!')} />
                  <EventsButton onPress={() => console.log('Events pressed!')} />
                  <PacketsButton onPress={() => console.log('Packets pressed!')} />
                  <RecapsButton onPress={() => console.log('Recaps pressed!')} />
                  <RecyclopediaButton onPress={() => console.log('Recyclopedia pressed!')} />
                  <BackyardButton onPress={() => console.log('Backyard pressed!')} />
                </ScrollView>
                <View style={styles.scrollGradientLeft} />
                <View style={styles.scrollGradientRight} />
              </View>
            </View>

            <View style={styles.challengeSection}>
              <DailyChallenge
                id={4}
                day={4}
                difficulty="hard"
                name="Jejak Nol Plastik Piknik"
                description="Hari ini, siapkan piknik makan siang tanpa menggunakan plastik sekali pakai. Bawa bekal dengan wadah dan alat makan sendiri, lalu nikmati di taman terdekat sambil memungut 5 sampah plastik yang kamu temukan! #ZeroWastePicnic #EcoChallenge"
                point_gain={350}
                participants={0}
                onPress={() => console.log('Challenge pressed!')}
              />
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
    paddingBottom: 15,
  },
  welcomeSection: {
    flex: 1,
    marginBottom: 15,
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
  challengeSection: {
    marginBottom: 10,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  scrollIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  scrollDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outline + '40',
  },
  scrollWrapper: {
    position: 'relative',
    height: 120,
  },
  horizontalScroll: {
    height: 120,
  },
  scrollContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 12,
    alignItems: 'center',
    height: 120,
  },
  scrollGradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
    pointerEvents: 'none',
  },
  scrollGradientRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
    pointerEvents: 'none',
  },
});
