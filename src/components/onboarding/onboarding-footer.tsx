import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { OnboardingPagination } from '@/components/onboarding/onboarding-pagination';
import { Colors, Spacing } from '@/constants/theme';
import type { SharedValue } from 'react-native-reanimated';

/**
 * OnboardingFooter — alt blok: (sol) geri butonu + (orta) sayfa noktaları, altında
 * ana CTA. Son sayfada CTA "Get Started", öncesinde "Next". Geri butonu yalnız
 * ilk slayttan sonra görünür. Beyaz zemine uygun renkler (primary noktalar).
 */
export type OnboardingFooterProps = {
  count: number;
  scrollX: SharedValue<number>;
  isLast: boolean;
  /** İlk slayttan sonra geri butonunu göster. */
  showBack: boolean;
  onPrimary: () => void;
  onBack: () => void;
};

export function OnboardingFooter({
  count,
  scrollX,
  isLast,
  showBack,
  onPrimary,
  onBack,
}: OnboardingFooterProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack && (
            <IconButton
              icon="chevron-back"
              accessibilityLabel={t('onboarding:footer.backA11y')}
              color={Colors.light.text}
              onPress={onBack}
            />
          )}
        </View>
        <OnboardingPagination count={count} scrollX={scrollX} color={Colors.light.primary} />
        <View style={styles.side} />
      </View>
      <AppButton
        label={isLast ? t('onboarding:footer.getStarted') : t('onboarding:footer.next')}
        onPress={onPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  side: { width: 44, alignItems: 'center', justifyContent: 'center' },
});
