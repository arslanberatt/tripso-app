/**
 * Yer (Place) tipleri. Kaynak: backend `Place` modeli + places modülü
 * interface'leri (mapbox arama sonucu, nearby place).
 *
 * NOT: `Destination` saf bir UI view-model'idir (Home/Detail ekranları için
 * görsel + puan + etiket + öne çıkanlar taşır). Backend'de tek bir tabloya
 * birebir karşılık gelmez; API'ye bağlanınca Place + metadata + şehir verisinden
 * derlenecektir.
 */

import type { IconName } from '@/components/ui/icon';
import type { ISODateTime, UUID } from './common';

export type PlaceCategory =
  | 'attraction'
  | 'restaurant'
  | 'hotel'
  | 'landmark'
  | 'nature'
  | 'entertainment'
  | 'other';

/** Backend `Place.metadata` JSON şekli. */
export interface PlaceMetadata {
  openingHours?: string;
  rating?: number;
  photos?: string[];
  phone?: string;
}

/** Backend `Place` kaydı (coordinates UI'da {lat,lng} olarak tüketilir). */
export interface Place {
  id: UUID;
  mapboxPlaceId: string | null;
  googlePlaceId: string | null;
  name: string;
  canonicalName: string;
  coordinates: { lat: number; lng: number };
  countryCode: string;
  cityName: string | null;
  cityId: UUID | null;
  category: PlaceCategory;
  metadata: PlaceMetadata;
  lastVerifiedAt: ISODateTime | null;
}

/** Mapbox arama sonucu (Explore ekranı). Backend `place.types.ts` ile uyumlu. */
export interface PlaceSearchResult {
  mapboxId: string;
  name: string;
  fullName: string;
  lat: number;
  lng: number;
  placeType: string;
  category?: string;
  countryCode?: string;
  countryName?: string;
  cityName?: string;
}

/** Detay ekranındaki öne çıkan satır (ikon + etiket). */
export interface DestinationHighlight {
  /** Ionicons ikon adı (`Icon` component'i ile çizilir). */
  icon: IconName;
  label: string;
}

/** UI view-model — Home kartları ve Destination Detail ekranı bunu kullanır. */
export interface Destination {
  id: UUID;
  name: string;
  /** Ülke/bölge gösterimi, ör. "South Asia" veya "Indonesia". */
  region: string;
  countryCode: string;
  cityName: string;
  category: PlaceCategory;
  imageUrl: string;
  /** Galeri / hero için ek görseller. */
  gallery: string[];
  rating: number; // 0..5
  reviewCount: number;
  description: string;
  /** Filtre/etiketler, ör. ["Beach", "Relaxing", "Family"]. */
  tags: string[];
  highlights: DestinationHighlight[];
}

/** Home'daki "Popular Experiences" kartı. */
export interface Experience {
  id: UUID;
  title: string;
  category: PlaceCategory;
  imageUrl: string;
  durationLabel: string; // ör. "2 days"
}
