import { useTranslation } from 'react-i18next';

import { AppInput, type AppInputProps } from '@/components/ui/input';

/**
 * EmailField — `AppInput`'un e-posta preset'i (login/register formları).
 * Mail ikonu + uygun klavye/otomatik-tamamlama. Doğrulama UI tarafında, basit.
 * Placeholder verilmezse i18n'den ('auth:fields.email') çözülür.
 */
export type EmailFieldProps = Omit<AppInputProps, 'leadingIcon' | 'keyboardType'>;

export function EmailField({ placeholder, ...rest }: EmailFieldProps) {
  const { t } = useTranslation();
  return (
    <AppInput
      leadingIcon="mail-outline"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      textContentType="emailAddress"
      placeholder={placeholder ?? t('auth:fields.email')}
      {...rest}
    />
  );
}
