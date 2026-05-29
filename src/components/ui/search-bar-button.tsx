import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * SearchBarButton — arama ÇUBUĞU görünümlü buton (Home).
 *
 * Görünüşü `AppInput`'un arama preset'iyle aynıdır, ama metin girişi değil
 * butondur: dokununca inline arama yapmaz, adanmış `/search` ekranına yönlendirir
 * (iOS 18 / Android / web yolu). iOS 26'da arama ayrıca native search rolüyle de
 * açılabilir (bkz. `(tabs)/_layout`).
 */
export type SearchBarButtonProps = {
  onPress: () => void;
  /** Yer tutucu metin; verilmezse i18n'den çözülür. */
  placeholder?: string;
};

export function SearchBarButton({ onPress, placeholder }: SearchBarButtonProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const text = placeholder ?? t('home:search.placeholder');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home:search.a11y.open')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.backgroundElement, borderRadius: Radii.md, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Icon name="search-outline" size={20} themeColor="textSecondary" />
      <ThemedText type="default" themeColor="textTertiary" numberOfLines={1} style={styles.text}>
        {text}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 52,
  },
  text: { flex: 1 },
});
