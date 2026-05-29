import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AuthScaffold } from '@/components/auth/auth-scaffold';
import { EmailField } from '@/components/auth/email-field';
import { PasswordField } from '@/components/auth/password-field';
import { AppInput } from '@/components/ui/input';
import { AppButton } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { FeatureFlags } from '@/config/feature-flags';
import { useAuth } from '@/hooks/data/use-auth';

/**
 * Register (`/register`) — isim/e-posta/şifre ile kayıt. Yalnız `authEmailEnabled`
 * AÇIK iken erişilir (kapalıyken `/login` landing'e yönlenir). Sosyal giriş
 * landing'de olduğu için burada tekrar edilmez.
 *
 * Form state sade `useState`; doğrulama UI-only. Başarıda tabs'a.
 * TODO(api): `register` mock; gerçekte e-posta doğrulama akışı + alan hataları.
 */
export default function RegisterScreen() {
  const { t } = useTranslation();
  const { register, isSubmitting } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Bayrak kapalıysa kayıt akışı yok → landing'e dön.
  if (!FeatureFlags.authEmailEnabled) {
    return <Redirect href="/login" />;
  }

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6;

  const onSubmit = async () => {
    if (!canSubmit) return;
    await register(email, password, name);
    router.replace('/home');
  };

  return (
    <AuthScaffold
      title={t('auth:register.title')}
      subtitle={t('auth:register.subtitle')}
      onBack={() => router.back()}
      footer={
        <View style={styles.footer}>
          <View style={styles.signinRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {t('auth:register.haveAccount')}
            </ThemedText>
            <Link href="/email-sign-in" replace asChild>
              <Pressable accessibilityRole="button" accessibilityLabel={t('auth:register.signIn')}>
                <ThemedText type="small" themeColor="primary" style={styles.link}>
                  {t('auth:register.signIn')}
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      }
    >
      <AppInput
        leadingIcon="person-outline"
        placeholder={t('auth:register.namePlaceholder')}
        autoCapitalize="words"
        textContentType="name"
        value={name}
        onChangeText={setName}
        clearable
      />
      <EmailField value={email} onChangeText={setEmail} clearable />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        isNew
        placeholder={t('auth:register.passwordPlaceholder')}
      />
      <AppButton
        label={t('auth:register.submit')}
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={!canSubmit}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  footer: { gap: Spacing.three },
  signinRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  link: { fontWeight: '700' },
});
