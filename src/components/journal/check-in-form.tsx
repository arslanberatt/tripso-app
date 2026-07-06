import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppInput } from '@/components/ui/input';
import { Radii, Spacing } from '@/constants/theme';

export type CheckInInput = { placeName: string; city: string; caption: string };

/** CheckInForm — yer adı + şehir + not; form state'i içeride, submit dışarıda. */
export function CheckInForm({ onSubmit }: { onSubmit: (input: CheckInInput) => void }) {
  const { t } = useTranslation();
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [caption, setCaption] = useState('');

  const submit = () => {
    if (!placeName.trim() || !city.trim()) return;
    onSubmit({ placeName: placeName.trim(), city: city.trim(), caption: caption.trim() });
    setPlaceName('');
    setCity('');
    setCaption('');
  };

  return (
    <Card radius={Radii.lg}>
      <View style={styles.form}>
        <ThemedText type="h3">{t('pages:journal.addPinTitle')}</ThemedText>
        <AppInput placeholder={t('pages:journal.placeName')} value={placeName} onChangeText={setPlaceName} />
        <AppInput placeholder={t('pages:journal.city')} value={city} onChangeText={setCity} />
        <AppInput placeholder={t('pages:journal.caption')} value={caption} onChangeText={setCaption} />
        <AppButton label={t('pages:journal.save')} onPress={submit} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.two, padding: Spacing.three },
});
