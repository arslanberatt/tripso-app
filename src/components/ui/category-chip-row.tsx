import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/constants/theme';
import type { IconName } from '@/components/ui/icon';

/**
 * CategoryChipRow — yatay kaydırılan kategori filtreleri (Home).
 * Controlled: seçili anahtar `selectedKey`, değişim `onSelect(key)` ile dışarıda
 * tutulur. Veri `CATEGORY_FILTERS` mock'undan ({ key, label, icon }) gelir.
 */
export type CategoryFilter = { key: string; label: string; icon: IconName };

export type CategoryChipRowProps = {
  categories: CategoryFilter[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export function CategoryChipRow({ categories, selectedKey, onSelect }: CategoryChipRowProps) {
  const { t } = useTranslation();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((c) => (
        <Chip
          key={c.key}
          // Etiket i18n'den ('home:categories.<key>'); mock label fallback.
          label={t(`home:categories.${c.key}`, { defaultValue: c.label })}
          icon={c.icon}
          selected={c.key === selectedKey}
          onPress={() => onSelect(c.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.two, paddingHorizontal: Spacing.three },
});
