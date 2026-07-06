import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/avatar';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { RatingBadge } from '@/components/ui/rating-badge';
import { Radii, Spacing } from '@/constants/theme';
import { usePlace, usePlaceReviews } from '@/hooks/data/use-place';
import { useTheme } from '@/hooks/use-theme';
import { categoryIcon } from '@/mocks/plan-details';

/** Mekân Detayı (`/place/[id]`) — galeri, puan (Tripso + Google), yorumlar, plana ekle. */
export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: place } = usePlace(id);
  const { data: reviews } = usePlaceReviews(id);
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [added, setAdded] = useState(false);

  if (!place) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="h2">{t('pages:place.notFound')}</ThemedText>
        <AppButton label={t('common:goBack')} variant="ghost" fullWidth={false} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const openDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;
    void Linking.openURL(url);
  };

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={place.name}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
          {place.gallery.map((uri) => (
            <View key={uri} style={styles.galleryImage}>
              <CachedImage uri={uri} displayWidth={280} style={cachedImageStyles.fill} recyclingKey={uri} radius={Radii.lg} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.padded}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <View style={styles.categoryRow}>
                <Icon name={categoryIcon(place.category)} size={14} themeColor="primary" />
                <ThemedText type="caption" themeColor="primary">
                  {t(`pages:category.${place.category}`)}
                </ThemedText>
              </View>
              <ThemedText type="h1">{place.name}</ThemedText>
            </View>
          </View>

          <View style={styles.ratingsRow}>
            <View style={styles.ratingBlock}>
              <ThemedText type="caption" themeColor="textTertiary">
                {t('pages:recommendations.tripsoRating')}
              </ThemedText>
              <RatingBadge rating={place.tripsoRating} reviewCount={place.tripsoReviewCount} />
            </View>
            <View style={styles.ratingBlock}>
              <ThemedText type="caption" themeColor="textTertiary">
                {t('pages:recommendations.googleRating')}
              </ThemedText>
              <RatingBadge rating={place.googleRating} reviewCount={place.googleReviewCount} />
            </View>
            <View style={styles.ratingBlock}>
              <ThemedText type="caption" themeColor="textTertiary">
                {t('pages:place.priceLevel')}
              </ThemedText>
              <ThemedText type="small">{'$'.repeat(place.priceLevel)}</ThemedText>
            </View>
          </View>

          <ThemedText type="h3" style={styles.sectionTitle}>
            {t('pages:place.about')}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            {place.description}
          </ThemedText>

          <View style={styles.infoRow}>
            <Icon name="time-outline" size={16} themeColor="textSecondary" />
            <ThemedText type="small" themeColor="textSecondary">
              {t('pages:place.openingHours')}: {place.openingHours}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={16} themeColor="textSecondary" />
            <ThemedText type="small" themeColor="textSecondary">
              {place.address}
            </ThemedText>
          </View>

          <ThemedText type="h3" style={styles.sectionTitle}>
            {t('pages:place.reviews')}
          </ThemedText>
          {reviews.length === 0 ? (
            <ThemedText type="small" themeColor="textTertiary">
              {t('pages:place.noReviews')}
            </ThemedText>
          ) : (
            <View style={styles.reviewList}>
              {reviews.map((r) => (
                <View key={r.id} style={styles.reviewRow}>
                  <Avatar uri={r.authorAvatarUrl} name={r.authorName} size={36} />
                  <View style={styles.reviewBody}>
                    <View style={styles.reviewHeader}>
                      <ThemedText type="smallBold">{r.authorName}</ThemedText>
                      <RatingBadge rating={r.rating} />
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                      {r.comment}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textTertiary">
                      {r.source === 'google' ? t('pages:place.reviewSourceGoogle') : t('pages:place.reviewSourceTripso')}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { borderTopColor: theme.border, backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.two },
        ]}
      >
        <View style={styles.footerRow}>
          <View style={styles.footerBtn}>
            <AppButton
              label={t('pages:place.getDirections')}
              variant="secondary"
              leadingIcon="navigate-outline"
              onPress={openDirections}
            />
          </View>
          <View style={styles.footerBtnGrow}>
            <AppButton
              label={added ? t('pages:place.addedToPlan') : t('pages:place.addToPlan')}
              leadingIcon={added ? 'checkmark' : 'add'}
              onPress={() => setAdded(true)}
              disabled={added}
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  content: { gap: Spacing.three },
  gallery: { gap: Spacing.two, paddingHorizontal: Spacing.three },
  galleryImage: { width: 280, height: 200, borderRadius: Radii.lg, overflow: 'hidden' },
  padded: { paddingHorizontal: Spacing.three, gap: Spacing.two },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  titleLeft: { flex: 1, gap: Spacing.one },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingsRow: { flexDirection: 'row', gap: Spacing.four, marginTop: Spacing.one },
  ratingBlock: { gap: 2 },
  sectionTitle: { marginTop: Spacing.two },
  description: { lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  reviewList: { gap: Spacing.three },
  reviewRow: { flexDirection: 'row', gap: Spacing.two },
  reviewBody: { flex: 1, gap: 2 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: StyleSheet.hairlineWidth, padding: Spacing.four, paddingTop: Spacing.two },
  footerRow: { flexDirection: 'row', gap: Spacing.two },
  footerBtn: { minWidth: 140 },
  footerBtnGrow: { flex: 1 },
});
