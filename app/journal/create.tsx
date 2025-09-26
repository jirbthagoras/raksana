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
  View,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateLog } from '../../hooks/useApiQueries';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';
import LoadingOverlay from '@/components/Screens/LoadingComponent';

function CreateJournalScreenContent() {
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const createLogMutation = useCreateLog();
  const { showPopUp } = useError();

  // Dismiss keyboard when loading starts
  useEffect(() => {
    if (isSubmitting) {
      Keyboard.dismiss();
    }
  }, [isSubmitting]);

  // Show actions when user starts typing
  useEffect(() => {
    setShowActions(text.trim().length > 0);
  }, [text]);

  const handleSubmit = async () => {
    // Validation
    if (!text.trim()) {
      showPopUp('Entri Journal tidak boleh kosong', 'Input Diperlukan', 'warning');
      return;
    }

    if (text.trim().length < 10) {
      showPopUp('Entri Journal harus minimal 10 karakter', 'Input Diperlukan', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      await createLogMutation.mutateAsync({
        text: text.trim(),
        is_private: isPrivate
      });

      showPopUp(
        'Log berhasil ditambahkan!',
        'Berhasil!',
        'info'
      );
      
      // Navigate back after a short delay to let user see the success message
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      showPopUp(
        error.response?.data?.message || 'Gagal membuat entri Journal',
        'Error',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (text.trim()) {
      showPopUp(
        'Apakah Anda yakin ingin membuang entri ini?',
        'Buang Entri',
        'warning'
      );
    } else {
      router.back();
    }
  };

  const getCharacterCount = () => text.length;
  const getCharacterColor = () => {
    const count = getCharacterCount();
    if (count < 10) return Colors.error;
    if (count > 500) return Colors.error;
    return Colors.secondary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay 
        visible={isSubmitting}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleCancel}
          >
            <FontAwesome5 name="arrow-left" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Append Log</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Privacy Toggle */}
          <View style={styles.privacySection}>
            <View style={styles.privacyHeader}>
              <FontAwesome5 
                name={isPrivate ? "lock" : "globe"} 
                size={16} 
                color={isPrivate ? Colors.error : Colors.secondary} 
              />
              <Text style={styles.privacyLabel}>
                {isPrivate ? 'Private Entry' : 'Public Entry'}
              </Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ 
                false: Colors.outline + '40', 
                true: Colors.error + '40' 
              }}
              thumbColor={isPrivate ? Colors.error : Colors.secondary}
            />
          </View>

          <Text style={styles.privacyDescription}>
            {isPrivate 
              ? 'Hanya Anda yang dapat melihat entri ini' 
              : 'Entri ini akan terlihat oleh orang lain'
            }
          </Text>

          {/* Journal Text Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Entri Log Anda</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                placeholder="Apa yang ada di pikiran Anda hari ini? Bagikan pemikiran, pengalaman, atau refleksi Anda..."
                placeholderTextColor={Colors.onSurfaceVariant}
                multiline
                textAlignVertical="top"
                maxLength={1000}
                autoFocus
              />
            </View>
            
            {/* Character Counter */}
            <View style={styles.characterCounter}>
              <Text style={[styles.characterCount, { color: getCharacterColor() }]}>
                {getCharacterCount()}/1000 characters
              </Text>
              {getCharacterCount() < 10 && (
                <Text style={styles.characterHint}>
                  Minimal 10 karakter diperlukan
                </Text>
              )}
            </View>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Panduan Menulis</Text>
            <View style={styles.guidelineItem}>
              <FontAwesome5 name="lightbulb" size={12} color={Colors.tertiary} />
              <Text style={styles.guidelineText}>
                Jadilah autentik dan jujur dalam refleksi Anda
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <FontAwesome5 name="heart" size={12} color={Colors.tertiary} />
              <Text style={styles.guidelineText}>
                Sertakan emosi dan perasaan Anda
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <FontAwesome5 name="star" size={12} color={Colors.tertiary} />
              <Text style={styles.guidelineText}>
                Catat pelajaran yang dipetik atau wawasan yang didapat
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {showActions && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 300 }}
            style={styles.actionContainer}
          >
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={!text.trim() || isSubmitting}
            >
              <FontAwesome5 name="save" size={16} color="white" />
              <Text style={styles.submitButtonText}>
                Append Log
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function CreateJournalScreen() {
  return (
    <ErrorProvider>
      <CreateJournalScreenContent />
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
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
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  privacySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '20',
    marginBottom: 8,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  privacyDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 24,
    marginLeft: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 12,
  },
  textInputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    minHeight: 200,
    padding: 16,
  },
  textInput: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 24,
    flex: 1,
  },
  characterCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  characterCount: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
  },
  characterHint: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.error,
  },
  guidelines: {
    backgroundColor: Colors.tertiaryContainer,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  guidelinesTitle: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.tertiary,
    marginBottom: 4,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guidelineText: {
    fontFamily: Fonts.text.regular,
    fontSize: 13,
    color: Colors.onTertiaryContainer,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + '20',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: 'white',
  },
});
