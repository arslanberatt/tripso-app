import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { BUDGET_TIERS } from '@/components/trip-wizard/constants';
import { ChipGroup } from '@/components/wizard/chip-group';
import { StepHeading } from '@/components/wizard/step-heading';
import { ThemedText } from '@/components/themed-text';
import { AppInput } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import type { BudgetTier } from '@/types';

export type BudgetStepProps = {
  budgetTier: BudgetTier;
  setBudgetTier: (v: BudgetTier) => void;
  budgetAmount: string;
  setBudgetAmount: (v: string) => void;
};

export function BudgetStep({ budgetTier, setBudgetTier, budgetAmount, setBudgetAmount }: BudgetStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.budget.title')} subtitle={t('pages:wizard.budget.subtitle')} />
      <ChipGroup
        options={BUDGET_TIERS.map((tier) => ({ key: tier, label: t(`pages:budgetTier.${tier}`) }))}
        selectedKeys={[budgetTier]}
        onSelect={(key) => setBudgetTier(key as BudgetTier)}
      />
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:wizard.budget.amountLabel')}
        </ThemedText>
        <AppInput
          leadingIcon="cash-outline"
          value={budgetAmount}
          onChangeText={setBudgetAmount}
          keyboardType="numeric"
          placeholder={t('pages:wizard.budget.amountPlaceholder')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  fieldGap: { gap: Spacing.one },
});
