import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { BUDGET_CATEGORIES, BUDGET_CATEGORY_ICON } from '@/components/budget/budget-categories';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Expense } from '@/types';

/** CategoryBreakdown — kategori bazlı harcama çubukları. */
export function CategoryBreakdown({ expenses }: { expenses: Expense[] }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const totals = new Map<string, number>();
  for (const e of expenses) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  const rows = BUDGET_CATEGORIES.map((c) => ({ category: c, amount: totals.get(c) ?? 0 }));
  const max = Math.max(1, ...rows.map((r) => r.amount));

  return (
    <View style={styles.section}>
      <ThemedText type="h3">{t('pages:budgetScreen.byCategory')}</ThemedText>
      <View style={styles.list}>
        {rows.map(({ category, amount }) => (
          <View key={category} style={styles.row}>
            <Icon name={BUDGET_CATEGORY_ICON[category]} size={16} themeColor="textSecondary" />
            <ThemedText type="small" style={styles.label} numberOfLines={1}>
              {t(`pages:budgetCategory.${category}`)}
            </ThemedText>
            <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
              <View style={[styles.fillBar, { backgroundColor: theme.primary, width: `${(amount / max) * 100}%` }]} />
            </View>
            <ThemedText type="caption" themeColor="textSecondary">
              ${amount}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  list: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  label: { width: 90 },
  track: { flex: 1, height: 8, borderRadius: Radii.pill, overflow: 'hidden' },
  fillBar: { height: 8, borderRadius: Radii.pill },
});
