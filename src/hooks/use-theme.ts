/**
 * Aktif tema paletini döndürür.
 *
 * Renk şeması artık doğrudan cihazdan değil, kullanıcı tercihinden
 * (`usePreferences`) gelir — 'system' seçiliyse cihazı izler, aksi halde
 * kullanıcının seçtiği açık/koyu temayı uygular.
 */

import { Colors } from '@/constants/theme';
import { usePreferences } from '@/hooks/use-preferences';

export function useTheme() {
  const { colorScheme } = usePreferences();
  return Colors[colorScheme];
}
