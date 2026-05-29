import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { GlassSurface } from '@/components/ui/glass-surface';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, type ThemeColor } from '@/constants/theme';
import { useGlassCapability } from '@/hooks/use-glass-capability';
import { useTheme } from '@/hooks/use-theme';

/**
 * IconButton — dairesel ikon buton (back / favorite / share / bell).
 *
 * Detay ekranı hero'su gibi görsel üstünde durması gerektiğinde `glass` ya da
 * `solidOverlay` ile okunur kalır. iOS 26+'da `glass` gerçek cam, değilse yarı
 * saydam koyu zemine düşer.
 *
 * Erişilebilirlik: `accessibilityLabel` ZORUNLU (ikonun anlamı metinle yok).
 */
export type IconButtonProps = Omit<PressableProps, 'style'> & {
  icon: IconName;
  accessibilityLabel: string;
  size?: number;
  /** Dokunma alanı çapı (default: 40). */
  diameter?: number;
  /** İkon tema rengi (default: 'text'). `color` verilirse o öncelikli. */
  themeColor?: ThemeColor;
  color?: string;
  /** iOS 26+'da cam zemin. */
  glass?: boolean;
  /** Görsel üstünde okunurluk için yarı saydam koyu zemin (glass yoksa). */
  solidOverlay?: boolean;
};

export function IconButton({
  icon,
  accessibilityLabel,
  size = 22,
  diameter = 40,
  themeColor,
  color,
  glass = false,
  solidOverlay = false,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();
  const { isLiquidGlass } = useGlassCapability();

  const circle = { width: diameter, height: diameter, borderRadius: Radii.pill };
  const useGlass = glass && isLiquidGlass;

  const inner = (
    <View style={[circle, styles.center]}>
      <Icon name={icon} size={size} themeColor={themeColor} color={color} />
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      {...rest}
    >
      {useGlass ? (
        <GlassSurface radius={Radii.pill} bordered={false}>
          {inner}
        </GlassSurface>
      ) : (
        <View
          style={[
            circle,
            styles.center,
            solidOverlay && { backgroundColor: theme.overlay },
          ]}
        >
          <Icon name={icon} size={size} themeColor={themeColor} color={color} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
