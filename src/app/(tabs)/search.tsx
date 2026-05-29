import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DestinationCard } from '@/components/ui/destination-card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SearchInput } from '@/components/ui/search-input';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { destinationName, tagLabel } from '@/i18n/content';
import { useDestinations } from '@/hooks/data/use-destinations';
import type { Destination } from '@/types';

/**
 * Search (`/search`) — adanmış arama ekranı.
 *
 * İki giriş noktası, tek ekran:
 *  - iOS 26: native tab bar'ın `role="search"` sekmesi (bkz. `(tabs)/_layout`).
 *  - iOS 18 / Android / web: Home'daki arama çubuğuna dokununca `router.push`.
 *
 * Sorgu boşken popüler destinasyonları önerir; sorgu varken isim/bölge/şehir/
 * etiket üzerinden filtreler. Tıklama → Destination Detail.
 *
 * TODO(api): mock filtre yerine `usePlaceSearch(query)` (Mapbox) bağlanacak.
 */
export default function SearchScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');

  const { data: destinations } = useDestinations();

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length === 0 ? destinations : destinations.filter((d) => matches(d, trimmed));

  const openDestination = (d: Destination) => router.push(`/destination/${d.id}`);

  // Stack ile push edildiyse geri butonu göster (tab olarak açıldıysa gerekmez).
  const showBack = router.canGoBack();
  const cardWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;

  return (
    <ThemedView style={styles.fill}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        {showBack && (
          <IconButton
            icon="chevron-back"
            accessibilityLabel={t('common:a11y.goBack')}
            themeColor="text"
            onPress={() => router.back()}
          />
        )}
        <View style={styles.searchWrap}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            autoFocus={showBack}
            placeholder={t('home:search.placeholder')}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
      >
        {trimmed.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            {t('home:search.suggestions')}
          </ThemedText>
        ) : results.length > 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            {t('home:search.resultsCount', { count: results.length })}
          </ThemedText>
        ) : (
          <View style={styles.empty}>
            <Icon name="search-outline" size={40} themeColor="textTertiary" />
            <ThemedText type="h3">{t('home:search.noResultsTitle')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyMsg}>
              {t('home:search.noResultsMessage', { query: query.trim() })}
            </ThemedText>
          </View>
        )}

        <View style={styles.list}>
          {results.map((d) => (
            <DestinationCard key={d.id} destination={d} width={cardWidth} onPress={openDestination} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

/** Destinasyonu sorguya karşı eşleştirir (çevrili ad dâhil). */
function matches(d: Destination, q: string): boolean {
  const haystack = [
    destinationName(d),
    d.name,
    d.region,
    d.cityName,
    ...d.tags,
    ...d.tags.map((tag) => tagLabel(tag)),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  searchWrap: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  list: { gap: Spacing.four },
  empty: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.five },
  emptyMsg: { textAlign: 'center' },
});
