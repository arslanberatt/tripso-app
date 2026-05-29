import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { SocialAuth } from '@/components/auth/social-auth';
import { AppButton } from '@/components/ui/button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { FeatureFlags } from '@/config/feature-flags';
import { useAuth } from '@/hooks/data/use-auth';

/**
 * Login landing (`/login`) — tam ekran ilham görseli + alttan koyu degrade + giriş.
 *
 * Birincil giriş: Google + Apple (iOS'ta ikisi, Android/web'de Google) —
 * `SocialAuth` platform dosya ayrımıyla. E-posta/şifre akışı varsayılan KAPALI;
 * yalnız `FeatureFlags.authEmailEnabled` (=> `.env`) açıkken "E-posta ile devam
 * et" butonu görünür ve `/email-sign-in`'e gider. Başarılı girişte tabs'a.
 *
 * Görsel: `assets/images/auth/auth.webp` (yerel asset, expo-image ile).
 */
export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isSubmitting } = useAuth();

  const goHome = () => router.replace('/home');
  const onGoogle = async () => {
    await signInWithGoogle();
    goHome();
  };
  const onApple = async () => {
    await signInWithApple();
    goHome();
  };

  return (
    <View style={styles.fill}>
      <Image
        source={require('@/assets/images/auth/auth.webp')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
        accessibilityLabel={t('auth:landing.tagline')}
      />
      {/* Alttan yukarı koyulaşan degrade → metin/butonlar okunaklı kalsın. */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + Spacing.four },
        ]}
      >
        <View style={styles.brand}>
          <ThemedText type="h1" themeColor="onPrimary" style={styles.brandText}>
            {t('auth:landing.brand')}
          </ThemedText>
        </View>

        <View style={styles.panel}>
          <ThemedText type="h2" themeColor="onPrimary" style={styles.tagline}>
            {t('auth:landing.tagline')}
          </ThemedText>

          <SocialAuth onGoogle={onGoogle} onApple={onApple} loading={isSubmitting} />

          {FeatureFlags.authEmailEnabled && (
            <AppButton
              label={t('auth:landing.emailCta')}
              variant="ghost"
              leadingIcon="mail-outline"
              onPress={() => router.push('/email-sign-in')}
              disabled={isSubmitting}
            />
          )}

          <ThemedText type="caption" themeColor="onPrimary" style={styles.terms}>
            {t('auth:landing.terms')}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#000' },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  brand: { alignItems: 'center', paddingTop: Spacing.five },
  brandText: { fontSize: 40, fontWeight: '800', letterSpacing: 0.5 },
  panel: { gap: Spacing.three },
  tagline: { textAlign: 'center', marginBottom: Spacing.one },
  terms: { textAlign: 'center', opacity: 0.8 },
});
