/**
 * Trip tipleri. Kaynak: backend `Trip` modeli + `CreateTripDto` / `trip.constants.ts`.
 * Alan adları backend ile birebir.
 */

import type { ISODate, Timestamps, UUID } from './common';
import type {
  AccommodationTier,
  Alcohol,
  Pace,
  PhysicalCapability,
  TransportationStyle,
} from './user';

export type TripStatus = 'draft' | 'planning' | 'active' | 'completed' | 'cancelled';
export type BudgetTier = 'economy' | 'standard' | 'comfort' | 'luxury';
export type DateFlexibility = 'exact' | 'month' | 'flexible';
export type Occasion =
  | 'honeymoon'
  | 'birthday'
  | 'anniversary'
  | 'business_leisure'
  | 'family_visit';

/** Backend `Trip.travelers` JSON şekli. */
export interface Travelers {
  adults: number; // 1..20
  children?: number; // 0..10
  seniors?: number;
  infants?: number;
}

/** Trip oluşturulurken dondurulan tercih anlık görüntüsü (`Trip.profileSnapshot`). */
export interface ProfileSnapshot {
  dietary: string[];
  alcohol: Alcohol;
  accommodationTier: AccommodationTier;
  pace: Pace;
  transportationStyle: TransportationStyle;
  physicalCapability: PhysicalCapability;
  interests: string[];
  languages: string[];
  ageGroup: string;
  travelExperience: string;
}

export interface Trip extends Timestamps {
  id: UUID;
  userId: UUID;
  title: string | null;
  destinationCity: string;
  destinationCountryCode: string; // 2 harf
  startDate: ISODate;
  endDate: ISODate;
  dateFlexibility: DateFlexibility;
  travelers: Travelers;
  budgetTier: BudgetTier;
  budgetAmount: number | null;
  budgetCurrency: string | null; // ISO 3 harf
  occasion: Occasion | null;
  travelFocus: string[];
  tripSpecificInterests: string[];
  freeTextNotes: string | null;
  profileSnapshot: ProfileSnapshot | Record<string, never>;
  status: TripStatus;
}
