import { ImageBackground } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * PromoBanner — Home'daki turuncu/görselli tanıtım bandı.
 * Planlayıcı-odaklı metin ("Plan your next trip"); CTA → trip/new akışı.
 * Görsel verilirse arka plan + scrim; yoksa düz `primary` zemin.
 */
export type PromoBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  imageUrl?: string;
  onPress?: () => void;
};

export function PromoBanner({
  title,
  subtitle,
  ctaLabel = 'Plan a Trip',
  imageUrl,
  onPress,
}: PromoBannerProps) {
  const theme = useTheme();

  const body = (
    <View style={styles.body}>
      <ThemedText type="h2" themeColor="onPrimary">
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText type="small" themeColor="onPrimary" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      )}
      {/* Görsel-amaçlı CTA: dış Pressable zaten tıklamayı yönetiyor; iç içe
          buton (nested <button>) kaçınmak için gerçek buton değil, etiket. */}
      <View style={[styles.cta, { backgroundColor: theme.card }]}>
        <ThemedText type="smallBold" themeColor="text">
          {ctaLabel}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${ctaLabel}`}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
    >
      {imageUrl ? (
        <ImageBackground
          source={{ uri: imageUrl }}
          contentFit="cover"
          style={[styles.banner, { borderRadius: Radii.xl }]}
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay }]} />
          {body}
        </ImageBackground>
      ) : (
        <View style={[styles.banner, { backgroundColor: theme.primary, borderRadius: Radii.xl }]}>
          {body}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: { minHeight: 150, overflow: 'hidden', justifyContent: 'center' },
  body: { padding: Spacing.four, gap: Spacing.two, alignItems: 'flex-start' },
  subtitle: { opacity: 0.9, maxWidth: '80%' },
  cta: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.pill,
  },
});
