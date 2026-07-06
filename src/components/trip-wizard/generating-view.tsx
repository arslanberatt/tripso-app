import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';

/** GeneratingView — sahte AI üretim ekranı (adım adım ilerleyen checklist). */
export function GeneratingView({ city, activeStep }: { city: string; activeStep: number }) {
  const { t } = useTranslation();

  const steps = [
    t('pages:wizard.generating.step1'),
    t('pages:wizard.generating.step2', { city }),
    t('pages:wizard.generating.step3'),
    t('pages:wizard.generating.step4'),
  ];

  return (
    <ThemedView style={styles.container}>
      <Icon name="sparkles" size={48} themeColor="primary" />
      <ThemedText type="h1" style={styles.center}>
        {t('pages:wizard.generating.title')}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
        {t('pages:wizard.generating.message', { city })}
      </ThemedText>
      <View style={styles.steps}>
        {steps.map((label, i) => (
          <View key={label} style={styles.stepRow}>
            <Icon
              name={i <= activeStep ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              themeColor={i <= activeStep ? 'primary' : 'textTertiary'}
            />
            <ThemedText type="small" themeColor={i <= activeStep ? 'text' : 'textTertiary'}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two, padding: Spacing.five },
  center: { textAlign: 'center' },
  steps: { gap: Spacing.two, marginTop: Spacing.four, alignSelf: 'stretch' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
