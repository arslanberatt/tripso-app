import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Header } from '@/components/ui/header';
import { Radii, Spacing } from '@/constants/theme';
import { useNotifications } from '@/hooks/data/use-notifications';
import { useTheme } from '@/hooks/use-theme';
import type { Notification, NotificationType } from '@/types';

const TYPE_ICON: Record<NotificationType, IconName> = {
  plan_ready: 'sparkles',
  plan_reminder: 'time-outline',
  trip_start: 'airplane-outline',
  trip_end: 'flag-outline',
  travel_history_update: 'location-outline',
};

/** Notifications (`/notifications`) — bildirim merkezi. */
export default function NotificationsScreen() {
  const { data } = useNotifications();
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const open = (n: Notification) => {
    setReadIds((prev) => new Set(prev).add(n.id));
    const route = n.data.route;
    if (typeof route === 'string') router.push(route as Href);
  };

  const markAllRead = () => setReadIds(new Set(data.map((n) => n.id)));

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:notifications.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
        trailing={
          <Pressable accessibilityRole="button" accessibilityLabel={t('pages:notifications.markAllRead')} onPress={markAllRead}>
            <Icon name="checkmark-done-outline" size={20} themeColor="primary" />
          </Pressable>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        {data.length === 0 ? (
          <ThemedText type="small" themeColor="textTertiary" style={styles.padded}>
            {t('pages:notifications.empty')}
          </ThemedText>
        ) : (
          data.map((n) => {
            const isRead = readIds.has(n.id);
            return (
              <Pressable
                key={n.id}
                accessibilityRole="button"
                accessibilityLabel={n.title}
                onPress={() => open(n)}
                style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={[styles.iconWrap, { backgroundColor: isRead ? theme.backgroundElement : theme.primary }]}>
                  <Icon name={TYPE_ICON[n.type]} size={18} color={isRead ? theme.textSecondary : theme.onPrimary} />
                </View>
                <View style={styles.body}>
                  <ThemedText type={isRead ? 'small' : 'smallBold'} numberOfLines={1}>
                    {n.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
                    {n.body}
                  </ThemedText>
                </View>
                {!isRead && <View style={[styles.dot, { backgroundColor: theme.primary }]} />}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.one },
  padded: { paddingHorizontal: Spacing.three },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.three },
  iconWrap: { width: 40, height: 40, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
  dot: { width: 8, height: 8, borderRadius: Radii.pill },
});
