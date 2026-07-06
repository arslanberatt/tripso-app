import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import type { CommunityRecommendation } from '@/types';

/**
 * RecommendationCard — "Başkaları Ne Önerdi" satırı: görsel, Tripso + Google
 * puanı yan yana, beğen/kaydet aksiyonları. Gövdeye dokununca mekân detayı.
 */
export type RecommendationCardProps = {
  recommendation: CommunityRecommendation;
  liked: boolean;
  saved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
};

export function RecommendationCard({
  recommendation: r,
  liked,
  saved,
  onToggleLike,
  onToggleSave,
}: RecommendationCardProps) {
  const { t } = useTranslation();

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={r.placeName}
        onPress={() => router.push(`/place/${r.placeId}`)}
        style={({ pressed }) => [styles.row, { opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.imageWrap}>
          <CachedImage
            uri={r.imageUrl}
            displayWidth={72}
            style={cachedImageStyles.fill}
            recyclingKey={r.id}
            radius={Radii.md}
          />
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
            onPress={onToggleLike}
            hitSlop={8}
          >
            <Icon name={liked ? 'heart' : 'heart-outline'} size={20} themeColor={liked ? 'danger' : 'textSecondary'} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('pages:recommendations.save')}
            onPress={onToggleSave}
            hitSlop={8}
          >
            <Icon
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              themeColor={saved ? 'primary' : 'textSecondary'}
            />
          </Pressable>
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  imageWrap: { width: 72, height: 72, borderRadius: Radii.md, overflow: 'hidden' },
  body: { flex: 1, gap: Spacing.one },
  ratingRow: { flexDirection: 'row', gap: Spacing.three },
  ratingItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actions: { gap: Spacing.two, alignItems: 'center' },
});
