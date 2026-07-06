import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { DetailHeader } from '@/components/ui/detail-header';
import { HighlightItem } from '@/components/ui/highlight-item';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { AppButton } from '@/components/ui/button';
import { RatingBadge } from '@/components/ui/rating-badge';
import { Tag } from '@/components/ui/tag';
import { Radii, Spacing } from '@/constants/theme';
import { destinationDescription, destinationName, highlightLabel, tagLabel } from '@/i18n/content';
import { useTheme } from '@/hooks/use-theme';
import { useDestination } from '@/hooks/data/use-destination';

const HERO_HEIGHT = 360;

/**
 * Destination Detail (`/destination/[id]`).
 *
 * Hero görsel + üzerinde scroll'a duyarlı `DetailHeader` (şeffaf → cam/solid).
 * Scroll offset'i `scrollY` paylaşılan değeriyle header'a verilir. Altta sabit
 * "Plan a Trip Here" CTA → trip/new (şehir/ülke prefill mock).
 *
 * Veri `useDestination(id)` mock'undan; bulunamazsa basit boş durum.
 */
export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: destination } = useDestination(id);
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const scrollY = useSharedValue(0);
  const [favorite, setFavorite] = useState(false);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  if (!destination) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="h2">{t('home:detail.notFound')}</ThemedText>
        <AppButton
          label={t('common:goBack')}
          variant="ghost"
          fullWidth={false}
          onPress={() => router.back()}
        />
      </ThemedView>
    );
  }

  const name = destinationName(destination);

  const planTrip = () =>
    // TODO(nav): prefill — şehir/ülke trip/new'e param olarak geçecek.
    router.push(`/trip/new?city=${encodeURIComponent(destination.cityName)}&country=${destination.countryCode}`);

  return (
    <ThemedView style={styles.fill}>
      <DetailHeader
        scrollY={scrollY}
        title={name}
        onBack={() => router.back()}
        trailing={
          <>
            <IconButton
              icon={favorite ? 'heart' : 'heart-outline'}
              accessibilityLabel={
                favorite ? t('home:detail.a11y.removeFavorite') : t('home:detail.a11y.addFavorite')
              }
              solidOverlay
              color={favorite ? theme.danger : '#FFFFFF'}
              onPress={() => setFavorite((f) => !f)}
            />
            <IconButton
              icon="share-outline"
              accessibilityLabel={t('home:detail.a11y.share')}
              solidOverlay
              color="#FFFFFF"
              onPress={() => {
                // TODO: react-native Share.share(...)
              }}
            />
          </>
        }
      />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        {/* Hero — alta doğru zemin rengine eriyen "bulutsu" degrade; alttaki içerik
            sayfayla birleşik görünsün. Gövde z-index olarak fotoğrafın üstünde. */}
        <View style={{ height: HERO_HEIGHT, width }}>
          <CachedImage
            uri={destination.imageUrl}
            displayWidth={width}
            style={cachedImageStyles.fill}
            accessibilityLabel={t('home:photoA11y', { name })}
          />
          <LinearGradient
            colors={['transparent', 'transparent', theme.background]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </View>

        <View style={[styles.body, { backgroundColor: theme.background }]}>
          {/* Başlık + konum + puan */}
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <ThemedText type="h1">{name}</ThemedText>
              <View style={styles.location}>
                <Icon name="location-outline" size={16} themeColor="textSecondary" />
                <ThemedText type="small" themeColor="textSecondary">
                  {destination.cityName}, {destination.region}
                </ThemedText>
              </View>
            </View>
            <RatingBadge rating={destination.rating} reviewCount={destination.reviewCount} />
          </View>

          {/* Etiketler */}
          <View style={styles.tags}>
            {destination.tags.map((tag) => (
              <Tag key={tag} label={tagLabel(tag)} />
            ))}
          </View>

          {/* Açıklama */}
          <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
            {destinationDescription(destination)}
          </ThemedText>

          {/* Öne çıkanlar */}
          <ThemedText type="h3" style={styles.highlightsTitle}>
            {t('home:detail.highlights')}
          </ThemedText>
          <View style={styles.highlights}>
            {destination.highlights.map((h) => (
              <HighlightItem key={h.label} icon={h.icon} label={highlightLabel(h.label)} />
            ))}
          </View>

          <AppButton
            label={t('pages:recommendations.title')}
            leadingIcon="people-outline"
            variant="secondary"
            onPress={() => router.push(`/recommendations/${encodeURIComponent(destination.cityName)}`)}
          />
        </View>
      </Animated.ScrollView>

      {/* Sabit CTA */}
      <View
        style={[
          styles.cta,
          { paddingBottom: insets.bottom + Spacing.two, backgroundColor: theme.background, borderTopColor: theme.border },
        ]}
      >
        <AppButton label={t('home:detail.planCta')} leadingIcon="map-outline" onPress={planTrip} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
    // Hero'nun alt kısmıyla örtüşür; degradeyle birlikte kesintisiz geçiş verir.
    marginTop: -Spacing.five,
    zIndex: 1,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.two },
  titleLeft: { flex: 1, gap: Spacing.one },
  location: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  description: { lineHeight: 24 },
  highlightsTitle: { marginTop: Spacing.two },
  highlights: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
