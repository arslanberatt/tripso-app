import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import type { MapMarker } from '@/components/map/mock-map-canvas';
import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';

/** SelectedMarkerCard — haritada seçilen pin'in özet kartı. */
export function SelectedMarkerCard({ marker }: { marker: MapMarker }) {
  const { t } = useTranslation();

  return (
    <Card radius={Radii.lg}>
      <View style={styles.row}>
        <View style={styles.imageWrap}>
          <CachedImage
            uri={marker.imageUrl}
            displayWidth={64}
            style={cachedImageStyles.fill}
            recyclingKey={marker.id}
            radius={Radii.md}
          />
        </View>
        <View style={styles.body}>
          <ThemedText type="h3" numberOfLines={1}>
            {marker.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {marker.city}
          </ThemedText>
          {marker.placeId && (
            <AppButton
              label={t('pages:plan.openPlace')}
              fullWidth={false}
              variant="ghost"
              onPress={() => router.push(`/place/${marker.placeId}`)}
            />
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.three },
  imageWrap: { width: 64, height: 64, borderRadius: Radii.md, overflow: 'hidden' },
  body: { flex: 1, gap: 2 },
});
