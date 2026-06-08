import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type OnboardingSlideData = {
  key: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

// Footer (noktalar + Sonraki) için altta bırakılan pay; absolute metin bunun üstünde durur.
const FOOTER_RESERVE = 120;

export function OnboardingSlide({ slide }: { slide: OnboardingSlideData }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();

  const title = t(`content:onboarding.${slide.key}.title`, { defaultValue: slide.title });
  const subtitle = t(`content:onboarding.${slide.key}.subtitle`, {
    defaultValue: slide.subtitle,
  });


  return (
    <View style={[styles.slide, { width }]}>
      <Image
        source={slide.image}
        style={{ width: '100%', height: "100%", marginTop:  - Spacing.five }}
        contentFit="contain"
        transition={250}
        accessibilityLabel={title}
      />

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
  slide: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
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
