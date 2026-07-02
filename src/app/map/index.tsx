import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Radii, Spacing } from '@/constants/theme';
import { usePins } from '@/hooks/data/use-pins';
import { usePlan } from '@/hooks/data/use-plan';
import { useTheme } from '@/hooks/use-theme';
import { categoryIcon } from '@/mocks/plan-details';
import type { PlaceCategory } from '@/types';

type Marker = {
  id: string;
  title: string;
  city: string;
  category: PlaceCategory;
  imageUrl: string;
  placeId: string | null;
  kind: 'plan' | 'visited';
};

/** id string'inden 0..1 arası deterministik bir "konum" (gerçek harita SDK'sı gelene dek görsel yer tutucu). */
function pseudoPosition(seed: string): { x: number; y: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = Math.abs(h);
  const x = ((a % 83) / 83) * 0.8 + 0.1;
  const y = (((a >> 4) % 71) / 71) * 0.75 + 0.1;
  return { x, y };
}

const CATEGORY_FILTERS: PlaceCategory[] = ['attraction', 'restaurant', 'nature', 'landmark', 'entertainment'];

/**
 * Map (`/map`) — plan durakları + gezilmiş yerler pinli görünüm.
 *
 * Gerçek harita SDK'sı (Mapbox) henüz kurulmadı — bkz. docs/product-plan.md §5.1
 * (native modül, dev build gerektirir). Bu ekran pinleri deterministik bir
 * yer tutucu üzerinde gösterir; tasarım harita entegrasyonuyla değişecek.
 * `?planId=` verilirse o planın durakları, yoksa gezilmiş yerler (mock) gösterilir.
 */
export default function MapScreen() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const { data: plan } = usePlan(planId);
  const { data: pins } = usePins('mine');
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [selected, setSelected] = useState<Marker | null>(null);

  const markers: Marker[] = useMemo(() => {
    if (plan) {
      return plan.days.flatMap((d) =>
        d.items.map((item) => ({
          id: item.id,
          title: item.title,
          city: plan.destinationCity,
          category: item.category,
          imageUrl: item.imageUrl,
          placeId: item.placeId,
          kind: 'plan' as const,
        })),
      );
    }
    return pins.map((p) => ({
      id: p.id,
      title: p.placeName,
      city: p.city,
      category: p.category,
      imageUrl: p.photoUrl,
      placeId: p.placeId,
      kind: 'visited' as const,
    }));
  }, [plan, pins]);

  const visibleMarkers = category ? markers.filter((m) => m.category === category) : markers;
  const mapHeight = 420;

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

      <View style={[styles.mapCanvas, { height: mapHeight, backgroundColor: theme.backgroundElement }]}>
        {visibleMarkers.length === 0 ? (
          <View style={styles.mapEmpty}>
            <Icon name="map-outline" size={32} themeColor="textTertiary" />
            <ThemedText type="small" themeColor="textTertiary">
              {t('pages:map.empty')}
            </ThemedText>
          </View>
        ) : (
          visibleMarkers.map((m) => {
            const pos = pseudoPosition(m.id);
            return (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityLabel={m.title}
                onPress={() => setSelected(m)}
                style={[
                  styles.marker,
                  {
                    left: pos.x * (width - Spacing.three * 2),
                    top: pos.y * mapHeight,
                    backgroundColor: selected?.id === m.id ? theme.primary : theme.card,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Icon
                  name={categoryIcon(m.category)}
                  size={16}
                  color={selected?.id === m.id ? theme.onPrimary : theme.primary}
                />
              </Pressable>
            );
          })
        )}
      </View>

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
        {selected && (
          <Card radius={Radii.lg}>
            <View style={styles.selectedCard}>
              <View style={styles.selectedImage}>
                <CachedImage uri={selected.imageUrl} style={cachedImageStyles.fill} recyclingKey={selected.id} radius={Radii.md} />
              </View>
              <View style={styles.selectedBody}>
                <ThemedText type="h3" numberOfLines={1}>
                  {selected.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  {selected.city}
                </ThemedText>
                {selected.placeId && (
                  <AppButton
                    label={t('pages:plan.openPlace')}
                    fullWidth={false}
                    variant="ghost"
                    onPress={() => router.push(`/place/${selected.placeId}`)}
                  />
                )}
              </View>
            </View>
          </Card>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  subtitle: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
  mapCanvas: { marginHorizontal: Spacing.three, borderRadius: Radii.lg, overflow: 'hidden' },
  mapEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  selectedWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: Spacing.three, paddingTop: Spacing.two },
  selectedCard: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.three },
  selectedImage: { width: 64, height: 64, borderRadius: Radii.md, overflow: 'hidden' },
  selectedBody: { flex: 1, gap: 2 },
});
