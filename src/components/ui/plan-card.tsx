import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { RouteThumb } from '@/components/ui/route-thumb';
import { Tag } from '@/components/ui/tag';
import { Radii, Spacing } from '@/constants/theme';
import type { PlanCardVM } from '@/mocks/plans';

/**
 * PlanCard — Keşfet'teki plan kartı.
 * Sol: başlık + meta (ort. fiyat, yer sayısı) + etiketler. Sağ: thumbnail.
 */
export type PlanCardProps = {
  plan: PlanCardVM;
  onPress?: () => void;
};

/** Bütçeyi "avg" gösterimi için formatlar (USD → $1,000). */
function formatBudget(amount: number, currency: string): string {
  if (currency === 'USD') return `$${amount.toLocaleString('en-US')}`;
  return `${amount.toLocaleString('en-US')} ${currency}`;
}

export function PlanCard({ plan, onPress }: PlanCardProps) {
  const { t } = useTranslation();

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={plan.title}
        onPress={onPress}
        style={({ pressed }) => [styles.row, { opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.body}>
          <ThemedText type="h3" numberOfLines={2}>
            {plan.title}
          </ThemedText>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Icon name="cash-outline" size={14} themeColor="textSecondary" />
              <ThemedText type="caption" themeColor="textSecondary">
                {t('home:explore.card.avg', {
                  amount: formatBudget(plan.budgetAmount, plan.budgetCurrency),
                })}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Icon name="location-outline" size={14} themeColor="textSecondary" />
              <ThemedText type="caption" themeColor="textSecondary">
                {t('home:explore.card.places', { count: plan.placesCount })}
              </ThemedText>
            </View>
          </View>

          <View style={styles.tags}>
            {plan.tags.map((tg) => (
              <Tag key={tg.label} label={tg.label} icon={tg.icon} />
            ))}
          </View>
        </View>

        <RouteThumb seed={plan.id} size={96} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  body: { flex: 1, gap: Spacing.two },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
});
