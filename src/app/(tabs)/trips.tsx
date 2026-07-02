import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { BottomTabInset, Radii, Spacing } from '@/constants/theme';
import { useTrips } from '@/hooks/data/use-trips';
import type { Trip, TripStatus } from '@/types';

type Filter = 'all' | TripStatus;

const COVERS: Record<string, string> = {
  ID: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
  JP: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
};
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80';

/**
 * Trips (`/trips`) — kullanıcının gezileri.
 *
 * `useTrips()` mock hook'undan gelir (Trip Sihirbazı'nda oluşturulan planlar da
 * `trip-draft-store` üzerinden burada belirir). Karta dokununca `/plan/[id]`.
 */
export default function TripsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const { data: trips } = useTrips(filter === 'all' ? undefined : filter);

  const filters: Filter[] = ['all', 'planning', 'active', 'completed'];

  return (
    <ThemedView type="backgroundElement" style={styles.fill}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.three }]}
      >
        <View style={styles.padded}>
          <ThemedText type="h1">{t('pages:trips.title')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('pages:trips.subtitle')}
          </ThemedText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.padded, styles.filterRow]}
        >
          {filters.map((f) => (
            <Chip
              key={f}
              label={t(`pages:trips.filters.${f}`)}
              selected={filter === f}
              onPress={() => setFilter(f)}
            />
          ))}
        </ScrollView>

        <View style={[styles.padded, styles.list]}>
          {trips.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="airplane-outline" size={40} themeColor="textTertiary" />
              <ThemedText type="h3">{t('pages:trips.empty')}</ThemedText>
              <AppButton
                label={t('pages:trips.emptyCta')}
                fullWidth={false}
                onPress={() => router.push('/trip/new')}
              />
            </View>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const { t } = useTranslation();
  const travelerCount = trip.travelers.adults + (trip.travelers.children ?? 0) + (trip.travelers.seniors ?? 0);
  const cover = COVERS[trip.destinationCountryCode] ?? DEFAULT_COVER;

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={trip.title ?? trip.destinationCity}
        onPress={() => router.push(`/plan/${trip.id}`)}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.cover}>
          <CachedImage uri={cover} style={cachedImageStyles.fill} recyclingKey={trip.id} />
          <View style={styles.statusBadge}>
            <ThemedText type="caption" themeColor="onPrimary" style={styles.statusText}>
              {t(`pages:trips.filters.${trip.status === 'draft' || trip.status === 'cancelled' ? 'planning' : trip.status}`)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.cardBody}>
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
  fill: { flex: 1 },
  content: { paddingBottom: BottomTabInset + Spacing.four, gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three },
  filterRow: { gap: Spacing.two },
  list: { gap: Spacing.three },
  empty: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.six },
  cover: { height: 140, overflow: 'hidden' },
  statusBadge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  statusText: { fontWeight: '700' },
  cardBody: { padding: Spacing.three, gap: Spacing.one },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  metaGap: { marginLeft: Spacing.two },
});
