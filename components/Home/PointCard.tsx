import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  balance: number;
  currency?: string;
  onPress?: () => void;
  onHistoryPress?: () => void;
  onConvertPress?: () => void;
};

export default function BalanceCard({ 
  balance = 1000, 
  currency = "Rp",
  onPress,
  onHistoryPress,
  onConvertPress,
}: Props) {
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(Math.abs(amount));
  };

  const handleHistoryPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onHistoryPress?.() || onPress?.();
  };

  const handleConvertPress = () => {
    onConvertPress?.();
  };


  return (
    <Animated.View 
      style={[
        styles.cardContainer, 
        { 
          transform: [{ scale: scaleValue }],
          opacity: fadeValue 
        }
      ]}
    >
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="coins" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Point</Text>
          </View>
        </View>

        {/* Prominent Balance Display */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceContainer}>
            <Text style={styles.currencySymbol}>{currency}</Text>
            <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
          </View>
          <View style={styles.balanceAccent} />
        </View>

        {/* Minimalist Navigation Button */}
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleHistoryPress}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>History</Text>
            <FontAwesome5 name="chevron-right" size={12} color={Colors.primary} />
          </TouchableOpacity>
        </Animated.View>

      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.outline + "30",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 160,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  balanceSection: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  balanceAccent: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  currencySymbol: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.tertiary,
  },
  cardValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 36,
    color: Colors.primary,
    lineHeight: 42,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    marginTop: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryContainer + '40',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    borderColor: Colors.primary + '20',
  },
  navButtonText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.primary,
    flex: 1,
  },
});
