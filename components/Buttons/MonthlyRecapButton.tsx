import { MonthlyRecapModal } from "@/components/Modals/MonthlyRecapModal";
import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ErrorProvider, useError } from "../../contexts/ErrorContext";
import { useCreateMonthlyRecap } from "../../hooks/useApiQueries";

type Props = {
  onPress?: () => void;
};

function MonthlyRecapButtonContent({ onPress }: Props) {
  // Check if today is the 1st of the month
  const today = new Date();
  const isFirstOfMonth = true; // Set to true for testing, change to: today.getDate() === 1;
  
  const [showModal, setShowModal] = useState(false);
  const [recapData, setRecapData] = useState<any>(null);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const { showPopUp } = useError();
  
  // Monthly recap mutation
  const createMonthlyRecapMutation = useCreateMonthlyRecap();

  useEffect(() => {
    if (isFirstOfMonth) {
      // Subtle glow animation for active state
      const glowAnimation = () => {
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]).start(() => glowAnimation());
      };
      glowAnimation();
    }
  }, [isFirstOfMonth]);
  
  const handlePress = async () => {
    // Gentle press animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 200,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      // Create monthly recap
      const response = await createMonthlyRecapMutation.mutateAsync();
      console.log('Monthly recap response:', response);
      console.log('Response data:', response.data);
      setRecapData(response.data);
      setShowModal(true);
      onPress?.();
    } catch (error: any) {
      showPopUp(
        error.message || 'Gagal memuat recap bulanan',
        'Error',
        'error'
      );
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={isFirstOfMonth ? 0.9 : 1}
        disabled={!isFirstOfMonth || createMonthlyRecapMutation.isPending}
      >
        {/* Glow effect for active state */}
        {isFirstOfMonth && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
              },
            ]}
          />
        )}

        {/* Button content */}
        <LinearGradient
          colors={isFirstOfMonth 
            ? [Colors.secondary, Colors.tertiary] 
            : [Colors.surfaceContainer, Colors.surfaceContainerHigh]
          }
          style={[
            styles.button,
            isFirstOfMonth ? styles.activeButton : styles.inactiveButton
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              {createMonthlyRecapMutation.isPending ? (
                <ActivityIndicator 
                  size="small" 
                  color={isFirstOfMonth ? 'white' : Colors.onSurfaceVariant} 
                />
              ) : (
                <FontAwesome5 
                  name="calendar-alt" 
                  size={18} 
                  color={isFirstOfMonth ? 'white' : Colors.onSurfaceVariant}
                />
              )}
            </View>
            <Text style={[
              styles.buttonText,
              isFirstOfMonth ? styles.activeText : styles.inactiveText
            ]}>
              {createMonthlyRecapMutation.isPending ? 'Loading...' : 'Get Monthly Recap'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Monthly Recap Modal */}
      <MonthlyRecapModal
        visible={showModal}
        onClose={handleCloseModal}
        recapData={recapData}
        loading={false}
      />
    </Animated.View>
  );
}

export default function MonthlyRecapButton({ onPress }: Props) {
  return (
    <ErrorProvider>
      <MonthlyRecapButtonContent onPress={onPress} />
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  touchable: {
    position: 'relative',
    borderRadius: 16,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    opacity: 0.2,
    zIndex: -1,
  },
  button: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  activeButton: {
    borderColor: Colors.secondary + '30',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  inactiveButton: {
    borderColor: Colors.outline + '20',
    shadowColor: Colors.outline,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: Colors.onSurfaceVariant,
  },
});
