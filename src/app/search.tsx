import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchSuggestions } from '@/components/search/search-suggestions';
import { matchesQuery } from '@/components/search/destination-matcher';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DestinationCard } from '@/components/ui/destination-card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SearchInput } from '@/components/ui/search-input';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useDestinations } from '@/hooks/data/use-destinations';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from '@/storage/app-storage';
import type { Destination } from '@/types';

/**
 * Search (`/search`) — adanmış arama ekranı (kök stack route, tabs ÜSTÜNDE).
 *
 * Liste FlatList ile sanallaştırılır; boş sorguda öneri başlığı
 * (`SearchSuggestions`) `ListHeaderComponent` olarak akar. Sorgu varken
 * isim/bölge/şehir/etiket üzerinden filtreler (`matchesQuery`).
 *
 * TODO(api): mock filtre yerine `usePlaceSearch(query)` (Mapbox) bağlanacak.
 */
export default function SearchScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<string[]>([]);

  const { data: destinations } = useDestinations();

  // Mount'ta arama geçmişini yükle.
  useEffect(() => {
    let active = true;
    void (async () => {
      const stored = await getRecentSearches();
      if (active) setRecents(stored);
    })();
    return () => {
      active = false;
    };
  }, []);

  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;
  const results = isSearching ? destinations.filter((d) => matchesQuery(d, trimmed)) : destinations;

  // İlgi alanı etiketleri: tüm destinasyon etiketlerinin tekilleştirilmiş listesi.
  const popularTags = Array.from(new Set(destinations.flatMap((d) => d.tags))).slice(0, 8);

  // Geçmişe yaz + state'i güncelle (en yeni başta).
  const persist = (term: string) => {
    void (async () => {
      const next = await addRecentSearch(term);
      setRecents(next);
    })();
  };

  const submit = () => {
    if (trimmed.length > 0) persist(query);
  };

  const openDestination = (d: Destination) => {
    if (trimmed.length > 0) persist(query);
    router.push(`/destination/${d.id}`);
  };

  const applyTerm = (term: string) => {
    setQuery(term);
    persist(term);
  };

  const handleRemoveRecent = (term: string) => {
    void (async () => {
      const next = await removeRecentSearch(term);
      setRecents(next);
    })();
  };

  const handleClearRecents = () => {
    void (async () => {
      await clearRecentSearches();
      setRecents([]);
    })();
  };

  const cardWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;

  return (
    <ThemedView style={styles.fill}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <IconButton
          icon="chevron-back"
          accessibilityLabel={t('common:a11y.goBack')}
          themeColor="text"
          onPress={() => router.back()}
        />
        <View style={styles.searchWrap}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit}
            autoFocus
            placeholder={t('home:search.placeholder')}
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <DestinationCard destination={item} width={cardWidth} onPress={openDestination} />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        ListHeaderComponent={
          isSearching ? (
            <ThemedText type="small" themeColor="textSecondary">
              {t('home:search.resultsCount', { count: results.length })}
            </ThemedText>
          ) : (
            <SearchSuggestions
              recents={recents}
              popularTags={popularTags}
              onApplyTerm={applyTerm}
              onRemoveRecent={handleRemoveRecent}
              onClearRecents={handleClearRecents}
            />
          )
        }
        ListEmptyComponent={
          <Animated.View entering={FadeIn.duration(220)} style={styles.empty}>
            <Icon name="search-outline" size={40} themeColor="textTertiary" />
            <ThemedText type="h3">{t('home:search.noResultsTitle')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyMsg}>
              {t('home:search.noResultsMessage', { query: query.trim() })}
            </ThemedText>
          </Animated.View>
        }
      />
    </ThemedView>
  );
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
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  empty: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.five },
  emptyMsg: { textAlign: 'center' },
});
