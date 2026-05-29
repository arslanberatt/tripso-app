import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AuthScaffold } from '@/components/auth/auth-scaffold';
import { EmailField } from '@/components/auth/email-field';
import { PasswordField } from '@/components/auth/password-field';
import { AppButton } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { FeatureFlags } from '@/config/feature-flags';
import { useAuth } from '@/hooks/data/use-auth';

/**
 * E-posta ile Giriş (`/email-sign-in`) — yalnız `authEmailEnabled` AÇIK iken
 * erişilir (`.env`: EXPO_PUBLIC_AUTH_EMAIL_ENABLED=true). Kapalıyken bu route'a
 * gelinirse landing'e (`/login`) yönlendirilir; böylece kod silinmeden gizlenir.
 *
 * Form state'i sade `useState`; doğrulama UI-only. Başarıda tabs'a (`/home`).
 * TODO(api): `signInWithEmail` mock; gerçekte alan doğrulaması + hata mesajları.
 */
export default function EmailSignInScreen() {
  const { t } = useTranslation();
  const { signInWithEmail, isSubmitting } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Bayrak kapalıysa e-posta akışı yok → landing'e dön.
  if (!FeatureFlags.authEmailEnabled) {
    return <Redirect href="/login" />;
  }

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const onSubmit = async () => {
    if (!canSubmit) return;
    await signInWithEmail(email, password);
    router.replace('/home');
  };

  return (
    <AuthScaffold
      title={t('auth:login.title')}
      subtitle={t('auth:login.subtitle')}
      onBack={() => router.back()}
      footer={
        <View style={styles.footer}>
          <View style={styles.signupRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {t('auth:login.noAccount')}
            </ThemedText>
            <Link href="/register" replace asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('auth:login.createAccountA11y')}
              >
                <ThemedText type="small" themeColor="primary" style={styles.link}>
                  {t('auth:login.signUp')}
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      }
    >
      <EmailField value={email} onChangeText={setEmail} clearable />
      <PasswordField value={password} onChangeText={setPassword} />
      <AppButton
        label={t('auth:login.submit')}
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={!canSubmit}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  footer: { gap: Spacing.three },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  link: { fontWeight: '700' },
});
