import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * RatingBadge — yıldız + puan (opsiyonel yorum sayısı).
 * Kart üstünde (`onImage`) yarı saydam koyu zeminle okunur kalır.
 */
export type RatingBadgeProps = {
  rating: number;
  reviewCount?: number;
  /** Görsel üstünde mi? → koyu zemin + beyaz metin. */
  onImage?: boolean;
};

export function RatingBadge({ rating, reviewCount, onImage = false }: RatingBadgeProps) {
  const theme = useTheme();

  const textColor: ThemeColor = onImage ? 'onPrimary' : 'text';
  const label = `${rating.toFixed(1)}${reviewCount != null ? ` (${reviewCount})` : ''} rating`;

  return (
    <View
      accessibilityLabel={label}
      style={[
        styles.badge,
        onImage && { backgroundColor: theme.overlay, borderRadius: Radii.sm },
      ]}
    >
      <Icon name="star" size={14} themeColor="star" />
      <ThemedText type="caption" themeColor={textColor} style={styles.value}>
        {rating.toFixed(1)}
      </ThemedText>
      {reviewCount != null && (
        <ThemedText type="caption" themeColor={onImage ? 'onPrimary' : 'textTertiary'}>
          ({reviewCount})
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
  },
  value: { fontWeight: '700' },
});
