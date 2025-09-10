import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AnimatedLogo from '../components/AnimatedLogo';
import FloatingElements from '../components/FloatingElements';
import GradientBackground from '../components/GradientBackground';
import TypewriterText from '../components/TypewriterText';
import { Colors, Fonts } from '../constants';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [showTypewriter, setShowTypewriter] = useState(false);

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
                size={180} 
                style={styles.logoContainer}
              />
              
              <View style={styles.subtitleContainer}>
                {showTypewriter ? (
                  <TypewriterText 
                    text="Craft your Eco Centric Lifestyle"
                    speed={80}
                    style={styles.typewriterText}
                  />
                ) : (
                  <TouchableOpacity 
                    onPress={() => setShowTypewriter(true)}
                    style={styles.subtitleTouchable}
                  >
                    <Text style={styles.subtitlePlaceholder}>
                      Tap untuk melihat misi kami ✨
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
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
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: width * 0.9,
    gap: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 8,
  },
  logoContainer: {
    marginVertical: 20,
  },
  subtitleContainer: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  subtitleTouchable: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  subtitlePlaceholder: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  typewriterText: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.tertiary,
    textAlign: 'center',
    lineHeight: 26,
  },
  appTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 72,
    color: Colors.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 106, 100, 0.3)',
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
    shadowColor: Colors.black,
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
    color: Colors.text.primary,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
    color: Colors.white,
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
    shadowColor: Colors.black,
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
