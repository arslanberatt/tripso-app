import { StyleSheet, View, type ViewProps } from 'react-native';

import { GlassSurface } from '@/components/ui/glass-surface';
import { Radii, Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Card — yuvarlatılmış içerik yüzeyi.
 *
 * Varsayılan: temadan `card` rengi + yumuşak gölge. `glass` ile iOS 26+'da
 * Liquid Glass yüzeye döner (üstte yüzen paneller için). İçerik padding'i
 * dışarıdan verilir (esneklik için zorlamıyoruz).
 */
export type CardProps = ViewProps & {
  radius?: number;
  /** iOS 26+'da cam yüzey kullan. */
  glass?: boolean;
  /** Gölge ekle (default: true; glass'ta otomatik kapanır). */
  elevated?: boolean;
};

export function Card({
  style,
  radius = Radii.lg,
  glass = false,
  elevated = true,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();

  if (glass) {
    return (
      <GlassSurface radius={radius} style={style} {...rest}>
        {children}
      </GlassSurface>
    );
  }

  return (
    <View
      style={[
        { backgroundColor: theme.card, borderRadius: radius, overflow: 'hidden' },
        elevated && Shadows.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export const cardStyles = StyleSheet.create({
  fill: { flex: 1 },
});
