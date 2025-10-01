import LoadingOverlay from '@/components/Screens/LoadingComponent';
import { Colors, Fonts } from '@/constants';
import { useError } from '@/contexts/ErrorContext';
import { useCreatePacket } from '@/hooks/useApiQueries';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
     ActivityIndicator,
     Dimensions,
     KeyboardAvoidingView,
     Platform,
     ScrollView,
     StyleSheet,
     Text,
     TextInput,
     TouchableOpacity,
     View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorProvider } from '../contexts/ErrorContext';

// Import Info Section Components
import ActivitiesSection from '@/components/Info/ActivitiesSection';
import GamificationSection from '@/components/Info/GamificationSection';
import RecyclopediaSection from '@/components/Info/RecyclopediaSection';
import TrilokaSection from '@/components/Info/TrilokaSection';

const { width } = Dimensions.get('window');

interface InfoSection {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType;
}

const infoSections: InfoSection[] = [
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

interface OnboardingContentProps {}

function OnboardingContent({}: OnboardingContentProps) {
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'welcome' | 'info' | 'create'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [currentInfoSection, setCurrentInfoSection] = useState(0);

  const { showPopUp } = useError();
  const createPacketMutation = useCreatePacket();

  const handleNext = () => {
    setStep('info');
  };

  const handleInfoNext = () => {
    if (currentInfoSection < infoSections.length - 1) {
      setCurrentInfoSection(currentInfoSection + 1);
    } else {
      setStep('create');
    }
  };

  const handleInfoPrevious = () => {
    if (currentInfoSection > 0) {
      setCurrentInfoSection(currentInfoSection - 1);
    } else {
      setStep('welcome');
    }
  };

  const handleCreatePacket = async () => {
    // Validation
    if (target.trim().length < 10 || target.trim().length > 200) {
      showPopUp('Target harus antara 10-200 karakter', 'warning');
      return;
    }

    if (description.trim().length < 20 || description.trim().length > 500) {
      showPopUp('Deskripsi harus antara 20-500 karakter', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      await createPacketMutation.mutateAsync({
        target: target.trim(),
        description: description.trim(),
      });

      showPopUp('Paket berhasil dibuat! Selamat datang di Raksana!', 'info');
      
      // Navigate to packet screen after success
      setTimeout(() => {
        router.replace('/(tabs)/packet');
      }, 1500);
    } catch (error: any) {
      showPopUp(error.message || 'Gagal membuat paket', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderWelcomeStep = () => (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.welcomeContainer}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 800, delay: 200 }}
            style={styles.iconContainer}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.iconGradient}
            >
              <FontAwesome5 name="leaf" size={48} color={Colors.onPrimary} />
            </LinearGradient>
          </MotiView>
          
          <Text style={styles.welcomeTitle}>Selamat Datang di Raksana!</Text>
          <Text style={styles.welcomeSubtitle}>
            Mari mulai perjalanan ramah lingkungan Anda dengan membuat paket pertama
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 400 }}
            style={styles.featureItem}
          >
            <View style={styles.featureIcon}>
              <FontAwesome5 name="tasks" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Buat Target</Text>
              <Text style={styles.featureDescription}>Tentukan tujuan ramah lingkungan Anda</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 500 }}
            style={styles.featureItem}
          >
            <View style={styles.featureIcon}>
              <FontAwesome5 name="trophy" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Raih Pencapaian</Text>
              <Text style={styles.featureDescription}>Selesaikan tugas dan dapatkan poin</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 600 }}
            style={styles.featureItem}
          >
            <View style={styles.featureIcon}>
              <FontAwesome5 name="users" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Bergabung dengan Komunitas</Text>
              <Text style={styles.featureDescription}>Ikuti event dan challenge bersama</Text>
            </View>
          </MotiView>
        </View>

        {/* Next Button */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 700 }}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Mulai Sekarang</Text>
              <FontAwesome5 name="arrow-right" size={16} color={Colors.onPrimary} />
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
    </ScrollView>
  );

  const renderInfoStep = () => {
    const currentSection = infoSections[currentInfoSection];
    const CurrentComponent = currentSection.component;
    const progress = ((currentInfoSection + 1) / infoSections.length) * 100;

    return (
      <ScrollView 
        contentContainerStyle={styles.infoScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.infoContainer}
        >
          {/* Header */}
          <View style={styles.infoHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleInfoPrevious}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="chevron-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <View style={styles.infoHeaderCenter}>
              <Text style={styles.infoTitle}>Tentang Raksana</Text>
              <Text style={styles.infoSubtitle}>
                {currentInfoSection + 1} dari {infoSections.length}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => setStep('create')}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
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
          </View>

          {/* Section Title */}
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIconContainer}>
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.sectionIconGradient}
              >
                <FontAwesome5 
                  name={currentSection.icon} 
                  size={24} 
                  color={Colors.onPrimary} 
                />
              </LinearGradient>
            </View>
            <Text style={styles.sectionTitle}>
              {currentSection.title}
            </Text>
          </View>

          {/* Content */}
          <MotiView
            key={`content-${currentInfoSection}`}
            from={{ opacity: 0, translateX: 30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.infoContentContainer}
          >
            <CurrentComponent />
          </MotiView>

          {/* Navigation */}
          <View style={styles.infoNavigationContainer}>
            <TouchableOpacity
              style={[
                styles.infoNavButton,
                styles.infoPrevButton,
                currentInfoSection === 0 && styles.infoNavButtonDisabled
              ]}
              onPress={handleInfoPrevious}
              disabled={currentInfoSection === 0}
              activeOpacity={0.7}
            >
              <FontAwesome5 
                name="chevron-left" 
                size={20} 
                color={currentInfoSection === 0 ? Colors.onSurfaceVariant : Colors.onSurface} 
              />
            </TouchableOpacity>

            {/* Section Indicators */}
            <View style={styles.indicatorsContainer}>
              {infoSections.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentInfoSection && styles.indicatorActive
                  ]}
                  onPress={() => setCurrentInfoSection(index)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.infoNavButton, styles.infoNextButton]}
              onPress={handleInfoNext}
              activeOpacity={0.7}
            >
              <FontAwesome5 
                name={currentInfoSection === infoSections.length - 1 ? 'check' : 'chevron-right'} 
                size={20} 
                color={Colors.onPrimary} 
              />
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    );
  };

  const renderCreateStep = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateX: 30 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.createContainer}
        >
          {/* Header */}
          <View style={styles.createHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep('welcome')}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.createTitle}>Buat Paket Pertama</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Target Input */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 200 }}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Target</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Mengurangi penggunaan plastik sekali pakai"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={target}
                onChangeText={setTarget}
                multiline
                maxLength={200}
              />
              <Text style={styles.characterCount}>
                {target.length}/200 karakter (min. 10)
              </Text>
            </MotiView>

            {/* Description Input */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 300 }}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Deskripsi</Text>
              <TextInput
                style={[styles.textInput, styles.descriptionInput]}
                placeholder="Ceritakan tentang diri anda, seperti profesi anda lingkungan sehari-hari anda."
                placeholderTextColor={Colors.onSurfaceVariant}
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {description.length}/500 karakter (min. 20)
              </Text>
            </MotiView>

            {/* Create Button */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 400 }}
              style={styles.buttonContainer}
            >
              <TouchableOpacity
                style={[
                  styles.createButton,
                  (target.trim().length < 10 || description.trim().length < 20) && styles.createButtonDisabled
                ]}
                onPress={handleCreatePacket}
                disabled={target.trim().length < 10 || description.trim().length < 20 || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    (target.trim().length < 10 || description.trim().length < 20)
                      ? [Colors.onSurfaceVariant, Colors.onSurfaceVariant]
                      : [Colors.primary, Colors.secondary]
                  }
                  style={styles.createButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary} />
                  ) : (
                    <>
                      <FontAwesome5 name="plus" size={16} color={Colors.onPrimary} />
                      <Text style={styles.createButtonText}>Buat Paket</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      {step === 'welcome' && renderWelcomeStep()}
      {step === 'info' && renderInfoStep()}
      {step === 'create' && renderCreateStep()}
    </SafeAreaView>
  );
}

export default function OnboardingScreen() {
  return (
    <ErrorProvider>
      <OnboardingContent />
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  infoScrollContainer: {
    flexGrow: 1,
  },
  
  // Welcome Step Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  
  // Features Styles
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  
  // Create Step Styles
  createContainer: {
    flex: 1,
  },
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createTitle: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  
  // Form Styles
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    minHeight: 56,
    textAlignVertical: 'top',
  },
  descriptionInput: {
    minHeight: 120,
  },
  characterCount: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'right',
    marginTop: 4,
  },
  
  // Button Styles
  buttonContainer: {
    marginTop: 20,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  nextButtonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  createButtonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  
  // Info Step Styles
  infoContainer: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  infoHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  infoTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  infoSubtitle: {
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
  infoContentContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  infoNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface + '95',
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  infoNavButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPrevButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
  },
  infoNextButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  infoNavButtonDisabled: {
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