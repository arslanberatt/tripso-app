import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ChipGroup } from '@/components/wizard/chip-group';
import { INTEREST_OPTIONS } from '@/components/wizard/interest-options';
import { StepHeading } from '@/components/wizard/step-heading';
import { AppInput } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';

export type InterestsStepProps = {
  interests: string[];
  toggleInterest: (key: string) => void;
  notes: string;
  setNotes: (v: string) => void;
};

export function InterestsStep({ interests, toggleInterest, notes, setNotes }: InterestsStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.interests.title')} subtitle={t('pages:wizard.interests.subtitle')} />
      <ChipGroup
        options={INTEREST_OPTIONS.map((opt) => ({
          key: opt.key,
          label: t(`pages:interests.${opt.key}`),
          icon: opt.icon,
        }))}
        selectedKeys={interests}
        onSelect={toggleInterest}
      />
      <AppInput
        value={notes}
        onChangeText={setNotes}
        placeholder={t('pages:wizard.interests.notesPlaceholder')}
        multiline
        containerStyle={styles.notesInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  notesInput: { minHeight: 80, alignItems: 'flex-start', paddingVertical: Spacing.two },
});
