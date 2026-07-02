import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { Radii, Spacing } from '@/constants/theme';
import { usePlan } from '@/hooks/data/use-plan';
import { useTheme } from '@/hooks/use-theme';
import { ALTERNATIVE_ITEM_POOL, categoryIcon, type PlanDayVM, type PlanItemVM } from '@/mocks/plan-details';

/**
 * Plan / Rota Detayı (`/plan/[id]`) — Explore'daki plan kartları ve Trips
 * listesindeki gezi kartları buraya gelir (`usePlan` iki kaynağı da tek tipe
 * çevirir, bkz. `mocks/plan-details.ts`).
 *
 * Gün sekmeleri + durak kartları. Her durağın "Bunu istemiyorum" aksiyonu
 * `ALTERNATIVE_ITEM_POOL`'dan bir alternatifle değiştirir (yerelde, mock).
 */
export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlan(id);
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [days, setDays] = useState<PlanDayVM[] | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const swapCounter = useRef(0);
  const resolvedDays = days ?? plan?.days ?? [];

  if (!plan) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="h2">{t('pages:plan.notFound')}</ThemedText>
        <AppButton label={t('common:goBack')} variant="ghost" fullWidth={false} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const day = resolvedDays[activeDay] ?? resolvedDays[0];

  const totalEstimate = resolvedDays
    .flatMap((d) => d.items)
    .reduce((sum, item) => sum + (item.estimatedCost ?? 0), 0);

  const swapItem = (dayId: string, itemId: string) => {
    const base = days ?? plan.days;
    const usedIds = new Set(base.flatMap((d) => d.items.map((i) => i.placeId ?? i.id)));
    const candidate =
      ALTERNATIVE_ITEM_POOL.find((alt) => !usedIds.has(alt.placeId ?? alt.id)) ?? ALTERNATIVE_ITEM_POOL[0];
    swapCounter.current += 1;
    const replacement: PlanItemVM = { ...candidate, id: `${itemId}-alt-${swapCounter.current}` };

    setDays(
      base.map((d) =>
        d.id === dayId ? { ...d, items: d.items.map((i) => (i.id === itemId ? replacement : i)) } : d,
      ),
    );
  };

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={plan.title}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
      >
        <View style={styles.cover}>
          <CachedImage uri={plan.coverImageUrl} style={cachedImageStyles.fill} recyclingKey={plan.id} />
        </View>

        <View style={styles.padded}>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={16} themeColor="textSecondary" />
            <ThemedText type="small" themeColor="textSecondary">
              {plan.destinationCity}
            </ThemedText>
          </View>
          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={16} themeColor="textSecondary" />
            <ThemedText type="small" themeColor="textSecondary">
              {plan.startDate} → {plan.endDate}
            </ThemedText>
          </View>
          {totalEstimate > 0 && (
            <ThemedText type="caption" themeColor="textTertiary">
              {t('pages:plan.totalEstimate')}: ${totalEstimate.toLocaleString('en-US')}
            </ThemedText>
          )}
        </View>

        <View style={styles.padded}>
          <UnderlineTabs
            options={resolvedDays.map((d, i) => ({ value: String(i), label: t('pages:plan.day', { number: d.dayNumber }) }))}
            value={String(activeDay)}
            onChange={(v) => setActiveDay(Number(v))}
          />
        </View>

        <View style={[styles.padded, styles.itemList]}>
          {day?.items.map((item) => (
            <PlanItemCard key={item.id} item={item} onSwap={() => swapItem(day.id, item.id)} />
          ))}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.two }]}
      >
        <View style={styles.footerRow}>
          <FooterAction icon="map-outline" label={t('pages:plan.viewMap')} onPress={() => router.push(`/map?planId=${plan.id}`)} />
          <FooterAction icon="wallet-outline" label={t('pages:plan.budget')} onPress={() => router.push(`/plan/${plan.id}/budget`)} />
          <FooterAction icon="people-outline" label={t('pages:plan.collaborate')} onPress={() => router.push(`/plan/${plan.id}/collaborate`)} />
        </View>
      </View>
    </ThemedView>
  );
}

function FooterAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.footerAction, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.footerIcon, { backgroundColor: theme.backgroundElement }]}>
        <Icon name={icon} size={18} themeColor="primary" />
      </View>
      <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function PlanItemCard({ item, onSwap }: { item: PlanItemVM; onSwap: () => void }) {
  const { t } = useTranslation();

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole={item.placeId ? 'button' : undefined}
        accessibilityLabel={item.title}
        onPress={item.placeId ? () => router.push(`/place/${item.placeId}`) : undefined}
        style={({ pressed }) => [styles.itemRow, { opacity: item.placeId && pressed ? 0.85 : 1 }]}
      >
        <View style={styles.itemImageWrap}>
          <CachedImage uri={item.imageUrl} style={cachedImageStyles.fill} recyclingKey={item.id} radius={Radii.md} />
        </View>
        <View style={styles.itemBody}>
          <View style={styles.itemTitleRow}>
            <Icon name={categoryIcon(item.category)} size={14} themeColor="primary" />
            <ThemedText type="caption" themeColor="primary">
              {t(`pages:category.${item.category}`)}
            </ThemedText>
          </View>
          <ThemedText type="h3" numberOfLines={2}>
            {item.title}
          </ThemedText>
          <View style={styles.itemMeta}>
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
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  content: { gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three, gap: Spacing.one },
  cover: { height: 180, marginHorizontal: Spacing.three, borderRadius: Radii.lg, overflow: 'hidden' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  itemList: { gap: Spacing.three },
  itemRow: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.three },
  itemImageWrap: { width: 80, height: 80, borderRadius: Radii.md, overflow: 'hidden' },
  itemBody: { flex: 1, gap: Spacing.half },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  itemMeta: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.half },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: Spacing.two },
  footerRow: { flexDirection: 'row', justifyContent: 'space-around' },
  footerAction: { alignItems: 'center', gap: Spacing.one, minWidth: 88 },
  footerIcon: { width: 40, height: 40, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
});
