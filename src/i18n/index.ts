import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { detectLanguage, FALLBACK_LANGUAGE } from '@/i18n/detect-language';

import enAuth from '@/i18n/locales/en/auth.json';
import enCommon from '@/i18n/locales/en/common.json';
import enContent from '@/i18n/locales/en/content.json';
import enHome from '@/i18n/locales/en/home.json';
import enOnboarding from '@/i18n/locales/en/onboarding.json';
import trAuth from '@/i18n/locales/tr/auth.json';
import trCommon from '@/i18n/locales/tr/common.json';
import trContent from '@/i18n/locales/tr/content.json';
import trHome from '@/i18n/locales/tr/home.json';
import trOnboarding from '@/i18n/locales/tr/onboarding.json';

/**
 * i18next kurulumu (yan-etkili import: `import '@/i18n'` ile tetiklenir).
 *
 * Strateji (Expo SDK 56 doğrulandı):
 *  - `resources` statik import → senkron paketlenir (ilk render'da `t()` hazır).
 *  - `lng` cihaz dilinden (`detectLanguage`), `fallbackLng` her zaman İngilizce.
 *  - `useSuspense:false` + `initAsync:false`: RN'de Suspense sınırı gerekmez,
 *    init senkron biter → ekranlar boş frame görmez (i18next v26: eski adı
 *    `initImmediate`).
 *  - Provider GEREKMEZ; react-i18next default instance + `useTranslation()` yeterli.
 *
 * Yeni dil eklemek: locales/<lng>/*.json ekle, buraya resources'a bağla,
 * detect-language.ts'deki SUPPORTED_LANGUAGES'i genişlet. Yeni anahtar eklemek:
 * ilgili namespace JSON'una hem en hem tr için aynı key'i ekle.
 */
export const defaultNS = 'common';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    onboarding: enOnboarding,
    content: enContent,
  },
  tr: {
    common: trCommon,
    auth: trAuth,
    home: trHome,
    onboarding: trOnboarding,
    content: trContent,
  },
} as const;

// eslint-disable-next-line import/no-named-as-default-member -- i18next zincir API'si (i18n.use)
void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  ns: ['common', 'auth', 'home', 'onboarding', 'content'],
  defaultNS,
  interpolation: { escapeValue: false }, // RN/React zaten escape eder; {{name}} + emoji düzgün gelsin
  react: { useSuspense: false },
  initAsync: false,
});

export default i18n;
