import { StyleSheet, View, type ViewProps } from 'react-native';
import { GlassView, type GlassStyle } from 'expo-glass-effect';

import { Radii } from '@/constants/theme';
import { useGlassCapability } from '@/hooks/use-glass-capability';
import { useTheme } from '@/hooks/use-theme';

/**
 * GlassSurface — Expo UI cam yüzey stratejisinin kalbi.
 *
 * - iOS 26+ (Liquid Glass var) → `expo-glass-effect`'in `GlassView`'i ile gerçek
 *   cam efekti (blur + canlılık).
 * - Eski iOS / Android / web → temadan gelen `card` rengiyle düz, ince kenarlıklı
 *   yüzeye düşer. Böylece her platformda şık ve okunaklı kalır.
 *
 * Üstte yüzen kontroller (header, arama kutusu, CTA arka planı) için kullan.
 */
export type GlassSurfaceProps = ViewProps & {
  /** iOS cam yoğunluğu. 'clear' daha şeffaf, 'regular' standart. */
  glassEffectStyle?: GlassStyle;
  /** iOS cam tonu (opsiyonel). */
  tintColor?: string;
  /** Köşe yarıçapı (default: Radii.lg). */
  radius?: number;
  /** Fallback'te kenarlık çizilsin mi? (default: true) */
  bordered?: boolean;
};

export function GlassSurface({
  style,
  glassEffectStyle = 'regular',
  tintColor,
  radius = Radii.lg,
  bordered = true,
  children,
  ...rest
}: GlassSurfaceProps) {
  const theme = useTheme();
  const { isLiquidGlass } = useGlassCapability();

  // iOS 26+ : gerçek cam.
  if (isLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor}
        style={[{ borderRadius: radius, overflow: 'hidden' }, style]}
        {...rest}
      >
        {children}
      </GlassView>
    );
  }

  // Fallback: düz kart yüzeyi + ince kenarlık.
  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: radius,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
          borderColor: theme.border,
          overflow: 'hidden',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
