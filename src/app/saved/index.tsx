import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:saved.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <FlatList
        data={collections}
        keyExtractor={(c) => c.id}
        renderItem={({ item: c }) => (
          <Card radius={Radii.lg}>
            <View style={styles.cover}>
              <CachedImage uri={c.coverImageUrl} displayWidth={width} style={cachedImageStyles.fill} recyclingKey={c.id} />
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
                    <CachedImage uri={item.imageUrl} displayWidth={56} style={cachedImageStyles.fill} recyclingKey={item.id} radius={Radii.sm} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        ListHeaderComponent={
          <ThemedText type="small" themeColor="textSecondary">
            {t('pages:saved.subtitle')}
          </ThemedText>
        }
        ListEmptyComponent={
          <ThemedText type="small" themeColor="textTertiary">
            {t('pages:saved.empty')}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  cover: { height: 140 },
  cardBody: { padding: Spacing.three, gap: Spacing.one },
  itemsRow: { gap: Spacing.two, marginTop: Spacing.two },
  itemThumb: { width: 56, height: 56, borderRadius: Radii.sm, overflow: 'hidden' },
});
