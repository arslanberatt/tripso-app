import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { IconName } from '@/components/ui/icon';

/**
 * WizardFrame — çok adımlı akışların ortak iskeleti:
 * kapatmalı başlık + "Adım x/y" progress bar + kaydırılır gövde + Geri/İleri footer.
 * Trip Sihirbazı ve Kişiselleştirme bunu kompoze eder; adım içerikleri children.
 */
export type WizardFrameProps = {
  title: string;
  /** "Adım x / y" metni (i18n çözümü ekranda kalır). */
  stepText: string;
  /** 0..1 arası ilerleme oranı. */
  progress: number;
  backLabel: string;
  nextLabel: string;
  nextIcon?: IconName;
  nextDisabled?: boolean;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  closeLabel: string;
  children: ReactNode;
};

export function WizardFrame({
  title,
  stepText,
  progress,
  backLabel,
  nextLabel,
  nextIcon,
  nextDisabled = false,
  onClose,
  onBack,
  onNext,
  closeLabel,
  children,
}: WizardFrameProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={title}
        leading={<IconButton icon="close" accessibilityLabel={closeLabel} onPress={onClose} />}
      />
      <View style={styles.progressWrap}>
        <ThemedText type="caption" themeColor="textSecondary">
          {stepText}
        </ThemedText>
        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: `${Math.min(1, Math.max(0, progress)) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
      >
        {children}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, paddingBottom: insets.bottom + Spacing.two }]}>
        <View style={styles.footerRow}>
          <View style={styles.footerBack}>
            <AppButton label={backLabel} variant="secondary" onPress={onBack} />
          </View>
          <View style={styles.footerNext}>
            <AppButton label={nextLabel} trailingIcon={nextIcon} disabled={nextDisabled} onPress={onNext} />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  progressWrap: { paddingHorizontal: Spacing.four, gap: Spacing.one, paddingBottom: Spacing.two },
  progressTrack: { height: 4, borderRadius: Radii.pill, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: Radii.pill },
  content: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  footer: { padding: Spacing.four, paddingTop: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth },
  footerRow: { flexDirection: 'row', gap: Spacing.two },
  footerBack: { minWidth: 96 },
  footerNext: { flex: 1 },
});
