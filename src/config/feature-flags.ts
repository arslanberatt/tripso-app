/**
 * Derleme-zamanı özellik bayrakları (`.env` üzerinden).
 *
 * Expo, `EXPO_PUBLIC_*` ile başlayan değişkenleri paket içine string olarak
 * inler (SDK 56). Bu yüzden değerleri `=== 'true'` ile boolean'a çeviririz.
 * Değişiklik sonrası Metro'yu yeniden başlatmak gerekir (gerekirse `-c`).
 *
 * authEmailEnabled: e-posta/şifre giriş + kayıt akışını açar. Varsayılan KAPALI
 * → yalnız Google + Apple. Kapalıyken e-posta/şifre kodu silinmez, sadece UI'dan
 * gizlenir (route'lar erişilemez kalır). Açmak için `.env`:
 *   EXPO_PUBLIC_AUTH_EMAIL_ENABLED=true
 */
export const FeatureFlags = {
  authEmailEnabled: process.env.EXPO_PUBLIC_AUTH_EMAIL_ENABLED === 'true',
} as const;
