import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AGE_GROUPS } from '@/components/personalize/constants';
import { ChipGroup } from '@/components/wizard/chip-group';
import { StepHeading } from '@/components/wizard/step-heading';
import { ThemedText } from '@/components/themed-text';
import { AppInput } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';

export type AboutStepProps = {
  name: string;
  setName: (v: string) => void;
  ageGroup: string;
  setAgeGroup: (v: string) => void;
};

export function AboutStep({ name, setName, ageGroup, setAgeGroup }: AboutStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:personalize.about.title')} subtitle={t('pages:personalize.about.subtitle')} />
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:personalize.about.nameLabel')}
        </ThemedText>
        <AppInput
          leadingIcon="person-outline"
          value={name}
          onChangeText={setName}
          placeholder={t('pages:personalize.about.namePlaceholder')}
        />
      </View>
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:personalize.about.ageLabel')}
        </ThemedText>
        <ChipGroup
          options={AGE_GROUPS.map((g) => ({ key: g, label: t(`pages:personalize.ageGroup.${g}`) }))}
          selectedKeys={[ageGroup]}
          onSelect={setAgeGroup}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  fieldGap: { gap: Spacing.one },
});
