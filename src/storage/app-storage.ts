import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageKeys } from '@/storage/keys';

/**
 * AsyncStorage üzerine tipli ince sarmal — uygulamanın tek kalıcı veri kapısı.
 *
 * Web'de localStorage, native'de async storage ile çalışır (SDK 56). Tüm
 * okuma/yazma buradan geçer; ekran/hook'lar ham anahtarlara dokunmaz.
 */

/** Mock oturum şekli; gerçek API'de token/refresh ile değişecek. TODO(api). */
export interface StoredSession {
  /** Mock kullanıcı kimliği veya e-postası. */
  userId: string;
  /** Oturumun oluşturulma anı (ISO). */
  createdAt: string;
}

export async function getOnboarded(): Promise<boolean> {
  return (await AsyncStorage.getItem(StorageKeys.HAS_ONBOARDED)) === 'true';
}

export async function setOnboarded(value: boolean): Promise<void> {
  if (value) {
    await AsyncStorage.setItem(StorageKeys.HAS_ONBOARDED, 'true');
  } else {
    await AsyncStorage.removeItem(StorageKeys.HAS_ONBOARDED);
  }
}

export async function getSession(): Promise<StoredSession | null> {
  const raw = await AsyncStorage.getItem(StorageKeys.SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    // Bozuk JSON → oturumu yok say (ve temizle), çökme yerine zarif düşüş.
    await AsyncStorage.removeItem(StorageKeys.SESSION);
    return null;
  }
}

export async function setSession(session: StoredSession): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.SESSION, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(StorageKeys.SESSION);
}

/** Kullanıcı tercihleri (tema/dil/ad) — profilden düzenlenir, kalıcı saklanır. */
export type ThemePreference = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | 'en' | 'tr';

export interface StoredPreferences {
  theme: ThemePreference;
  language: LanguagePreference;
  displayName: string | null;
}

const THEME_VALUES: ThemePreference[] = ['system', 'light', 'dark'];
const LANGUAGE_VALUES: LanguagePreference[] = ['system', 'en', 'tr'];

/**
 * Tercihleri tek turda okur (tema + dil + ad). Geçersiz/eksik değerler
 * güvenli varsayılana ('system' / null) düşer.
 */
export async function hydratePreferences(): Promise<StoredPreferences> {
  const pairs = await AsyncStorage.multiGet([
    StorageKeys.THEME,
    StorageKeys.LANGUAGE,
    StorageKeys.DISPLAY_NAME,
  ]);
  const map = new Map(pairs);

  const rawTheme = map.get(StorageKeys.THEME);
  const theme = THEME_VALUES.includes(rawTheme as ThemePreference)
    ? (rawTheme as ThemePreference)
    : 'system';

  const rawLang = map.get(StorageKeys.LANGUAGE);
  const language = LANGUAGE_VALUES.includes(rawLang as LanguagePreference)
    ? (rawLang as LanguagePreference)
    : 'system';

  const displayName = map.get(StorageKeys.DISPLAY_NAME) ?? null;

  return { theme, language, displayName };
}

export async function setThemePreference(value: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.THEME, value);
}

export async function setLanguagePreference(value: LanguagePreference): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.LANGUAGE, value);
}

export async function setDisplayName(value: string | null): Promise<void> {
  const trimmed = value?.trim();
  if (trimmed) {
    await AsyncStorage.setItem(StorageKeys.DISPLAY_NAME, trimmed);
  } else {
    await AsyncStorage.removeItem(StorageKeys.DISPLAY_NAME);
  }
}

/**
 * Boot'ta iki bayrağı tek turda okur (çift okuma/flicker'ı önler).
 * `multiGet` AsyncStorage'da tek IO turu yapar.
 */
export async function hydrateBootstrap(): Promise<{
  hasOnboarded: boolean;
  session: StoredSession | null;
}> {
  const pairs = await AsyncStorage.multiGet([StorageKeys.HAS_ONBOARDED, StorageKeys.SESSION]);
  const map = new Map(pairs);
  const hasOnboarded = map.get(StorageKeys.HAS_ONBOARDED) === 'true';

  let session: StoredSession | null = null;
  const rawSession = map.get(StorageKeys.SESSION);
  if (rawSession) {
    try {
      session = JSON.parse(rawSession) as StoredSession;
    } catch {
      await AsyncStorage.removeItem(StorageKeys.SESSION);
    }
  }

  return { hasOnboarded, session };
}
