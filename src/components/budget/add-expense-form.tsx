import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { BUDGET_CATEGORIES } from '@/components/budget/budget-categories';
import { ChipGroup } from '@/components/wizard/chip-group';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppInput } from '@/components/ui/input';
import { Radii, Spacing } from '@/constants/theme';
import type { BudgetCategoryKey } from '@/types';

export type ExpenseInput = { label: string; amount: number; category: BudgetCategoryKey };

/** AddExpenseForm — etiket + tutar + kategori; geçerli girdide `onSubmit`. */
export function AddExpenseForm({ onSubmit }: { onSubmit: (input: ExpenseInput) => void }) {
  const { t } = useTranslation();
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BudgetCategoryKey>('food');

  const submit = () => {
    if (!label.trim() || !amount.trim()) return;
    onSubmit({ label: label.trim(), amount: Number(amount), category });
    setLabel('');
    setAmount('');
  };

  return (
    <Card radius={Radii.lg}>
      <View style={styles.form}>
        <AppInput placeholder={t('pages:budgetScreen.expenseLabel')} value={label} onChangeText={setLabel} />
        <AppInput
          placeholder={t('pages:budgetScreen.expenseAmount')}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <ChipGroup
          options={BUDGET_CATEGORIES.map((c) => ({ key: c, label: t(`pages:budgetCategory.${c}`) }))}
          selectedKeys={[category]}
          onSelect={(key) => setCategory(key as BudgetCategoryKey)}
        />
        <AppButton label={t('pages:budgetScreen.save')} onPress={submit} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.two, padding: Spacing.three },
});
