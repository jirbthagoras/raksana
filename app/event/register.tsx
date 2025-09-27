import { Colors, Fonts } from '@/constants';
import { useError } from '@/contexts/ErrorContext';
import { useEventRegistration } from '@/hooks/useApiQueries';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '@/components/Screens/LoadingComponent';
import { ErrorProvider } from '@/contexts/ErrorContext';

function EventRegistrationContent() {
  const params = useLocalSearchParams();
  const [contactNumber, setContactNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showPopUp } = useError();
  const eventRegistrationMutation = useEventRegistration();
  
  // Get event ID from route parameters and validate it
  const eventId = params.eventId ? Number(params.eventId) : null;
  
  // Debug log to check what we're receiving
  console.log('Event registration params:', params);
  console.log('Parsed eventId:', eventId);

  const handleBack = () => {
    router.back();
  };

  // Show error if no valid event ID is provided
  if (!eventId || isNaN(eventId)) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingOverlay visible={false} />
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Daftar Event</Text>
          </View>
          <View style={styles.headerSpacer} />
        </MotiView>
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Event ID Tidak Valid</Text>
          <Text style={styles.errorText}>
            Tidak dapat memuat halaman pendaftaran. Silakan kembali dan coba lagi.
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const validateContactNumber = (contact: string): boolean => {
    if (!contact.trim()) {
      showPopUp('Nomor kontak tidak boleh kosong', 'warning');
      return false;
    }

    if (contact.trim().length < 10) {
      showPopUp('Nomor kontak minimal 10 karakter', 'warning');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateContactNumber(contactNumber)) {
      return;
    }

    if (!eventId || isNaN(eventId)) {
      showPopUp('ID event tidak valid', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      await eventRegistrationMutation.mutateAsync({
        eventId,
        contactNumber: contactNumber.trim()
      });
      
      showPopUp('Berhasil mendaftar event!', 'info');
      
      // Navigate back after showing success message
      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      showPopUp(
        error?.message || 'Gagal mendaftar event. Silakan coba lagi.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Daftar Event</Text>
        </View>
        <View style={styles.headerSpacer} />
      </MotiView>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Form Container */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 200 }}
              style={styles.formContainer}
            >
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <FontAwesome5 name="user-plus" size={24} color={Colors.primary} />
                  <Text style={styles.formTitle}>Registrasi Event</Text>
                </View>
                
                <Text style={styles.formDescription}>
                  Masukkan nomor kontak Anda untuk mendaftar ke event ini. 
                  Kami akan menghubungi Anda jika diperlukan.
                </Text>

                {/* Contact Number Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nomor Kontak</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome5 
                      name="phone" 
                      size={16} 
                      color={Colors.onSurfaceVariant} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={contactNumber}
                      onChangeText={setContactNumber}
                      placeholder="Contoh: 081234567890"
                      placeholderTextColor={Colors.onSurfaceVariant}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={15}
                    />
                  </View>
                  <Text style={styles.inputHelper}>
                    Minimal 10 karakter, maksimal 15 karakter
                  </Text>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    (!contactNumber.trim() || contactNumber.trim().length < 10) && styles.registerButtonDisabled
                  ]}
                  onPress={handleRegister}
                  disabled={!contactNumber.trim() || contactNumber.trim().length < 10 || isLoading}
                  activeOpacity={0.8}
                >
                  <FontAwesome5 
                    name="check" 
                    size={16} 
                    color={Colors.onPrimary} 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.registerButtonText}>
                    {isLoading ? 'Mendaftar...' : 'Daftar Event'}
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>

            {/* Info Card */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 400 }}
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <FontAwesome5 name="info-circle" size={18} color={Colors.secondary} />
                <Text style={styles.infoTitle}>Informasi Penting</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>
                  • Pastikan nomor kontak yang Anda masukkan aktif dan dapat dihubungi
                </Text>
                <Text style={styles.infoText}>
                  • Kami akan mengirimkan konfirmasi melalui WhatsApp atau SMS
                </Text>
                <Text style={styles.infoText}>
                  • Pendaftaran akan diverifikasi dalam 1x24 jam
                </Text>
              </View>
            </MotiView>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function EventRegistrationScreen() {
  return (
    <ErrorProvider>
      <EventRegistrationContent />
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline + '20',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formContainer: {
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  formTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
  },
  formDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    padding: 0,
  },
  inputHelper: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.onSurfaceVariant,
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 4,
  },
  registerButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  infoCard: {
    backgroundColor: Colors.secondaryContainer + '40',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.secondary + '20',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  infoContent: {
    gap: 8,
  },
  infoText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  errorButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onPrimary,
  },
});
