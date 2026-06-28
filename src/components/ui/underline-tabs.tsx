import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * UnderlineTabs — alt çizgili sekme satırı (Keşfet'teki "Planım / Keşfet").
 * Seçili sekme kalın metin + marka renginde alt çizgi alır. Controlled.
 */
export type UnderlineTabsOption = { value: string; label: string };

export type UnderlineTabsProps = {
  options: UnderlineTabsOption[];
  value: string;
  onChange: (value: string) => void;
};

export function UnderlineTabs({ options, value, onChange }: UnderlineTabsProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
            onPress={() => onChange(opt.value)}
            style={styles.item}
          >
            <ThemedText
              type="small"
              themeColor={selected ? 'text' : 'textSecondary'}
              style={{ fontWeight: selected ? '700' : '500' }}
            >
              {opt.label}
            </ThemedText>
            {selected && <View style={[styles.underline, { backgroundColor: theme.primary }]} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three },
  item: { alignItems: 'center', paddingVertical: Spacing.one },
  underline: {
    height: 2,
    alignSelf: 'stretch',
    borderRadius: Radii.pill,
    marginTop: Spacing.one,
  },
});
