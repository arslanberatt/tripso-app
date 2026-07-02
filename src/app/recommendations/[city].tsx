import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Radii, Spacing } from '@/constants/theme';
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        <View style={styles.padded}>
          <ThemedText type="small" themeColor="textSecondary">
            {t('pages:recommendations.subtitle', { city })}
          </ThemedText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.padded, styles.filterRow]}
        >
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

        <View style={[styles.padded, styles.list]}>
          {visible.length === 0 ? (
            <ThemedText type="small" themeColor="textTertiary">
              {t('pages:recommendations.empty')}
            </ThemedText>
          ) : (
            visible.map((r) => {
              const liked = overrides[r.id]?.liked ?? r.likedByMe;
              const saved = overrides[r.id]?.saved ?? r.savedByMe;
              return (
                <Card key={r.id} radius={Radii.lg}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={r.placeName}
                    onPress={() => router.push(`/place/${r.placeId}`)}
                    style={({ pressed }) => [styles.row, { opacity: pressed ? 0.9 : 1 }]}
                  >
                    <View style={styles.imageWrap}>
                      <CachedImage uri={r.imageUrl} style={cachedImageStyles.fill} recyclingKey={r.id} radius={Radii.md} />
                    </View>
                    <View style={styles.body}>
                      <ThemedText type="h3" numberOfLines={1}>
                        {r.placeName}
                      </ThemedText>
                      <View style={styles.ratingRow}>
                        <View style={styles.ratingItem}>
                          <Icon name="star" size={14} themeColor="star" />
                          <ThemedText type="caption" themeColor="textSecondary">
                            {t('pages:recommendations.tripsoRating')} {r.tripsoRating.toFixed(1)}
                          </ThemedText>
                        </View>
                        <View style={styles.ratingItem}>
                          <Icon name="logo-google" size={12} themeColor="textTertiary" />
                          <ThemedText type="caption" themeColor="textSecondary">
                            {r.googleRating.toFixed(1)}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    <View style={styles.actions}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('pages:recommendations.like')}
                        onPress={() => toggleLike(r)}
                        hitSlop={8}
                      >
                        <Icon name={liked ? 'heart' : 'heart-outline'} size={20} themeColor={liked ? 'danger' : 'textSecondary'} />
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('pages:recommendations.save')}
                        onPress={() => toggleSave(r)}
                        hitSlop={8}
                      >
                        <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={20} themeColor={saved ? 'primary' : 'textSecondary'} />
                      </Pressable>
                    </View>
                  </Pressable>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three },
  filterRow: { gap: Spacing.two },
  list: { gap: Spacing.three },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  imageWrap: { width: 72, height: 72, borderRadius: Radii.md, overflow: 'hidden' },
  body: { flex: 1, gap: Spacing.one },
  ratingRow: { flexDirection: 'row', gap: Spacing.three },
  ratingItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actions: { gap: Spacing.two, alignItems: 'center' },
});
