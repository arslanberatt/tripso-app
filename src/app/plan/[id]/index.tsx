import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlanFooter } from '@/components/plan/plan-footer';
import { PlanItemCard } from '@/components/plan/plan-item-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { Radii, Spacing } from '@/constants/theme';
import { usePlan } from '@/hooks/data/use-plan';
import { ALTERNATIVE_ITEM_POOL, type PlanDayVM, type PlanItemVM } from '@/mocks/plan-details';

/**
 * Plan / Rota Detayı (`/plan/[id]`) — gün sekmeleri + durak kartları.
 * "Bunu istemiyorum" `ALTERNATIVE_ITEM_POOL`'dan alternatif yerleştirir (mock).
 * Not: gün başına 2-5 durak olduğundan ScrollView bilinçli tercih (FlatList değil).
 */
export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlan(id);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Kapak yatay Spacing.three*2 padding'le akar (styles.cover marginHorizontal).
  const coverWidth = width - Spacing.three * 2;

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
          <CachedImage
            uri={plan.coverImageUrl}
            displayWidth={coverWidth}
            style={cachedImageStyles.fill}
            recyclingKey={plan.id}
          />
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

      <PlanFooter
        actions={[
          { icon: 'map-outline', label: t('pages:plan.viewMap'), onPress: () => router.push(`/map?planId=${plan.id}`) },
          { icon: 'wallet-outline', label: t('pages:plan.budget'), onPress: () => router.push(`/plan/${plan.id}/budget`) },
          {
            icon: 'people-outline',
            label: t('pages:plan.collaborate'),
            onPress: () => router.push(`/plan/${plan.id}/collaborate`),
          },
        ]}
      />
    </ThemedView>
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
});
