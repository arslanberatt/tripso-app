import { Stack } from 'expo-router';

/** Onboarding grubu — başlıksız stack (tek `welcome` ekranı; ileride genişler). */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
