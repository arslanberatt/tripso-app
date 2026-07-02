import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Header } from '@/components/ui/header';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { AppInput } from '@/components/ui/input';
import { Radii, Spacing } from '@/constants/theme';
import { useBudget } from '@/hooks/data/use-budget';
import { usePlan } from '@/hooks/data/use-plan';
import { useTheme } from '@/hooks/use-theme';
import type { BudgetCategoryKey, Expense } from '@/types';

const CATEGORIES: BudgetCategoryKey[] = ['accommodation', 'food', 'activities', 'transport', 'shopping', 'other'];
const CATEGORY_ICON: Record<BudgetCategoryKey, IconName> = {
  accommodation: 'bed-outline',
  food: 'restaurant-outline',
  activities: 'trail-sign-outline',
  transport: 'car-outline',
  shopping: 'bag-outline',
  other: 'ellipse-outline',
};

/** Bütçe Takibi (`/plan/[id]/budget`) — plan bütçesi vs gerçekleşen harcama. */
export default function PlanBudgetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlan(id);
  const { data: baseExpenses } = useBudget(id);
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [extraExpenses, setExtraExpenses] = useState<Expense[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BudgetCategoryKey>('food');

  const expenses = [...baseExpenses, ...extraExpenses];
  const planned = plan?.budgetAmount ?? 0;
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = planned - spent;

  const categoryTotals = new Map<BudgetCategoryKey, number>();
  for (const e of expenses) categoryTotals.set(e.category, (categoryTotals.get(e.category) ?? 0) + e.amount);
  const byCategory = CATEGORIES.map((c) => ({ category: c, amount: categoryTotals.get(c) ?? 0 }));

  const maxCategoryAmount = Math.max(1, ...byCategory.map((c) => c.amount));

  const addExpense = () => {
    if (!label.trim() || !amount.trim()) return;
    setExtraExpenses((prev) => [
      ...prev,
      {
        id: `ex-local-${Date.now()}`,
        planId: id ?? '',
        category,
        label: label.trim(),
        amount: Number(amount),
        currency: 'USD',
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setLabel('');
    setAmount('');
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        <Card radius={Radii.lg}>
          <View style={styles.summary}>
            <SummaryStat label={t('pages:budgetScreen.planned')} value={`$${planned.toLocaleString('en-US')}`} />
            <SummaryStat label={t('pages:budgetScreen.spent')} value={`$${spent.toLocaleString('en-US')}`} />
            <SummaryStat
              label={t('pages:budgetScreen.remaining')}
              value={`$${remaining.toLocaleString('en-US')}`}
              danger={remaining < 0}
            />
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: remaining < 0 ? theme.danger : theme.primary,
                  width: `${Math.min(100, planned > 0 ? (spent / planned) * 100 : 0)}%`,
                },
              ]}
            />
          </View>
          {remaining < 0 && (
            <ThemedText type="caption" themeColor="danger" style={styles.overBudget}>
              {t('pages:budgetScreen.overBudget')}
            </ThemedText>
          )}
        </Card>

        <View style={styles.section}>
          <ThemedText type="h3">{t('pages:budgetScreen.byCategory')}</ThemedText>
          <View style={styles.categoryList}>
            {byCategory.map(({ category: c, amount: a }) => (
              <View key={c} style={styles.categoryRow}>
                <Icon name={CATEGORY_ICON[c]} size={16} themeColor="textSecondary" />
                <ThemedText type="small" style={styles.categoryLabel} numberOfLines={1}>
                  {t(`pages:budgetCategory.${c}`)}
                </ThemedText>
                <View style={[styles.categoryTrack, { backgroundColor: theme.backgroundElement }]}>
                  <View
                    style={[styles.categoryFill, { backgroundColor: theme.primary, width: `${(a / maxCategoryAmount) * 100}%` }]}
                  />
                </View>
                <ThemedText type="caption" themeColor="textSecondary">
                  ${a}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

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

          {formVisible && (
            <Card radius={Radii.lg}>
              <View style={styles.form}>
                <AppInput
                  placeholder={t('pages:budgetScreen.expenseLabel')}
                  value={label}
                  onChangeText={setLabel}
                />
                <AppInput
                  placeholder={t('pages:budgetScreen.expenseAmount')}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
                <View style={styles.chipWrap}>
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c}
                      label={t(`pages:budgetCategory.${c}`)}
                      selected={category === c}
                      onPress={() => setCategory(c)}
                    />
                  ))}
                </View>
                <AppButton label={t('pages:budgetScreen.save')} onPress={addExpense} />
              </View>
            </Card>
          )}

          {expenses.length === 0 ? (
            <ThemedText type="small" themeColor="textTertiary">
              {t('pages:budgetScreen.empty')}
            </ThemedText>
          ) : (
            <View style={styles.expenseList}>
              {expenses.map((e) => (
                <View key={e.id} style={styles.expenseRow}>
                  <View style={[styles.expenseIcon, { backgroundColor: theme.backgroundElement }]}>
                    <Icon name={CATEGORY_ICON[e.category]} size={16} themeColor="primary" />
                  </View>
                  <View style={styles.expenseBody}>
                    <ThemedText type="small" numberOfLines={1}>
                      {e.label}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textTertiary">
                      {e.date}
                    </ThemedText>
                  </View>
                  <ThemedText type="smallBold">${e.amount}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function SummaryStat({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="caption" themeColor="textTertiary">
        {label}
      </ThemedText>
      <ThemedText type="h3" themeColor={danger ? 'danger' : 'text'}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.four },
  summary: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.three, paddingBottom: Spacing.two },
  stat: { gap: 2 },
  progressTrack: { height: 6, marginHorizontal: Spacing.three, borderRadius: Radii.pill, backgroundColor: 'rgba(128,128,128,0.2)', overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: Radii.pill },
  overBudget: { padding: Spacing.three, paddingTop: Spacing.one },
  section: { gap: Spacing.two },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryList: { gap: Spacing.two },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  categoryLabel: { width: 90 },
  categoryTrack: { flex: 1, height: 8, borderRadius: Radii.pill, overflow: 'hidden' },
  categoryFill: { height: 8, borderRadius: Radii.pill },
  form: { gap: Spacing.two, padding: Spacing.three },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  expenseList: { gap: Spacing.two },
  expenseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.one },
  expenseIcon: { width: 32, height: 32, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
  expenseBody: { flex: 1, gap: 2 },
});
