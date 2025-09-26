import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function LeaderboardButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <FontAwesome5 name="medal" size={24} color={Colors.tertiary} style={styles.icon} />
      <Text style={styles.title}>Leaderboard</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
    maxHeight: 110,
    padding: 16,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'center',
  },
});
