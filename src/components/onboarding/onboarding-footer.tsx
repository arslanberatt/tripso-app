import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/button';
import { OnboardingPagination } from '@/components/onboarding/onboarding-pagination';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { SharedValue } from 'react-native-reanimated';

export type OnboardingFooterProps = {
  count: number;
  scrollX: SharedValue<number>;
  isLast: boolean;
  showBack: boolean;
  onPrimary: () => void;
  onBack: () => void;
};

/**
 * Alt çubuk: solda "Geri" (ilk slayttan sonra), ortada ilerleme noktaları,
 * sağda "Sonraki" / son slaytta "Başla". Hepsi tek satırda hizalı durur.
 */
export function OnboardingFooter({
  count,
  scrollX,
  isLast,
  showBack,
  onPrimary,
  onBack,
}: OnboardingFooterProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('onboarding:footer.backA11y')}
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <ThemedText type="small" style={[styles.backLabel, { color: theme.textSecondary }]}>
              {t('onboarding:footer.back')}
            </ThemedText>
          </Pressable>
        )}
      </View>

      <OnboardingPagination count={count} scrollX={scrollX} color={theme.primary} />

      <View style={styles.right}>
        <AppButton
          fullWidth={false}
          label={isLast ? t('onboarding:footer.getStarted') : t('onboarding:footer.next')}
          onPress={onPrimary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  // Sol/sağ aynı genişlikte → noktalar tam ortada kalır.
  left: { flex: 1, alignItems: 'flex-start' },
  right: { flex: 1, alignItems: 'flex-end' },
  backLabel: { fontWeight: '700' },
});
