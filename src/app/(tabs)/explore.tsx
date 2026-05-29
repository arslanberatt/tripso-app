import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/ui/coming-soon';

/**
 * Explore (`/explore`) — STUB (sonraki faz).
 * Planlanan: Mapbox arama (`PlaceSearchResult`) + harita + kategori filtreleri.
 * Kullanacağı parçalar: `SearchInput`, `CategoryChipRow`, `useDestinations`,
 * ileride `usePlaceSearch` + harita component'i.
 */
export default function ExploreScreen() {
  const { t } = useTranslation();
  return (
    <ComingSoon
      icon="compass-outline"
      title={t('home:comingSoon.explore.title')}
      message={t('home:comingSoon.explore.message')}
    />
  );
}
