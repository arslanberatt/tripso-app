/**
 * Trip Sihirbazı'nda oluşturulan gezileri bellekte tutan sahte "yazma" katmanı.
 * Gerçek backend'e bağlanınca `useTrips().createTrip` mutation'ı bunun yerini alır
 * (bkz. tripso-backend PlanGenerationService.enqueue). Uygulama yeniden başlayınca
 * sıfırlanır — kalıcılık şart değil, oturum içi akışın uçtan uca çalışması yeterli.
 */

import { MOCK_TRIPS } from './trips';
import { MOCK_USER } from './user';

import type { Trip } from '@/types';

let createdTrips: Trip[] = [];

export function getAllTrips(): Trip[] {
  return [...createdTrips, ...MOCK_TRIPS];
}

export function getTripById(id: string): Trip | null {
  return getAllTrips().find((t) => t.id === id) ?? null;
}

export type CreateTripInput = Pick<
  Trip,
  | 'destinationCity'
  | 'destinationCountryCode'
  | 'startDate'
  | 'endDate'
  | 'dateFlexibility'
  | 'travelers'
  | 'budgetTier'
  | 'budgetAmount'
  | 'budgetCurrency'
  | 'occasion'
  | 'travelFocus'
  | 'tripSpecificInterests'
  | 'freeTextNotes'
>;

function fakeUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
}

export function createTrip(input: CreateTripInput): Trip {
  const now = new Date().toISOString();
  const trip: Trip = {
    id: fakeUuid(),
    userId: MOCK_USER.id,
    title: `${input.destinationCity} Gezisi`,
    ...input,
    profileSnapshot: {},
    status: 'planning',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  createdTrips = [trip, ...createdTrips];
  return trip;
}
