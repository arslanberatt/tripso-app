/**
 * Auth durumu + aksiyonları — `AppBootstrapProvider` üzerine ince selector.
 *
 * Gerçek state ve persist mantığı `use-app-bootstrap` içinde tek noktada tutulur
 * (oturum AsyncStorage'a yazılır). Bu hook geriye dönük uyumluluk için kalır:
 * mevcut `login.tsx`/`register.tsx` import'ları bozulmaz.
 *
 * TODO(api): gerçek istekler `use-app-bootstrap` içindeki aksiyonlarda yapılacak.
 */

import { useAppBootstrap } from '@/hooks/use-app-bootstrap';

export interface AuthApi {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthApi {
  const {
    isAuthenticated,
    isSubmitting,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    register,
    signOut,
  } = useAppBootstrap();

  return {
    isAuthenticated,
    isSubmitting,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    register,
    signOut,
  };
}
