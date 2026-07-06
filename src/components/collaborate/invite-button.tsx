import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton } from '@/components/ui/button';

/**
 * InviteButton — davet linkini panoya kopyalar, kısa süre "kopyalandı" gösterir.
 * Timeout ref'te tutulur ve unmount'ta temizlenir (unmount sonrası setState yok).
 */
export function InviteButton({ planId }: { planId: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const copyInvite = () => {
    void Clipboard.setStringAsync(`https://tripso.app/plan/${planId}`);
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AppButton
      label={copied ? t('pages:collaborate.inviteCopied') : t('pages:collaborate.invite')}
      leadingIcon={copied ? 'checkmark' : 'link-outline'}
      variant="secondary"
      onPress={copyInvite}
    />
  );
}
