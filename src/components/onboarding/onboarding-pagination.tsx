import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * OnboardingPagination — aktif sayfayı gösteren noktalar.
 * Aktif nokta `scrollX`'e göre genişler/parlar (`useAnimatedStyle` + `interpolate`).
 * Animasyon component içinde kapsüllü; ekran sadece `scrollX` paylaşır.
 */
export type OnboardingPaginationProps = {
  count: number;
  /** Yatay scroll offset'i (paylaşılan değer). */
  scrollX: SharedValue<number>;
  /** Nokta rengi (verilmezse temadan). Beyaz onboarding zemini için primary geçilir. */
  color?: string;
};

export function OnboardingPagination({ count, scrollX, color }: OnboardingPaginationProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} scrollX={scrollX} color={color} />
      ))}
    </View>
  );
}

function Dot({ index, scrollX, color }: { index: number; scrollX: SharedValue<number>; color?: string }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color ?? theme.onPrimary, borderRadius: Radii.pill }, style]}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dot: { height: 8 },
});
