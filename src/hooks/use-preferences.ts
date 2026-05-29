import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import i18n from '@/i18n';
import { detectLanguage } from '@/i18n/detect-language';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  hydratePreferences,
  setDisplayName as persistDisplayName,
  setLanguagePreference as persistLanguage,
  setThemePreference as persistTheme,
  type LanguagePreference,
  type ThemePreference,
} from '@/storage/app-storage';

/**
 * Kullanıcı tercihleri (tema + dil + görünen ad) — tek kaynak.
 *
 * Profilden değiştirilen tema/dil burada tutulur, kalıcı yazılır ve anında
 * uygulanır:
 *  - Tema: `colorScheme` çözülür ('system' → cihaz teması), `use-theme` ve
 *    kök `ThemeProvider` bunu okur.
 *  - Dil: `i18next.changeLanguage` çağrılır → tüm `useTranslation` tüketicileri
 *    yeniden render olur ('system' → cihaz dili).
 *
 * Mount'ta `hydratePreferences()` ile tek IO turunda okunur; bu sırada cihaz
 * varsayılanları kullanılır (görünür sıçrama olmaz).
 */
export type ResolvedScheme = 'light' | 'dark';

export interface PreferencesApi {
  /** Ham tema tercihi ('system' iken cihazı izler). */
  themePreference: ThemePreference;
  /** Uygulanacak nihai tema. */
  colorScheme: ResolvedScheme;
  /** Ham dil tercihi ('system' iken cihazı izler). */
  language: LanguagePreference;
  /** Uygulanacak nihai dil kodu. */
  resolvedLanguage: 'en' | 'tr';
  /** Profilde girilen görünen ad (yoksa null → mock ad kullanılır). */
  displayName: string | null;
  setThemePreference: (value: ThemePreference) => Promise<void>;
  setLanguage: (value: LanguagePreference) => Promise<void>;
  setDisplayName: (value: string | null) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesApi | null>(null);

/** 'system' tercihini cihaz diline indirger. */
function resolveLanguage(pref: LanguagePreference): 'en' | 'tr' {
  return pref === 'system' ? detectLanguage() : pref;
}

export function usePreferencesValue(): PreferencesApi {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePref] = useState<ThemePreference>('system');
  const [language, setLanguageState] = useState<LanguagePreference>('system');
  const [displayName, setDisplayNameState] = useState<string | null>(null);

  // Mount'ta kalıcı tercihleri oku ve uygula.
  useEffect(() => {
    let active = true;
    void (async () => {
      const prefs = await hydratePreferences();
      if (!active) return;
      setThemePref(prefs.theme);
      setLanguageState(prefs.language);
      setDisplayNameState(prefs.displayName);
      const lng = resolveLanguage(prefs.language);
      if (i18n.language !== lng) {
        void i18n.changeLanguage(lng);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setThemePreference = useCallback(async (value: ThemePreference) => {
    setThemePref(value);
    await persistTheme(value);
  }, []);

  const setLanguage = useCallback(async (value: LanguagePreference) => {
    setLanguageState(value);
    await persistLanguage(value);
    await i18n.changeLanguage(resolveLanguage(value));
  }, []);

  const setDisplayName = useCallback(async (value: string | null) => {
    const trimmed = value?.trim() || null;
    setDisplayNameState(trimmed);
    await persistDisplayName(trimmed);
  }, []);

  const colorScheme: ResolvedScheme =
    themePreference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themePreference;

  return {
    themePreference,
    colorScheme,
    language,
    resolvedLanguage: resolveLanguage(language),
    displayName,
    setThemePreference,
    setLanguage,
    setDisplayName,
  };
}

export const PreferencesProvider = PreferencesContext.Provider;

/** Tercih context'ini tüketir; provider dışında çağrılırsa hata verir. */
export function usePreferences(): PreferencesApi {
  const ctx = useContext(PreferencesContext);
  if (ctx === null) {
    throw new Error('usePreferences must be used within <PreferencesProvider>.');
  }
  return ctx;
}
