import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ChallengesInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChallengesInfoModal: React.FC<ChallengesInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const challengeFeatures = [
    {
      title: 'Daily Challenge',
      icon: 'trophy',
      color: Colors.primary,
      description: 'Tantangan harian yang unik dan variatif untuk memberikan pengalaman berbeda setiap hari'
    },
    {
      title: 'AI Generated',
      icon: 'brain',
      color: '#FF9800',
      description: 'Konten challenge dibuat oleh AI generatif untuk memastikan keunikan dan variasi'
    },
    {
      title: 'Point Rewards',
      icon: 'coins',
      color: '#4CAF50',
      description: 'Dapatkan poin sebagai hadiah ketika berpartisipasi dalam daily challenge'
    },
    {
      title: 'Photo Upload',
      icon: 'camera',
      color: '#9C27B0',
      description: 'Berpartisipasi dengan mengupload foto sesuai konteks challenge ke Album'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Challenge Generation',
      description: 'Setiap tengah malam, sistem akan menghasilkan challenge baru menggunakan AI generatif',
      icon: 'clock'
    },
    {
      step: '2',
      title: 'Unique Content',
      description: 'AI membuat konten challenge yang berbeda-beda dan unik setiap harinya',
      icon: 'magic'
    },
    {
      step: '3',
      title: 'Photo Participation',
      description: 'Pengguna berpartisipasi dengan mengupload foto sesuai konteks challenge ke Album',
      icon: 'upload'
    },
    {
      step: '4',
      title: 'AI Point Calculation',
      description: 'AI menentukan jumlah poin yang diberikan berdasarkan partisipasi pengguna',
      icon: 'calculator'
    },
    {
      step: '5',
      title: 'Notification',
      description: 'Pengguna mendapat notifikasi ketika daily challenge di-refresh dengan yang baru',
      icon: 'bell'
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
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <FontAwesome5 name="trophy" size={32} color={Colors.onPrimary} />
            </View>
            <Text style={styles.title}>Tentang Challenges</Text>
            <Text style={styles.subtitle}>
              Fitur Daily Challenge memberikan tantangan unik setiap hari untuk pengguna dengan hadiah berupa poin
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Features Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="star" size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Fitur Challenge</Text>
              </View>
              
              {challengeFeatures.map((feature, index) => (
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

            {/* How It Works Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="cogs" size={16} color={Colors.secondary} />
                <Text style={styles.sectionTitle}>Cara Kerja</Text>
              </View>
              
              {howItWorks.map((step, index) => (
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
                  {index < howItWorks.length - 1 && <View style={styles.stepConnector} />}
                </View>
              ))}
            </View>

            {/* Benefits Section */}
            <View style={styles.benefitsSection}>
              <View style={styles.benefitsHeader}>
                <FontAwesome5 name="heart" size={18} color={Colors.onPrimary} />
                <Text style={styles.benefitsTitle}>Manfaat Challenge</Text>
              </View>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Mendapat tantangan unik dan variatif setiap hari</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Mengasah kreativitas melalui foto challenge</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Mendapat poin sebagai reward partisipasi</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Notifikasi otomatis untuk challenge terbaru</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Konten AI yang selalu fresh dan menarik</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Mengerti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    width: width - 40,
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onBackground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
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
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
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
  benefitsSection: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
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
  closeModalButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 24,
  },
  closeModalButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
});
