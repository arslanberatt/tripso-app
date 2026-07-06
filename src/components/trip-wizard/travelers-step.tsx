import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { OCCASIONS } from '@/components/trip-wizard/constants';
import { ChipGroup } from '@/components/wizard/chip-group';
import { StepHeading } from '@/components/wizard/step-heading';
import { Stepper } from '@/components/wizard/stepper';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';
import type { Occasion, Travelers } from '@/types';

export type TravelersStepProps = {
  travelers: Travelers;
  setTravelers: (v: Travelers) => void;
  occasion: Occasion | null;
  setOccasion: (v: Occasion | null) => void;
};

export function TravelersStep({ travelers, setTravelers, occasion, setOccasion }: TravelersStepProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.travelers.title')} subtitle={t('pages:wizard.travelers.subtitle')} />
      <Card radius={Radii.lg}>
        <View style={styles.stepperCard}>
          <Stepper
            label={t('pages:wizard.travelers.adults')}
            value={travelers.adults}
            min={1}
            onChange={(adults) => setTravelers({ ...travelers, adults })}
          />
          <Stepper
            label={t('pages:wizard.travelers.children')}
            value={travelers.children ?? 0}
            onChange={(children) => setTravelers({ ...travelers, children })}
          />
          <Stepper
            label={t('pages:wizard.travelers.seniors')}
            value={travelers.seniors ?? 0}
            onChange={(seniors) => setTravelers({ ...travelers, seniors })}
          />
        </View>
      </Card>

      <ThemedText type="small" themeColor="textSecondary">
        {t('pages:wizard.travelers.occasionLabel')}
      </ThemedText>
      <ChipGroup
        options={[
          { key: 'none', label: t('pages:wizard.travelers.occasionNone') },
          ...OCCASIONS.map((o) => ({ key: o, label: t(`pages:occasion.${o}`) })),
        ]}
        selectedKeys={[occasion ?? 'none']}
        onSelect={(key) => setOccasion(key === 'none' ? null : (key as Occasion))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  stepperCard: { gap: Spacing.three, padding: Spacing.three },
});
