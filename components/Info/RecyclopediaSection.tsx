import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RecyclopediaStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const steps: RecyclopediaStep[] = [
  {
    id: 'scan',
    title: 'Tangkap Gambar',
    description: 'Ambil foto limbah dalam bentuk apapun menggunakan kamera aplikasi',
    icon: 'camera',
    color: Colors.primary,
  },
  {
    id: 'analyze',
    title: 'Analisis AI',
    description: 'Aplikasi menganalisis dan memberikan ide-ide untuk mengelola limbah, terutama karya seni',
    icon: 'brain',
    color: Colors.secondary,
  },
  {
    id: 'ideas',
    title: 'Dapatkan Ide',
    description: 'Terima gambaran bagaimana limbah bisa diubah menjadi karya seni yang bermanfaat',
    icon: 'lightbulb',
    color: Colors.tertiary,
  },
  {
    id: 'greenprint',
    title: 'Buat Greenprint',
    description: 'Buat skema atau rancangan pembuatan yang menjadi acuan untuk karya seni',
    icon: 'drafting-compass',
    color: '#FF6B35',
  },
];

export default function RecyclopediaSection() {
  const [selectedStep, setSelectedStep] = useState<string>('scan');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const selectedStepData = steps.find(step => step.id === selectedStep) || steps[0];

  const handleStepSelect = (stepId: string) => {
    setSelectedStep(stepId);
    const index = steps.findIndex(step => step.id === stepId);
    setCurrentStepIndex(index);
  };

  const handleNext = () => {
    const nextIndex = (currentStepIndex + 1) % steps.length;
    setCurrentStepIndex(nextIndex);
    setSelectedStep(steps[nextIndex].id);
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex === 0 ? steps.length - 1 : currentStepIndex - 1;
    setCurrentStepIndex(prevIndex);
    setSelectedStep(steps[prevIndex].id);
  };

  const renderStepIndicator = (step: RecyclopediaStep, index: number) => {
    const isSelected = selectedStep === step.id;
    const isCompleted = index < currentStepIndex;

    return (
      <MotiView
        key={step.id}
        from={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: isSelected ? 1.2 : 1 
        }}
        transition={{ 
          type: 'spring', 
          delay: 200 + (index * 100),
          damping: 15,
          stiffness: 150
        }}
        style={styles.stepIndicatorContainer}
      >
        <TouchableOpacity
          onPress={() => handleStepSelect(step.id)}
          activeOpacity={0.8}
          style={styles.stepIndicatorButton}
        >
          <LinearGradient
            colors={isSelected || isCompleted ? [step.color, step.color + '80'] : [Colors.surface, Colors.surfaceContainerHigh]}
            style={[
              styles.stepIndicator,
              isSelected && styles.stepIndicatorSelected
            ]}
          >
            <FontAwesome5 
              name={isCompleted && !isSelected ? 'check' : step.icon} 
              size={isSelected ? 20 : 16} 
              color={isSelected || isCompleted ? Colors.onPrimary : step.color} 
            />
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={[
          styles.stepNumber,
          { color: isSelected ? step.color : Colors.onSurfaceVariant }
        ]}>
          {index + 1}
        </Text>
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
        <Text style={styles.introTitle}>Recyclopedia</Text>
        <Text style={styles.introDescription}>
          Waste Scanner yang mengubah limbah menjadi karya seni dengan bantuan AI
        </Text>
      </MotiView>

      {/* Step Indicators */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 800, delay: 200 }}
        style={styles.stepsContainer}
      >
        <View style={styles.stepsIndicators}>
          {steps.map((step, index) => renderStepIndicator(step, index))}
        </View>
        
        {/* Connection Lines */}
        <View style={styles.connectionLines}>
          {steps.slice(0, -1).map((_, index) => (
            <MotiView
              key={index}
              from={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: 'timing', duration: 500, delay: 400 + (index * 100) }}
              style={[
                styles.connectionLine,
                { backgroundColor: index < currentStepIndex ? Colors.primary : Colors.outline + '40' }
              ]}
            />
          ))}
        </View>
      </MotiView>

      {/* Selected Step Details */}
      <MotiView
        key={`details-${selectedStep}`}
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.detailsContainer}
      >
        <LinearGradient
          colors={[selectedStepData.color + '10', selectedStepData.color + '05']}
          style={styles.detailsCard}
        >
          <View style={styles.detailsHeader}>
            <View style={[styles.detailsIcon, { backgroundColor: selectedStepData.color + '20' }]}>
              <FontAwesome5 
                name={selectedStepData.icon} 
                size={28} 
                color={selectedStepData.color} 
              />
            </View>
            <View style={styles.detailsHeaderText}>
              <Text style={styles.stepLabel}>Langkah {currentStepIndex + 1}</Text>
              <Text style={[styles.detailsTitle, { color: selectedStepData.color }]}>
                {selectedStepData.title}
              </Text>
            </View>
          </View>
          
          <Text style={styles.detailsDescription}>
            {selectedStepData.description}
          </Text>
        </LinearGradient>
      </MotiView>

      {/* Navigation */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 600 }}
        style={styles.navigationContainer}
      >
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePrevious}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="chevron-left" size={16} color={Colors.primary} />
          <Text style={styles.navButtonText}>Sebelumnya</Text>
        </TouchableOpacity>

        <View style={styles.progressDots}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStepIndex && styles.progressDotActive
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Selanjutnya</Text>
          <FontAwesome5 name="chevron-right" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </MotiView>

      {/* Features */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 800 }}
        style={styles.featuresContainer}
      >
        <Text style={styles.featuresTitle}>Fitur Recyclopedia</Text>
        
        <View style={styles.featuresList}>
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 900 }}
            style={styles.featureItem}
          >
            <View style={[styles.featureIcon, { backgroundColor: Colors.primary + '15' }]}>
              <FontAwesome5 name="history" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.featureText}>
              Riwayat Waste Scanning tersimpan di Recyclopedia Screen
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 1000 }}
            style={styles.featureItem}
          >
            <View style={[styles.featureIcon, { backgroundColor: Colors.secondary + '15' }]}>
              <FontAwesome5 name="palette" size={16} color={Colors.secondary} />
            </View>
            <Text style={styles.featureText}>
              Fokus pada ide karya seni dari limbah
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 1100 }}
            style={styles.featureItem}
          >
            <View style={[styles.featureIcon, { backgroundColor: Colors.tertiary + '15' }]}>
              <FontAwesome5 name="file-alt" size={16} color={Colors.tertiary} />
            </View>
            <Text style={styles.featureText}>
              Greenprint sebagai panduan pembuatan
            </Text>
          </MotiView>
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
  stepsContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  stepsIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  connectionLines: {
    position: 'absolute',
    top: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: -1,
  },
  connectionLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 10,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    gap: 8,
  },
  stepIndicatorButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  stepIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepIndicatorSelected: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stepNumber: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
  },
  detailsContainer: {
    marginBottom: 24,
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
  stepLabel: {
    fontFamily: Fonts.display.medium,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  detailsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
  },
  detailsDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.outline + '40',
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  featuresContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  featuresTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 18,
  },
});
