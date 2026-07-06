import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { AppInput } from '@/components/ui/input';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PlanComment } from '@/types';

/** CommentSection — yorum girişi + liste; giriş state'i içeride, gönderim dışarıda. */
export function CommentSection({
  comments,
  onSend,
}: {
  comments: PlanComment[];
  onSend: (text: string) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.section}>
      <ThemedText type="h3">{t('pages:collaborate.comments')}</ThemedText>
      <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement }]}>
        <AppInput
          value={text}
          onChangeText={setText}
          placeholder={t('pages:collaborate.commentPlaceholder')}
          containerStyle={styles.input}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <IconButton icon="send" accessibilityLabel={t('pages:collaborate.send')} themeColor="primary" onPress={send} />
      </View>
      <View style={styles.list}>
        {comments.map((c) => (
          <View key={c.id} style={styles.row}>
            <Avatar uri={c.authorAvatarUrl} name={c.authorName} size={32} />
            <View style={styles.body}>
              <View style={styles.header}>
                <ThemedText type="smallBold">{c.authorName}</ThemedText>
                {c.itemId === null && (
                  <ThemedText type="caption" themeColor="textTertiary">
                    · {t('pages:collaborate.generalComment')}
                  </ThemedText>
                )}
              </View>
              <ThemedText type="small">{c.text}</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: Radii.pill, paddingRight: Spacing.one },
  input: { flex: 1, backgroundColor: 'transparent' },
  list: { gap: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.two },
  body: { flex: 1, gap: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
