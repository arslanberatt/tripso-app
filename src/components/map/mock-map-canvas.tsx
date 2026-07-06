import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { categoryIcon } from '@/mocks/plan-details';
import type { PlaceCategory } from '@/types';

export type MapMarker = {
  id: string;
  title: string;
  city: string;
  category: PlaceCategory;
  imageUrl: string;
  placeId: string | null;
  kind: 'plan' | 'visited';
};

/** id string'inden 0..1 arası deterministik "konum" (Mapbox gelene dek yer tutucu). */
function pseudoPosition(seed: string): { x: number; y: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = Math.abs(h);
  return { x: ((a % 83) / 83) * 0.8 + 0.1, y: (((a >> 4) % 71) / 71) * 0.75 + 0.1 };
}

const CANVAS_HEIGHT = 420;

/**
 * MockMapCanvas — pinleri deterministik yer tutucu tuval üzerinde gösterir.
 * Gerçek harita SDK'sı (Mapbox, dev build gerektirir) gelince aynı props'la değişecek.
 */
export function MockMapCanvas({
  markers,
  selectedId,
  onSelect,
}: {
  markers: MapMarker[];
  selectedId: string | null;
  onSelect: (marker: MapMarker) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.canvas, { height: CANVAS_HEIGHT, backgroundColor: theme.backgroundElement }]}>
      {markers.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="map-outline" size={32} themeColor="textTertiary" />
          <ThemedText type="small" themeColor="textTertiary">
            {t('pages:map.empty')}
          </ThemedText>
        </View>
      ) : (
        markers.map((m) => {
          const pos = pseudoPosition(m.id);
          const selected = selectedId === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityLabel={m.title}
              onPress={() => onSelect(m)}
              style={[
                styles.marker,
                {
                  left: pos.x * (width - Spacing.three * 2),
                  top: pos.y * CANVAS_HEIGHT,
                  backgroundColor: selected ? theme.primary : theme.card,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Icon name={categoryIcon(m.category)} size={16} color={selected ? theme.onPrimary : theme.primary} />
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { marginHorizontal: Spacing.three, borderRadius: Radii.lg, overflow: 'hidden' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
