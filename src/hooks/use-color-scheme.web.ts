import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  // Statik render (web) sonrası hydration'da bir kez true'ya çekilir; bu, cihaz
  // temasını yalnızca client'ta yeniden çözmek için kasıtlı bir desendir (Expo
  // şablonu). Tek seferlik olduğundan cascade render riski yok → kural kapalı.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
