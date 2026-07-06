import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import type { Trip } from '@/types';

/** Ülke koduna göre kapak görseli (mock; API kapak URL'i dönene kadar). */
const COVERS: Record<string, string> = {
  ID: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
  JP: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
};
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80';

/** TripCard — Trips listesindeki gezi kartı; tıklayınca `/plan/[id]`. */
export function TripCard({ trip }: { trip: Trip }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const travelerCount =
    trip.travelers.adults + (trip.travelers.children ?? 0) + (trip.travelers.seniors ?? 0);
  const cover = COVERS[trip.destinationCountryCode] ?? DEFAULT_COVER;
  const statusKey =
    trip.status === 'draft' || trip.status === 'cancelled' ? 'planning' : trip.status;

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={trip.title ?? trip.destinationCity}
        onPress={() => router.push(`/plan/${trip.id}`)}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.cover}>
          <CachedImage uri={cover} displayWidth={width} style={cachedImageStyles.fill} recyclingKey={trip.id} />
          <View style={styles.statusBadge}>
            <ThemedText type="caption" themeColor="onPrimary" style={styles.statusText}>
              {t(`pages:trips.filters.${statusKey}`)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText type="h3" numberOfLines={1}>
            {trip.title ?? trip.destinationCity}
          </ThemedText>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={14} themeColor="textSecondary" />
            <ThemedText type="caption" themeColor="textSecondary">
              {trip.destinationCity}
            </ThemedText>
          </View>
          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={14} themeColor="textSecondary" />
            <ThemedText type="caption" themeColor="textSecondary">
              {trip.startDate} → {trip.endDate}
            </ThemedText>
            <View style={[styles.metaRow, styles.metaGap]}>
              <Icon name="people-outline" size={14} themeColor="textSecondary" />
              <ThemedText type="caption" themeColor="textSecondary">
                {t('pages:trips.card.travelers', { count: travelerCount })}
              </ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  cover: { height: 140, overflow: 'hidden' },
  statusBadge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.5)', // görsel üstü scrim — temadan bağımsız okunurluk
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  statusText: { fontWeight: '700' },
  body: { padding: Spacing.three, gap: Spacing.one },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  metaGap: { marginLeft: Spacing.two },
});
