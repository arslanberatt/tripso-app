import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

/**
 * SocialAuth (Android) — yalnız Google ile giriş.
 *
 * Apple Sign-In Android'de gösterilmez (iOS varyantında var). Aynı `SocialAuthProps`
 * imzasını paylaşır ki ekran kodu platformdan habersiz kalsın; `onApple` burada
 * kullanılmaz.
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
