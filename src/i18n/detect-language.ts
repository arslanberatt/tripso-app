import { getLocales } from 'expo-localization';

/**
 * Cihaz dilini desteklenen sete (`tr` / `en`) indirger.
 *
 * `getLocales()` SDK 56'da SENKRON çalışır ve en az bir eleman döner; ilk render
 * öncesi dil belirlensin diye hook yerine bunu kullanıyoruz. `languageCode`
 * bölge içermez (ör. "tr", "en"). Türkçe değilse İngilizceye düşeriz (fallback).
 *
 * Not: tr ve en ikisi de LTR; bu yüzden RTL (I18nManager) işi YOK.
 */
export const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: AppLanguage = 'en';

export function detectLanguage(): AppLanguage {
  // getLocales() web'de de çalışır (navigator.language üzerinden).
  const code = getLocales()[0]?.languageCode;
  return code === 'tr' ? 'tr' : FALLBACK_LANGUAGE;
}
