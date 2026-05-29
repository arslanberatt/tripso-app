import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tag — salt-okunur etiket (Destination Detail'deki "Beach", "Relaxing"…).
 * Chip'in aksine tıklanmaz; sadece bilgi gösterir.
 */
export type TagProps = {
  label: string;
  icon?: IconName;
};

export function Tag({ label, icon }: TagProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.tag,
        { backgroundColor: theme.backgroundElement, borderRadius: Radii.sm },
      ]}
    >
      {icon && <Icon name={icon} size={14} themeColor="textSecondary" />}
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
