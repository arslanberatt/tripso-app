/**
 * Plan / Rota Detayı için sahte veri. Explore'daki plan kartları (`plan-1..4`)
 * ve Trips listesindeki gerçek `Trip`ler (bkz. `mocks/trips.ts` + `trip-draft-store`)
 * aynı ekrana (`/plan/[id]`) gider — bu dosya ikisini de tek tipe (`PlanDetailVM`)
 * dönüştürür. API'ye bağlanınca `PlanVersion`/`PlanDay`/`PlanItem` (types/plan.ts)
 * ile değişecek.
 */

import { getTripById } from './trip-draft-store';

import type { IconName } from '@/components/ui/icon';
import type { PlaceCategory, Travelers } from '@/types';

export interface PlanItemVM {
  id: string;
  title: string;
  category: PlaceCategory;
  /** Doluysa Mekân Detayı'na (`/place/[id]`) gidilebilir. */
  placeId: string | null;
  startTime: string | null;
  durationMinutes: number | null;
  estimatedCost: number | null;
  imageUrl: string;
  note: string | null;
}

export interface PlanDayVM {
  id: string;
  dayNumber: number;
  date: string;
  theme: string | null;
  items: PlanItemVM[];
}

export interface PlanDetailVM {
  id: string;
  title: string;
  destinationCity: string;
  destinationCountryCode: string;
  startDate: string;
  endDate: string;
  travelers: Travelers;
  budgetTier: string;
  budgetAmount: number | null;
  budgetCurrency: string | null;
  coverImageUrl: string;
  days: PlanDayVM[];
}

const CATEGORY_ICON: Record<PlaceCategory, IconName> = {
  attraction: 'camera-outline',
  restaurant: 'restaurant-outline',
  hotel: 'bed-outline',
  landmark: 'flag-outline',
  nature: 'leaf-outline',
  entertainment: 'wine-outline',
  other: 'ellipse-outline',
};

export function categoryIcon(category: PlaceCategory): IconName {
  return CATEGORY_ICON[category];
}

/** Kullanıcı bir durağı beğenmeyip "alternatif öner"e dokununca havuzdan seçilir. */
export const ALTERNATIVE_ITEM_POOL: PlanItemVM[] = [
  {
    id: 'alt-bar-1',
    title: 'Gizli Kapılı Kokteyl Bar',
    category: 'entertainment',
    placeId: 'pl-paris-bar-lefooding',
    startTime: null,
    durationMinutes: 120,
    estimatedCost: 45,
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80',
    note: 'Sanattan çok eğlence isteyenler için önerildi.',
  },
  {
    id: 'alt-nature-1',
    title: 'Şehir Manzaralı Yürüyüş Parkuru',
    category: 'nature',
    placeId: null,
    startTime: null,
    durationMinutes: 90,
    estimatedCost: 0,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
    note: null,
  },
  {
    id: 'alt-food-1',
    title: 'Sokak Lezzetleri Turu',
    category: 'restaurant',
    placeId: 'pl-paris-marais',
    startTime: null,
    durationMinutes: 150,
    estimatedCost: 35,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    note: null,
  },
  {
    id: 'alt-entertainment-1',
    title: 'Canlı Müzik Kulübü',
    category: 'entertainment',
    placeId: null,
    startTime: null,
    durationMinutes: 180,
    estimatedCost: 30,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80',
    note: null,
  },
  {
    id: 'alt-attraction-1',
    title: 'Yerel Sanat Galerisi',
    category: 'attraction',
    placeId: null,
    startTime: null,
    durationMinutes: 90,
    estimatedCost: 12,
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=80',
    note: null,
  },
];

