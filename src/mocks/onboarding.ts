/**
 * Onboarding slayt verisi — yerel karakter görselleri + slayt anahtarları.
 * Metinler i18n'den (`content:onboarding.<key>.*`) çözülür; buradaki `title`/
 * `subtitle` yalnız fallback (defaultValue) içindir. Görsellerin beyaz zemini
 * dosyaya gömülüdür; slayt bu yüzden her temada açık renkli bir artwork paneli
 * içinde gösterir (bkz. onboarding-slide.tsx `ART_SURFACE`).
 */

import type { OnboardingSlideData } from '@/components/onboarding/onboarding-slide';

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    key: 'discover',
    title: "Don't know where to start?",
    subtitle: "So many options can feel overwhelming at first — let's make it simple.",
    image: require('@/assets/images/onboarding/onboarding.webp'),
  },
  {
    key: 'plan',
    title: 'Let Tripso plan it for you',
    subtitle: 'Tell us your style and get a day-by-day itinerary in seconds.',
    image: require('@/assets/images/onboarding/onboarding2.webp'),
  },
  {
    key: 'go',
    title: 'Just go and enjoy',
    subtitle: 'Every plan, place and detail in one place — focus on the experience.',
    image: require('@/assets/images/onboarding/onboarding3.webp'),
  },
];
