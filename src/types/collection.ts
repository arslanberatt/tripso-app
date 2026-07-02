/** Kaydedilenler / Koleksiyonlar — beğenilen mekân ve destinasyonların organize edilmesi. */

import type { UUID } from './common';
import type { PlaceCategory } from './place';

export interface SavedItem {
  id: UUID;
  placeId: UUID;
  name: string;
  imageUrl: string;
  category: PlaceCategory;
}

export interface SavedCollection {
  id: UUID;
  userId: UUID;
  name: string;
  coverImageUrl: string;
  items: SavedItem[];
}
