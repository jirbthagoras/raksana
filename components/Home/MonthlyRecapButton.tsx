import { Colors, Fonts } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onPress?: () => void;
};

export default function MonthlyRecapButton({ onPress }: Props) {
  // Check if today is the 1st of the month
  const today = new Date();
  const isFirstOfMonth = today.getDate() === 1;
  
  const handlePress = () => {
    if (isFirstOfMonth) {
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFirstOfMonth ? styles.activeButton : styles.inactiveButton
      ]}
      onPress={handlePress}
      activeOpacity={isFirstOfMonth ? 0.8 : 1}
      disabled={!isFirstOfMonth}
    >
      <View style={styles.buttonContent}>
        <FontAwesome5 
          name="calendar-alt" 
          size={20} 
          color={isFirstOfMonth ? 'white' : Colors.onSurfaceVariant}
          style={styles.icon}
        />
        <Text style={[
          styles.buttonText,
          isFirstOfMonth ? styles.activeText : styles.inactiveText
        ]}>
          Get Monthly Recap
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  activeButton: {
    backgroundColor: '#10B981', // Emerald green
    shadowColor: '#10B981',
  },
  inactiveButton: {
    backgroundColor: Colors.outline + '40',
    shadowColor: 'transparent',
  },
  buttonText: {
    fontFamily: Fonts.display.bold,
    fontSize: 17,
    letterSpacing: 0.5,
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: Colors.onSurfaceVariant,
  },
});
