import LoadingOverlay from '@/components/Screens/LoadingComponent';
import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorProvider, useError } from '../../../contexts/ErrorContext';
import { useCreatePacket } from '../../../hooks/useApiQueries';

function CreatePacketScreenContent() {
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const createPacketMutation = useCreatePacket();
  const { showPopUp } = useError();

  // Dismiss keyboard when loading starts
  useEffect(() => {
    if (isSubmitting) {
      Keyboard.dismiss();
    }
  }, [isSubmitting]);

  const handleSubmit = async () => {
    // Validation
    if (!target.trim()) {
      showPopUp('Target tidak boleh kosong', 'Input Required', 'warning');
      return;
    }

    if (!description.trim()) {
      showPopUp('Deskripsi tidak boleh kosong', 'Input Required', 'warning');
      return;
    }

    if (target.trim().length < 10) {
      showPopUp('Target minimal 10 karakter', 'Input Required', 'warning');
      return;
    }

    if (description.trim().length < 20) {
      showPopUp('Deskripsi minimal 20 karakter', 'Input Required', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      await createPacketMutation.mutateAsync({
        target: target.trim(),
        description: description.trim()
      });

      showPopUp(
        'Paket berhasil dibuat. Kamu akan mendapatkan tugas harian untuk mencapai target ini.',
        'Berhasil!',
        'info'
      );
      
      // Navigate back after a short delay to let user see the success message
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      showPopUp(
        error?.message || 'Terjadi kesalahan saat membuat paket. Silakan coba lagi.',
        'Gagal Membuat Paket',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (target.trim() || description.trim()) {
      showPopUp(
        'Data yang sudah diisi akan hilang. Apakah kamu yakin ingin membatalkan?',
        'Batalkan Pembuatan Paket?',
        'warning'
      );
      // Note: For now using showPopUp for notification. 
      // In a full implementation, you might want a confirmation dialog component
      // that can handle "Yes/No" actions, but showPopUp provides good user feedback
    } else {
      router.back();
    }
  };

  const targetCharCount = target.length;
  const descriptionCharCount = description.length;
  const isFormValid = target.trim().length >= 10 && description.trim().length >= 20;

  // Show actions when form becomes valid
  useEffect(() => {
    if (isFormValid && !showActions) {
      const timer = setTimeout(() => {
        setShowActions(true);
      }, 300); // Small delay for better UX
      return () => clearTimeout(timer);
    } else if (!isFormValid && showActions) {
      setShowActions(false);
    }
  }, [isFormValid, showActions]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Paket Baru</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Introduction */}
          <View style={styles.introSection}>
            <View style={styles.introIcon}>
              <FontAwesome5 name="bullseye" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.introTitle}>Tentukan Target Kebiasaanmu</Text>
            <Text style={styles.introSubtitle}>
              Buat paket challenge yang akan membantumu membangun kebiasaan baru atau mencapai tujuan tertentu
            </Text>
          </View>

          {/* Target Field */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Target Kebiasaan</Text>
            <Text style={styles.fieldDescription}>
              Jelaskan kebiasaan atau tujuan yang ingin kamu capai
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: menghidupkan kembali kebiasaan eco centric"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={target}
                onChangeText={setTarget}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              <View style={styles.charCounter}>
                <Text style={[
                  styles.charCountText,
                  targetCharCount >= 10 ? styles.charCountValid : styles.charCountInvalid
                ]}>
                  {targetCharCount}/200 {targetCharCount >= 10 ? '✓' : '(min. 10)'}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Field */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Deskripsi Detail</Text>
            <Text style={styles.fieldDescription}>
              Ceritakan lebih detail tentang dirimu, situasimu, dan jenis tantangan yang kamu inginkan
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.textInputLarge]}
                placeholder="Contoh: saya adalah seorang siswa yang memiliki kebun di belakang rumah, saya menginginkan tantangan yang sulit dan tidak mudah dilakukan. Saya juga ingin habit yang variatif!"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <View style={styles.charCounter}>
                <Text style={[
                  styles.charCountText,
                  descriptionCharCount >= 20 ? styles.charCountValid : styles.charCountInvalid
                ]}>
                  {descriptionCharCount}/500 {descriptionCharCount >= 20 ? '✓' : '(min. 20)'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.spacer} />

        </ScrollView>

        {/* Floating Action Button */}
        <MotiView 
          style={styles.floatingButton}
          animate={{
            opacity: showActions ? 1 : 0,
            scale: showActions ? 1 : 0,
            rotate: showActions ? '0deg' : '180deg',
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
          }}
        >
          <TouchableOpacity 
            style={[
              styles.fabButton,
              isSubmitting && styles.fabButtonLoading
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="arrow-right" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </MotiView>
      </KeyboardAvoidingView>
      
      <LoadingOverlay visible={isSubmitting} />
    </SafeAreaView>
  );
}

export default function CreatePacketScreen() {
  return (
    <ErrorProvider>
      <CreatePacketScreenContent />
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: 100,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
    backgroundColor: Colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  introSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.primaryContainer + '20',
    marginBottom: 24,
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  introSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  fieldSection: {
    paddingHorizontal: 20,
    marginBottom: 30
  },
  fieldLabel: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  fieldDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
    lineHeight: 18,
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    overflow: 'hidden',
  },
  textInput: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    padding: 16,
    minHeight: 80,
    maxHeight: 120,
  },
  textInputLarge: {
    minHeight: 120,
    maxHeight: 180,
  },
  charCounter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceVariant + '50',
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  charCountText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    textAlign: 'right',
  },
  charCountValid: {
    color: Colors.primary,
  },
  charCountInvalid: {
    color: Colors.onSurfaceVariant,
  },
  tipsSection: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.secondaryContainer + '20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '20',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: Colors.secondary,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 18,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80, // 75px tab bar height + 20px spacing
    right: 20,
    zIndex: 1000,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fabButtonLoading: {
    opacity: 0.8,
  },
});
