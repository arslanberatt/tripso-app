import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { BUDGET_CATEGORY_ICON } from '@/components/budget/budget-categories';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Expense } from '@/types';

/** ExpenseList — harcama satırları (kategori ikonu + etiket + tarih + tutar). */
export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (expenses.length === 0) {
    return (
      <ThemedText type="small" themeColor="textTertiary">
        {t('pages:budgetScreen.empty')}
      </ThemedText>
    );
  }

  return (
    <View style={styles.list}>
      {expenses.map((e) => (
        <View key={e.id} style={styles.row}>
          <View style={[styles.icon, { backgroundColor: theme.backgroundElement }]}>
            <Icon name={BUDGET_CATEGORY_ICON[e.category]} size={16} themeColor="primary" />
          </View>
          <View style={styles.body}>
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
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.one },
  icon: { width: 32, height: 32, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
});
