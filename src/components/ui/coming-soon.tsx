import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';

/**
 * ComingSoon — stub ekranların ortak boş-durum yer tutucusu.
 * İkon + başlık + kısa açıklama. Stub ekranlar (Explore/Trips/Profile/trip-new)
 * iskeletini bunun üstüne kurar.
 */
export type ComingSoonProps = {
  icon: IconName;
  title: string;
  message: string;
};

export function ComingSoon({ icon, title, message }: ComingSoonProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.box}>
        <Icon name={icon} size={48} themeColor="primary" />
        <ThemedText type="h1" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.message}>
          {message}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  box: { alignItems: 'center', gap: Spacing.two, maxWidth: 320 },
  title: { textAlign: 'center' },
  message: { textAlign: 'center' },
});
