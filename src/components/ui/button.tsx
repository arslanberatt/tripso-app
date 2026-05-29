import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlassSurface } from '@/components/ui/glass-surface';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useGlassCapability } from '@/hooks/use-glass-capability';
import { useTheme } from '@/hooks/use-theme';

/**
 * AppButton — uygulamanın tek CTA butonu.
 *
 * Varyantlar:
 *  - `primary`   → turuncu brand zemin (Get Started, Plan a Trip gibi ana aksiyon).
 *  - `secondary` → nötr `backgroundElement` zemin (ikincil aksiyon).
 *  - `ghost`     → zeminsiz, yalnız metin (iptal / "Skip" gibi).
 *
 * iOS 26+'da `glass` prop'u ile zemin gerçek Liquid Glass olur (primary hariç —
 * marka rengi korunur). `loading` sırasında spinner gösterilir ve buton pasifleşir.
 *
 * Erişilebilirlik: `accessibilityRole="button"` otomatik; etiket metinden alınır,
 * gerekirse `accessibilityLabel` ile ezilir.
 */
export type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

export type AppButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: AppButtonVariant;
  /** Metnin solunda ikon. */
  leadingIcon?: IconName;
  /** Metnin sağında ikon. */
  trailingIcon?: IconName;
  /** Yükleniyor → spinner + pasif. */
  loading?: boolean;
  disabled?: boolean;
  /** Satır boyunca genişle (default: true). */
  fullWidth?: boolean;
  /** iOS 26+'da cam zemin kullan (secondary/ghost için anlamlı). */
  glass?: boolean;
};

export function AppButton({
  label,
  variant = 'primary',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  fullWidth = true,
  glass = false,
  accessibilityLabel,
  ...rest
}: AppButtonProps) {
  const theme = useTheme();
  const { isLiquidGlass } = useGlassCapability();
  const isDisabled = disabled || loading;

  // Varyanta göre zemin + metin rengi.
  const palette = {
    primary: { bg: theme.primary, fg: theme.onPrimary },
    secondary: { bg: theme.backgroundElement, fg: theme.text },
    ghost: { bg: 'transparent', fg: theme.primary },
  }[variant];

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {leadingIcon && <Icon name={leadingIcon} size={18} color={palette.fg} />}
          <ThemedText type="small" style={[styles.label, { color: palette.fg }]}>
            {label}
          </ThemedText>
          {trailingIcon && <Icon name={trailingIcon} size={18} color={palette.fg} />}
        </>
      )}
    </View>
  );

  // iOS 26 cam zemin (yalnız non-primary, çünkü primary marka rengini korur).
  const useGlass = glass && isLiquidGlass && variant !== 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={isDisabled}
      style={({ pressed }) => [
        fullWidth && styles.fullWidth,
        { opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
      {...rest}
    >
      {useGlass ? (
        <GlassSurface radius={Radii.pill} style={styles.base} bordered={false}>
          {content}
        </GlassSurface>
      ) : (
        <View style={[styles.base, { backgroundColor: palette.bg, borderRadius: Radii.pill }]}>
          {content}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: { alignSelf: 'stretch' },
  base: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: { fontWeight: '700' },
});
