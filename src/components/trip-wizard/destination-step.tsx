import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { StepHeading } from '@/components/wizard/step-heading';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SearchInput } from '@/components/ui/search-input';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PlaceSearchResultVM } from '@/mocks/place-search';

/**
 * DestinationStep — API destekli autocomplete; kullanıcı yalnızca listeden
 * seçim yapar (serbest metin destinasyon yok — bkz. product-plan.md §3.1).
 */
export type DestinationStepProps = {
  query: string;
  setQuery: (v: string) => void;
  results: PlaceSearchResultVM[];
  destination: PlaceSearchResultVM | null;
  onSelect: (d: PlaceSearchResultVM) => void;
  onClear: () => void;
};

export function DestinationStep({
  query,
  setQuery,
  results,
  destination,
  onSelect,
  onClear,
}: DestinationStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.stepGap}>
      <StepHeading
        title={t('pages:wizard.destination.title')}
        subtitle={t('pages:wizard.destination.subtitle')}
      />

      {destination ? (
        <Card radius={Radii.lg}>
          <View style={styles.selectedRow}>
            <Icon name="location" size={20} themeColor="primary" />
            <View style={styles.selectedText}>
              <ThemedText type="h3">{destination.city}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {destination.countryName}
              </ThemedText>
            </View>
            <IconButton icon="close-circle" accessibilityLabel={t('common:clear')} onPress={onClear} />
          </View>
        </Card>
      ) : (
        <>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('pages:wizard.destination.placeholder')}
            autoFocus
          />
          <View style={styles.resultList}>
            {results.length === 0 ? (
              <ThemedText type="small" themeColor="textTertiary">
                {t('pages:wizard.destination.empty')}
              </ThemedText>
            ) : (
              results.map((r) => (
                <Pressable
                  key={r.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${r.city}, ${r.countryName}`}
                  onPress={() => onSelect(r)}
                  style={({ pressed }) => [
                    styles.resultRow,
                    { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Icon name="location-outline" size={18} themeColor="textSecondary" />
                  <View style={styles.selectedText}>
                    <ThemedText type="small">{r.city}</ThemedText>
                    <ThemedText type="caption" themeColor="textTertiary">
                      {r.countryName}
                    </ThemedText>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  resultList: { gap: Spacing.two },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three },
  selectedText: { flex: 1, gap: 2 },
});
