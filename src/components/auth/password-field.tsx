import { useTranslation } from 'react-i18next';

import { AppInput, type AppInputProps } from '@/components/ui/input';

/**
 * PasswordField — `AppInput`'un şifre preset'i. Kilit ikonu + göster/gizle
 * toggle'ı (`secureToggle`). `isNew` ile yeni-şifre otomatik-tamamlaması (register).
 * Placeholder verilmezse i18n'den ('auth:fields.password') çözülür.
 */
export type PasswordFieldProps = Omit<
  AppInputProps,
  'leadingIcon' | 'secureToggle' | 'secureTextEntry'
> & {
  /** Kayıt formu mu? → newPassword content type. */
  isNew?: boolean;
};

export function PasswordField({ placeholder, isNew = false, ...rest }: PasswordFieldProps) {
  const { t } = useTranslation();
  return (
    <AppInput
      leadingIcon="lock-closed-outline"
      secureToggle
      autoCapitalize="none"
      autoComplete={isNew ? 'new-password' : 'password'}
      textContentType={isNew ? 'newPassword' : 'password'}
      placeholder={placeholder ?? t('auth:fields.password')}
      {...rest}
    />
  );
}
