import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { RemovableChip } from '@/components/ui/removable-chip';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing } from '@/constants/theme';
import { tagLabel } from '@/i18n/content';

/**
 * SearchSuggestions — arama boşken gösterilen keşif başlığı:
 * son aramalar (silinebilir) + ilgi alanı etiketleri + "popüler" bölüm başlığı.
 * Destinasyon kartlarının kendisi ekranın FlatList'inde akar (sanallaştırma).
 */
export type SearchSuggestionsProps = {
  recents: string[];
  popularTags: string[];
  onApplyTerm: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClearRecents: () => void;
};

export function SearchSuggestions({
  recents,
  popularTags,
  onApplyTerm,
  onRemoveRecent,
  onClearRecents,
}: SearchSuggestionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.sections}>
      {recents.length > 0 && (
        <View>
          <SectionHeader
            title={t('home:search.recent')}
            actionLabel={t('home:search.clear')}
            onSeeAll={onClearRecents}
          />
          <View style={styles.chipWrap}>
            {recents.map((term) => (
              <RemovableChip
                key={term}
                label={term}
                onPress={() => onApplyTerm(term)}
                onRemove={() => onRemoveRecent(term)}
                removeAccessibilityLabel={t('home:search.a11y.removeRecent', { term })}
              />
            ))}
          </View>
        </View>
      )}

      <View>
        <SectionHeader title={t('home:search.browse')} />
        <View style={styles.chipWrap}>
          {popularTags.map((tag) => {
            const label = tagLabel(tag);
            return (
              <Chip
                key={tag}
                label={label}
                accessibilityLabel={t('home:search.a11y.applySearch', { term: label })}
                onPress={() => onApplyTerm(label)}
              />
            );
          })}
        </View>
      </View>

      <SectionHeader title={t('home:search.suggestions')} />
    </View>
  );
}

const styles = StyleSheet.create({
  sections: { gap: Spacing.four },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
