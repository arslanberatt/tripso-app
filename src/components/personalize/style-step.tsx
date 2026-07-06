import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ACCOMMODATION_TIERS, PACE_OPTIONS } from '@/components/personalize/constants';
import { ChipGroup } from '@/components/wizard/chip-group';
import { StepHeading } from '@/components/wizard/step-heading';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import type { AccommodationTier, Pace } from '@/types';

export type StyleStepProps = {
  pace: Pace;
  setPace: (v: Pace) => void;
  accommodation: AccommodationTier;
  setAccommodation: (v: AccommodationTier) => void;
};

export function StyleStep({ pace, setPace, accommodation, setAccommodation }: StyleStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:personalize.style.title')} subtitle={t('pages:personalize.style.subtitle')} />
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:personalize.style.paceLabel')}
        </ThemedText>
        <SegmentedControl
          options={PACE_OPTIONS.map((p) => ({ value: p, label: t(`pages:personalize.pace.${p}`) }))}
          value={pace}
          onChange={setPace}
        />
      </View>
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:personalize.style.accommodationLabel')}
        </ThemedText>
        <ChipGroup
          options={ACCOMMODATION_TIERS.map((a) => ({ key: a, label: t(`pages:budgetTier.${a}`) }))}
          selectedKeys={[accommodation]}
          onSelect={(key) => setAccommodation(key as AccommodationTier)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  fieldGap: { gap: Spacing.one },
});
