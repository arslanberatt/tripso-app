import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** BudgetSummary — planlanan/harcanan/kalan + ilerleme çubuğu. */
export function BudgetSummary({ planned, spent }: { planned: number; spent: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const remaining = planned - spent;
  const overBudget = remaining < 0;

  return (
    <Card radius={Radii.lg}>
      <View style={styles.summary}>
        <Stat label={t('pages:budgetScreen.planned')} value={`$${planned.toLocaleString('en-US')}`} />
        <Stat label={t('pages:budgetScreen.spent')} value={`$${spent.toLocaleString('en-US')}`} />
        <Stat label={t('pages:budgetScreen.remaining')} value={`$${remaining.toLocaleString('en-US')}`} danger={overBudget} />
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[
            styles.fillBar,
            {
              backgroundColor: overBudget ? theme.danger : theme.primary,
              width: `${Math.min(100, planned > 0 ? (spent / planned) * 100 : 0)}%`,
            },
          ]}
        />
      </View>
      {overBudget && (
        <ThemedText type="caption" themeColor="danger" style={styles.warning}>
          {t('pages:budgetScreen.overBudget')}
        </ThemedText>
      )}
    </Card>
  );
}

function Stat({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
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
  summary: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.three, paddingBottom: Spacing.two },
  stat: { gap: 2 },
  track: { height: 6, marginHorizontal: Spacing.three, marginBottom: Spacing.three, borderRadius: Radii.pill, overflow: 'hidden' },
  fillBar: { height: 6, borderRadius: Radii.pill },
  warning: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.three },
});
