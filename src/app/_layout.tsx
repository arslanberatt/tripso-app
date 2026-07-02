import '@/i18n'; // yan-etkili: i18next'i ilk render'dan önce senkron başlatır

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppBootstrapProvider, useAppBootstrapValue } from '@/hooks/use-app-bootstrap';
import { PreferencesProvider, usePreferencesValue } from '@/hooks/use-preferences';

/**
 * Root layout — tüm uygulamayı saran tek Stack.
 *
 * Gruplar: `(onboarding)` → `(auth)` → `(tabs)`; ayrıca tabs üstünde modal/stack
 * ekranlar (`destination/[id]`, `trip/new`). Sağlayıcılar: SafeAreaProvider (tüm
 * ekranlar `useSafeAreaInsets` kullanır), GestureHandlerRootView (reanimated/
 * gesture), ThemeProvider (sistem temasına göre Dark/Default — header/arka plan).
 *
 * Başlangıç rotası `app/index.tsx` (Redirect) tarafından belirlenir.
 */
export default function RootLayout() {
  // Tercihleri (tema + dil + ad) tek noktada hydrate edip ağaca dağıt.
  const preferences = usePreferencesValue();
  // Kalıcı bayrakları (onboarding + oturum) tek noktada hydrate edip ağaca dağıt.
  const bootstrap = useAppBootstrapValue();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PreferencesProvider value={preferences}>
          {/* Tema, sistemden değil kullanıcı tercihinden (colorScheme) sürülür. */}
          <ThemeProvider value={preferences.colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AppBootstrapProvider value={bootstrap}>
              <AnimatedSplashOverlay />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(auth)" />
                {/* Arama: tabs üstünde tam ekran stack screen (tüm platformlar). */}
                <Stack.Screen name="search" />
                {/* Detay: tabs üstünde tam ekran stack screen. */}
                <Stack.Screen name="destination/[id]" />
                {/* Plan a Trip akışı — Trip Sihirbazı, modal sunum. */}
                <Stack.Screen name="trip/new" options={{ presentation: 'modal' }} />
                {/* Plan / Rota Detayı + alt akışları (bütçe, ortak plan). */}
                <Stack.Screen name="plan/[id]/index" />
                <Stack.Screen name="plan/[id]/budget" />
                <Stack.Screen name="plan/[id]/collaborate" />
                {/* Harita, gezi günlüğü ve mekân/öneri ekranları. */}
                <Stack.Screen name="map/index" />
                <Stack.Screen name="recommendations/[city]" />
                <Stack.Screen name="place/[id]" />
                <Stack.Screen name="journal/index" />
                <Stack.Screen name="saved/index" />
                <Stack.Screen name="notifications/index" />
                {/* Kişiselleştirme sihirbazı — modal sunum. */}
                <Stack.Screen name="personalize/index" options={{ presentation: 'modal' }} />
              </Stack>
            </AppBootstrapProvider>
          </ThemeProvider>
        </PreferencesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
