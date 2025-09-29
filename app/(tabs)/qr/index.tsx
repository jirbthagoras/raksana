import { Colors, Fonts } from '@/constants';
import { useQRScan } from '@/hooks/useApiQueries';
import { QRScanResultPopup } from '@/components/Popups/QRScanResultPopup';
import { QRScanErrorPopup } from '@/components/Popups/QRScanErrorPopup';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function QRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [scanResult, setScanResult] = useState<{ type: 'treasures' | 'quest' | 'event'; data: any } | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [scanError, setScanError] = useState<any>(null);
  const scanLineAnim = useRef(new Animated.Value(-100)).current;
  const qrScanMutation = useQRScan();

  // Handle screen focus to manage camera properly
  useFocusEffect(
    useCallback(() => {
      // Start scanning when screen is focused
      setIsScanning(true);
      
      return () => {
        // Stop scanning when screen loses focus
        setIsScanning(false);
      };
    }, [])
  );

  useEffect(() => {
    if (isScanning) {
      // Animate scanning line
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isScanning, scanLineAnim]);

  const handleQRScanSuccess = (response: any) => {
    const { data } = response;
    
    // Set scan result and show popup
    setScanResult({ type: data.type, data });
    setShowResultPopup(true);
  };

  const handleQRScanError = (error: any) => {
    setScanError(error);
    setShowErrorPopup(true);
  };

  const handlePopupClose = () => {
    setShowResultPopup(false);
    setScanResult(null);
  };

  const handleScanAgain = () => {
    setShowResultPopup(false);
    setScanResult(null);
    setScannedData(null);
    setIsScanning(true);
  };

  const handleErrorPopupClose = () => {
    setShowErrorPopup(false);
    setScanError(null);
  };

  const handleErrorScanAgain = () => {
    setShowErrorPopup(false);
    setScanError(null);
    setScannedData(null);
    setIsScanning(true);
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    setScannedData(data);
    
    // Check if the scanned data is a JWT token
    if (data && typeof data === 'string' && data.includes('.')) {
      // Looks like a JWT token, send to API
      qrScanMutation.mutate(data, {
        onSuccess: handleQRScanSuccess,
        onError: handleQRScanError,
      });
    } else {
      // Not a JWT token, show generic message
      Alert.alert(
        'QR Code Dipindai',
        `Data: ${data}`,
        [
          {
            text: 'Scan Lagi',
            onPress: () => {
              setIsScanning(true);
              setScannedData(null);
            },
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    }
  };


  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="camera-outline" size={64} color={Colors.primary} />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>QR Scanner</Text>
          <Text style={styles.headerSubtitle}>Camera Permission Required</Text>
        </LinearGradient>

        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color={Colors.primary} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes. Please grant camera permission to continue.
          </Text>
          
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.buttonGradient}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}>Grant Permission</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        
        {/* Overlay with scanning guidelines - positioned absolutely on top */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.overlayTop}>
            <Text style={styles.instructionText}>
              Posisikan QR di dalam Frame
            </Text>
          </View>
          
          {/* Middle section with scanning frame */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlayLeft} />
            
            {/* Scanning frame */}
            <View style={styles.scanFrame}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scanning line */}
              {isScanning && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanLineAnim }],
                    },
                  ]}
                />
              )}
            </View>
            
            <View style={styles.overlayRight} />
          </View>
          
          {/* Bottom overlay with status */}
          <View style={styles.overlayBottom}>
            <View style={styles.statusContainer}>
              {qrScanMutation.isPending ? (
                <View style={styles.statusItem}>
                  <Ionicons name="hourglass" size={24} color="white" />
                  <Text style={styles.statusText}>Memproses QR...</Text>
                </View>
              ) : !isScanning && scannedData ? (
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={() => {
                    setIsScanning(true);
                    setScannedData(null);
                  }}
                >
                  <Ionicons name="refresh" size={24} color="white" />
                  <Text style={styles.statusText}>Scan Lagi</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.statusItem}>
                  <Ionicons name="scan" size={24} color="white" />
                  <Text style={styles.statusText}>Siap untuk scan QR</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* QR Scan Result Popup */}
      {scanResult && (
        <QRScanResultPopup
          visible={showResultPopup}
          onClose={handlePopupClose}
          onScanAgain={handleScanAgain}
          type={scanResult.type}
          data={scanResult.data}
        />
      )}

      {/* QR Scan Error Popup */}
      <QRScanErrorPopup
        visible={showErrorPopup}
        onClose={handleErrorPopupClose}
        onScanAgain={handleErrorScanAgain}
        error={scanError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: Fonts.text.regular,
    color: Colors.onSurfaceVariant,
  },
  // Permission screen
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.display.bold,
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.text.regular,
    color: 'white',
    opacity: 0.9,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: Fonts.display.bold,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: Fonts.text.regular,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.text.bold,
    color: 'white',
  },
  // Camera screen
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: Fonts.text.bold,
    color: 'white',
    textAlign: 'center',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: width * 0.8,
  },
  overlayLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 20,
    right: 20,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: Colors.primary,
    opacity: 0.9,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusItem: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  scanAgainButton: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    fontSize: 14,
    fontFamily: Fonts.text.bold,
    color: 'white',
    textAlign: 'center',
  },
});
