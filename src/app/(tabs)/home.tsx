import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { CategoryChipRow } from '@/components/ui/category-chip-row';
import { DestinationCard } from '@/components/ui/destination-card';
import { ExperienceCard } from '@/components/ui/experience-card';
import { HomeHeader } from '@/components/ui/home-header';
import { PromoBanner } from '@/components/ui/promo-banner';
import { SearchBarButton } from '@/components/ui/search-bar-button';
import { SectionHeader } from '@/components/ui/section-header';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useCurrentUser } from '@/hooks/data/use-current-user';
import { useDestinations } from '@/hooks/data/use-destinations';
import { useExperiences } from '@/hooks/data/use-experiences';
import { usePreferences } from '@/hooks/use-preferences';
import { CATEGORY_FILTERS } from '@/mocks/destinations';
import type { Destination } from '@/types';

/**
 * Home (`/home`) — keşif ana ekranı.
 *
 * HomeHeader (avatar + selamlama + bildirim) → arama → kategori chip'leri →
 * promo banner → "Top Destinations" (yatay kart listesi) → "Popular Experiences".
 * Kart tıklama Destination Detail'e gider; promo CTA "Plan a Trip" akışına.
 *
 * Veri placeholder hook'lardan gelir (mock); kategori seçimi `useDestinations`'a
 * filtre olarak geçer. TODO(api): arama metni de query param'a bağlanacak.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const { displayName } = usePreferences();
  const [category, setCategory] = useState('all');

  const { data: destinations } = useDestinations(category);
  const { data: experiences } = useExperiences();

  const openDestination = (d: Destination) => router.push(`/destination/${d.id}`);

  return (
    <ThemedView style={styles.fill}>
      <HomeHeader
        name={displayName ?? user.name}
        avatarUri={user.avatarUrl}
        unreadCount={2}
        onPressBell={() => {
          // TODO(nav): bildirimler ekranı (sonraki faz).
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.padded}>
          {/* Arama çubuğu artık inline arama yapmaz → adanmış /search ekranına gider. */}
          <SearchBarButton onPress={() => router.push('/search')} />
        </View>

        <CategoryChipRow categories={CATEGORY_FILTERS} selectedKey={category} onSelect={setCategory} />

        <View style={styles.padded}>
          <PromoBanner
            title={t('home:promo.title')}
            subtitle={t('home:promo.subtitle')}
            ctaLabel={t('home:promo.cta')}
            imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
            onPress={() => router.push('/trip/new')}
          />
        </View>

        <View style={styles.padded}>
          <SectionHeader title={t('home:topDestinations')} onSeeAll={() => {}} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} onPress={openDestination} />
          ))}
        </ScrollView>

        <View style={[styles.padded, styles.sectionGap]}>
          <SectionHeader title={t('home:popularExperiences')} onSeeAll={() => {}} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {experiences.map((e) => (
            <ExperienceCard key={e.id} experience={e} />
          ))}
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingBottom: BottomTabInset + Spacing.four, gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three },
  hList: { gap: Spacing.three, paddingHorizontal: Spacing.three },
  sectionGap: { marginTop: Spacing.two },
});
