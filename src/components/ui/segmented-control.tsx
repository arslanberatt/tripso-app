import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * SegmentedControl — birkaç seçenek arasından tek seçim (tema/dil ayarı gibi).
 * Seçili segment `primary` zeminle vurgulanır. Tipi jenerik (`T extends string`).
 */
export type SegmentOption<T extends string> = { value: T; label: string };

export type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundElement, borderRadius: Radii.md }]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              { borderRadius: Radii.sm },
              selected && { backgroundColor: theme.primary },
            ]}
          >
            <ThemedText
              type="small"
              style={[styles.label, { color: selected ? theme.onPrimary : theme.textSecondary }]}
              numberOfLines={1}
            >
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', padding: Spacing.half, gap: Spacing.half },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.two },
  label: { fontWeight: '600' },
});
