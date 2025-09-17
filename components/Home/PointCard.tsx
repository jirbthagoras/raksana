import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  balance?: number;
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
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle glow animation
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
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const formatBalance = (amount: number) => {
    return amount.toLocaleString('id-ID');
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }], opacity: fadeValue }]}>
      {/* Glow effect */}
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={[Colors.primary + '20', 'transparent']}
          style={styles.glow}
        />
      </Animated.View>
      
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="wallet" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Your Point</Text>
          </View>

          {/* Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.currency}>{currency}</Text>
            <Text style={styles.balance}>{formatBalance(balance)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onHistoryPress}
            >
              <FontAwesome5 name="history" size={14} color={Colors.primary} />
              <Text style={styles.actionText}>Riwayat</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    position: "relative",
  },
  glowContainer: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    zIndex: -1,
  },
  glow: {
    flex: 1,
    borderRadius: 24,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.primary + "10",
  },
  cardContent: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontFamily: Fonts.display.medium,
    color: Colors.onSurfaceVariant,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 22,
  },
  currency: {
    fontSize: 16,
    fontFamily: Fonts.display.medium,
    color: Colors.onSurfaceVariant,
    marginRight: 4,
  },
  balance: {
    fontSize: 28,
    fontFamily: Fonts.display.bold,
    color: Colors.onSurface,
  },
  actionContainer: {
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "space-between",
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.outline + "40",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    borderRadius: 12,
  },
  actionText: {
    fontSize: 13,
    fontFamily: Fonts.display.medium,
    color: Colors.primary,
    marginLeft: 6,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.outline + "30",
  },
});
