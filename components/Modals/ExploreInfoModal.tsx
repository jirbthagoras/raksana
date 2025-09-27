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

interface ExploreInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExploreInfoModal: React.FC<ExploreInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const yardComponents = [
    {
      title: 'Album',
      icon: 'images',
      color: Colors.primary,
      description: 'Kumpulan memory berupa postingan gambar dan teks yang menyimpan kenangan dan pengalaman Anda'
    },
    {
      title: 'Journal',
      icon: 'book-open',
      color: Colors.secondary,
      description: 'Kumpulan log berupa teks reflektif yang bersifat time-driven untuk mencatat proses perjalanan Anda'
    },
    {
      title: 'Memory',
      icon: 'camera',
      color: '#FF9800',
      description: 'Postingan individual dalam Album yang berisi gambar dan teks sebagai kenangan pengalaman'
    },
    {
      title: 'Log',
      icon: 'edit',
      color: '#9C27B0',
      description: 'Catatan individual dalam Journal yang berisi teks reflektif tentang perjalanan waktu'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Ekspresikan Diri',
      description: 'Pengguna dapat secara bebas mengekspresikan diri atau berbagi pengalaman dan pikiran melalui Yard',
      icon: 'user-circle'
    },
    {
      step: '2',
      title: 'Buat Album',
      description: 'Buat Album yang berisi memory (postingan gambar + teks) untuk menyimpan kenangan event-driven',
      icon: 'images'
    },
    {
      step: '3',
      title: 'Tulis Journal',
      description: 'Tulis Journal yang berisi log (teks reflektif) untuk mencatat proses time-driven',
      icon: 'book-open'
    },
    {
      step: '4',
      title: 'Tampil di Yard',
      description: 'Album dan Journal akan terpampang dengan jelas di Yard pengguna untuk dilihat pengunjung',
      icon: 'eye'
    },
    {
      step: '5',
      title: 'Jelajahi Yard Lain',
      description: 'Kunjungi dan jelajahi Yard pengguna lain untuk melihat Album dan Journal mereka',
      icon: 'compass'
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
              <FontAwesome5 name="compass" size={32} color={Colors.onPrimary} />
            </View>
            <Text style={styles.title}>Tentang Yard</Text>
            <Text style={styles.subtitle}>
              One-way Narrative Platform untuk mengekspresikan diri dan berbagi pengalaman
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Components Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="puzzle-piece" size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Komponen Yard</Text>
              </View>
              
              {yardComponents.map((component, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: component.color }]}>
                    <FontAwesome5 name={component.icon} size={16} color={Colors.onPrimary} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{component.title}</Text>
                    <Text style={styles.featureDescription}>{component.description}</Text>
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

            {/* Key Differences Section */}
            <View style={styles.differencesSection}>
              <View style={styles.differencesHeader}>
                <FontAwesome5 name="balance-scale" size={18} color={Colors.onPrimary} />
                <Text style={styles.differencesTitle}>Perbedaan Album & Journal</Text>
              </View>
              <View style={styles.differencesList}>
                <View style={styles.differenceItem}>
                  <View style={styles.differenceIcon}>
                    <FontAwesome5 name="images" size={12} color={Colors.primary} />
                  </View>
                  <View style={styles.differenceContent}>
                    <Text style={styles.differenceLabel}>Album (Event-driven)</Text>
                    <Text style={styles.differenceText}>Hasil dari pengalaman dan kenangan</Text>
                  </View>
                </View>
                <View style={styles.differenceItem}>
                  <View style={styles.differenceIcon}>
                    <FontAwesome5 name="book-open" size={12} color={Colors.secondary} />
                  </View>
                  <View style={styles.differenceContent}>
                    <Text style={styles.differenceLabel}>Journal (Time-driven)</Text>
                    <Text style={styles.differenceText}>Proses reflektif perjalanan waktu</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

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
  differencesSection: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  differencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  differencesTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  differencesList: {
    gap: 16,
    marginBottom: 16,
  },
  differenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  differenceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.onPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  differenceContent: {
    flex: 1,
  },
  differenceLabel: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.onPrimary,
    marginBottom: 2,
  },
  differenceText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onPrimary,
    lineHeight: 18,
  },
  analogyContainer: {
    backgroundColor: Colors.onPrimary + '15',
    borderRadius: 12,
    padding: 12,
  },
  analogyText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onPrimary,
    textAlign: 'center',
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
