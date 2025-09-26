import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Colors, Fonts } from '../constants';

const { width } = Dimensions.get('window');

interface HistoryInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HistoryInfoModal: React.FC<HistoryInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const pointFeatures = [
    {
      title: 'Sistem Poin Triloka',
      icon: 'coins',
      color: Colors.primary,
      description: 'Poin dapat dikumpulkan melalui berbagai aktivitas eco-friendly dan akan berguna di fase Convert & Contribute'
    },
    {
      title: 'LintangFest Integration',
      icon: 'calendar-star',
      color: Colors.secondary,
      description: 'Poin akan memiliki kegunaan khusus selama event LintangFest berlangsung'
    },
    {
      title: 'Riwayat Lengkap',
      icon: 'history',
      color: Colors.tertiary,
      description: 'Semua transaksi poin tercatat dalam history untuk transparansi dan tracking'
    }
  ];

  const howToEarn = [
    {
      step: '1',
      title: 'Challenge Harian',
      description: 'Selesaikan tantangan eco-friendly yang tersedia setiap hari',
      icon: 'trophy'
    },
    {
      step: '2', 
      title: 'Task Lingkungan',
      description: 'Lakukan berbagai task yang mendukung kelestarian lingkungan',
      icon: 'tasks'
    },
    {
      step: '3',
      title: 'Memory Sharing',
      description: 'Bagikan momen eco-centric melalui foto dan video',
      icon: 'camera'
    },
    {
      step: '4',
      title: 'Aktivitas Komunitas',
      description: 'Berpartisipasi dalam event dan aktivitas komunitas Triloka',
      icon: 'users'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.container}
        >
          <LinearGradient
            colors={[Colors.surface, Colors.background]}
            style={styles.gradient}
          >
            {/* Header */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 200 }}
              style={styles.header}
            >
              <View style={styles.headerIcon}>
                <FontAwesome5 name="history" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Tentang Riwayat Poin</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome5 name="times" size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </MotiView>

            {/* Content */}
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Features Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="star" size={16} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Fitur Poin</Text>
                </View>
                
                {pointFeatures.map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                      <FontAwesome5 name={feature.icon} size={16} color={Colors.onPrimary} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* How to Earn Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="coins" size={16} color={Colors.secondary} />
                  <Text style={styles.sectionTitle}>Cara Mendapatkan Poin</Text>
                </View>
                
                {howToEarn.map((step, index) => (
                  <View key={index} style={styles.stepCard}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{step.step}</Text>
                      </View>
                      <View style={styles.stepIconContainer}>
                        <FontAwesome5 name={step.icon} size={14} color={Colors.secondary} />
                      </View>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                    </View>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                    {index < howToEarn.length - 1 && <View style={styles.stepConnector} />}
                  </View>
                ))}
              </View>

              {/* Benefits Section */}
              <View style={styles.benefitsSection}>
                <View style={styles.benefitsHeader}>
                  <FontAwesome5 name="seedling" size={18} color={Colors.onPrimary} />
                  <Text style={styles.benefitsTitle}>Fase Triloka</Text>
                </View>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                    <Text style={styles.benefitText}>Poin berguna di fase Convert & Contribute</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                    <Text style={styles.benefitText}>Kegunaan khusus saat LintangFest</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                    <Text style={styles.benefitText}>Transparansi melalui history lengkap</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                    <Text style={styles.benefitText}>Kontribusi nyata untuk lingkungan</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    elevation: 8,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    flex: 1,
    maxHeight: '85%',
  },
  gradient: {
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  sectionContent: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  additionalInfo: {
    padding: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onPrimaryContainer,
    marginBottom: 4,
  },
  tipText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onPrimaryContainer,
    lineHeight: 18,
    opacity: 0.9,
  },
  // Feature styles
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  // Step styles
  stepCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    position: 'relative',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onPrimary,
  },
  stepIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  stepDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginLeft: 36,
  },
  stepConnector: {
    position: 'absolute',
    left: 28,
    bottom: -6,
    width: 2,
    height: 12,
    backgroundColor: Colors.secondary + '40',
  },
  // Benefits styles
  benefitsSection: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  benefitsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onPrimary,
    flex: 1,
    lineHeight: 18,
  },
});
