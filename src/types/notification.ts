/**
 * Bildirim tipleri. Kaynak: backend `Notification` modeli + notification.constants.ts.
 */

import type { ISODateTime, Timestamps, UUID } from './common';

export type NotificationType =
  | 'plan_ready'
  | 'plan_reminder'
  | 'trip_start'
  | 'trip_end'
  | 'travel_history_update';

export type NotificationStatus = 'scheduled' | 'sent' | 'failed' | 'cancelled';

export interface Notification extends Timestamps {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  body: string;
  data: Record<string, unknown>;
  imageUrl: string | null;
  scheduledAt: ISODateTime | null;
  sentAt: ISODateTime | null;
}
