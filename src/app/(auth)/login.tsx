import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ExternalLink } from '@/components/external-link';
import { SocialAuth } from '@/components/auth/social-auth';
import { AppButton } from '@/components/ui/button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { FeatureFlags } from '@/config/feature-flags';
import { useAuth } from '@/hooks/data/use-auth';

const TERMS_URL = 'https://tripso.app/terms';
const PRIVACY_URL = 'https://tripso.app/privacy';

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
        {/* Brand kaldırıldı; panel'in eski konumunu koruması için yer tutucu. */}
        <View style={styles.brand} />
          
        <View style={styles.panel}>
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
            {t('auth:landing.termsPrefix')}
            <ExternalLink href={TERMS_URL} style={styles.termsLink}>
              {t('auth:landing.termsLink')}
            </ExternalLink>
            {t('auth:landing.termsConjunction')}
            <ExternalLink href={PRIVACY_URL} style={styles.termsLink}>
              {t('auth:landing.privacyLink')}
            </ExternalLink>
            {t('auth:landing.termsSuffix')}
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
  // Eski brand bloğunun kapladığı dikey alanı korur (üst boşluk + başlık satırı).
  brand: { height: Spacing.five + 48 },
  panel: { gap: Spacing.three },
  terms: { textAlign: 'center', opacity: 0.8 },
  termsLink: { color: '#FFFFFF', fontWeight: '700', textDecorationLine: 'underline' },
});
