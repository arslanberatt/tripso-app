import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * PromptBar — Keşfet ekranının AI prompt çubuğu (kapsül).
 *
 * Sol: marka renginde dolu yuvarlak. Orta: "Ask me here.." placeholder.
 * Sağ: mikrofon ikonu (şimdilik görsel placeholder). Metin girişi değildir;
 * dokununca adanmış `/search` ekranına yönlendirir (`SearchBarButton` gibi).
 */
export type PromptBarProps = {
  onPress: () => void;
  /** Yer tutucu metin; verilmezse i18n'den çözülür. */
  placeholder?: string;
};

export function PromptBar({ onPress, placeholder }: PromptBarProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const text = placeholder ?? t('home:explore.promptPlaceholder');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home:explore.a11y.openPrompt')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.backgroundElement, borderRadius: Radii.pill, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: theme.primary }]} />
      <ThemedText type="default" themeColor="textTertiary" numberOfLines={1} style={styles.text}>
        {text}
      </ThemedText>
      <Icon name="mic-outline" size={20} themeColor="textSecondary" />
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
  dot: { width: 14, height: 14, borderRadius: Radii.pill },
  text: { flex: 1 },
});
