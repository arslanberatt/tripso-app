import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';

/**
 * HomeHeader — Home ekranının üst başlığı.
 * Sol: kullanıcı avatarı. Orta: "Hi, {name} 👋 / Where do you want to go?".
 * Sağ: bildirim zili (rozetli). `Header` yerine kendi düzenini kurar çünkü iki
 * satırlık selamlama gerekiyor.
 */
export type HomeHeaderProps = {
  name: string;
  avatarUri?: string | null;
  /** Okunmamış bildirim sayısı (>0 ise zilde nokta). */
  unreadCount?: number;
  onPressAvatar?: () => void;
  onPressBell?: () => void;
};

export function HomeHeader({
  name,
  avatarUri,
  unreadCount = 0,
  onPressAvatar,
  onPressBell,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.row, { paddingTop: insets.top + Spacing.two }]}>
      <View style={styles.left}>
        <Avatar uri={avatarUri} name={name} size={44} />
        <View>
          <ThemedText type="caption" themeColor="textSecondary">
            {t('home:greeting', { name })}
          </ThemedText>
          <ThemedText type="h3">{t('home:prompt')}</ThemedText>
        </View>
      </View>

      <View>
        <IconButton
          icon="notifications-outline"
          accessibilityLabel={
            unreadCount > 0
              ? t('home:notificationsUnread', { count: unreadCount })
              : t('home:notifications')
          }
          onPress={onPressBell}
        />
        {unreadCount > 0 && <View style={styles.badge} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexShrink: 1 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
});
