/**
 * Sahte trip verisi (Trips listesi stub'ı + ileride detay için). API'ye bağlanınca silinecek.
 * KURAL: id = UUID, startDate/endDate = ISO date string.
 */

import type { Trip } from '@/types';
import { MOCK_USER } from './user';

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'aaaa1111-bbbb-4ccc-8ddd-eeee22223333',
    userId: MOCK_USER.id,
    title: 'Summer in Bali',
    destinationCity: 'Denpasar',
    destinationCountryCode: 'ID',
    startDate: '2026-07-12',
    endDate: '2026-07-20',
    dateFlexibility: 'exact',
    travelers: { adults: 2 },
    budgetTier: 'comfort',
    budgetAmount: 3500,
    budgetCurrency: 'USD',
    occasion: 'anniversary',
    travelFocus: ['relaxation', 'nature'],
    tripSpecificInterests: ['surfing', 'temples'],
    freeTextNotes: null,
    profileSnapshot: {},
    status: 'planning',
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-02T10:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'bbbb2222-cccc-4ddd-8eee-ffff33334444',
    userId: MOCK_USER.id,
    title: 'Kyoto Culture Trip',
    destinationCity: 'Kyoto',
    destinationCountryCode: 'JP',
    startDate: '2026-04-02',
    endDate: '2026-04-08',
    dateFlexibility: 'exact',
    travelers: { adults: 1 },
    budgetTier: 'standard',
    budgetAmount: 2200,
    budgetCurrency: 'USD',
    occasion: null,
    travelFocus: ['culture', 'food'],
    tripSpecificInterests: [],
    freeTextNotes: 'Cherry blossom season.',
    profileSnapshot: {},
    status: 'completed',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-04-09T10:00:00.000Z',
    deletedAt: null,
  },
];
