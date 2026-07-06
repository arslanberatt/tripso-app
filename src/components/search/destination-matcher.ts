import { destinationName, tagLabel } from '@/i18n/content';
import type { Destination } from '@/types';

/** Destinasyonu sorguya karşı eşleştirir (çevrili ad dâhil). */
export function matchesQuery(destination: Destination, query: string): boolean {
  const haystack = [
    destinationName(destination),
    destination.name,
    destination.region,
    destination.cityName,
    ...destination.tags,
    ...destination.tags.map((tag) => tagLabel(tag)),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}
