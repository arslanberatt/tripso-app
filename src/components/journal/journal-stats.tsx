import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';
import type { TravelPin } from '@/types';

/** JournalStats — pinlerden türeyen ülke/şehir/yer sayaçları. */
export function JournalStats({ pins }: { pins: TravelPin[] }) {
  const { t } = useTranslation();
  const countries = new Set(pins.map((p) => p.countryCode)).size;
  const cities = new Set(pins.map((p) => p.city)).size;

  return (
    <Card radius={Radii.lg}>
      <View style={styles.row}>
        <Stat value={countries} label={t('pages:journal.stats.countries', { count: countries })} />
        <Stat value={cities} label={t('pages:journal.stats.cities', { count: cities })} />
        <Stat value={pins.length} label={t('pages:journal.stats.places', { count: pins.length })} />
      </View>
    </Card>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="h2">{value}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', padding: Spacing.three },
  stat: { alignItems: 'center', gap: 2 },
});
