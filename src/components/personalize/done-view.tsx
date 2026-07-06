import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';

/** DoneView — kişiselleştirme kaydedildi ekranı. */
export function DoneView({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <Icon name="checkmark-circle" size={56} themeColor="primary" />
      <ThemedText type="h1" style={styles.center}>
        {t('pages:personalize.saved')}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
        {t('pages:personalize.savedMessage')}
      </ThemedText>
      <AppButton label={t('pages:personalize.done')} fullWidth={false} onPress={onDone} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.five },
  center: { textAlign: 'center' },
});
