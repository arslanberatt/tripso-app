import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/chip';
import { DestinationCard } from '@/components/ui/destination-card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { RemovableChip } from '@/components/ui/removable-chip';
import { SearchInput } from '@/components/ui/search-input';
import { SectionHeader } from '@/components/ui/section-header';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { destinationName, tagLabel } from '@/i18n/content';
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
 * Tüm platformlarda Home'daki arama çubuğuna dokununca `router.push('/search')`
 * ile açılır (web/iOS/Android tutarlı). Tabs içinde GİZLİ bir sekme yerine kök
 * route tercih edildi: gizli sekmeye push web'de çalışmıyordu.
 *
 * Sorgu boşken: son aramalar (kalıcı, silinebilir) + ilgi alanı etiketleri +
 * popüler destinasyonlar. Sorgu varken isim/bölge/şehir/etiket üzerinden filtreler.
 * Arama gönderilince veya bir sonuç açılınca terim geçmişe yazılır.
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
  const results = isSearching ? destinations.filter((d) => matches(d, trimmed)) : destinations;

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        {isSearching ? (
          // ── Sonuçlar ──────────────────────────────────────────────
          results.length > 0 ? (
            <>
              <ThemedText type="small" themeColor="textSecondary">
                {t('home:search.resultsCount', { count: results.length })}
              </ThemedText>
              <View style={styles.list}>
                {results.map((d) => (
                  <Animated.View key={d.id} entering={FadeInDown.duration(220)}>
                    <DestinationCard destination={d} width={cardWidth} onPress={openDestination} />
                  </Animated.View>
                ))}
              </View>
            </>
          ) : (
            <Animated.View entering={FadeIn.duration(220)} style={styles.empty}>
              <Icon name="search-outline" size={40} themeColor="textTertiary" />
              <ThemedText type="h3">{t('home:search.noResultsTitle')}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyMsg}>
                {t('home:search.noResultsMessage', { query: query.trim() })}
              </ThemedText>
            </Animated.View>
          )
        ) : (
          // ── Keşif (sorgu boş) ─────────────────────────────────────
          <Animated.View entering={FadeIn.duration(220)} style={styles.sections}>
            {recents.length > 0 && (
              <View>
                <SectionHeader
                  title={t('home:search.recent')}
                  actionLabel={t('home:search.clear')}
                  onSeeAll={handleClearRecents}
                />
                <View style={styles.chipWrap}>
                  {recents.map((term) => (
                    <RemovableChip
                      key={term}
                      label={term}
                      onPress={() => applyTerm(term)}
                      onRemove={() => handleRemoveRecent(term)}
                      removeAccessibilityLabel={t('home:search.a11y.removeRecent', { term })}
                    />
                  ))}
                </View>
              </View>
            )}

            <View>
              <SectionHeader title={t('home:search.browse')} />
              <View style={styles.chipWrap}>
                {popularTags.map((tag) => {
                  const label = tagLabel(tag);
                  return (
                    <Chip
                      key={tag}
                      label={label}
                      accessibilityLabel={t('home:search.a11y.applySearch', { term: label })}
                      onPress={() => applyTerm(label)}
                    />
                  );
                })}
              </View>
            </View>

            <View>
              <SectionHeader title={t('home:search.suggestions')} />
              <View style={styles.list}>
                {destinations.map((d) => (
                  <DestinationCard
                    key={d.id}
                    destination={d}
                    width={cardWidth}
                    onPress={openDestination}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        )}
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
  sections: { gap: Spacing.four },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  list: { gap: Spacing.four },
  empty: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.five },
  emptyMsg: { textAlign: 'center' },
});
