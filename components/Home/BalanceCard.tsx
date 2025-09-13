import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  balance: number;
  currency?: string;
  changePercent: number;
  changeAmount: number;
  onHistoryPress?: () => void;
};

export default function BalanceCard({ 
  balance = 1000, 
  currency = "Rp", 
  changePercent = -15, 
  changeAmount = -200,
  onHistoryPress 
}: Props) {
  const isPositive = changePercent >= 0;
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

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

  const getChangeColor = () => {
    return isPositive ? Colors.secondary : Colors.error;
  };

  const getChangeIcon = () => {
    return isPositive ? "trending-up" : "trending-down";
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
        colors={[Colors.mainBackground, "rgba(255, 255, 255, 0.8)"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with icon + title */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="wallet" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Point</Text>
          </View>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={onHistoryPress}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="history" size={16} color={Colors.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Main Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.currencySymbol}>{currency}</Text>
          <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        </View>

        {/* Change Indicator */}
        <View style={styles.changeSection}>
          <View style={[styles.changeIndicator, { backgroundColor: getChangeColor() + "20" }]}>
            <FontAwesome5
              name={getChangeIcon()}
              size={12}
              color={getChangeColor()}
            />
            <Text style={[styles.changePercent, { color: getChangeColor() }]}>
              {isPositive ? "+" : ""}{changePercent}%
            </Text>
          </View>
          <Text style={styles.changeAmount}>
            {isPositive ? "+" : ""}{currency} {formatCurrency(changeAmount)} dari kemarin
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <FontAwesome5 name="exchange-alt" size={12} color={Colors.primary} />
            <Text style={styles.actionText}>Convert</Text>
          </TouchableOpacity>
        </View>
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
    minHeight: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  historyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceSection: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
    gap: 4,
  },
  currencySymbol: {
    fontFamily: Fonts.display.bold,
    fontSize: 18,
    color: Colors.tertiary,
  },
  cardValue: {
    fontFamily: Fonts.display.bold,
    fontSize: 32,
    color: Colors.primary,
    lineHeight: 38,
  },
  changeSection: {
    marginBottom: 20,
    gap: 8,
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changePercent: {
    fontFamily: Fonts.display.bold,
    fontSize: 12,
  },
  changeAmount: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.surfaceVariant,
  },
  actionText: {
    fontFamily: Fonts.text.regular,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
});
