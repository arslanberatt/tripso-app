import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ALCOHOL_OPTIONS, DIETARY_OPTIONS } from '@/components/personalize/constants';
import { ChipGroup } from '@/components/wizard/chip-group';
import { StepHeading } from '@/components/wizard/step-heading';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import type { Alcohol } from '@/types';

export type TastesStepProps = {
  alcohol: Alcohol;
  setAlcohol: (v: Alcohol) => void;
  dietary: string[];
  toggleDietary: (key: string) => void;
};

export function TastesStep({ alcohol, setAlcohol, dietary, toggleDietary }: TastesStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:personalize.tastes.title')} subtitle={t('pages:personalize.tastes.subtitle')} />
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:personalize.tastes.alcoholLabel')}
        </ThemedText>
        <SegmentedControl
          options={ALCOHOL_OPTIONS.map((a) => ({ value: a, label: t(`pages:personalize.alcohol.${a}`) }))}
          value={alcohol}
          onChange={setAlcohol}
        />
      </View>
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:personalize.tastes.dietaryLabel')}
        </ThemedText>
        <ChipGroup
          options={DIETARY_OPTIONS.map((d) => ({ key: d, label: t(`pages:personalize.dietary.${d}`) }))}
          selectedKeys={dietary}
          onSelect={toggleDietary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  fieldGap: { gap: Spacing.one },
});
