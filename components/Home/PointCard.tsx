import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  balance: number;
  currency?: string;
  onHistoryPress?: () => void;
  onConvertPress?: () => void;
};

export default function BalanceCard({ 
  balance = 1000, 
  currency = "Rp", 
  onHistoryPress,
  onConvertPress,
}: Props) {
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const historyButtonScale = useRef(new Animated.Value(1)).current;
  const convertButtonScale = useRef(new Animated.Value(1)).current;

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
      Animated.timing(historyButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(historyButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onHistoryPress?.();
  };

  const handleConvertPress = () => {
    Animated.sequence([
      Animated.timing(convertButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(convertButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
        {/* Header with Creative History Button */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="coins" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Point</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: historyButtonScale }] }}>
            <TouchableOpacity 
              style={styles.creativeHistoryButton}
              onPress={handleHistoryPress}
              activeOpacity={0.8}
            >
              <View style={styles.historyButtonContent}>
                <FontAwesome5 name="clock" size={14} color="white" />
                <Text style={styles.historyButtonText}>History</Text>
              </View>
              <View style={styles.historyButtonGlow} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Prominent Balance Display */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceContainer}>
            <Text style={styles.currencySymbol}>{currency}</Text>
            <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
          </View>
          <View style={styles.balanceAccent} />
        </View>

        <Animated.View style={[styles.convertSection, { transform: [{ scale: convertButtonScale }] }]}>
          <TouchableOpacity 
            style={styles.creativeConvertButton}
            onPress={handleConvertPress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.convertButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <FontAwesome5 name="magic" size={16} color="white" />
              <Text style={styles.convertButtonText}>Convert Points</Text>
              <FontAwesome5 name="arrow-right" size={12} color="white" />
            </LinearGradient>
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
    minHeight: 240,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
  creativeHistoryButton: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  historyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    zIndex: 2,
  },
  historyButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: 'white',
  },
  historyButtonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: Colors.primary,
    borderRadius: 22,
    opacity: 0.3,
    zIndex: 1,
  },
  balanceSection: {
    position: 'relative',
    marginBottom: 20,
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
  creativeConvertButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  convertButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  convertButtonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 14,
    color: 'white',
  },
  convertSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