const MOCK_PLAN_DETAILS: PlanDetailVM[] = [
  {
    id: 'plan-1',
    title: 'Tokyo şehrinde 5 günlük keşif',
    destinationCity: 'Tokyo',
    destinationCountryCode: 'JP',
    startDate: '2026-08-10',
    endDate: '2026-08-15',
    travelers: { adults: 2 },
    budgetTier: 'comfort',
    budgetAmount: 1000,
    budgetCurrency: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    days: [
      {
        id: 'plan-1-d1',
        dayNumber: 1,
        date: '2026-08-10',
        theme: 'Şehir Merkezi',
        items: [
          {
            id: 'plan-1-d1-i1',
            title: 'Shibuya Kesişimi & Alışveriş',
            category: 'attraction',
            placeId: null,
            startTime: '10:00',
            durationMinutes: 120,
            estimatedCost: 20,
            imageUrl: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=900&q=80',
            note: null,
          },
          {
            id: 'plan-1-d1-i2',
            title: 'Ramen Sokağı',
            category: 'restaurant',
            placeId: null,
            startTime: '13:00',
            durationMinutes: 60,
            estimatedCost: 15,
            imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=900&q=80',
            note: null,
          },
        ],
      },
      {
        id: 'plan-1-d2',
        dayNumber: 2,
        date: '2026-08-11',
        theme: 'Kültür',
        items: [
          {
            id: 'plan-1-d2-i1',
            title: 'Senso-ji Tapınağı',
            category: 'landmark',
            placeId: null,
            startTime: '09:30',
            durationMinutes: 90,
            estimatedCost: 0,
            imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&q=80',
            note: null,
          },
        ],
      },
      {
        id: 'plan-1-d3',
        dayNumber: 3,
        date: '2026-08-12',
        theme: 'Eğlence',
        items: [
          {
            id: 'plan-1-d3-i1',
            title: 'Shinjuku Gece Hayatı',
            category: 'entertainment',
            placeId: null,
            startTime: '20:00',
            durationMinutes: 180,
            estimatedCost: 40,
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80',
            note: null,
          },
        ],
      },
    ],
  },
  {
    id: 'plan-2',
    title: "Bali'de 7 günlük yeni macera",
    destinationCity: 'Denpasar (Bali)',
    destinationCountryCode: 'ID',
    startDate: '2026-07-12',
    endDate: '2026-07-19',
    travelers: { adults: 2 },
    budgetTier: 'comfort',
    budgetAmount: 1800,
    budgetCurrency: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    days: [
      {
        id: 'plan-2-d1',
        dayNumber: 1,
        date: '2026-07-12',
        theme: 'Doğa',
        items: [
          {
            id: 'plan-2-d1-i1',
            title: 'Tegallalang Pirinç Terasları',
            category: 'nature',
            placeId: 'pl-bali-tegallalang',
            startTime: '08:00',
            durationMinutes: 150,
            estimatedCost: 10,
            imageUrl: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=900&q=80',
            note: null,
          },
        ],
      },
      {
        id: 'plan-2-d2',
        dayNumber: 2,
        date: '2026-07-13',
        theme: 'Plaj',
        items: [
          {
            id: 'plan-2-d2-i1',
            title: 'Uluwatu Plajı & Sörf',
            category: 'nature',
            placeId: null,
            startTime: '09:00',
            durationMinutes: 240,
            estimatedCost: 25,
            imageUrl: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=900&q=80',
            note: null,
          },
          {
            id: 'plan-2-d2-i2',
            title: 'Warung Akşam Yemeği',
            category: 'restaurant',
            placeId: null,
            startTime: '19:00',
            durationMinutes: 90,
            estimatedCost: 18,
            imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
            note: null,
          },
        ],
      },
    ],
  },
  {
    id: 'plan-3',
    title: "Avustralya'yı ilk kez keşfet",
    destinationCity: 'Sidney',
    destinationCountryCode: 'AU',
    startDate: '2026-09-05',
    endDate: '2026-09-16',
    travelers: { adults: 2, children: 1 },
    budgetTier: 'luxury',
    budgetAmount: 2500,
    budgetCurrency: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80',
    days: [
      {
        id: 'plan-3-d1',
        dayNumber: 1,
        date: '2026-09-05',
        theme: 'Liman',
        items: [
          {
            id: 'plan-3-d1-i1',
            title: 'Sydney Opera House Turu',
            category: 'landmark',
            placeId: null,
            startTime: '10:00',
            durationMinutes: 90,
            estimatedCost: 45,
            imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=900&q=80',
            note: null,
          },
        ],
      },
      {
        id: 'plan-3-d2',
        dayNumber: 2,
        date: '2026-09-06',
        theme: 'Macera',
        items: [
          {
            id: 'plan-3-d2-i1',
            title: 'Blue Mountains Yürüyüşü',
            category: 'nature',
            placeId: null,
            startTime: '08:00',
            durationMinutes: 300,
            estimatedCost: 60,
            imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
            note: null,
          },
        ],
      },
    ],
  },
  {
    id: 'plan-4',
    title: "Kyoto'da 6 günlük kültür gezisi",
    destinationCity: 'Kyoto',
    destinationCountryCode: 'JP',
    startDate: '2026-04-02',
    endDate: '2026-04-08',
    travelers: { adults: 1 },
    budgetTier: 'standard',
    budgetAmount: 1400,
    budgetCurrency: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
    days: [
      {
        id: 'plan-4-d1',
        dayNumber: 1,
        date: '2026-04-02',
        theme: 'Tapınaklar',
        items: [
          {
            id: 'plan-4-d1-i1',
            title: 'Fushimi Inari Taisha',
            category: 'landmark',
            placeId: 'pl-kyoto-fushimi',
            startTime: '09:00',
            durationMinutes: 120,
            estimatedCost: 0,
            imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&q=80',
            note: null,
          },
        ],
      },
      {
        id: 'plan-4-d2',
        dayNumber: 2,
        date: '2026-04-03',
        theme: 'Doğa & Çay',
        items: [
          {
            id: 'plan-4-d2-i1',
            title: 'Arashiyama Bambu Korusu',
            category: 'nature',
            placeId: null,
            startTime: '10:00',
            durationMinutes: 90,
            estimatedCost: 0,
            imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80',
            note: null,
          },
          {
            id: 'plan-4-d2-i2',
            title: 'Geleneksel Çay Evi',
            category: 'restaurant',
            placeId: null,
            startTime: '13:00',
            durationMinutes: 60,
            estimatedCost: 12,
            imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
            note: null,
          },
        ],
      },
    ],
  },
];

