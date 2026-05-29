import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconButton } from '@/components/ui/icon-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';

/**
 * AuthScaffold — Login ve Register'ın ortak iskeleti.
 * Başlık/alt başlık + klavyeyle çakışmayan kaydırılır gövde + alt slot (footer).
 * `onBack` verilirse sol üstte geri butonu. İçerik `MaxContentWidth` ile ortalanır
 * (geniş ekran/web).
 */
export type AuthScaffoldProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Sayfanın altına sabitlenen alan (CTA + sosyal giriş). */
  footer?: ReactNode;
  onBack?: () => void;
};

export function AuthScaffold({ title, subtitle, children, footer, onBack }: AuthScaffoldProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.fill}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + Spacing.two, paddingBottom: insets.bottom + Spacing.four },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            {onBack && (
              <IconButton
                icon="chevron-back"
                accessibilityLabel={t('common:a11y.goBack')}
                themeColor="text"
                onPress={onBack}
              />
            )}
            <View style={styles.head}>
              <ThemedText type="h1">{title}</ThemedText>
              {subtitle && (
                <ThemedText type="default" themeColor="textSecondary">
                  {subtitle}
                </ThemedText>
              )}
            </View>

            <View style={styles.form}>{children}</View>

            {footer && <View style={styles.footer}>{footer}</View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.four },
  inner: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', gap: Spacing.four },
  head: { gap: Spacing.one },
  form: { gap: Spacing.three },
  footer: { marginTop: 'auto', gap: Spacing.three, paddingTop: Spacing.four },
});
