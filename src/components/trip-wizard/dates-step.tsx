import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { StepHeading } from '@/components/wizard/step-heading';
import { ThemedText } from '@/components/themed-text';
import { AppInput } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import type { DateFlexibility } from '@/types';

export type DatesStepProps = {
  dateFlexibility: DateFlexibility;
  setDateFlexibility: (v: DateFlexibility) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
};

export function DatesStep({
  dateFlexibility,
  setDateFlexibility,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DatesStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.dates.title')} subtitle={t('pages:wizard.dates.subtitle')} />
      <SegmentedControl
        options={[
          { value: 'exact', label: t('pages:dateFlexibility.exact') },
          { value: 'month', label: t('pages:dateFlexibility.month') },
          { value: 'flexible', label: t('pages:dateFlexibility.flexible') },
        ]}
        value={dateFlexibility}
        onChange={setDateFlexibility}
      />
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:wizard.dates.startDate')}
        </ThemedText>
        <AppInput
          leadingIcon="calendar-outline"
          value={startDate}
          onChangeText={setStartDate}
          placeholder={t('pages:wizard.dates.datePlaceholder')}
        />
      </View>
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:wizard.dates.endDate')}
        </ThemedText>
        <AppInput
          leadingIcon="calendar-outline"
          value={endDate}
          onChangeText={setEndDate}
          placeholder={t('pages:wizard.dates.datePlaceholder')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  fieldGap: { gap: Spacing.one },
});
