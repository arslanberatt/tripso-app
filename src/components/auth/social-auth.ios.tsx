import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

/**
 * SocialAuth (iOS) — Apple + Google ile giriş.
 *
 * Apple Sign-In, App Store kuralı gereği iOS'ta sunulur (Android'de YOK — bkz.
 * `social-auth.android.tsx`). Platform ayrımı dosya uzantısıyla yapılır; ekran
 * tarafı sadece `<SocialAuth ... />` çağırır, doğru dosya bundler'ca seçilir.
 *
 * TODO(auth): `signInWithApple`/`signInWithGoogle` şu an mock (`use-auth`).
 * Gerçek akış için expo-apple-authentication + Google OAuth bağlanacak.
 */
export type SocialAuthProps = {
  onGoogle: () => void;
  onApple: () => void;
  loading?: boolean;
};

export function SocialAuth({ onGoogle, onApple, loading }: SocialAuthProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.group}>
      <AppButton
        label={t('auth:social.apple')}
        variant="secondary"
        leadingIcon="logo-apple"
        onPress={onApple}
        disabled={loading}
      />
      <AppButton
        label={t('auth:social.google')}
        variant="secondary"
        leadingIcon="logo-google"
        onPress={onGoogle}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
});
