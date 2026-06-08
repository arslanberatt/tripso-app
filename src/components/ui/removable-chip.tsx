import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * RemovableChip — gövdesi (etiket) bir aksiyonu, sağdaki (X) ise kaldırmayı
 * tetikleyen kapsül. Arama ekranındaki "son aramalar" için kullanılır.
 *
 * Gövde ve kaldır butonu ayrı dokunma hedefleridir (kaldırınca arama açılmaz).
 */
export type RemovableChipProps = {
  label: string;
  /** Sol ikon (örn. saat → geçmiş). */
  icon?: 'time-outline' | 'search-outline';
  onPress: () => void;
  onRemove: () => void;
  /** Kaldır butonunun erişilebilirlik etiketi. */
  removeAccessibilityLabel: string;
};

export function RemovableChip({
  label,
  icon = 'time-outline',
  onPress,
  onRemove,
  removeAccessibilityLabel,
}: RemovableChipProps) {
  const theme = useTheme();

  return (
    <View style={[styles.chip, { backgroundColor: theme.backgroundElement, borderRadius: Radii.pill }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.body, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Icon name={icon} size={15} themeColor="textTertiary" />
        <ThemedText type="small" style={styles.label} numberOfLines={1}>
          {label}
        </ThemedText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={removeAccessibilityLabel}
        hitSlop={8}
        onPress={onRemove}
        style={({ pressed }) => [styles.remove, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Icon name="close" size={15} themeColor="textSecondary" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  label: { fontWeight: '600', maxWidth: 160 },
  remove: { paddingLeft: Spacing.one, paddingVertical: Spacing.two },
});
