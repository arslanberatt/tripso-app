import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/avatar';
import { AppButton } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { AppInput } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomTabInset, Radii, Spacing } from '@/constants/theme';
import { useAppBootstrap } from '@/hooks/use-app-bootstrap';
import { useProfile } from '@/hooks/data/use-profile';
import { usePreferences } from '@/hooks/use-preferences';
import { useTheme } from '@/hooks/use-theme';
import type { LanguagePreference, ThemePreference } from '@/storage/app-storage';

/**
 * Profile (`/profile`) — gerçek profil ekranı.
 *
 * Profil verisi `useProfile()` mock'undan (avatar + e-posta). Görünen ad, dil ve
 * tema tercihleri `usePreferences()` üzerinden okunur/yazılır (kalıcı + anında
 * uygulanır). "Tanıtımı tekrar gör" onboarding bayrağını sıfırlar + oturumu
 * kapatır (Bug A: Google girişi onboarding'i atlıyordu → buradan yeniden oynatılır).
 *
 * TODO(api): ad değişimi PATCH /users/me/profile ile sunucuya da yazılacak.
 */
export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data } = useProfile();
  const { user } = data;
  const {
    displayName,
    setDisplayName,
    language,
    setLanguage,
    themePreference,
    setThemePreference,
  } = usePreferences();
  const { signOut, resetOnboarding } = useAppBootstrap();

  // Ad alanı yerel state'te tutulur; blur/temizle'de kalıcı yazılır.
  const [name, setName] = useState(displayName ?? user.name);

  const persistName = () => {
    void setDisplayName(name);
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

  const languageOptions: { value: LanguagePreference; label: string }[] = [
    { value: 'system', label: t('home:profile.languageOptions.system') },
    { value: 'en', label: t('home:profile.languageOptions.en') },
    { value: 'tr', label: t('home:profile.languageOptions.tr') },
  ];

  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: t('home:profile.themeOptions.system') },
    { value: 'light', label: t('home:profile.themeOptions.light') },
    { value: 'dark', label: t('home:profile.themeOptions.dark') },
  ];

  return (
    <ThemedView style={styles.fill}>
      <Header title={t('home:profile.title')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Kimlik kartı */}
        <View style={styles.identity}>
          <Avatar uri={user.avatarUrl} name={name} size={72} />
          <ThemedText type="h2">{name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {user.email}
          </ThemedText>
        </View>

        {/* Görünen ad */}
        <View style={styles.field}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
            {t('home:profile.nameLabel')}
          </ThemedText>
          <AppInput
            leadingIcon="person-outline"
            value={name}
            onChangeText={setName}
            onBlur={persistName}
            onEndEditing={persistName}
            clearable
            placeholder={t('home:profile.namePlaceholder')}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>

        {/* Tercihler */}
        <ThemedText type="caption" themeColor="textSecondary" style={styles.section}>
          {t('home:profile.preferences')}
        </ThemedText>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            {t('home:profile.language')}
          </ThemedText>
          <SegmentedControl options={languageOptions} value={language} onChange={setLanguage} />
        </View>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            {t('home:profile.theme')}
          </ThemedText>
          <SegmentedControl
            options={themeOptions}
            value={themePreference}
            onChange={setThemePreference}
          />
        </View>

        {/* Hesap */}
        <ThemedText type="caption" themeColor="textSecondary" style={styles.section}>
          {t('home:profile.account')}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home:profile.replayOnboarding')}
          onPress={handleReplayOnboarding}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.backgroundElement, borderRadius: Radii.md, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Icon name="refresh-outline" size={22} themeColor="text" />
          <View style={styles.rowText}>
            <ThemedText type="small" style={styles.rowTitle}>
              {t('home:profile.replayOnboarding')}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {t('home:profile.replayOnboardingHint')}
            </ThemedText>
          </View>
          <Icon name="chevron-forward" size={18} themeColor="textTertiary" />
        </Pressable>

        <AppButton
          label={t('home:profile.signOut')}
          variant="secondary"
          leadingIcon="log-out-outline"
          onPress={handleSignOut}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: Spacing.three, paddingBottom: BottomTabInset + Spacing.four, gap: Spacing.three },
  identity: { alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.three },
  field: { gap: Spacing.one },
  label: { fontWeight: '600' },
  section: { marginTop: Spacing.two, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontWeight: '600' },
});
