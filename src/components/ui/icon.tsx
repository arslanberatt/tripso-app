import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { useTheme } from '@/hooks/use-theme';
import type { ThemeColor } from '@/constants/theme';

/**
 * Icon — uygulamanın TEK ikon sistemi (Ionicons, `@expo/vector-icons`).
 * iOS/Android/web hepsinde aynı şekilde çalışır.
 *
 * Not: Saf iOS "SF Symbols" görünümü istersen `expo-symbols`'ın `SymbolView`'i
 * de kurulu (yalnızca iOS); bu component tutarlılık + cross-platform için Ionicons
 * kullanır. İkon adları: https://icons.expo.fyi (Ionicons sekmesi).
 */
export type IconName = ComponentProps<typeof Ionicons>['name'];

export type IconProps = {
  name: IconName;
  size?: number;
  /** Tema renk anahtarı (örn. 'text', 'primary'). `color` verilirse o öncelikli. */
  themeColor?: ThemeColor;
  /** Doğrudan renk değeri (tema dışı, örn. beyaz overlay ikon). */
  color?: string;
};

export function Icon({ name, size = 24, themeColor = 'text', color }: IconProps) {
  const theme = useTheme();
  return <Ionicons name={name} size={size} color={color ?? theme[themeColor]} />;
}
