import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AboutStep } from '@/components/personalize/about-step';
import { AGE_GROUPS, STEP_COUNT } from '@/components/personalize/constants';
import { DoneView } from '@/components/personalize/done-view';
import { InterestsStep } from '@/components/personalize/interests-step';
import { ReviewStep } from '@/components/personalize/review-step';
import { StyleStep } from '@/components/personalize/style-step';
import { TastesStep } from '@/components/personalize/tastes-step';
import { WizardFrame } from '@/components/wizard/wizard-frame';
import { useProfile } from '@/hooks/data/use-profile';
import { usePreferences } from '@/hooks/use-preferences';
import { updateProfile } from '@/mocks/profile-store';
import type { AccommodationTier, Alcohol, Pace } from '@/types';

/**
 * Personalize (`/personalize`) — çok adımlı kişiselleştirme sihirbazı (modal).
 *
 * Ad + yaş → alkol + diyet → tempo + konaklama → ilgi alanları → özet.
 * Ad `setDisplayName` ile kalıcı; diğer alanlar `profile-store`'a (mock) yazılır
 * ve AI plan önerilerinin `ProfileSnapshot`'ını besler. Adım içerikleri
 * `src/components/personalize/` altında; iskelet `WizardFrame`.
 */
export default function PersonalizeScreen() {
  const { t } = useTranslation();
  const { data } = useProfile();
  const { displayName, setDisplayName } = usePreferences();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [name, setName] = useState(displayName ?? data.user.name);
  const [ageGroup, setAgeGroup] = useState<string>(
    AGE_GROUPS.includes(data.profile.ageGroup as (typeof AGE_GROUPS)[number])
      ? data.profile.ageGroup
      : '25_34',
  );
  const [alcohol, setAlcohol] = useState<Alcohol>(data.profile.alcohol);
  const [dietary, setDietary] = useState<string[]>(
    data.profile.dietary.length > 0 ? data.profile.dietary : ['none'],
  );
  const [pace, setPace] = useState<Pace>(data.profile.pace);
  const [accommodation, setAccommodation] = useState<AccommodationTier>(data.profile.accommodationTier);
  const [interests, setInterests] = useState<string[]>(data.profile.interests);

  const toggleDietary = (key: string) =>
    setDietary((prev) => {
      // "Kısıtlama yok" diğerlerini temizler; başka bir seçim "yok"u kaldırır.
      if (key === 'none') return ['none'];
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev.filter((k) => k !== 'none'), key];
      return next.length > 0 ? next : ['none'];
    });

  const toggleInterest = (key: string) =>
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const save = () => {
    void setDisplayName(name);
    updateProfile({
      ageGroup,
      alcohol,
      dietary: dietary.filter((d) => d !== 'none'),
      pace,
      accommodationTier: accommodation,
      interests,
    });
    setDone(true);
  };

  const goNext = () => {
    if (step < STEP_COUNT - 1) setStep((s) => s + 1);
    else save();
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  if (done) return <DoneView onDone={() => router.back()} />;

  return (
    <WizardFrame
      title={t('pages:personalize.title')}
      stepText={t('pages:personalize.step', { current: step + 1, total: STEP_COUNT })}
      progress={(step + 1) / STEP_COUNT}
      backLabel={t('pages:personalize.back')}
      nextLabel={step === STEP_COUNT - 1 ? t('pages:personalize.save') : t('pages:personalize.next')}
      nextIcon={step === STEP_COUNT - 1 ? 'checkmark' : 'chevron-forward'}
      nextDisabled={step === 0 && name.trim().length === 0}
      closeLabel={t('common:close')}
      onClose={() => router.back()}
      onBack={goBack}
      onNext={goNext}
    >
      {step === 0 && <AboutStep name={name} setName={setName} ageGroup={ageGroup} setAgeGroup={setAgeGroup} />}
      {step === 1 && (
        <TastesStep alcohol={alcohol} setAlcohol={setAlcohol} dietary={dietary} toggleDietary={toggleDietary} />
      )}
      {step === 2 && (
        <StyleStep pace={pace} setPace={setPace} accommodation={accommodation} setAccommodation={setAccommodation} />
      )}
      {step === 3 && <InterestsStep interests={interests} toggleInterest={toggleInterest} />}
      {step === 4 && (
        <ReviewStep
          name={name}
          ageGroup={ageGroup}
          alcohol={alcohol}
          dietary={dietary}
          pace={pace}
          accommodation={accommodation}
          interests={interests}
        />
      )}
    </WizardFrame>
  );
}
