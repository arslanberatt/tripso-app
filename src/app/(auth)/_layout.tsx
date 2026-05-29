import { Stack } from 'expo-router';

/** Auth grubu — login/register başlıksız stack (ekranlar kendi başlığını çizer). */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
