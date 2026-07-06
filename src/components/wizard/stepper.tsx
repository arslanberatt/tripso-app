import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Stepper — sayı azalt/artır satırı (yolcu sayısı gibi). */
export type StepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
};

export function Stepper({ label, value, onChange, min = 0 }: StepperProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <ThemedText type="small" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('pages:wizard.a11y.decrease', { label })}
          onPress={() => onChange(Math.max(min, value - 1))}
          style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        >
          <Icon name="remove" size={16} />
        </Pressable>
        <ThemedText type="small" style={styles.value}>
          {value}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('pages:wizard.a11y.increase', { label })}
          onPress={() => onChange(value + 1)}
          style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        >
          <Icon name="add" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  button: { width: 32, height: 32, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 20, textAlign: 'center', fontWeight: '700' },
});
