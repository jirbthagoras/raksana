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
import { Colors, Fonts } from '../constants';

const { width } = Dimensions.get('window');

interface JournalInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const JournalInfoModal: React.FC<JournalInfoModalProps> = ({
  visible,
  onClose,
}) => {
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
              <FontAwesome5 name="journal-whills" size={32} color={Colors.onPrimary} />
            </View>
            <Text style={styles.title}>Tentang Journal</Text>
            <Text style={styles.subtitle}>
              Refleksikan hari Anda dan catat perkembangan dengan sistem journaling Raksana
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* What is Journal */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.primary }]}>
                  <FontAwesome5 name="book-open" size={20} color={Colors.onPrimary} />
                </View>
                <View style={styles.infoTitleContainer}>
                  <Text style={styles.infoTitle}>Apa itu Journal?</Text>
                </View>
              </View>

              <Text style={styles.infoDescription}>
                Journal adalah cara bagi pengguna untuk merefleksikan hari mereka. 
                Setiap harinya Anda dapat mencatat perkembangan, pengalaman, dan 
                pembelajaran yang didapat.
              </Text>
            </View>

            {/* Auto Logging */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.secondary }]}>
                  <FontAwesome5 name="magic" size={20} color={Colors.onPrimary} />
                </View>
                <View style={styles.infoTitleContainer}>
                  <Text style={styles.infoTitle}>Logging Otomatis</Text>
                </View>
              </View>

              <Text style={styles.infoDescription}>
                Sistem akan secara otomatis membuat log ketika Anda melakukan aktivitas 
                seperti menghadiri event, berkontribusi pada quest, dan berpartisipasi 
                dalam challenge.
              </Text>
            </View>

            {/* Recap Integration */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.tertiary }]}>
                  <FontAwesome5 name="chart-line" size={20} color={Colors.onPrimary} />
                </View>
                <View style={styles.infoTitleContainer}>
                  <Text style={styles.infoTitle}>Integrasi Recap</Text>
                </View>
              </View>

              <Text style={styles.infoDescription}>
                Journaling berperan besar pada fitur Recap karena menjadi acuan 
                bagi kecerdasan buatan untuk membuat rekap bulanan yang personal 
                dan bermakna.
              </Text>
            </View>

            {/* Log Unit */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.error }]}>
                  <FontAwesome5 name="file-alt" size={20} color={Colors.onPrimary} />
                </View>
                <View style={styles.infoTitleContainer}>
                  <Text style={styles.infoTitle}>Unit Log</Text>
                </View>
              </View>

              <Text style={styles.infoDescription}>
                Unit terkecil dari journal disebut "log". Setiap log dapat berupa 
                catatan pribadi (private) atau dapat dibagikan kepada komunitas (public).
              </Text>
            </View>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <View style={styles.tipsHeader}>
                <FontAwesome5 name="lightbulb" size={18} color={Colors.onPrimary} />
                <Text style={styles.tipsTitle}>Tips Journaling</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Tulis secara konsisten setiap hari</Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Refleksikan pembelajaran dan pengalaman</Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Gunakan private log untuk catatan personal</Text>
                </View>
                <View style={styles.tipItem}>
                  <FontAwesome5 name="check-circle" size={14} color={Colors.onPrimary} />
                  <Text style={styles.tipText}>Bagikan inspirasi melalui public log</Text>
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
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTitleContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  infoDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
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
