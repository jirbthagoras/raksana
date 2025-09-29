import { Colors, Fonts } from '@/constants';
import { useConvertPoints, useRegions } from '@/hooks/useApiQueries';
import { useError } from '@/contexts/ErrorContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Region {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface PointConversionModalProps {
  visible: boolean;
  onClose: () => void;
  currentBalance: number;
}

export const PointConversionModal: React.FC<PointConversionModalProps> = ({
  visible,
  onClose,
  currentBalance,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [treeAmount, setTreeAmount] = useState('1');
  const [step, setStep] = useState<'rate' | 'region' | 'confirm'>('rate');

  const { showApiError, showPopUp } = useError();
  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const convertPointsMutation = useConvertPoints();

  // Debug regions data
  React.useEffect(() => {
    console.log('🎯 PointConversionModal - regionsData:', regionsData);
    console.log('🎯 PointConversionModal - regionsLoading:', regionsLoading);
    console.log('🎯 PointConversionModal - regions array:', regionsData?.data?.regions);
  }, [regionsData, regionsLoading]);

  const regions: Region[] = regionsData?.data?.regions || [];
  const POINTS_PER_TREE = 500;
  const totalPoints = parseInt(treeAmount) * POINTS_PER_TREE;
  const canAfford = totalPoints <= currentBalance;

  const handleClose = () => {
    setStep('rate');
    setSelectedRegion(null);
    setTreeAmount('1');
    onClose();
  };

  const handleContinueToRegion = () => {
    const amount = parseInt(treeAmount);
    if (amount < 1) {
      showPopUp('Jumlah pohon minimal 1', 'Input Tidak Valid', 'warning');
      return;
    }
    if (totalPoints > currentBalance) {
      showPopUp('Poin tidak mencukupi untuk konversi ini', 'Poin Tidak Cukup', 'warning');
      return;
    }
    setStep('region');
  };

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setStep('confirm');
  };

  const handleConfirmConversion = async () => {
    if (!selectedRegion) return;

    try {
      await convertPointsMutation.mutateAsync({
        amount: parseInt(treeAmount),
        region_id: selectedRegion.id,
      });

      showPopUp(
        `Berhasil mengkonversi ${treeAmount} pohon di ${selectedRegion.name}!`,
        'Konversi Berhasil',
        'info'
      );

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      console.error('❌ Failed to convert points:', error);
      if (error?.status) {
        showApiError(error);
      } else {
        showPopUp(
          'Gagal mengkonversi poin. Silakan coba lagi.',
          'Konversi Gagal',
          'error'
        );
      }
    }
  };

  const renderRegion = ({ item, index }: { item: Region; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 }}
    >
      <TouchableOpacity
        style={styles.regionCard}
        onPress={() => handleRegionSelect(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[Colors.surfaceContainerLow, Colors.surfaceContainer]}
          style={styles.regionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.regionHeader}>
            <FontAwesome5 name="map-marker-alt" size={16} color={Colors.primary} />
            <Text style={styles.regionName}>{item.name}</Text>
          </View>
          <Text style={styles.regionLocation}>{item.location}</Text>
          <View style={styles.regionFooter}>
            <Text style={styles.regionCoords}>
              {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
            </Text>
            <FontAwesome5 name="arrow-right" size={14} color={Colors.primary} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );

  const renderRateStep = () => (
    <View style={styles.stepContainer}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 500 }}
        style={styles.rateCard}
      >
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.primaryContainer + 'E0']}
          style={styles.rateGradient}
        >
          <FontAwesome5 name="seedling" size={48} color={Colors.primary} />
          <Text style={styles.rateTitle}>Konversi Poin ke Pohon</Text>
          <Text style={styles.rateDescription}>
            Tukar poin Anda menjadi pohon yang akan ditanam di lokasi pilihan Anda
          </Text>
          
          <View style={styles.rateInfo}>
            <Text style={styles.rateLabel}>Rate Konversi:</Text>
            <Text style={styles.rateValue}>500 GP = 1 Pohon</Text>
          </View>
        </LinearGradient>
      </MotiView>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Jumlah Pohon</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={treeAmount}
            onChangeText={setTreeAmount}
            keyboardType="numeric"
            placeholder="1"
            placeholderTextColor={Colors.onSurfaceVariant}
          />
          <Text style={styles.inputUnit}>pohon</Text>
        </View>
        
        <View style={styles.calculationRow}>
          <Text style={styles.calculationLabel}>Total Poin Dibutuhkan:</Text>
          <Text style={[
            styles.calculationValue,
            { color: canAfford ? Colors.primary : Colors.error }
          ]}>
            {totalPoints.toLocaleString('id-ID')} GP
          </Text>
        </View>
        
        <View style={styles.calculationRow}>
          <Text style={styles.calculationLabel}>Saldo Saat Ini:</Text>
          <Text style={styles.calculationValue}>
            {currentBalance.toLocaleString('id-ID')} GP
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !canAfford && styles.continueButtonDisabled]}
        onPress={handleContinueToRegion}
        disabled={!canAfford}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={canAfford ? [Colors.secondary, Colors.tertiary] : [Colors.surfaceVariant, Colors.surfaceVariant]}
          style={styles.continueButtonGradient}
        >
          <Text style={[
            styles.continueButtonText,
            { color: canAfford ? Colors.onSecondary : Colors.onSurfaceVariant }
          ]}>
            Lanjutkan
          </Text>
          <FontAwesome5 
            name="arrow-right" 
            size={16} 
            color={canAfford ? Colors.onSecondary : Colors.onSurfaceVariant} 
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderRegionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pilih Lokasi Penanaman</Text>
      <Text style={styles.stepDescription}>
        Pilih wilayah dimana pohon akan ditanam
      </Text>

      {regionsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat lokasi...</Text>
        </View>
      ) : (
        <FlatList
          data={regions}
          renderItem={renderRegion}
          keyExtractor={(item) => item.id.toString()}
          style={styles.regionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="map" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>Tidak ada lokasi tersedia</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => setStep('rate')}>
        <FontAwesome5 name="arrow-left" size={16} color={Colors.primary} />
        <Text style={styles.backButtonText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConfirmStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Konfirmasi Konversi</Text>
      
      <View style={styles.confirmCard}>
        <LinearGradient
          colors={[Colors.tertiaryContainer, Colors.tertiaryContainer + 'E0']}
          style={styles.confirmGradient}
        >
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Jumlah Pohon:</Text>
            <Text style={styles.confirmValue}>{treeAmount} pohon</Text>
          </View>
          
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Total Poin:</Text>
            <Text style={styles.confirmValue}>{totalPoints.toLocaleString('id-ID')} GP</Text>
          </View>
          
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Lokasi:</Text>
            <Text style={styles.confirmValue}>{selectedRegion?.name}</Text>
          </View>
          
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Alamat:</Text>
            <Text style={styles.confirmValueSmall}>{selectedRegion?.location}</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.confirmButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setStep('region')}
        >
          <FontAwesome5 name="arrow-left" size={16} color={Colors.primary} />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmConvertButton}
          onPress={handleConfirmConversion}
          disabled={convertPointsMutation.isPending}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.secondary, Colors.tertiary]}
            style={styles.confirmConvertGradient}
          >
            {convertPointsMutation.isPending ? (
              <ActivityIndicator size="small" color={Colors.onSecondary} />
            ) : (
              <>
                <FontAwesome5 name="check" size={16} color={Colors.onSecondary} />
                <Text style={styles.confirmConvertText}>Konfirmasi</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome5 name="times" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Konversi Poin</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { 
                width: step === 'rate' ? '33%' : step === 'region' ? '66%' : '100%' 
              }
            ]} />
          </View>
          <Text style={styles.progressText}>
            {step === 'rate' ? 'Langkah 1 dari 3' : 
             step === 'region' ? 'Langkah 2 dari 3' : 'Langkah 3 dari 3'}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {step === 'rate' && renderRateStep()}
          {step === 'region' && renderRegionStep()}
          {step === 'confirm' && renderConfirmStep()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  stepDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginBottom: 24,
    lineHeight: 24,
  },
  rateCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  rateGradient: {
    padding: 24,
    alignItems: 'center',
  },
  rateTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  rateDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onPrimaryContainer,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  rateInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rateLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  rateValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.primary,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
  },
  inputUnit: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginLeft: 8,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calculationLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  calculationValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  continueButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
  },
  regionsList: {
    flex: 1,
    marginBottom: 20,
  },
  regionCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  regionGradient: {
    padding: 16,
  },
  regionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionName: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSurface,
    marginLeft: 8,
    flex: 1,
  },
  regionLocation: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  regionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionCoords: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 8,
    gap: 8,
  },
  backButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  confirmCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  confirmGradient: {
    padding: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  confirmLabel: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onTertiaryContainer,
    flex: 1,
  },
  confirmValue: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onTertiaryContainer,
    textAlign: 'right',
    flex: 1,
  },
  confirmValueSmall: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onTertiaryContainer,
    textAlign: 'right',
    flex: 1,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  confirmConvertButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmConvertGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  confirmConvertText: {
    fontFamily: Fonts.text.bold,
    fontSize: 16,
    color: Colors.onSecondary,
  },
});
