import { Redirect } from 'expo-router';

import { useAppBootstrap } from '@/hooks/use-app-bootstrap';

/**
 * Entry (`/`) — deterministik başlangıç yönlendirmesi (flash'sız gate).
 *
 * Kalıcı bayraklar (`AppBootstrapProvider`) hydrate olurken `null` döneriz;
 * o sırada `AnimatedSplashOverlay` hâlâ görünür → yanıp sönme (flash) olmaz.
 *  - oturum varsa → Home
 *  - onboarding görülmemişse → Welcome (onboarding)
 *  - onboard olmuş ama oturum yoksa → Login
 */
export default function Index() {
  const { isHydrating, hasOnboarded, isAuthenticated } = useAppBootstrap();

  if (isHydrating) return null; // splash hâlâ boyuyor → flash yok
  if (isAuthenticated) return <Redirect href="/home" />;
  if (!hasOnboarded) return <Redirect href="/welcome" />;
  return <Redirect href="/login" />;
}
