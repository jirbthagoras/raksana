import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FloatingElements from '../components/Screens/FloatingElements';
import GradientBackground from '../components/Screens/GradientBackground';

const { width, height } = Dimensions.get('window');

interface InfoSection {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType;
}

// Import section components
import ActivitiesSection from '@/components/Info/ActivitiesSection';
import GamificationSection from '@/components/Info/GamificationSection';
import RecyclopediaSection from '@/components/Info/RecyclopediaSection';
import TrilokaSection from '@/components/Info/TrilokaSection';

const sections: InfoSection[] = [
  {
    id: 'triloka',
    title: 'Apa itu Raksana?',
    icon: 'leaf',
    component: TrilokaSection,
  },
  {
    id: 'gamification',
    title: 'Make Lifestyle-Crafting Fun!',
    icon: 'gamepad',
    component: GamificationSection,
  },
  {
    id: 'activities',
    title: 'Activities',
    icon: 'tasks',
    component: ActivitiesSection,
  },
  {
    id: 'recyclopedia',
    title: 'Recyclopedia',
    icon: 'recycle',
    component: RecyclopediaSection,
  },
];

export default function InfoScreen() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);

  React.useEffect(() => {
    // Check if coming from onboarding (you can pass this as a param)
    const checkSource = () => {
      // This would be set based on navigation params
      // For now, we'll assume it's from home screen
      setIsFromOnboarding(false);
    };
    checkSource();
  }, []);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleFinish = () => {
    if (isFromOnboarding) {
      // Navigate to onboarding create step
      router.back();
    } else {
      // Navigate back to home
      router.back();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const progress = ((currentSection + 1) / sections.length) * 100;
  const CurrentComponent = sections[currentSection].component;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <FloatingElements count={4} />
        
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="times" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Tentang Raksana</Text>
            <Text style={styles.headerSubtitle}>
              {currentSection + 1} dari {sections.length}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </MotiView>

        {/* Progress Bar */}
        <MotiView
          from={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
          style={styles.progressContainer}
        >
          <View style={styles.progressBackground}>
            <MotiView
              from={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'timing', duration: 500 }}
              style={styles.progressBar}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </MotiView>
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </MotiView>

        {/* Section Title */}
        <MotiView
          key={`title-${currentSection}`}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 300 }}
          style={styles.sectionTitleContainer}
        >
          <View style={styles.sectionIconContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.sectionIconGradient}
            >
              <FontAwesome5 
                name={sections[currentSection].icon} 
                size={24} 
                color={Colors.onPrimary} 
              />
            </LinearGradient>
          </View>
          <Text style={styles.sectionTitle}>
            {sections[currentSection].title}
          </Text>
        </MotiView>

        {/* Content */}
        <MotiView
          key={`content-${currentSection}`}
          from={{ opacity: 0, translateX: 30 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          style={styles.contentContainer}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <CurrentComponent />
          </ScrollView>
        </MotiView>

        {/* Navigation */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 500 }}
          style={styles.navigationContainer}
        >
          <TouchableOpacity
            style={[
              styles.iconButton,
              styles.prevButton,
              currentSection === 0 && styles.iconButtonDisabled
            ]}
            onPress={handlePrevious}
            disabled={currentSection === 0}
            activeOpacity={0.7}
          >
            <FontAwesome5 
              name="chevron-left" 
              size={20} 
              color={currentSection === 0 ? Colors.onSurfaceVariant : Colors.onSurface} 
            />
          </TouchableOpacity>

          {/* Section Indicators */}
          <View style={styles.indicatorsContainer}>
            {sections.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicator,
                  index === currentSection && styles.indicatorActive
                ]}
                onPress={() => setCurrentSection(index)}
                activeOpacity={0.7}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.iconButton, styles.nextButton]}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <FontAwesome5 
              name={currentSection === sections.length - 1 ? 'check' : 'chevron-right'} 
              size={20} 
              color={Colors.onPrimary} 
            />
          </TouchableOpacity>
        </MotiView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface + '90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
    minWidth: 35,
    textAlign: 'right',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  sectionIconContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sectionIconGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface + '95',
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.outline + '40',
  },
  indicatorActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
});
