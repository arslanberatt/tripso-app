import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { OnboardingFooter } from '@/components/onboarding/onboarding-footer';
import { OnboardingSlide } from '@/components/onboarding/onboarding-slide';
import { Spacing } from '@/constants/theme';
import { useAppBootstrap } from '@/hooks/use-app-bootstrap';
import { useTheme } from '@/hooks/use-theme';
import { ONBOARDING_SLIDES } from '@/mocks/onboarding';

/**
 * Welcome (`/welcome`) — beyaz zeminli yatay paged onboarding.
 *
 * Sağ üstte "Atla" (skip, son slayt hariç), sol altta geri butonu (ilk slayttan
 * sonra), ortada reanimated noktalar, altta "İleri"/"Başla". Kayma `scrollX`
 * paylaşılan değeriyle takip edilir → noktaları sürer.
 *
 * Auth'a geçmeden önce `completeOnboarding()` ile onboarding-görüldü bayrağı
 * kalıcı yazılır; bir daha açılışta `/welcome` gösterilmez (gate `index.tsx`).
 */
export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const theme = useTheme();
  const { completeOnboarding } = useAppBootstrap();
  const slides = ONBOARDING_SLIDES;

  const scrollX = useSharedValue(0);
  const listRef = useAnimatedRef<Animated.ScrollView>();
  const [index, setIndex] = useState(0);
  const isLast = index >= slides.length - 1;

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goToSlide = (next: number) => {
    listRef.current?.scrollTo({ x: next * width, animated: true });
    setIndex(next);
  };

  const finish = async () => {
    await completeOnboarding(); // onboarding'i "görüldü" işaretle (kalıcı)
    router.replace('/login');
  };

  const handlePrimary = () => {
    if (isLast) {
      void finish();
      return;
    }
    goToSlide(index + 1);
  };

  const handleBack = () => {
    if (index > 0) goToSlide(index - 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Sağ üst: Atla (son slaytta gizli). */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two }]} pointerEvents="box-none">
        {!isLast && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('onboarding:footer.skipA11y')}
            hitSlop={8}
            onPress={() => void finish()}
          >
            <ThemedText type="small" style={[styles.skip, { color: theme.textSecondary }]}>
              {t('onboarding:footer.skip')}
            </ThemedText>
          </Pressable>
        )}
      </View>

      <Animated.ScrollView
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumEnd}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <OnboardingSlide key={slide.key} slide={slide} />
        ))}
      </Animated.ScrollView>

      <View style={styles.footer} pointerEvents="box-none">
        <OnboardingFooter
          count={slides.length}
          scrollX={scrollX}
          isLast={isLast}
          showBack={index > 0}
          onPrimary={handlePrimary}
          onBack={handleBack}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: Spacing.four,
    alignItems: 'flex-end',
  },
  skip: { fontWeight: '700' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
