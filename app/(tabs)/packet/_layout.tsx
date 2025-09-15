import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
     return (
          <SafeAreaProvider>
               <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
     )
}