import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import type { TravelPin } from '@/types';

/** PinCard — günlükteki tek check-in satırı; mekân kaydı varsa detayına gider. */
export function PinCard({ pin }: { pin: TravelPin }) {
  const isLocal = pin.placeId.startsWith('local-');

  return (
    <Card radius={Radii.lg}>
      <Pressable
        accessibilityRole={isLocal ? undefined : 'button'}
        accessibilityLabel={pin.placeName}
        onPress={isLocal ? undefined : () => router.push(`/place/${pin.placeId}`)}
        style={styles.row}
      >
        <View style={styles.imageWrap}>
          <CachedImage
            uri={pin.photoUrl}
            displayWidth={72}
            style={cachedImageStyles.fill}
            recyclingKey={pin.id}
            radius={Radii.md}
          />
        </View>
        <View style={styles.body}>
          <ThemedText type="h3" numberOfLines={1}>
            {pin.placeName}
          </ThemedText>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={14} themeColor="textSecondary" />
            <ThemedText type="caption" themeColor="textSecondary">
              {pin.city}
            </ThemedText>
          </View>
          {pin.caption && (
            <ThemedText type="caption" themeColor="textTertiary" numberOfLines={2}>
              {pin.caption}
            </ThemedText>
          )}
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.three },
  imageWrap: { width: 72, height: 72, borderRadius: Radii.md, overflow: 'hidden' },
  body: { flex: 1, gap: Spacing.one },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
