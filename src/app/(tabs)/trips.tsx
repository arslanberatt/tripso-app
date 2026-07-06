import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TripCard } from '@/components/trips/trip-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTrips } from '@/hooks/data/use-trips';
import type { TripStatus } from '@/types';

type Filter = 'all' | TripStatus;

const FILTERS: Filter[] = ['all', 'planning', 'active', 'completed'];

/**
 * Trips (`/trips`) — kullanıcının gezileri (FlatList ile sanallaştırılmış).
 * Sihirbazda oluşturulan planlar `trip-draft-store` üzerinden burada belirir.
 */
export default function TripsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const { data: trips } = useTrips(filter === 'all' ? undefined : filter);

  return (
    <ThemedView type="backgroundElement" style={styles.fill}>
      <FlatList
        data={trips}
        keyExtractor={(trip) => trip.id}
        renderItem={({ item }) => <TripCard trip={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.three }]}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="h1">{t('pages:trips.title')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('pages:trips.subtitle')}
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {FILTERS.map((f) => (
                <Chip
                  key={f}
                  label={t(`pages:trips.filters.${f}`)}
                  selected={filter === f}
                  onPress={() => setFilter(f)}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="airplane-outline" size={40} themeColor="textTertiary" />
            <ThemedText type="h3">{t('pages:trips.empty')}</ThemedText>
            <AppButton
              label={t('pages:trips.emptyCta')}
              fullWidth={false}
              onPress={() => router.push('/trip/new')}
            />
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  header: { gap: Spacing.one },
  filterRow: { gap: Spacing.two, paddingTop: Spacing.two },
  empty: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.six },
});
