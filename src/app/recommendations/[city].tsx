import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecommendationCard } from '@/components/recommendations/recommendation-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/chip';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { useRecommendations } from '@/hooks/data/use-recommendations';
import { categoryIcon } from '@/mocks/plan-details';
import type { CommunityRecommendation, PlaceCategory } from '@/types';

const CATEGORIES: PlaceCategory[] = ['restaurant', 'attraction', 'entertainment', 'landmark', 'nature'];

/** Başkaları Ne Önerdi (`/recommendations/[city]`) — şehir bazlı topluluk önerileri. */
export default function RecommendationsScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();
  const { data: recommendations } = useRecommendations(city);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [overrides, setOverrides] = useState<Record<string, { liked?: boolean; saved?: boolean }>>({});

  const toggleLike = (r: CommunityRecommendation) =>
    setOverrides((prev) => ({ ...prev, [r.id]: { ...prev[r.id], liked: !(prev[r.id]?.liked ?? r.likedByMe) } }));
  const toggleSave = (r: CommunityRecommendation) =>
    setOverrides((prev) => ({ ...prev, [r.id]: { ...prev[r.id], saved: !(prev[r.id]?.saved ?? r.savedByMe) } }));

  const visible = category ? recommendations.filter((r) => r.category === category) : recommendations;

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:recommendations.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <FlatList
        data={visible}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <RecommendationCard
            recommendation={item}
            liked={overrides[item.id]?.liked ?? item.likedByMe}
            saved={overrides[item.id]?.saved ?? item.savedByMe}
            onToggleLike={() => toggleLike(item)}
            onToggleSave={() => toggleSave(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <ThemedText type="small" themeColor="textSecondary">
              {t('pages:recommendations.subtitle', { city })}
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              <Chip label={t('pages:map.filterAll')} selected={category === null} onPress={() => setCategory(null)} />
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={t(`pages:category.${c}`)}
                  icon={categoryIcon(c)}
                  selected={category === c}
                  onPress={() => setCategory(c)}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <ThemedText type="small" themeColor="textTertiary">
            {t('pages:recommendations.empty')}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  headerContent: { gap: Spacing.three },
  filterRow: { gap: Spacing.two },
});
