import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * HighlightItem — Destination Detail'deki "öne çıkanlar" grid öğesi
 * (ikon kutusu + etiket). `Destination.highlights` dizisinden beslenir.
 */
export type HighlightItemProps = {
  icon: IconName;
  label: string;
};

export function HighlightItem({ icon, label }: HighlightItemProps) {
  const theme = useTheme();

  return (
    <View style={styles.item}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: theme.backgroundElement, borderRadius: Radii.md },
        ]}
      >
        <Icon name={icon} size={22} themeColor="primary" />
      </View>
      <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: 'center', gap: Spacing.one, width: 72 },
  iconBox: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
