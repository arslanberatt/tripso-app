import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/**
 * SectionHeader — bölüm başlığı + opsiyonel "See all" aksiyonu.
 * Home'daki "Top Destinations" / "Popular Experiences" satırlarında kullanılır.
 * `onSeeAll` verilmezse sağ aksiyon gizlenir.
 */
export type SectionHeaderProps = {
  title: string;
  /** Sağdaki aksiyon metni (default: 'See all'). */
  actionLabel?: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, actionLabel, onSeeAll }: SectionHeaderProps) {
  const { t } = useTranslation();
  const action = actionLabel ?? t('common:seeAll');
  return (
    <View style={styles.row}>
      <ThemedText type="h2">{title}</ThemedText>
      {onSeeAll && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${action}: ${title}`}
          onPress={onSeeAll}
          hitSlop={8}
        >
          <ThemedText type="small" themeColor="primary" style={styles.action}>
            {action}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  action: { fontWeight: '600' },
});