const GENERIC_ITEM_TEMPLATES: Omit<PlanItemVM, 'id'>[] = [
  {
    title: 'Şehir Merkezi Yürüyüş Turu',
    category: 'attraction',
    placeId: null,
    startTime: '10:00',
    durationMinutes: 120,
    estimatedCost: 15,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&q=80',
    note: null,
  },
  {
    title: 'Yerel Mutfak Deneyimi',
    category: 'restaurant',
    placeId: null,
    startTime: '13:00',
    durationMinutes: 90,
    estimatedCost: 25,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    note: null,
  },
  {
    title: 'Gün Batımı Manzara Noktası',
    category: 'nature',
    placeId: null,
    startTime: '18:30',
    durationMinutes: 60,
    estimatedCost: 0,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
    note: null,
  },
];

/** Sihirbazdan gelen yeni bir `Trip` için basit, deterministik bir plan üretir. */
function synthesizePlanForTrip(tripId: string): PlanDetailVM | null {
  const trip = getTripById(tripId);
  if (!trip) return null;

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const dayCount = Math.max(1, Math.min(6, Math.round((+end - +start) / 86_400_000) + 1));

  const days: PlanDayVM[] = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const template = GENERIC_ITEM_TEMPLATES[i % GENERIC_ITEM_TEMPLATES.length];
    return {
      id: `${trip.id}-d${i + 1}`,
      dayNumber: i + 1,
      date: date.toISOString().slice(0, 10),
      theme: null,
      items: [{ ...template, id: `${trip.id}-d${i + 1}-i1` }],
    };
  });

  return {
    id: trip.id,
    title: trip.title ?? `${trip.destinationCity} Gezisi`,
    destinationCity: trip.destinationCity,
    destinationCountryCode: trip.destinationCountryCode,
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: trip.travelers,
    budgetTier: trip.budgetTier,
    budgetAmount: trip.budgetAmount,
    budgetCurrency: trip.budgetCurrency,
    coverImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    days,
  };
}

export function getPlanDetail(id: string | undefined): PlanDetailVM | null {
  if (!id) return null;
  const staticPlan = MOCK_PLAN_DETAILS.find((p) => p.id === id);
  if (staticPlan) return staticPlan;
  return synthesizePlanForTrip(id);
}
