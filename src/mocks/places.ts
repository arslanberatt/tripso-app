/**
 * Mekân Detayı için sahte veri (fotoğraf, puan, yorumlar). API'ye bağlanınca
 * `Place` + Google Places (New) çağrısından derlenecek — bkz. docs/product-plan.md §5.2.
 * KURAL: id = 'pl-<şehir>-<slug>' (Mapbox/Google place id'lerinin yerini tutar).
 */

import type { PlaceCategory, PlaceReview } from '@/types';

export interface PlaceDetailVM {
  id: string;
  name: string;
  city: string;
  countryCode: string;
  category: PlaceCategory;
  imageUrl: string;
  gallery: string[];
  coordinates: { lat: number; lng: number };
  address: string;
  description: string;
  priceLevel: 1 | 2 | 3 | 4;
  openingHours: string;
  tripsoRating: number;
  tripsoReviewCount: number;
  googleRating: number;
  googleReviewCount: number;
}

export const MOCK_PLACES: PlaceDetailVM[] = [
  {
    id: 'pl-paris-louvre',
    name: 'Louvre Müzesi',
    city: 'Paris',
    countryCode: 'FR',
    category: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80',
      'https://images.unsplash.com/photo-1544413660-299165566b1d?w=1200&q=80',
    ],
    coordinates: { lat: 48.8606, lng: 2.3376 },
    address: 'Rue de Rivoli, 75001 Paris',
    description: "Dünyanın en büyük sanat müzesi — Mona Lisa'dan Venüs de Milo'ya binlerce eser.",
    priceLevel: 3,
    openingHours: '09:00 - 18:00',
    tripsoRating: 4.6,
    tripsoReviewCount: 312,
    googleRating: 4.7,
    googleReviewCount: 248_000,
  },
  {
    id: 'pl-paris-bar-lefooding',
    name: 'Little Red Door',
    city: 'Paris',
    countryCode: 'FR',
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80',
      'https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?w=1200&q=80',
    ],
    coordinates: { lat: 48.8611, lng: 2.3616 },
    address: '60 Rue Charlot, 75003 Paris',
    description: 'Le Marais\'de gizli kapılı, ödüllü kokteyl bar. Sanattan çok eğlence isteyenler için.',
    priceLevel: 3,
    openingHours: '18:00 - 02:00',
    tripsoRating: 4.5,
    tripsoReviewCount: 187,
    googleRating: 4.4,
    googleReviewCount: 3_400,
  },
  {
    id: 'pl-paris-eiffel',
    name: 'Tour Eiffel',
    city: 'Paris',
    countryCode: 'FR',
    category: 'landmark',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
      'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200&q=80',
    ],
    coordinates: { lat: 48.8584, lng: 2.2945 },
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    description: 'Paris\'in simgesi. Gün batımında ışıklandırma başladığında en güzel hali.',
    priceLevel: 2,
    openingHours: '09:00 - 23:45',
    tripsoRating: 4.7,
    tripsoReviewCount: 540,
    googleRating: 4.6,
    googleReviewCount: 412_000,
  },
  {
    id: 'pl-paris-marais',
    name: "L'As du Fallafel",
    city: 'Paris',
    countryCode: 'FR',
    category: 'restaurant',
    imageUrl: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=1200&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80',
    ],
    coordinates: { lat: 48.8589, lng: 2.3622 },
    address: '34 Rue des Rosiers, 75004 Paris',
    description: 'Le Marais\'nin efsane falafelcisi. Kuyruk uzun ama hızlı ilerliyor.',
    priceLevel: 1,
    openingHours: '11:00 - 23:00',
    tripsoRating: 4.8,
    tripsoReviewCount: 265,
    googleRating: 4.5,
    googleReviewCount: 18_900,
  },
  {
    id: 'pl-paris-cafe',
    name: 'Café de Flore',
    city: 'Paris',
    countryCode: 'FR',
    category: 'restaurant',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80'],
    coordinates: { lat: 48.8542, lng: 2.3327 },
    address: '172 Boulevard Saint-Germain, 75006 Paris',
    description: 'Tarihi Saint-Germain kafesi — sabah kahvaltısı için klasik seçim.',
    priceLevel: 3,
    openingHours: '07:30 - 01:30',
    tripsoRating: 4.3,
    tripsoReviewCount: 198,
    googleRating: 4.2,
    googleReviewCount: 22_100,
  },
  {
    id: 'pl-rome-colosseum',
    name: 'Colosseo',
    city: 'Rome',
    countryCode: 'IT',
    category: 'landmark',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80'],
    coordinates: { lat: 41.8902, lng: 12.4922 },
    address: 'Piazza del Colosseo, 1, 00184 Roma RM',
    description: 'Antik Roma\'nın en görkemli arenası. Bileti önceden online almak şart.',
    priceLevel: 2,
    openingHours: '08:30 - 19:00',
    tripsoRating: 4.6,
    tripsoReviewCount: 421,
    googleRating: 4.7,
    googleReviewCount: 289_000,
  },
  {
    id: 'pl-amsterdam-canal',
    name: 'Jordaan Kanalları',
    city: 'Amsterdam',
    countryCode: 'NL',
    category: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=80'],
    coordinates: { lat: 52.3745, lng: 4.8807 },
    address: 'Jordaan, Amsterdam',
    description: 'Kanal boyunca bisikletle ya da tekneyle keşfedilecek en sevimli mahalle.',
    priceLevel: 1,
    openingHours: '24 saat açık',
    tripsoRating: 4.5,
    tripsoReviewCount: 156,
    googleRating: 4.6,
    googleReviewCount: 41_200,
  },
  {
    id: 'pl-bali-tegallalang',
    name: 'Tegallalang Rice Terraces',
    city: 'Ubud',
    countryCode: 'ID',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=1200&q=80'],
    coordinates: { lat: -8.4312, lng: 115.2777 },
    address: 'Tegallalang, Gianyar, Bali',
    description: 'Yeşil pirinç teraslarıyla ünlü, salıncaklarıyla popüler bir doğa noktası.',
    priceLevel: 1,
    openingHours: '08:00 - 18:00',
    tripsoRating: 4.4,
    tripsoReviewCount: 203,
    googleRating: 4.3,
    googleReviewCount: 15_600,
  },
  {
    id: 'pl-kyoto-fushimi',
    name: 'Fushimi Inari Taisha',
    city: 'Kyoto',
    countryCode: 'JP',
    category: 'landmark',
    imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200&q=80'],
    coordinates: { lat: 34.9671, lng: 135.7727 },
    address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
    description: 'Binlerce turuncu torii kapısından oluşan ünlü tapınak yolu.',
    priceLevel: 1,
    openingHours: '24 saat açık',
    tripsoRating: 4.8,
    tripsoReviewCount: 389,
    googleRating: 4.7,
    googleReviewCount: 98_000,
  },
  {
    id: 'pl-santorini-oia',
    name: 'Oia Sunset Point',
    city: 'Santorini',
    countryCode: 'GR',
    category: 'landmark',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80'],
    coordinates: { lat: 36.4618, lng: 25.3753 },
    address: 'Oia, Santorini 847 02, Greece',
    description: 'Ege\'nin en ünlü gün batımı manzarası; kalenin çevresi akşam üstü dolar.',
    priceLevel: 2,
    openingHours: '24 saat açık',
    tripsoRating: 4.9,
    tripsoReviewCount: 512,
    googleRating: 4.8,
    googleReviewCount: 34_500,
  },
  {
    id: 'pl-maldives-reef',
    name: 'Overwater Bungalow Reef',
    city: 'Malé',
    countryCode: 'MV',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80'],
    coordinates: { lat: 4.1755, lng: 73.5093 },
    address: 'North Malé Atoll, Maldives',
    description: 'Bungalovun hemen altında başlayan canlı mercan resifi.',
    priceLevel: 4,
    openingHours: '24 saat açık',
    tripsoRating: 4.9,
    tripsoReviewCount: 97,
    googleRating: 4.9,
    googleReviewCount: 6_800,
  },
];

