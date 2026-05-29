import { useTranslation } from 'react-i18next';

import { AppInput, type AppInputProps } from '@/components/ui/input';

/**
 * SearchInput — `AppInput`'un arama preset'i (Home ekranı).
 * Sol arama ikonu + temizleme; placeholder verilmezse i18n'den çözülür.
 */
export type SearchInputProps = Omit<AppInputProps, 'leadingIcon' | 'clearable'>;

export function SearchInput({ placeholder, returnKeyType = 'search', ...rest }: SearchInputProps) {
  const { t } = useTranslation();
  return (
    <AppInput
      leadingIcon="search-outline"
      clearable
      autoCapitalize="none"
      autoCorrect={false}
      placeholder={placeholder ?? t('home:searchPlaceholder')}
      returnKeyType={returnKeyType}
      {...rest}
    />
  );
}
