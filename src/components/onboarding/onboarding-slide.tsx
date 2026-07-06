import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type OnboardingSlideData = {
  key: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

// Footer (noktalar + Sonraki) için altta bırakılan pay; metin bloğu bunun üstünde durur.
const FOOTER_RESERVE = 120;

/**
 * Artwork paneli HER TEMADA beyazdır: onboarding görsellerinin beyaz zemini
 * dosyanın içine gömülü (şeffaflaştırılamaz — degrade kenarlar key'lenemez).
 * Dark modda görseli siyah zemine basmak yerine bilinçli açık panel gösterilir;
 * tasarımcı şeffaf zeminli asset üretirse bu sabit kaldırılabilir.
 */
const ART_SURFACE = '#FFFFFF';

export function OnboardingSlide({ slide }: { slide: OnboardingSlideData }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();

  const title = t(`content:onboarding.${slide.key}.title`, { defaultValue: slide.title });
  const subtitle = t(`content:onboarding.${slide.key}.subtitle`, {
    defaultValue: slide.subtitle,
  });

  // Üstte artwork paneli, altta temalı metin alanı (footer payının üstünde).
  const artHeight = height * 0.62;

  return (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.artPanel, { height: artHeight, backgroundColor: ART_SURFACE }]}>
        <Image
          source={slide.image}
          style={styles.artImage}
          contentFit="contain"
          transition={250}
          accessibilityLabel={title}
        />
      </View>

      <View style={[styles.content, { bottom: FOOTER_RESERVE + insets.bottom }]}>
        <ThemedText type="h1" style={[styles.title, { color: theme.text }]}>
          {title}
        </ThemedText>
        <ThemedText type="default" style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' },
  artPanel: {
    borderBottomLeftRadius: Radii.xl,
    borderBottomRightRadius: Radii.xl,
    overflow: 'hidden',
    paddingTop: Spacing.four,
  },
  artImage: { width: '100%', height: '100%' },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    alignItems: 'center',
  },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '600', textAlign: 'center' },
  subtitle: { lineHeight: 22, textAlign: 'center' },
});
