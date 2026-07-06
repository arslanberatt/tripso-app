import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/constants/theme';
import type { IconName } from '@/components/ui/icon';

/**
 * ChipGroup — sarmalanan chip ızgarası. Tek/çoklu seçim mantığı dışarıda
 * tutulur; bu bileşen yalnız hangi anahtarların seçili olduğunu bilir.
 */
export type ChipOption = { key: string; label: string; icon?: IconName };

export type ChipGroupProps = {
  options: ChipOption[];
  selectedKeys: string[];
  onSelect: (key: string) => void;
};

export function ChipGroup({ options, selectedKeys, onSelect }: ChipGroupProps) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => (
        <Chip
          key={opt.key}
          label={opt.label}
          icon={opt.icon}
          selected={selectedKeys.includes(opt.key)}
          onPress={() => onSelect(opt.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
