import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Icon } from '@/components/ui/icon';
import { RatingBadge } from '@/components/ui/rating-badge';
import { Radii, Spacing } from '@/constants/theme';
import { destinationName } from '@/i18n/content';
import type { Destination } from '@/types';

/**
 * DestinationCard — Home'daki yatay scroll kartı ("Top Destinations").
 * Görsel + isim + konum + puan. Tıklama → Destination Detail.
 *
 * Görsel `recyclingKey` ile liste geri-dönüşümünde doğru kalır (expo-image).
 */
export type DestinationCardProps = {
  destination: Destination;
  onPress?: (destination: Destination) => void;
  /** Kart genişliği (yatay listede sabit; default: 220). */
  width?: number;
};

export function DestinationCard({ destination, onPress, width = 220 }: DestinationCardProps) {
  const { t } = useTranslation();
  const name = destinationName(destination);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${destination.region}`}
      onPress={() => onPress?.(destination)}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.imageWrap, { borderRadius: Radii.lg }]}>
        <CachedImage
          uri={destination.imageUrl}
          displayWidth={width}
          recyclingKey={destination.id}
          style={cachedImageStyles.fill}
          accessibilityLabel={t('home:photoA11y', { name })}
        />
        <View style={[styles.ratingFloat]}>
          <RatingBadge rating={destination.rating} onImage />
        </View>
      </View>

      <View style={styles.body}>
        <ThemedText type="h3" numberOfLines={1}>
          {name}
        </ThemedText>
        <View style={styles.location}>
          <Icon name="location-outline" size={14} themeColor="textSecondary" />
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
            {destination.region}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageWrap: { height: 160, overflow: 'hidden' },
  ratingFloat: { position: 'absolute', top: Spacing.two, left: Spacing.two },
  body: { paddingTop: Spacing.two, gap: 2 },
  location: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
});
