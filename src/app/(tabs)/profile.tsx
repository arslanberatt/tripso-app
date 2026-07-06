import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IdentityCards } from '@/components/profile/identity-cards';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LanguageSheet } from '@/components/ui/language-sheet';
import { SettingsGroup } from '@/components/ui/settings-group';
import { SettingsRow } from '@/components/ui/settings-row';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAppBootstrap } from '@/hooks/use-app-bootstrap';
import { useProfile } from '@/hooks/data/use-profile';
import { usePreferences } from '@/hooks/use-preferences';
import { useTheme } from '@/hooks/use-theme';
import type { LanguagePreference } from '@/storage/app-storage';

/**
 * Profile (`/profile`) — "Ayarlar" ekranı (gruplu kart düzeni).
 *
 * Kimlik + ID kartları üstte; ardından gezinme (Güvenlik, Bildirimler, Dil),
 * toggle'lar (Face ID, Karanlık Mod) ve hesap aksiyonları (tanıtımı tekrar gör,
 * çıkış) gruplu kartlarda. Dil seçimi alttan açılan `LanguageSheet` ile.
 *
 * Tema/dil tercihleri `usePreferences()` üzerinden kalıcı + anında uygulanır.
 * Karanlık Mod satırına UZUN basınca tema 'system'e döner.
 *
 * TODO(api): Güvenlik / Bildirim Tercihleri ekranları + Face ID gerçek auth.
 */
export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data } = useProfile();
  const { user } = data;
  const { displayName, language, setLanguage, colorScheme, setThemePreference } = usePreferences();
  const { signOut, resetOnboarding } = useAppBootstrap();

  const name = displayName ?? user.name;

  // Sadece görsel/yerel state (kalıcı değil; gerçek auth'a bağlı değil).
  const [faceId, setFaceId] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);

  const currentLanguageLabel = t(`home:profile.languageOptions.${language}`);

  const toggleDarkMode = () => {
    void setThemePreference(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const handleSelectLanguage = (value: LanguagePreference) => {
    void setLanguage(value);
    setSheetVisible(false);
  };

  const handleSignOut = () => {
    void (async () => {
      await signOut();
      router.replace('/login');
    })();
  };

  const handleReplayOnboarding = () => {
    void (async () => {
      await resetOnboarding();
      await signOut();
      router.replace('/welcome');
    })();
  };

  const trackColor = { true: theme.primary, false: theme.border };

  return (
    <ThemedView type="backgroundElement" style={styles.fill}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.three }]}
      >
        {/* Başlık */}
        <View style={styles.titleBlock}>
          <ThemedText type="h1">{t('home:profile.title')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('home:profile.subtitle')}
          </ThemedText>
        </View>

        <IdentityCards user={user} name={name} onPressIdentity={() => router.push('/personalize')} />

        {/* Gezinme */}
        <SettingsGroup>
          <SettingsRow
            icon="shield-checkmark-outline"
            label={t('home:profile.security')}
            showChevron
            onPress={() => {
              /* TODO(api): güvenlik ekranı */
            }}
          />
          <SettingsRow
            icon="notifications-outline"
            label={t('home:profile.notifications')}
            showChevron
            onPress={() => router.push('/notifications')}
          />
          <SettingsRow
            icon="language-outline"
            label={t('home:profile.language')}
            value={currentLanguageLabel}
            showChevron
            onPress={() => setSheetVisible(true)}
          />
        </SettingsGroup>

        {/* Gezgin araçları */}
        <SettingsGroup>
          <SettingsRow
            icon="person-circle-outline"
            label={t('pages:personalize.title')}
            showChevron
            onPress={() => router.push('/personalize')}
          />
          <SettingsRow
            icon="footsteps-outline"
            label={t('pages:journal.title')}
            showChevron
            onPress={() => router.push('/journal')}
          />
          <SettingsRow
            icon="bookmark-outline"
            label={t('pages:saved.title')}
            showChevron
            onPress={() => router.push('/saved')}
          />
        </SettingsGroup>

        {/* Toggle'lar */}
        <SettingsGroup>
          <SettingsRow
            icon="scan-outline"
            label={t('home:profile.faceId')}
            trailing={
              <Switch
                value={faceId}
                onValueChange={setFaceId}
                trackColor={trackColor}
                ios_backgroundColor={theme.border}
              />
            }
          />
          <SettingsRow
            icon="moon-outline"
            label={t('home:profile.darkMode')}
            onPress={toggleDarkMode}
            onLongPress={() => void setThemePreference('system')}
            trailing={
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleDarkMode}
                trackColor={trackColor}
                ios_backgroundColor={theme.border}
              />
            }
          />
        </SettingsGroup>

        {/* Hesap aksiyonları */}
        <SettingsGroup>
          <SettingsRow
            icon="refresh-outline"
            label={t('home:profile.replayOnboarding')}
            showChevron
            onPress={handleReplayOnboarding}
          />
          <SettingsRow
            icon="log-out-outline"
            iconColor="danger"
            labelColor="danger"
            label={t('home:profile.logout')}
            onPress={handleSignOut}
          />
        </SettingsGroup>
      </ScrollView>

      <LanguageSheet
        visible={sheetVisible}
        value={language}
        onSelect={handleSelectLanguage}
        onClose={() => setSheetVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  titleBlock: { gap: Spacing.half },
});
