import React from 'react';
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
import { Colors, Fonts } from '../constants';

const { width, height } = Dimensions.get('window');

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.appTitle}>Raksana</Text>
            <Text style={styles.subtitle}>
              Craft your Eco Centric Lifestyle
            </Text>
            <AnimatedLogo size={200} style={styles.logoContainer} />
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: width * 0.9,
    gap: 10,
  },
  logoContainer: {
    marginVertical: 100,
  },
  welcomeText: {
    fontFamily: Fonts.text.regular,
    fontSize: 18,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  appTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 48,
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: width * 0.8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.secondary,
    minWidth: width * 0.8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.secondary,
  },
});
