import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

/**
 * OnboardingSlide — beyaz zeminli tek tanıtım sayfası.
 *
 * Üstte karakter görseli (`contain`, kırpılmaz), altta ilerleyen başlık + açıklama.
 * Genişlik ekran genişliğine sabitlenir (yatay paged scroll'da her slayt bir
 * sayfa). Tema fark etmeksizin beyaz zemin + koyu metin (görseller beyaz fonlu).
 */
export type OnboardingSlideData = {
  key: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

export function OnboardingSlide({ slide }: { slide: OnboardingSlideData }) {
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();

  // Slayt metni i18n'den çözülür; mock İngilizce metin defaultValue (fallback).
  const title = t(`content:onboarding.${slide.key}.title`, { defaultValue: slide.title });
  const subtitle = t(`content:onboarding.${slide.key}.subtitle`, {
    defaultValue: slide.subtitle,
  });

  return (
    <View style={[styles.slide, { width, height }]}>
      <View style={styles.imageWrap}>
        <Image
          source={slide.image}
          style={styles.image}
          contentFit="contain"
          transition={250}
          accessibilityLabel={title}
        />
      </View>
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, backgroundColor: '#FFFFFF' },
  imageWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.six },
  image: { width: '100%', height: '100%' },
  content: {
    paddingHorizontal: Spacing.four,
    // Footer (dots + Next + back) alta sabit; metni onun üstünde tutacak boşluk.
    paddingBottom: 220,
    gap: Spacing.two,
  },
  title: { color: Colors.light.text, fontSize: 28, lineHeight: 34 },
  subtitle: { color: Colors.light.textSecondary, lineHeight: 22 },
});
