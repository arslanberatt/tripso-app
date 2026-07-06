import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ChipGroup } from '@/components/wizard/chip-group';
import { INTEREST_OPTIONS } from '@/components/wizard/interest-options';
import { StepHeading } from '@/components/wizard/step-heading';
import { Spacing } from '@/constants/theme';

export type InterestsStepProps = {
  interests: string[];
  toggleInterest: (key: string) => void;
};

export function InterestsStep({ interests, toggleInterest }: InterestsStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading
        title={t('pages:personalize.interests.title')}
        subtitle={t('pages:personalize.interests.subtitle')}
      />
      <ChipGroup
        options={INTEREST_OPTIONS.map((opt) => ({
          key: opt.key,
          label: t(`pages:interests.${opt.key}`),
          icon: opt.icon,
        }))}
        selectedKeys={interests}
        onSelect={toggleInterest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
});
