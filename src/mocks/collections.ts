/** Sahte koleksiyon verisi (Kaydedilenler). KURAL: id = UUID/slug. */

import { MOCK_PLACES } from './places';
import { MOCK_USER } from './user';

import type { SavedCollection } from '@/types';

function itemFrom(placeId: string) {
  const place = MOCK_PLACES.find((p) => p.id === placeId);
  if (!place) throw new Error(`Unknown mock place: ${placeId}`);
  return {
    id: `saved-${place.id}`,
    placeId: place.id,
    name: place.name,
    imageUrl: place.imageUrl,
    category: place.category,
  };
}

export const MOCK_COLLECTIONS: SavedCollection[] = [
  {
    id: 'col-1',
    userId: MOCK_USER.id,
    name: 'Paris Balayı Fikirleri',
    coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
    items: [
      itemFrom('pl-paris-eiffel'),
      itemFrom('pl-paris-bar-lefooding'),
      itemFrom('pl-paris-cafe'),
    ],
  },
  {
    id: 'col-2',
    userId: MOCK_USER.id,
    name: "Roma'da Yemek",
    coverImageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80',
    items: [itemFrom('pl-rome-colosseum')],
  },
  {
    id: 'col-3',
    userId: MOCK_USER.id,
    name: 'Doğa Kaçamakları',
    coverImageUrl: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=900&q=80',
    items: [itemFrom('pl-bali-tegallalang'), itemFrom('pl-maldives-reef')],
  },
];
