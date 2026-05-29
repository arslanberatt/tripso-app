/**
 * Kullanıcı + tercih tipleri. Kaynak: backend `User` ve `UserProfile` modelleri
 * (prisma/schema.prisma) + `UpdateProfileDto`. Alan adları backend ile birebir.
 */

import type { ISODateTime, Timestamps, UUID } from './common';

// --- UserProfile enum'ları (backend constants) ---
export type Alcohol = 'yes' | 'no' | 'occasional';
export type AccommodationTier = 'economy' | 'standard' | 'comfort' | 'luxury';
export type Pace = 'relaxed' | 'balanced' | 'intense';
export type TransportationStyle = 'car' | 'public' | 'neutral';
export type PhysicalCapability = 'high' | 'medium' | 'low' | 'accessible_needed';

/** Public kullanıcı (passwordHash hariç) — auth response'taki `user`. */
export interface User extends Timestamps {
  id: UUID;
  email: string;
  name: string;
  avatarUrl: string | null;
  timezone: string; // default "UTC"
  locale: string; // default "en-US"
  homeCity: string | null;
  homeAirportCode: string | null; // IATA 3 harf
  googleId: string | null;
  appleId: string | null;
  emailVerifiedAt: ISODateTime | null;
  lastActiveAt: ISODateTime | null;
}

/** Seyahat tercihleri — plan üretiminde AI bağlamı için kullanılır. */
export interface UserProfile extends Timestamps {
  id: UUID;
  userId: UUID;
  dietary: string[]; // çoklu seçim
  alcohol: Alcohol;
  accommodationTier: AccommodationTier;
  pace: Pace;
  transportationStyle: TransportationStyle;
  physicalCapability: PhysicalCapability;
  interests: string[];
  languages: string[];
  ageGroup: string; // default "adult"
  travelExperience: string; // default "beginner"
}
