import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { GlassSurface } from '@/components/ui/glass-surface';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * DetailHeader — Destination Detail hero'su üzerinde yüzen başlık.
 *
 * Scroll ile yumuşak geçiş: en üstte ŞEFFAF (ikonlar görsel üstünde overlay),
 * aşağı kaydırınca cam/solid zemin + başlık belirir. Geçiş `scrollY` paylaşılan
 * değerinden `useAnimatedStyle` + `interpolate` ile sürülür (animasyon component
 * içinde kapsüllü; reusable kalır).
 *
 * `insets.top` ile çentik altına hizalanır. Sol back, sağ favorite/share slotu.
 */
export type DetailHeaderProps = {
  /** Hero ScrollView'ın dikey offset'i (paylaşılan değer). */
  scrollY: SharedValue<number>;
  title: string;
  /** Zemin tam belirginleşmeden önce kaydırılacak mesafe (px). */
  threshold?: number;
  onBack?: () => void;
  /** Sağdaki aksiyon(lar) — favorite/share IconButton'ları. */
  trailing?: ReactNode;
};

export function DetailHeader({
  scrollY,
  title,
  threshold = 220,
  onBack,
  trailing,
}: DetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Zemin + başlık opaklığı: [0 → threshold] arası 0 → 1.
  const surfaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, threshold], [0, 1], Extrapolation.CLAMP),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [threshold * 0.6, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} pointerEvents="box-none">
      {/* Belirginleşen cam/solid zemin (altta). */}
      <Animated.View style={[StyleSheet.absoluteFill, surfaceStyle]} pointerEvents="none">
        <GlassSurface radius={0} bordered={false} style={StyleSheet.absoluteFill}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.card, opacity: 0.6 }]} />
        </GlassSurface>
      </Animated.View>

      <View style={styles.bar}>
        <IconButton
          icon="chevron-back"
          accessibilityLabel="Go back"
          solidOverlay
          color="#FFFFFF"
          onPress={onBack}
        />
        <Animated.View style={[styles.titleWrap, titleStyle]} pointerEvents="none">
          <ThemedText type="h3" numberOfLines={1}>
            {title}
          </ThemedText>
        </Animated.View>
        <View style={styles.trailing}>{trailing}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
