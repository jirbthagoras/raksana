import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
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
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useCreateMemory } from '../../hooks/useApiQueries';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';
import LoadingOverlay from '../../components/LoadingComponent';

function CreateMemoryScreenContent() {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const createMemoryMutation = useCreateMemory();
  const { showPopUp } = useError();

  // Dismiss keyboard when loading starts
  useEffect(() => {
    if (isSubmitting) {
      Keyboard.dismiss();
    }
  }, [isSubmitting]);

  const getContentType = (uri: string) => {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'mp4':
        return 'videos/mp4';
      default:
        return 'image/jpeg';
    }
  };

  const getFileName = (uri: string) => {
    const parts = uri.split('/');
    return parts[parts.length - 1] || 'memory';
  };

  const uploadFileToPresignedUrl = async (presignedUrl: string, fileUri: string) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': getContentType(fileUri),
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSelectMedia = () => {
    Alert.alert(
      'Pilih Media',
      'Pilih jenis media yang ingin Anda upload',
      [
        {
          text: 'Foto dari Kamera',
          onPress: () => openCamera(),
        },
        {
          text: 'Foto dari Galeri',
          onPress: () => openImagePicker(),
        },
        {
          text: 'Video',
          onPress: () => openVideoPicker(),
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showPopUp('Izin kamera diperlukan untuk mengambil foto', 'Permission Required', 'warning');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedFile(result.assets[0]);
    }
  };

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showPopUp('Izin galeri diperlukan untuk memilih foto', 'Permission Required', 'warning');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedFile(result.assets[0]);
    }
  };

  const openVideoPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        // Ensure we have the right properties for video files
        setSelectedFile({
          ...file,
          uri: file.uri,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType || 'video/mp4'
        });
      }
    } catch (error) {
      showPopUp('Gagal memilih video', 'Error', 'error');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!description.trim()) {
      showPopUp('Deskripsi tidak boleh kosong', 'Input Required', 'warning');
      return;
    }

    if (description.trim().length < 10) {
      showPopUp('Deskripsi minimal 10 karakter', 'Input Required', 'warning');
      return;
    }

    if (!selectedFile) {
      showPopUp('Pilih foto atau video terlebih dahulu', 'Media Required', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Get presigned URL
      const contentType = getContentType(selectedFile.uri);
      const filename = getFileName(selectedFile.uri);

      const presignedResponse = await createMemoryMutation.mutateAsync({
        content_type: contentType,
        filename: filename,
        description: description.trim()
      });

      // Step 2: Upload file to S3
      await uploadFileToPresignedUrl(presignedResponse.data.presigned_url, selectedFile.uri);

      showPopUp(
        'Memory berhasil dibuat dan akan segera muncul di album Anda.',
        'Berhasil!',
        'info'
      );
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      showPopUp(
        error?.message || 'Terjadi kesalahan saat membuat memory. Silakan coba lagi.',
        'Gagal Membuat Memory',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (description.trim() || selectedFile) {
      Alert.alert(
        'Batalkan Pembuatan Memory?',
        'Data yang sudah diisi akan hilang. Apakah Anda yakin ingin membatalkan?',
        [
          { text: 'Tidak', style: 'cancel' },
          { text: 'Ya', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const descriptionCharCount = description.length;
  const isFormValid = description.trim().length >= 10 && selectedFile;

  // Show actions when form becomes valid
  useEffect(() => {
    if (isFormValid && !showActions) {
      const timer = setTimeout(() => {
        setShowActions(true);
      }, 300);
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
          <Text style={styles.headerTitle}>Buat Memory Baru</Text>
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
              <FontAwesome5 name="camera" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.introTitle}>Bagikan Momen Eco Centric</Text>
            <Text style={styles.introSubtitle}>
              Abadikan pengalaman gaya hidup Eco Centric Anda dan bagikan dengan komunitas
            </Text>
          </View>

          {/* Media Selection */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Foto atau Video</Text>
            <Text style={styles.fieldDescription}>
              Pilih foto atau video yang menggambarkan aktivitas Eco Centric Anda
            </Text>
            
            {selectedFile ? (
              <View style={styles.mediaPreview}>
                {selectedFile.type?.startsWith('image') || selectedFile.uri.includes('.jpg') || selectedFile.uri.includes('.png') ? (
                  <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.videoPreview}>
                    <FontAwesome5 name="play-circle" size={48} color={Colors.primary} />
                    <Text style={styles.videoText}>Video dipilih</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.changeMediaButton}
                  onPress={handleSelectMedia}
                >
                  <FontAwesome5 name="edit" size={16} color={Colors.primary} />
                  <Text style={styles.changeMediaText}>Ganti Media</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.mediaSelector} onPress={handleSelectMedia}>
                <FontAwesome5 name="plus" size={32} color={Colors.onSurfaceVariant} />
                <Text style={styles.mediaSelectorText}>Pilih Foto atau Video</Text>
                <Text style={styles.mediaSelectorSubtext}>JPG, PNG, atau MP4</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Field */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Deskripsi</Text>
            <Text style={styles.fieldDescription}>
              Ceritakan tentang aktivitas Eco Centric yang Anda lakukan
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Hari ini saya menanam pohon mangga di halaman belakang rumah. Semoga bisa tumbuh besar dan memberikan manfaat untuk lingkungan..."
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
                  descriptionCharCount >= 10 ? styles.charCountValid : styles.charCountInvalid
                ]}>
                  {descriptionCharCount}/500 {descriptionCharCount >= 10 ? '✓' : '(min. 10)'}
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

export default function CreateMemoryScreen() {
  return (
    <ErrorProvider>
      <CreateMemoryScreenContent />
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
  mediaSelector: {
    height: 200,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.outline + '30',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mediaSelectorText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  mediaSelectorSubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  mediaPreview: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  videoPreview: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    gap: 8,
  },
  videoText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  changeMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.primaryContainer,
    gap: 8,
  },
  changeMediaText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
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
  floatingButton: {
    position: 'absolute',
    bottom: 30,
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
