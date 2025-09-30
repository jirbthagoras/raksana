import { Colors, Fonts } from '@/constants';
import { ErrorProvider, useError } from '@/contexts/ErrorContext';
import { useGreenprint } from '@/hooks/useApiQueries';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Tool {
  name: string;
  description: string;
  price: number;
}

interface Material {
  name: string;
  description: string;
  price: number;
  Quantity: number;
}

interface Step {
  description: string;
}

interface GreenprintData {
  Title: string;
  description: string;
  sustainability_score: string;
  estimated_time: string;
  tools: Tool[];
  materials: Material[];
  steps: Step[];
}

function GreenprintContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = parseInt(id || '0');
  const { showApiError, showPopUp } = useError();
  
  const { 
    data: greenprintResponse, 
    isLoading, 
    error, 
    refetch 
  } = useGreenprint(itemId);

  const greenprintData: GreenprintData | null = greenprintResponse?.data || null;

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error: any) {
      console.error('❌ Failed to refresh greenprint:', error);
      if (error?.status) {
        showApiError(error);
      } else {
        showPopUp(
          'Gagal memuat ulang data greenprint. Periksa koneksi internet Anda.',
          'Gagal Memuat Ulang',
          'warning'
        );
      }
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const renderTool = ({ item, index }: { item: Tool; index: number }) => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 400, delay: index * 100 }}
      style={styles.horizontalCard}
    >
      <LinearGradient
        colors={[Colors.primary + '15', Colors.primary + '05']}
        style={styles.horizontalCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.horizontalCardIcon}>
          <FontAwesome5 name="tools" size={18} color={Colors.primary} />
        </View>
        <Text style={styles.horizontalCardTitle} numberOfLines={2}>{item.name}</Text>
        <View style={styles.horizontalCardPrice}>
          <Text style={styles.horizontalCardPriceText}>{formatPrice(item.price)}</Text>
        </View>
      </LinearGradient>
    </MotiView>
  );

  const renderMaterial = ({ item, index }: { item: Material; index: number }) => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 400, delay: index * 100 }}
      style={styles.horizontalCard}
    >
      <LinearGradient
        colors={[Colors.secondary + '15', Colors.secondary + '05']}
        style={styles.horizontalCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.horizontalCardIcon}>
          <FontAwesome5 name="cube" size={18} color={Colors.secondary} />
        </View>
        <Text style={styles.horizontalCardTitle} numberOfLines={2}>{item.name}</Text>
        <View style={styles.horizontalCardQuantity}>
          <Text style={styles.horizontalCardQuantityText}>x{item.Quantity}</Text>
        </View>
        <View style={styles.horizontalCardPrice}>
          <Text style={styles.horizontalCardPriceText}>{formatPrice(item.price)}</Text>
        </View>
      </LinearGradient>
    </MotiView>
  );

  const renderStep = ({ item, index }: { item: Step; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 }}
      style={styles.stepCard}
    >
      <LinearGradient
        colors={[Colors.tertiary + '15', Colors.tertiary + '05']}
        style={styles.stepGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
        </View>
        <Text style={styles.stepDescription}>{item.description}</Text>
      </LinearGradient>
    </MotiView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="leaf" size={18} color={Colors.secondary} />
            <Text style={styles.headerTitle}>Greenprint</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading greenprint...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !greenprintData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="leaf" size={18} color={Colors.secondary} />
            <Text style={styles.headerTitle}>Greenprint</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Gagal Memuat Greenprint</Text>
          <Text style={styles.errorSubtitle}>
            {error?.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <FontAwesome5 name="leaf" size={18} color={Colors.secondary} />
          <Text style={styles.headerTitle}>Greenprint</Text>
        </View>
        <View style={{ width: 32 }} />
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Description */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.titleSection}
        >
          <Text style={styles.title}>{greenprintData.Title}</Text>
          <Text style={styles.description}>{greenprintData.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <FontAwesome5 name="leaf" size={14} color={Colors.secondary} />
              <Text style={styles.metaText}>Score: {greenprintData.sustainability_score}/5</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome5 name="clock" size={14} color={Colors.tertiary} />
              <Text style={styles.metaText}>{greenprintData.estimated_time}</Text>
            </View>
          </View>
        </MotiView>

        {/* Tools Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="tools" size={16} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Alat yang Dibutuhkan</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{greenprintData.tools.length}</Text>
            </View>
          </View>
          
          <FlatList
            data={greenprintData.tools}
            renderItem={renderTool}
            keyExtractor={(item, index) => `tool-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={140}
            decelerationRate="fast"
          />
        </MotiView>

        {/* Materials Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 600 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="cube" size={16} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Bahan yang Dibutuhkan</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{greenprintData.materials.length}</Text>
            </View>
          </View>
          
          <FlatList
            data={greenprintData.materials}
            renderItem={renderMaterial}
            keyExtractor={(item, index) => `material-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            snapToInterval={140}
            decelerationRate="fast"
          />
        </MotiView>

        {/* Steps Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 800 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="list-ol" size={16} color={Colors.tertiary} />
            <Text style={styles.sectionTitle}>Langkah-langkah</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{greenprintData.steps.length}</Text>
            </View>
          </View>
          
          <FlatList
            data={greenprintData.steps}
            renderItem={renderStep}
            keyExtractor={(item, index) => `step-${index}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.verticalList}
          />
        </MotiView>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  headerTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.secondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: 'white',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 24,
    color: Colors.onSurface,
    marginBottom: 12,
    lineHeight: 30,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 24,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  section: {
    paddingHorizontal: 0,
    marginBottom: 32,
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.onSurface,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  horizontalList: {
    paddingHorizontal: 20,
    paddingRight: 40,
    paddingVertical: 8,
  },
  horizontalCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  horizontalCardGradient: {
    padding: 16,
    height: 140,
    justifyContent: 'space-between',
  },
  horizontalCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  horizontalCardTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 12,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 16,
    marginVertical: 8,
  },
  horizontalCardQuantity: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  horizontalCardQuantityText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: 'white',
  },
  horizontalCardPrice: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  horizontalCardPriceText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    color: Colors.onSurface,
  },
  itemCard: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemGradient: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outline + '15',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemName: {
    fontFamily: Fonts.display.medium,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  itemQuantity: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.secondary,
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemPrice: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  stepCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  stepGradient: {
    padding: 16,
  },
  stepHeader: {
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepNumberText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: 'white',
  },
  stepDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  verticalList: {
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default function GreenprintScreen() {
  return (
    <ErrorProvider>
      <GreenprintContent />
    </ErrorProvider>
  );
}
