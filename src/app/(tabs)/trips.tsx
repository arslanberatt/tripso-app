import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/components/ui/coming-soon';

/**
 * Trips (`/trips`) — STUB (sonraki faz).
 * Planlanan: kullanıcının gezileri (`useTrips`) — durum (planning/booked/...),
 * tarih, kapak görseli ile liste; tıklayınca itinerary/plan ekranı.
 * Kullanacağı parçalar: `Card`, `useTrips`, ileride `usePlan`.
 */
export default function TripsScreen() {
  const { t } = useTranslation();
  return (
    <ComingSoon
      icon="airplane-outline"
      title={t('home:comingSoon.trips.title')}
      message={t('home:comingSoon.trips.message')}
    />
  );
}
