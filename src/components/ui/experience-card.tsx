import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { experienceDuration, experienceTitle } from '@/i18n/content';
import { useTheme } from '@/hooks/use-theme';
import type { Experience } from '@/types';

/**
 * ExperienceCard — Home'daki "Popular Experiences" kartı.
 * Görsel + başlık + süre etiketi (durationLabel). DestinationCard'tan daha
 * kompakt; alt köşede süre overlay'i.
 */
export type ExperienceCardProps = {
  experience: Experience;
  onPress?: (experience: Experience) => void;
  width?: number;
};

export function ExperienceCard({ experience, onPress, width = 160 }: ExperienceCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const title = experienceTitle(experience);
  const duration = experienceDuration(experience);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${duration}`}
      onPress={() => onPress?.(experience)}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.imageWrap, { borderRadius: Radii.lg }]}>
        <CachedImage
          uri={experience.imageUrl}
          recyclingKey={experience.id}
          style={cachedImageStyles.fill}
          accessibilityLabel={t('home:photoA11y', { name: title })}
        />
        <View style={[styles.durationFloat, { backgroundColor: theme.overlay }]}>
          <Icon name="time-outline" size={12} color="#FFFFFF" />
          <ThemedText type="caption" themeColor="onPrimary">
            {duration}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" style={styles.title} numberOfLines={2}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageWrap: { height: 120, overflow: 'hidden' },
  durationFloat: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  title: { paddingTop: Spacing.two, fontWeight: '600' },
});
