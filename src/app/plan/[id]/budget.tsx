import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddExpenseForm, type ExpenseInput } from '@/components/budget/add-expense-form';
import { BudgetSummary } from '@/components/budget/budget-summary';
import { CategoryBreakdown } from '@/components/budget/category-breakdown';
import { ExpenseList } from '@/components/budget/expense-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { useBudget } from '@/hooks/data/use-budget';
import { usePlan } from '@/hooks/data/use-plan';
import type { Expense } from '@/types';

/** Bütçe Takibi (`/plan/[id]/budget`) — plan bütçesi vs gerçekleşen harcama. */
export default function PlanBudgetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlan(id);
  const { data: baseExpenses } = useBudget(id);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [extraExpenses, setExtraExpenses] = useState<Expense[]>([]);
  const [formVisible, setFormVisible] = useState(false);

  const expenses = [...baseExpenses, ...extraExpenses];
  const planned = plan?.budgetAmount ?? 0;
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const addExpense = ({ label, amount, category }: ExpenseInput) => {
    setExtraExpenses((prev) => [
      ...prev,
      {
        id: `ex-local-${Date.now()}`,
        planId: id ?? '',
        category,
        label,
        amount,
        currency: 'USD',
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setFormVisible(false);
  };

  if (!plan) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="h2">{t('pages:plan.notFound')}</ThemedText>
        <AppButton label={t('common:goBack')} variant="ghost" fullWidth={false} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:budgetScreen.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        <BudgetSummary planned={planned} spent={spent} />
        <CategoryBreakdown expenses={expenses} />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="h3">{t('pages:budgetScreen.expenses')}</ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('pages:budgetScreen.addExpense')}
              onPress={() => setFormVisible((v) => !v)}
            >
              <Icon name={formVisible ? 'close-circle' : 'add-circle'} size={26} themeColor="primary" />
            </Pressable>
          </View>

          {formVisible && <AddExpenseForm onSubmit={addExpense} />}
          <ExpenseList expenses={expenses} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.four },
  section: { gap: Spacing.two },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
