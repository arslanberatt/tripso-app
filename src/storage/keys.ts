/**
 * AsyncStorage anahtarları — tek yerden yönetilir (çakışmayı önler).
 *
 * `@tripso/` öneki uygulamaya ait anahtarları diğer kütüphanelerden ayırır.
 */
export const StorageKeys = {
  /** Onboarding tamamlandı mı? ('true' | yok). */
  HAS_ONBOARDED: '@tripso/has-onboarded',
  /** Mock oturum (JSON); varlığı = kullanıcı giriş yapmış demektir. */
  SESSION: '@tripso/session',
  /** Kullanıcının seçtiği dil tercihi ('system' | 'en' | 'tr'). */
  LANGUAGE: '@tripso/language',
  /** Kullanıcının seçtiği tema tercihi ('system' | 'light' | 'dark'). */
  THEME: '@tripso/theme',
  /** Profilde girilen görünen ad (mock; API gelince /users/me'den gelecek). */
  DISPLAY_NAME: '@tripso/display-name',
} as const;