export const MOCK_REVIEWS: Record<string, PlaceReview[]> = {
  'pl-paris-louvre': [
    {
      id: 'rv-1',
      authorName: 'Ayşe Yılmaz',
      authorAvatarUrl: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      comment: 'Mona Lisa kalabalık ama Denon kanadının geri kalanı sakin ve muhteşem.',
      createdAt: '2026-03-02T10:00:00.000Z',
      source: 'tripso',
    },
    {
      id: 'rv-2',
      authorName: 'Google Kullanıcısı',
      authorAvatarUrl: null,
      rating: 4,
      comment: 'A must-see, but book skip-the-line tickets in advance.',
      createdAt: '2026-02-14T08:30:00.000Z',
      source: 'google',
    },
  ],
  'pl-paris-bar-lefooding': [
    {
      id: 'rv-3',
      authorName: 'Mert Kaya',
      authorAvatarUrl: 'https://i.pravatar.cc/150?img=15',
      rating: 5,
      comment: 'Kapıyı bulmak bile bir macera. Kokteyller harika.',
      createdAt: '2026-04-20T21:00:00.000Z',
      source: 'tripso',
    },
  ],
  'pl-paris-eiffel': [
    {
      id: 'rv-4',
      authorName: 'Elif Demir',
      authorAvatarUrl: 'https://i.pravatar.cc/150?img=25',
      rating: 5,
      comment: 'Işıklandırma saat başı 5 dakika — mutlaka görün.',
      createdAt: '2026-05-01T19:30:00.000Z',
      source: 'tripso',
    },
  ],
};

export function getPlaceById(id: string): PlaceDetailVM | null {
  return MOCK_PLACES.find((p) => p.id === id) ?? null;
}

export function getReviewsForPlace(id: string): PlaceReview[] {
  return MOCK_REVIEWS[id] ?? [];
}
