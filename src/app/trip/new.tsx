import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Spacing } from '@/constants/theme';

/**
 * New Trip (`/trip/new`) — STUB (modal). "Plan a Trip" CTA'larının hedefi.
 *
 * Planlanan akış (sonraki faz): hedef + tarihler (DateFlexibility) + bütçe
 * (BudgetTier) + yolcular (Travelers) + occasion → `useTrips().createTrip` →
 * plan üretimi (`PlanGenerationJob`). Detay ekranından gelen şehir/ülke prefill
 * edilir (aşağıda gösterilir).
 */
export default function NewTripScreen() {
  const { city, country } = useLocalSearchParams<{ city?: string; country?: string }>();
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('home:trip.title')}
        leading={
          <IconButton
            icon="close"
            accessibilityLabel={t('common:close')}
            onPress={() => router.back()}
          />
        }
      />
      <ComingSoon
        icon="map-outline"
        title={t('home:trip.title')}
        message={t('home:trip.message')}
      />
      {city && (
        <View style={styles.prefill}>
          <ThemedText type="caption" themeColor="textTertiary">
            {t('home:trip.prefill', { place: country ? `${city}, ${country}` : city })}
          </ThemedText>
        </View>
      )}
      <View style={styles.footer}>
        <AppButton label={t('common:close')} variant="secondary" onPress={() => router.back()} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  prefill: { alignItems: 'center', paddingBottom: Spacing.two },
  footer: { padding: Spacing.four },
});
