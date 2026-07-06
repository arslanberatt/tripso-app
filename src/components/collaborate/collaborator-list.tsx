import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Spacing } from '@/constants/theme';
import type { PlanCollaborator } from '@/types';

/** CollaboratorList — plan katılımcıları (avatar + rol). */
export function CollaboratorList({ collaborators }: { collaborators: PlanCollaborator[] }) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <ThemedText type="h3">{t('pages:collaborate.collaborators')}</ThemedText>
      <View style={styles.row}>
        {collaborators.map((c) => (
          <View key={c.id} style={styles.item}>
            <Avatar uri={c.avatarUrl} name={c.name} size={44} />
            <ThemedText type="caption" numberOfLines={1} style={styles.name}>
              {c.name}
            </ThemedText>
            <ThemedText type="caption" themeColor="textTertiary">
              {t(`pages:collaborate.${c.role}`)}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  row: { flexDirection: 'row', gap: Spacing.three, flexWrap: 'wrap' },
  item: { alignItems: 'center', gap: 2, width: 72 },
  name: { maxWidth: 72 },
});
