import { StyleSheet, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PlanFooterAction = { icon: IconName; label: string; onPress: () => void };

/** PlanFooter — plan detayının altındaki sabit aksiyon çubuğu (harita/bütçe/ortak plan). */
export function PlanFooter({ actions }: { actions: PlanFooterAction[] }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        { borderTopColor: theme.border, backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.two },
      ]}
    >
      <View style={styles.row}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
            style={({ pressed }) => [styles.action, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.icon, { backgroundColor: theme.backgroundElement }]}>
              <Icon name={action.icon} size={18} themeColor="primary" />
            </View>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
              {action.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: Spacing.two },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  action: { alignItems: 'center', gap: Spacing.one, minWidth: 88 },
  icon: { width: 40, height: 40, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
});
