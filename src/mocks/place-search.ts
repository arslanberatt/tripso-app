/**
 * Trip Sihirbazı'ndaki destinasyon adımı için sahte "geocoding" sonuçları.
 * Gerçek entegrasyonda Mapbox Geocoding/Search Box API'den gelecek — kullanıcı
 * asla serbest metin göndermez, yalnızca bu listeden (veya API sonuçlarından)
 * seçim yapar. Bkz. docs/product-plan.md §3.1 / §5.1.
 */

export interface PlaceSearchResultVM {
  id: string;
  city: string;
  countryCode: string;
  countryName: string;
  coordinates: { lat: number; lng: number };
}

export const MOCK_SEARCHABLE_PLACES: PlaceSearchResultVM[] = [
  { id: 'geo-paris', city: 'Paris', countryCode: 'FR', countryName: 'Fransa', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { id: 'geo-rome', city: 'Roma', countryCode: 'IT', countryName: 'İtalya', coordinates: { lat: 41.9028, lng: 12.4964 } },
  { id: 'geo-amsterdam', city: 'Amsterdam', countryCode: 'NL', countryName: 'Hollanda', coordinates: { lat: 52.3676, lng: 4.9041 } },
  { id: 'geo-santorini', city: 'Santorini', countryCode: 'GR', countryName: 'Yunanistan', coordinates: { lat: 36.3932, lng: 25.4615 } },
  { id: 'geo-bali', city: 'Denpasar (Bali)', countryCode: 'ID', countryName: 'Endonezya', coordinates: { lat: -8.65, lng: 115.2167 } },
  { id: 'geo-kyoto', city: 'Kyoto', countryCode: 'JP', countryName: 'Japonya', coordinates: { lat: 35.0116, lng: 135.7681 } },
  { id: 'geo-tokyo', city: 'Tokyo', countryCode: 'JP', countryName: 'Japonya', coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: 'geo-barcelona', city: 'Barcelona', countryCode: 'ES', countryName: 'İspanya', coordinates: { lat: 41.3874, lng: 2.1686 } },
  { id: 'geo-lisbon', city: 'Lizbon', countryCode: 'PT', countryName: 'Portekiz', coordinates: { lat: 38.7223, lng: -9.1393 } },
  { id: 'geo-prague', city: 'Prag', countryCode: 'CZ', countryName: 'Çekya', coordinates: { lat: 50.0755, lng: 14.4378 } },
  { id: 'geo-vienna', city: 'Viyana', countryCode: 'AT', countryName: 'Avusturya', coordinates: { lat: 48.2082, lng: 16.3738 } },
  { id: 'geo-london', city: 'Londra', countryCode: 'GB', countryName: 'Birleşik Krallık', coordinates: { lat: 51.5072, lng: -0.1276 } },
  { id: 'geo-newyork', city: 'New York', countryCode: 'US', countryName: 'ABD', coordinates: { lat: 40.7128, lng: -74.006 } },
  { id: 'geo-dubai', city: 'Dubai', countryCode: 'AE', countryName: 'BAE', coordinates: { lat: 25.2048, lng: 55.2708 } },
  { id: 'geo-sydney', city: 'Sidney', countryCode: 'AU', countryName: 'Avustralya', coordinates: { lat: -33.8688, lng: 151.2093 } },
  { id: 'geo-istanbul', city: 'İstanbul', countryCode: 'TR', countryName: 'Türkiye', coordinates: { lat: 41.0082, lng: 28.9784 } },
];

/** Sorguya göre filtreler (case-insensitive, şehir/ülke adı içinde arar). */
export function searchPlaces(query: string): PlaceSearchResultVM[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_SEARCHABLE_PLACES.slice(0, 6);
  return MOCK_SEARCHABLE_PLACES.filter(
    (p) => p.city.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q),
  );
}
