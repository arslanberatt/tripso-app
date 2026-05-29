/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    // --- Tripso eklenenler (light) ---
    primary: '#FF7A1A', // turuncu brand / ana CTA
    onPrimary: '#FFFFFF', // primary üstündeki metin/ikon
    card: '#FFFFFF', // kart yüzeyi
    border: '#E6E8EB', // ince ayraç / kenarlık
    star: '#F5A623', // puan yıldızı
    textTertiary: '#9096A0', // en soluk metin (ipucu, meta)
    overlay: 'rgba(0,0,0,0.35)', // hero görsel scrim'i
    danger: '#E5484D', // hata / yıkıcı aksiyon
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    // --- Tripso eklenenler (dark) — light ile AYNI key seti olmalı ---
    primary: '#FF8A33',
    onPrimary: '#FFFFFF',
    card: '#1A1B1E',
    border: '#2A2D31',
    star: '#FFB938',
    textTertiary: '#7C828C',
    overlay: 'rgba(0,0,0,0.45)',
    danger: '#FF6369',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Köşe yarıçapı ölçeği. Kart/buton/chip yuvarlaklığında bu sabitleri kullan
 * (sabit sayı yazma). `pill` tam yuvarlak (kapsül) içindir.
 */
export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Platforma duyarlı gölgeler. Native'de shadow/elevation, web'de boxShadow.
 * Kullanım: `style={[styles.card, Shadows.card]}`.
 */
export const Shadows = {
  card:
    Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      },
    }) ?? {},
} as const;
