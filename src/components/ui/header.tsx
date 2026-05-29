import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { GlassSurface } from '@/components/ui/glass-surface';
import { Spacing } from '@/constants/theme';

/**
 * Header — generic ekran başlığı (slot tabanlı).
 *
 * `leading` (sol, örn. back butonu) / `title` (orta) / `trailing` (sağ, aksiyonlar)
 * slotları. `home-header` ve `detail-header` bunu kompoze eder.
 *
 * `glass` true ise iOS 26+'da cam zemin (üstte yüzen header). `safeArea` ile
 * `insets.top` kadar üst padding eklenir (çentik/Dynamic Island çakışmasını önler).
 */
export type HeaderProps = {
  leading?: ReactNode;
  title?: string;
  trailing?: ReactNode;
  /** Cam/solid yüzey arka planı (default: false → şeffaf). */
  glass?: boolean;
  /** Üstte `insets.top` boşluğu bırak (default: true). */
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Header({
  leading,
  title,
  trailing,
  glass = false,
  safeArea = true,
  style,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = safeArea ? insets.top : 0;

  const bar = (
    <View style={[styles.bar, { paddingTop }, style]}>
      <View style={styles.side}>{leading}</View>
      {title ? (
        <ThemedText type="h3" numberOfLines={1} style={styles.title}>
          {title}
        </ThemedText>
      ) : (
        <View style={styles.title} />
      )}
      <View style={[styles.side, styles.trailing]}>{trailing}</View>
    </View>
  );

  if (glass) {
    return (
      <GlassSurface radius={0} bordered={false}>
        {bar}
      </GlassSurface>
    );
  }
  return bar;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    minHeight: 44,
  },
  side: { minWidth: 44, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  trailing: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
});
