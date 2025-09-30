import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScanResultModal } from '../../components/Modals/ScanResultModal';
import { useScanTrash } from '../../hooks/useApiQueries';
import { TrashScanResult } from '../../types/auth';

export default function ScanScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<TrashScanResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const scanTrashMutation = useScanTrash();

  const handleBack = () => {
    router.back();
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin kamera dan galeri untuk memindai sampah.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto dari kamera');
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto dari galeri');
    }
  };

  const handleScanTrash = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Pilih gambar terlebih dahulu');
      return;
    }

    try {
      const response = await scanTrashMutation.mutateAsync(selectedImage);
      setScanResult(response.data);
      setShowResultModal(true);
      setSelectedImage(null); // Reset selected image
    } catch (error: any) {
      Alert.alert(
        'Scan Gagal',
        error.message || 'Terjadi kesalahan saat memindai sampah'
      );
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setScanResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
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
              disabled={scanTrashMutation.isPending}
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
              disabled={scanTrashMutation.isPending}
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
                disabled={scanTrashMutation.isPending}
              >
                <LinearGradient
                  colors={[Colors.secondary, Colors.tertiary]}
                  style={styles.scanButtonGradient}
                >
                  {scanTrashMutation.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <FontAwesome5 name="search" size={20} color="white" />
                  )}
                  <Text style={styles.scanButtonText}>
                    {scanTrashMutation.isPending ? 'Memindai...' : 'Scan Sampah'}
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
    </SafeAreaView>
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
