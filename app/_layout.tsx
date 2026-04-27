import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import authService from '@/services/auth.service';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    // App initialization logic if needed
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="member/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="committee" options={{ headerShown: false }} />
        <Stack.Screen name="gallery" options={{ headerShown: false }} />
        <Stack.Screen name="faq" options={{ headerShown: false }} />
        <Stack.Screen name="business" options={{ headerShown: false }} />
        <Stack.Screen name="business/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="business/register" options={{ headerShown: false }} />
        <Stack.Screen name="polls" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="donations" options={{ headerShown: false }} />
        <Stack.Screen name="complaints" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
