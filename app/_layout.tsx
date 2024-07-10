import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import AuthContext, { AuthProvider, useAuth } from './AuthContext';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { userToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userToken) {
      router.push('/screens/LoginScreen');
    } else {
      router.push('/(tabs)');
    }
  }, [userToken]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
      {userToken ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="screens" options={{ headerShown: false }} />
      )}
      </Stack>
    </ThemeProvider>
  );
}
