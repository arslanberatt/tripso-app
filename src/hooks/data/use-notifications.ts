/**
 * Bildirim Merkezi hook'u — şimdilik mock.
 * TODO(api): GET /notifications ile değiştir; okundu işaretleme bir mutation olacak.
 */

import { MOCK_NOTIFICATIONS } from '@/mocks/notifications';
import type { Notification } from '@/types';
import { AsyncState, loaded } from './async-state';

export function useNotifications(): AsyncState<Notification[]> {
  return loaded(MOCK_NOTIFICATIONS);
}
