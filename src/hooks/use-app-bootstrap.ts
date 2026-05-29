import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  clearSession,
  hydrateBootstrap,
  setOnboarded,
  setSession,
  type StoredSession,
} from '@/storage/app-storage';

/**
 * Uygulama açılış (bootstrap) durumu + auth aksiyonları — tek kaynak.
 *
 * Mount'ta `hydrateBootstrap()` ile iki kalıcı bayrağı (onboarding + oturum)
 * tek IO turunda okur; bu sırada `isHydrating=true` olur ve `index.tsx` boş
 * frame döner (splash hâlâ görünür → flash yok). Hydrate bitince deterministik
 * yönlendirme yapılır.
 *
 * Auth aksiyonları şimdilik mock; başarıda `SESSION` persist eder.
 * TODO(api):
 *   - signInWithEmail → POST /auth/login, token'ları SecureStore'a yaz
 *   - signInWithGoogle(idToken) → POST /auth/google/mobile
 *   - signInWithApple(identityToken) → POST /auth/apple/mobile
 *   - register → POST /auth/register
 *   - signOut → token + session temizle
 */
export interface AppBootstrapApi {
  /** Kalıcı bayraklar henüz okunuyor mu? true iken yönlendirme bekletilir. */
  isHydrating: boolean;
  /** Onboarding daha önce tamamlandı mı? */
  hasOnboarded: boolean;
  /** Geçerli (mock) oturum var mı? */
  isAuthenticated: boolean;
  /** Bir auth isteği sürüyor mu (buton spinner'ı için)? */
  isSubmitting: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Onboarding'i "görüldü" işaretler (kalıcı). */
  completeOnboarding: () => Promise<void>;
  /** Onboarding bayrağını sıfırlar → bir sonraki gate'te `/welcome` tekrar görünür. */
  resetOnboarding: () => Promise<void>;
}

const AppBootstrapContext = createContext<AppBootstrapApi | null>(null);

/** Mock oturum üretir (gerçek API token döndürene kadar). */
function createMockSession(userId: string): StoredSession {
  return { userId, createdAt: new Date().toISOString() };
}

export function useAppBootstrapValue(): AppBootstrapApi {
  const [isHydrating, setIsHydrating] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mount'ta kalıcı bayrakları tek turda hydrate et.
  useEffect(() => {
    let active = true;
    void (async () => {
      const { hasOnboarded: onboarded, session } = await hydrateBootstrap();
      if (!active) return;
      setHasOnboarded(onboarded);
      setIsAuthenticated(session !== null);
      setIsHydrating(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // TODO(api): gerçek istek burada. Şimdilik mock oturum yazıp bayrağı çeviriyoruz.
  const signInWithEmail = useCallback(async (email: string, _password: string) => {
    setIsSubmitting(true);
    await setSession(createMockSession(email));
    setIsAuthenticated(true);
    setIsSubmitting(false);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await setSession(createMockSession('google-user'));
    setIsAuthenticated(true);
  }, []);

  const signInWithApple = useCallback(async () => {
    await setSession(createMockSession('apple-user'));
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (email: string, _password: string, _name: string) => {
    setIsSubmitting(true);
    await setSession(createMockSession(email));
    setIsAuthenticated(true);
    setIsSubmitting(false);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setIsAuthenticated(false);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await setOnboarded(true);
    setHasOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await setOnboarded(false);
    setHasOnboarded(false);
  }, []);

  return {
    isHydrating,
    hasOnboarded,
    isAuthenticated,
    isSubmitting,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    register,
    signOut,
    completeOnboarding,
    resetOnboarding,
  };
}

export const AppBootstrapProvider = AppBootstrapContext.Provider;

/** Bootstrap context'ini tüketir; provider dışında çağrılırsa hata verir. */
export function useAppBootstrap(): AppBootstrapApi {
  const ctx = useContext(AppBootstrapContext);
  if (ctx === null) {
    throw new Error('useAppBootstrap must be used within <AppBootstrapProvider>.');
  }
  return ctx;
}
