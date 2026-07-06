import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { categoryIcon, type PlanItemVM } from '@/mocks/plan-details';

/**
 * PlanItemCard — rota durağı kartı: görsel, kategori, saat/maliyet ve
 * "Bunu istemiyorum" (alternatif öner) aksiyonu. Mekân kaydı varsa detayına gider.
 */
export function PlanItemCard({ item, onSwap }: { item: PlanItemVM; onSwap: () => void }) {
  const { t } = useTranslation();

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole={item.placeId ? 'button' : undefined}
        accessibilityLabel={item.title}
        onPress={item.placeId ? () => router.push(`/place/${item.placeId}`) : undefined}
        style={({ pressed }) => [styles.row, { opacity: item.placeId && pressed ? 0.85 : 1 }]}
      >
        <View style={styles.imageWrap}>
          <CachedImage
            uri={item.imageUrl}
            displayWidth={80}
            style={cachedImageStyles.fill}
            recyclingKey={item.id}
            radius={Radii.md}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Icon name={categoryIcon(item.category)} size={14} themeColor="primary" />
            <ThemedText type="caption" themeColor="primary">
              {t(`pages:category.${item.category}`)}
            </ThemedText>
          </View>
          <ThemedText type="h3" numberOfLines={2}>
            {item.title}
          </ThemedText>
          <View style={styles.meta}>
            {item.startTime && (
              <ThemedText type="caption" themeColor="textSecondary">
                {item.startTime}
              </ThemedText>
            )}
            {item.estimatedCost != null && (
              <ThemedText type="caption" themeColor="textSecondary">
                {t('pages:plan.estimatedCost', { amount: `$${item.estimatedCost}` })}
              </ThemedText>
            )}
          </View>
          {item.note && (
            <ThemedText type="caption" themeColor="textTertiary" numberOfLines={2}>
              {item.note}
            </ThemedText>
          )}
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('pages:plan.a11y.swap', { title: item.title })}
        onPress={onSwap}
        style={({ pressed }) => [styles.swapRow, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Icon name="swap-horizontal-outline" size={16} themeColor="textSecondary" />
        <ThemedText type="caption" themeColor="textSecondary">
          {t('pages:plan.swap')}
        </ThemedText>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.three },
  imageWrap: { width: 80, height: 80, borderRadius: Radii.md, overflow: 'hidden' },
  body: { flex: 1, gap: Spacing.half },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  meta: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.half },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
