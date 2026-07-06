import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MockMapCanvas, type MapMarker } from '@/components/map/mock-map-canvas';
import { SelectedMarkerCard } from '@/components/map/selected-marker-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/chip';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { usePins } from '@/hooks/data/use-pins';
import { usePlan } from '@/hooks/data/use-plan';
import { categoryIcon } from '@/mocks/plan-details';
import type { PlaceCategory } from '@/types';

const CATEGORY_FILTERS: PlaceCategory[] = ['attraction', 'restaurant', 'nature', 'landmark', 'entertainment'];

/**
 * Map (`/map`) — `?planId=` verilirse o planın durakları, yoksa gezilmiş
 * yerler (mock). Tuval `MockMapCanvas`; Mapbox entegrasyonu ayrı iş
 * (bkz. docs/product-plan.md §5.1 — dev build gerektirir).
 */
export default function MapScreen() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const { data: plan } = usePlan(planId);
  const { data: pins } = usePins('mine');
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [selected, setSelected] = useState<MapMarker | null>(null);

  const markers: MapMarker[] = plan
    ? plan.days.flatMap((d) =>
        d.items.map((item) => ({
          id: item.id,
          title: item.title,
          city: plan.destinationCity,
          category: item.category,
          imageUrl: item.imageUrl,
          placeId: item.placeId,
          kind: 'plan' as const,
        })),
      )
    : pins.map((p) => ({
        id: p.id,
        title: p.placeName,
        city: p.city,
        category: p.category,
        imageUrl: p.photoUrl,
        placeId: p.placeId,
        kind: 'visited' as const,
      }));

  const visibleMarkers = category ? markers.filter((m) => m.category === category) : markers;

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:map.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        {t('pages:map.subtitle', { count: visibleMarkers.length })}
      </ThemedText>

      <MockMapCanvas markers={visibleMarkers} selectedId={selected?.id ?? null} onSelect={setSelected} />

      <View style={styles.filterRow}>
        <Chip label={t('pages:map.filterAll')} selected={category === null} onPress={() => setCategory(null)} />
        {CATEGORY_FILTERS.map((c) => (
          <Chip
            key={c}
            label={t(`pages:category.${c}`)}
            icon={categoryIcon(c)}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </View>

      <View style={[styles.selectedWrap, { paddingBottom: insets.bottom + Spacing.three }]}>
        {selected && <SelectedMarkerCard marker={selected} />}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  subtitle: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  selectedWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: Spacing.three, paddingTop: Spacing.two },
});
