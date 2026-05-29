import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * AppInput — temalı metin girişi (leading ikon, clear, secure toggle).
 *
 * Form state'i DIŞARIDA `useState` ile tutulur (harici form kütüphanesi yok);
 * bu component sadece görünüm + küçük etkileşimleri (clear, şifre göster/gizle)
 * yönetir. `email-field` / `password-field` / `search-input` bunun preset'leridir.
 */
export type AppInputProps = Omit<TextInputProps, 'style'> & {
  /** Solda ikon (örn. 'mail-outline'). */
  leadingIcon?: IconName;
  /** Değer varken "temizle" (X) butonu göster. */
  clearable?: boolean;
  /** Şifre alanı → göz ikonuyla göster/gizle. */
  secureToggle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AppInput({
  leadingIcon,
  clearable = false,
  secureToggle = false,
  value,
  onChangeText,
  secureTextEntry,
  containerStyle,
  accessibilityLabel,
  placeholder,
  ...rest
}: AppInputProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(secureTextEntry ?? secureToggle);

  const showClear = clearable && !!value;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement, borderRadius: Radii.md },
        containerStyle,
      ]}
    >
      {leadingIcon && (
        <Icon name={leadingIcon} size={20} themeColor="textSecondary" />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        secureTextEntry={secureToggle ? hidden : secureTextEntry}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={[styles.input, { color: theme.text }]}
        {...rest}
      />
      {showClear && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common:a11y.clearText')}
          hitSlop={8}
          onPress={() => onChangeText?.('')}
        >
          <Icon name="close-circle" size={18} themeColor="textTertiary" />
        </Pressable>
      )}
      {secureToggle && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? t('common:a11y.showPassword') : t('common:a11y.hidePassword')}
          hitSlop={8}
          onPress={() => setHidden((h) => !h)}
        >
          <Icon
            name={hidden ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            themeColor="textSecondary"
          />
        </Pressable>
      )}
    </View>
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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
});
