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

export default function WeeklyRecapButton({ onPress }: Props) {
  // Check if today is Sunday (0 = Sunday)
  const today = new Date();
  const isSunday = today.getDay() === 0;
  
  const handlePress = () => {
    if (isSunday) {
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSunday ? styles.activeButton : styles.inactiveButton
      ]}
      onPress={handlePress}
      activeOpacity={isSunday ? 0.8 : 1}
      disabled={!isSunday}
    >
      <View style={styles.buttonContent}>
        <FontAwesome5 
          name="calendar-week" 
          size={20} 
          color={isSunday ? 'white' : Colors.onSurfaceVariant}
          style={styles.icon}
        />
        <Text style={[
          styles.buttonText,
          isSunday ? styles.activeText : styles.inactiveText
        ]}>
          Get Weekly Recap
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
    backgroundColor: '#EF4444', // Bright red
    shadowColor: '#EF4444',
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
