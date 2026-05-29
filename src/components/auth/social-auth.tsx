import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

/**
 * SocialAuth (base / web) — Google ile giriş.
 *
 * Platform dosya ayrımı: iOS → `social-auth.ios.tsx` (Apple + Google),
 * Android → `social-auth.android.tsx` (Google). Bu base dosya web ve TS tip
 * çözümü içindir; web'de Apple Sign-In olmadığından yalnız Google sunar.
 */
export type SocialAuthProps = {
  onGoogle: () => void;
  onApple: () => void;
  loading?: boolean;
};

export function SocialAuth({ onGoogle, loading }: SocialAuthProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.group}>
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
