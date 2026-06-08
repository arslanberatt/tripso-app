import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { LanguagePreference } from '@/storage/app-storage';

const OPTIONS: LanguagePreference[] = ['system', 'en', 'tr'];

/**
 * LanguageSheet — alttan kayan dil seçici (RN `Modal`). Aktif seçenekte onay
 * işareti gösterir; bir seçeneğe dokununca `onSelect` çağrılır.
 */
export type LanguageSheetProps = {
  visible: boolean;
  value: LanguagePreference;
  onSelect: (value: LanguagePreference) => void;
  onClose: () => void;
};

export function LanguageSheet({ visible, value, onSelect, onClose }: LanguageSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}
        accessibilityLabel={t('common:close')}
        onPress={onClose}
      />
      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.card, paddingBottom: insets.bottom + Spacing.three },
        ]}
      >
        <View style={[styles.grabber, { backgroundColor: theme.border }]} />
        <ThemedText type="h3" style={styles.title}>
          {t('home:profile.languageSheetTitle')}
        </ThemedText>

        {OPTIONS.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [styles.option, { opacity: pressed ? 0.6 : 1 }]}
            >
              <ThemedText type="small" style={styles.optionLabel}>
                {t(`home:profile.languageOptions.${option}`)}
              </ThemedText>
              {selected && <Icon name="checkmark" size={20} themeColor="primary" />}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: Radii.pill,
    marginBottom: Spacing.three,
  },
  title: { marginBottom: Spacing.two },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    minHeight: 52,
  },
  optionLabel: { fontWeight: '600' },
});
