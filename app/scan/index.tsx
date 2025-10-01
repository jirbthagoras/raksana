import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScanResultModal } from '../../components/Modals/ScanResultModal';
import { useScanTrash } from '../../hooks/useApiQueries';
import { TrashScanResult } from '../../types/auth';
import { ErrorProvider, useError } from '../../contexts/ErrorContext';
import LoadingOverlay from '../../components/Screens/LoadingComponent';

function ScanContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<TrashScanResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const scanTrashMutation = useScanTrash();
  const { showPopUp } = useError();

  // Manage status bar when screen is focused/unfocused
  useFocusEffect(
    useCallback(() => {
      // Set status bar for this screen
      StatusBar.setBarStyle('dark-content', true);
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
      
      return () => {
        // Reset status bar when leaving this screen
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setTranslucent(true);
      };
    }, [])
  );

  const handleBack = () => {
    router.back();
  };

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        showPopUp(
          'Izin Diperlukan',
          'Aplikasi memerlukan izin kamera dan galeri untuk memindai sampah. Silakan berikan izin di pengaturan aplikasi.',
          'warning'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      showPopUp(
        'Error Izin',
        'Terjadi kesalahan saat meminta izin. Silakan coba lagi.',
        'error'
      );
      return false;
    }
  };

  const pickImageFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validate image size (max 10MB)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          showPopUp(
            'File Terlalu Besar',
            'Ukuran gambar tidak boleh lebih dari 10MB. Silakan pilih gambar yang lebih kecil.',
            'warning'
          );
          return;
        }
        
        setSelectedImage(asset.uri);
        showPopUp(
          'Foto Berhasil Diambil',
          'Foto berhasil diambil dari kamera. Tap "Scan Sampah" untuk memulai analisis.',
          'info'
        );
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      showPopUp(
        'Error Kamera',
        error.message || 'Gagal mengambil foto dari kamera. Pastikan kamera berfungsi dengan baik.',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validate image size (max 10MB)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          showPopUp(
            'File Terlalu Besar',
            'Ukuran gambar tidak boleh lebih dari 10MB. Silakan pilih gambar yang lebih kecil.',
            'warning'
          );
          return;
        }
        
        // Validate image format
        const validFormats = ['jpg', 'jpeg', 'png', 'webp'];
        const fileExtension = asset.uri.split('.').pop()?.toLowerCase();
        if (!fileExtension || !validFormats.includes(fileExtension)) {
          showPopUp(
            'Format Tidak Didukung',
            'Format gambar harus JPG, JPEG, PNG, atau WebP.',
            'warning'
          );
          return;
        }
        
        setSelectedImage(asset.uri);
        showPopUp(
          'Foto Berhasil Dipilih',
          'Foto berhasil dipilih dari galeri. Tap "Scan Sampah" untuk memulai analisis.',
          'info'
        );
      }
    } catch (error: any) {
      console.error('Gallery error:', error);
      showPopUp(
        'Error Galeri',
        error.message || 'Gagal mengambil foto dari galeri. Pastikan aplikasi memiliki akses ke galeri.',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanTrash = async () => {
    if (!selectedImage) {
      showPopUp(
        'Gambar Belum Dipilih',
        'Silakan pilih atau ambil foto terlebih dahulu sebelum memindai.',
        'warning'
      );
      return;
    }

    try {
      setIsProcessing(true);
      console.log('🔍 Starting trash scan for image:', selectedImage);
      
      const response = await scanTrashMutation.mutateAsync(selectedImage);
      
      if (!response || !response.data) {
        throw new Error('Response data tidak valid dari server');
      }
      
      console.log('✅ Scan successful:', response.data);
      setScanResult(response.data);
      setShowResultModal(true);
      setSelectedImage(null); // Reset selected image
      
      showPopUp(
        'Scan Berhasil!',
        `Berhasil mengidentifikasi ${response.data.items?.length || 0} ide daur ulang dari gambar Anda.`,
        'info'
      );
      
    } catch (error: any) {
      console.error('❌ Scan error:', error);
      
      let errorTitle = 'Scan Gagal';
      let errorMessage = 'Terjadi kesalahan saat memindai sampah';
      
      // Handle specific error types
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorTitle = 'Gambar Tidak Valid';
            errorMessage = data?.message || 'Format atau kualitas gambar tidak sesuai. Silakan coba dengan gambar yang lebih jelas.';
            break;
          case 413:
            errorTitle = 'File Terlalu Besar';
            errorMessage = 'Ukuran file gambar terlalu besar. Silakan kompres gambar atau pilih gambar yang lebih kecil.';
            break;
          case 429:
            errorTitle = 'Terlalu Banyak Permintaan';
            errorMessage = 'Anda telah melakukan terlalu banyak scan. Silakan tunggu beberapa saat sebelum mencoba lagi.';
            break;
          case 500:
            errorTitle = 'Server Error';
            errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.';
            break;
          case 503:
            errorTitle = 'Layanan Tidak Tersedia';
            errorMessage = 'Layanan scan sedang dalam pemeliharaan. Silakan coba lagi nanti.';
            break;
          default:
            errorMessage = data?.message || `Error ${status}: ${error.message}`;
        }
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network')) {
        errorTitle = 'Koneksi Bermasalah';
        errorMessage = 'Periksa koneksi internet Anda dan coba lagi.';
      } else if (error.message.includes('timeout')) {
        errorTitle = 'Timeout';
        errorMessage = 'Proses scan memakan waktu terlalu lama. Silakan coba dengan gambar yang lebih kecil.';
      }
      
      showPopUp(errorTitle, errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setScanResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
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
          <FontAwesome5 name="camera" size={18} color={Colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Scan Sampah</Text>
        </View>
        <View style={styles.headerSpacer} />
      </MotiView>

      <View style={styles.content}>
        {/* Image Preview Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 200, damping: 12, stiffness: 120 }}
          style={styles.imageSection}
        >
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <FontAwesome5 name="image" size={64} color={Colors.onSurfaceVariant} />
                <Text style={styles.placeholderText}>Pilih atau ambil foto sampah</Text>
                <Text style={styles.placeholderSubtext}>
                  Foto akan dianalisis untuk memberikan ide daur ulang
                </Text>
              </View>
            )}
            
            {selectedImage && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <FontAwesome5 name="times" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 400, damping: 12, stiffness: 120 }}
          style={styles.actionsContainer}
        >
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cameraButton]}
              onPress={pickImageFromCamera}
              disabled={scanTrashMutation.isPending || isProcessing}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.buttonGradient}
              >
                <FontAwesome5 name="camera" size={20} color="white" />
                <Text style={styles.buttonText}>Ambil Foto</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.galleryButton]}
              onPress={pickImageFromGallery}
              disabled={scanTrashMutation.isPending || isProcessing}
            >
              <View style={styles.buttonSolid}>
                <FontAwesome5 name="images" size={20} color={Colors.primary} />
                <Text style={[styles.buttonText, { color: Colors.primary }]}>Dari Galeri</Text>
              </View>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', delay: 100, damping: 12, stiffness: 120 }}
              style={styles.scanButtonContainer}
            >
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanTrash}
                disabled={scanTrashMutation.isPending || isProcessing}
              >
                <LinearGradient
                  colors={[Colors.secondary, Colors.tertiary]}
                  style={styles.scanButtonGradient}
                >
                  {(scanTrashMutation.isPending || isProcessing) ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <FontAwesome5 name="search" size={20} color="white" />
                  )}
                  <Text style={styles.scanButtonText}>
                    {(scanTrashMutation.isPending || isProcessing) ? 'Memindai...' : 'Scan Sampah'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}
        </MotiView>

        {/* Instructions */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', delay: 600, duration: 500 }}
          style={styles.instructionsContainer}
        >
          <Text style={styles.instructionsTitle}>Tips untuk hasil terbaik:</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <FontAwesome5 name="lightbulb" size={14} color={Colors.primary} />
              <Text style={styles.instructionText}>Pastikan pencahayaan cukup terang</Text>
            </View>
            <View style={styles.instructionItem}>
              <FontAwesome5 name="eye" size={14} color={Colors.primary} />
              <Text style={styles.instructionText}>Fokuskan kamera pada objek sampah</Text>
            </View>
            <View style={styles.instructionItem}>
              <FontAwesome5 name="hand-paper" size={14} color={Colors.primary} />
              <Text style={styles.instructionText}>Hindari foto yang buram atau gelap</Text>
            </View>
          </View>
        </MotiView>
      </View>

      {/* Scan Result Modal */}
      <ScanResultModal
        visible={showResultModal}
        onClose={handleCloseResultModal}
        scanResult={scanResult}
      />
      
      {/* Loading Overlay */}
      <LoadingOverlay visible={isProcessing} />
    </SafeAreaView>
  );
}

export default function ScanScreen() {
  return (
    <ErrorProvider>
      <ScanContent />
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
    gap: 8,
  },
  headerIcon: {
    marginRight: 4,
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageSection: {
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.outline + '20',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraButton: {
    // Gradient button styles handled by LinearGradient
  },
  galleryButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonSolid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
  },
  buttonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: 'white',
  },
  scanButtonContainer: {
    // Animation container
  },
  scanButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scanButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanButtonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: 'white',
  },
  instructionsContainer: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 16,
    padding: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.primary,
    flex: 1,
  },
});
