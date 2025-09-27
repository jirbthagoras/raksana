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

interface EventsInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EventsInfoModal: React.FC<EventsInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const eventFeatures = [
    {
      title: 'Aktivitas Bersama',
      icon: 'users',
      color: Colors.primary,
      description: 'Event dilakukan secara bersamaan dengan pengguna lainnya untuk menciptakan pengalaman kolektif'
    },
    {
      title: 'Kerjasama Pihak Ketiga',
      icon: 'handshake',
      color: Colors.secondary,
      description: 'Bekerja sama dengan berbagai organisasi untuk menyediakan event yang beragam dan berkualitas'
    },
    {
      title: 'Fleksibilitas Digital',
      icon: 'mobile-alt',
      color: '#FF9800',
      description: 'Memanfaatkan teknologi digital untuk memberikan fleksibilitas dalam partisipasi event'
    },
    {
      title: 'Verifikasi QR Code',
      icon: 'qrcode',
      color: '#9C27B0',
      description: 'Sistem verifikasi kehadiran menggunakan QR code untuk memastikan partisipasi yang valid'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Jelajahi Event',
      description: 'Temukan berbagai event menarik yang tersedia melalui halaman Event di aplikasi',
      icon: 'search'
    },
    {
      step: '2',
      title: 'Daftar Event',
      description: 'Pilih event yang diminati dan lakukan proses registrasi sesuai dengan persyaratan yang ditentukan',
      icon: 'user-plus'
    },
    {
      step: '3',
      title: 'Ikuti Registrasi',
      description: 'Lengkapi semua tahapan registrasi yang diperlukan hingga proses pendaftaran selesai',
      icon: 'clipboard-check'
    },
    {
      step: '4',
      title: 'Hadiri Event',
      description: 'Datang dan ikuti event sesuai dengan jadwal dan lokasi yang telah ditentukan',
      icon: 'calendar-check'
    },
    {
      step: '5',
      title: 'Scan QR Code',
      description: 'Setelah event berakhir, scan QR code dari penyelenggara untuk konfirmasi kehadiran dan dapatkan poin',
      icon: 'qrcode'
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
              <FontAwesome5 name="calendar-alt" size={32} color={Colors.onPrimary} />
            </View>
            <Text style={styles.title}>Tentang Events</Text>
            <Text style={styles.subtitle}>
              Event adalah salah satu aktivitas kolektif yang memenuhi trinitas Activity di Raksana
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

            {/* Features Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="star" size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Tentang Event</Text>
              </View>
              
              {eventFeatures.map((feature, index) => (
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
                <Text style={styles.benefitsTitle}>Manfaat Events</Text>
              </View>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Berpartisipasi dalam aktivitas bersama pengguna lain</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Mengakses berbagai event dari mitra terpercaya</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Fleksibilitas dalam memilih event sesuai minat</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Mendapatkan poin reward setelah menyelesaikan event</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.benefitText}>Sistem verifikasi yang mudah dengan QR code</Text>
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
  introSection: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  introTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  introText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onPrimary,
    lineHeight: 20,
    textAlign: 'justify',
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
