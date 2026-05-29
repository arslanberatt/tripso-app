/**
 * "Popular Experiences" hook'u — şimdilik mock.
 * TODO(api): useQuery(['experiences']) ile değiştir.
 */

import type { Experience } from '@/types';
import { MOCK_EXPERIENCES } from '@/mocks/destinations';
import { AsyncState, loaded } from './async-state';

export function useExperiences(): AsyncState<Experience[]> {
  return loaded(MOCK_EXPERIENCES);
}
