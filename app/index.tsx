import AnimatedLogo from '@/components/Screens/AnimatedLogo';
import FloatingElements from '@/components/Screens/FloatingElements';
import GradientBackground from '@/components/Screens/GradientBackground';
import { Colors, Fonts } from '@/constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [showTypewriter, setShowTypewriter] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Auto-trigger typewriter effect after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(true);
      // Start fade and slide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500); // Delay to let the logo animation settle

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <FloatingElements count={8} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.appTitle}>Raksana</Text>
                <View style={styles.titleUnderline} />
              </View>
              
              <AnimatedLogo 
                size={160} 
                style={styles.logoContainer}
              />
              
              {/* Additional tagline that appears after typewriter */}
              <Animated.View 
                style={[
                  styles.taglineContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }
                ]}
              >
                <Text style={styles.taglineText}>
                  Bangun Gaya Hidup Eco Centric Mu!
                </Text>
              </Animated.View>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              accessibilityRole="button"
              accessibilityLabel="Login to your account"
              onPress={() => router.push('/login')}
            >
              <Text style={styles.primaryButtonText}>Masuk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Register a new account"
              onPress={() => router.push('/register')}
            >
              <Text style={styles.secondaryButtonText}>Daftar</Text>
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: width * 0.9,
    gap: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    marginVertical: 15,
  },
  subtitleContainer: {
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  placeholderContainer: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitlePlaceholder: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    opacity: 0.8,
  },
  typewriterText: {
    fontFamily: Fonts.display.bold,
    fontSize: 22,
    color: Colors.tertiary,
    textAlign: 'center',
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  taglineContainer: {
    marginTop: 15,
    paddingHorizontal: 30,
    opacity: 0.9,
  },
  taglineText: {
    fontFamily: Fonts.text.italic,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  appTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 72,
    color: Colors.primary,
    textAlign: 'center',
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuresPreview: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  featureText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onBackground,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 70,
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
    minWidth: width * 0.8,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.secondary,
    minWidth: width * 0.8,
    alignItems: 'center',
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.secondary,
  },
});
