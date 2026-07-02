import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { Radii, Spacing } from '@/constants/theme';
import { useCollections } from '@/hooks/data/use-collections';

/** Saved (`/saved`) — kaydedilenler / koleksiyonlar. */
export default function SavedScreen() {
  const { data: collections } = useCollections();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:saved.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        <View style={styles.padded}>
          <ThemedText type="small" themeColor="textSecondary">
            {t('pages:saved.subtitle')}
          </ThemedText>
        </View>

        <View style={[styles.padded, styles.list]}>
          {collections.length === 0 ? (
            <ThemedText type="small" themeColor="textTertiary">
              {t('pages:saved.empty')}
            </ThemedText>
          ) : (
            collections.map((c) => (
              <Card key={c.id} radius={Radii.lg}>
                <View style={styles.cover}>
                  <CachedImage uri={c.coverImageUrl} style={cachedImageStyles.fill} recyclingKey={c.id} />
                </View>
                <View style={styles.cardBody}>
                  <ThemedText type="h3">{c.name}</ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    {t('pages:saved.items', { count: c.items.length })}
                  </ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsRow}>
                    {c.items.map((item) => (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        accessibilityLabel={item.name}
                        onPress={() => router.push(`/place/${item.placeId}`)}
                        style={styles.itemThumb}
                      >
                        <CachedImage uri={item.imageUrl} style={cachedImageStyles.fill} recyclingKey={item.id} radius={Radii.sm} />
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three },
  list: { gap: Spacing.three },
  cover: { height: 140 },
  cardBody: { padding: Spacing.three, gap: Spacing.one },
  itemsRow: { gap: Spacing.two, marginTop: Spacing.two },
  itemThumb: { width: 56, height: 56, borderRadius: Radii.sm, overflow: 'hidden' },
});
