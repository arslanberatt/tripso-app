/**
 * Plan (itinerary) tipleri. Kaynak: backend `PlanVersion` / `PlanDay` / `PlanItem`
 * modelleri + trips modülü interface'leri. Sonraki fazda Itinerary ekranı kullanacak.
 */

import type { ISODate, Timestamps, TimeString, UUID } from './common';

export type PlanGenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PlanItem extends Timestamps {
  id: UUID;
  planDayId: UUID;
  placeId: UUID | null;
  orderIndex: number;
  itemType: string; // ör. "activity" | "meal" | "transport"
  title: string;
  description: string | null;
  startTime: TimeString | null;
  durationMinutes: number | null;
  aiRecommendationNote: string | null;
  userNote: string | null;
  details: Record<string, unknown>;
}

export interface PlanDay extends Timestamps {
  id: UUID;
  planVersionId: UUID;
  dayNumber: number;
  date: ISODate;
  theme: string | null;
  summary: string | null;
  items: PlanItem[];
}

export interface PlanVersion extends Timestamps {
  id: UUID;
  tripId: UUID;
  versionNumber: number;
  isActive: boolean;
  regenerationFeedback: string | null;
  summary: string | null;
  totalEstimatedCost: number | null;
  days: PlanDay[];
}

/** Plan üretim işinin durumu (polling ile izlenir). */
export interface PlanGenerationJob extends Timestamps {
  id: UUID;
  tripId: UUID;
  status: PlanGenerationStatus;
  triggeredBy: string;
  planVersionId: UUID | null;
  errorCode: string | null;
  errorMessage: string | null;
}
