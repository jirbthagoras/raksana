import { WeeklyRecapModal } from "@/components/Modals/WeeklyRecapModal";
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
import { useCreateWeeklyRecap } from "../../hooks/useApiQueries";

type Props = {
  onPress?: () => void;
};

function WeeklyRecapButtonContent({ onPress }: Props) {
  // Check if today is Sunday (0 = Sunday)
  const today = new Date();
  const isSunday = today.getDay() === 0;
  
  const [showModal, setShowModal] = useState(false);
  const [recapData, setRecapData] = useState<any>(null);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const { showPopUp } = useError();
  
  // Weekly recap mutation
  const createWeeklyRecapMutation = useCreateWeeklyRecap();

  useEffect(() => {
    if (isSunday) {
      // Subtle glow animation for active state
      const glowAnimation = () => {
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start(() => glowAnimation());
      };
      glowAnimation();
    }
  }, [isSunday]);
  
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
      // Create weekly recap
      const response = await createWeeklyRecapMutation.mutateAsync();
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Recap data:', response.data.recap);
      setRecapData(response.data.recap);
      setShowModal(true);
      onPress?.();
    } catch (error: any) {
      showPopUp(
        error.message || 'Gagal memuat recap mingguan',
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
        activeOpacity={isSunday ? 0.9 : 1}
        disabled={!isSunday || createWeeklyRecapMutation.isPending}
      >
        {/* Glow effect for active state */}
        {isSunday && (
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
          colors={isSunday 
            ? [Colors.primary, Colors.secondary] 
            : [Colors.surfaceContainer, Colors.surfaceContainerHigh]
          }
          style={[
            styles.button,
            isSunday ? styles.activeButton : styles.inactiveButton
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              {createWeeklyRecapMutation.isPending ? (
                <ActivityIndicator 
                  size="small" 
                  color={isSunday ? 'white' : Colors.onSurfaceVariant} 
                />
              ) : (
                <FontAwesome5 
                  name="calendar-week" 
                  size={18} 
                  color={isSunday ? 'white' : Colors.onSurfaceVariant}
                />
              )}
            </View>
            <Text style={[
              styles.buttonText,
              isSunday ? styles.activeText : styles.inactiveText
            ]}>
              {createWeeklyRecapMutation.isPending ? 'Loading...' : 'Get Weekly Recap'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Weekly Recap Modal */}
      <WeeklyRecapModal
        visible={showModal}
        onClose={handleCloseModal}
        recapData={recapData}
        loading={false}
      />
    </Animated.View>
  );
}

export default function WeeklyRecapButton({ onPress }: Props) {
  return (
    <ErrorProvider>
      <WeeklyRecapButtonContent onPress={onPress} />
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
    backgroundColor: Colors.primary,
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
    borderColor: Colors.primary + '30',
    shadowColor: Colors.primary,
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
