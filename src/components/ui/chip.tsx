import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Chip — seçilebilir kapsül (Home kategori filtreleri: All / Adventure / Beach…).
 *
 * Controlled: seçili durum `selected` prop'undan gelir, tıklama `onPress`'i
 * tetikler (state'i dışarıda tut). Seçiliyken primary zemin + onPrimary metin.
 */
export type ChipProps = Omit<PressableProps, 'children'> & {
  label: string;
  selected?: boolean;
  icon?: IconName;
};

export function Chip({ label, selected = false, icon, ...rest }: ChipProps) {
  const theme = useTheme();

  const bg = selected ? theme.primary : theme.backgroundElement;
  const fg = selected ? theme.onPrimary : theme.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderRadius: Radii.pill, opacity: pressed ? 0.85 : 1 },
      ]}
      {...rest}
    >
      {icon && <Icon name={icon} size={16} color={fg} />}
      <ThemedText type="small" style={[styles.label, { color: fg }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  label: { fontWeight: '600' },
});
