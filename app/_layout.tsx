import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'PlusJakartaDisplay-Light': require('../assets/fonts/PlusJakartaDisplay-Light.otf'),
    'PlusJakartaDisplay-Regular': require('../assets/fonts/PlusJakartaDisplay-Regular.otf'),
    'PlusJakartaDisplay-Medium': require('../assets/fonts/PlusJakartaDisplay-Medium.otf'),
    'PlusJakartaDisplay-Bold': require('../assets/fonts/PlusJakartaDisplay-Bold.otf'),
    'PlusJakartaDisplay-LightItalic': require('../assets/fonts/PlusJakartaDisplay-LightItalic.otf'),
    'PlusJakartaDisplay-Italic': require('../assets/fonts/PlusJakartaDisplay-Italic.otf'),
    'PlusJakartaDisplay-MediumItalic': require('../assets/fonts/PlusJakartaDisplay-MediumItalic.otf'),
    'PlusJakartaDisplay-BoldItalic': require('../assets/fonts/PlusJakartaDisplay-BoldItalic.otf'),
    'PlusJakartaText-Light': require('../assets/fonts/PlusJakartaText-Light.otf'),
    'PlusJakartaText-Regular': require('../assets/fonts/PlusJakartaText-Regular.otf'),
    'PlusJakartaText-Bold': require('../assets/fonts/PlusJakartaText-Bold.otf'),
    'PlusJakartaText-LightItalic': require('../assets/fonts/PlusJakartaText-LightItalic.otf'),
    'PlusJakartaText-Italic': require('../assets/fonts/PlusJakartaText-Italic.otf'),
    'PlusJakartaText-BoldItalic': require('../assets/fonts/PlusJakartaText-BoldItalic.otf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
