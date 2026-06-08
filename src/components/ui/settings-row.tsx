import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * SettingsRow — ayarlar listelerindeki tek satır.
 *
 * Sol ikon + etiket, sağda opsiyonel aksesuar: değer metni (`value`), serbest
 * `trailing` (örn. Switch/QR butonu) ve/veya chevron. `SettingsGroup` içinde
 * kullanıldığında satırlar arası ince ayraç için `divider` verilir.
 */
export type SettingsRowProps = {
  icon: IconName;
  label: string;
  /** İkon tema rengi (default: 'text'; örn. 'danger'). */
  iconColor?: ThemeColor;
  /** Etiket tema rengi (default: 'text'; örn. 'danger'). */
  labelColor?: ThemeColor;
  /** Sağda gösterilen ikincil metin (örn. seçili dil). */
  value?: string;
  /** Sağda serbest içerik (Switch, IconButton vb.). */
  trailing?: ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  /** Alt ince ayraç (gruptaki son satır hariç). */
  divider?: boolean;
  disabled?: boolean;
};

export function SettingsRow({
  icon,
  label,
  iconColor = 'text',
  labelColor = 'text',
  value,
  trailing,
  showChevron = false,
  onPress,
  onLongPress,
  divider = false,
  disabled = false,
}: SettingsRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      disabled={disabled || (!onPress && !onLongPress)}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.row,
        divider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
        { opacity: pressed && onPress ? 0.6 : 1 },
      ]}
    >
      <Icon name={icon} size={22} themeColor={iconColor} />
      <ThemedText type="small" themeColor={labelColor} numberOfLines={1} style={styles.label}>
        {label}
      </ThemedText>
      {value !== undefined && (
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {value}
        </ThemedText>
      )}
      {trailing}
      {showChevron && <Icon name="chevron-forward" size={18} themeColor="textTertiary" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 52,
  },
  label: { flex: 1, fontWeight: '600' },
});
