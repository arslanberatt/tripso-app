import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Radii } from '@/constants/theme';
import type { SettingsRowProps } from '@/components/ui/settings-row';

/**
 * SettingsGroup — `SettingsRow`'ları bir kartta toplar ve son satır hariç
 * hepsine alt ayraç (`divider`) ekler. Boş/`null` çocuklar atlanır.
 */
export function SettingsGroup({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<SettingsRowProps>[];

  return (
    <Card radius={Radii.lg}>
      {rows.map((row, i) =>
        cloneElement(row, { key: row.key ?? i, divider: i < rows.length - 1 }),
      )}
    </Card>
  );
}
