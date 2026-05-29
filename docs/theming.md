# Theming

All visual styling flows from **`src/constants/theme.ts`** and is read through the
**`useTheme()`** hook. Dark mode is automatic — it follows the device color scheme.

## The pieces

| Export | What it is |
| --- | --- |
| `Colors` | `{ light, dark }` palette maps (identical key sets) |
| `ThemeColor` | `keyof Colors.light & keyof Colors.dark` — the valid color keys |
| `Fonts` | per-platform font families (`sans`/`serif`/`rounded`/`mono`) |
| `Spacing` | spacing scale: `half:2, one:4, two:8, three:16, four:24, five:32, six:64` |
| `Radii` | corner radii: `sm:8, md:12, lg:16, xl:24, pill:999` |
| `Shadows` | platform-aware card shadow (`Shadows.card`) |
| `MaxContentWidth` | 800 — center wide/web layouts |
| `BottomTabInset` | tab bar height to pad scroll content |

## Reading colors

Always go through `useTheme()` — never hardcode hex or read `Colors` directly in
components:

```tsx
import { useTheme } from '@/hooks/use-theme';

function Example() {
  const theme = useTheme(); // -> Colors.light or Colors.dark, resolved
  return <View style={{ backgroundColor: theme.card, borderColor: theme.border }} />;
}
```

For text, prefer `ThemedText` with a `themeColor` (a `ThemeColor` key) instead of a
raw color:

```tsx
<ThemedText type="h2" themeColor="text">Title</ThemedText>
<ThemedText type="caption" themeColor="textSecondary">Subtitle</ThemedText>
```

## Color keys

| Key | Role |
| --- | --- |
| `text` / `textSecondary` / `textTertiary` | primary → faint text |
| `background` / `backgroundElement` / `backgroundSelected` | page → inset surfaces |
| `primary` / `onPrimary` | orange brand + text on it (CTAs, active chips) |
| `card` | raised surface (cards, glass fallback) |
| `border` | hairline dividers/outlines |
| `star` | rating star |
| `overlay` | dark scrim over hero images |
| `danger` | destructive / error (e.g. active favorite heart) |

## Adding a new color

1. Add the **same key** to **both** `Colors.light` and `Colors.dark` (the
   `ThemeColor` type is derived from the intersection — a key missing from one map
   won't be usable).
2. Keep `as const` on the `Colors` object so the literal types survive.
3. Use it via `theme.yourKey` or `themeColor="yourKey"` — no other wiring needed;
   `ThemedText`/`ThemedView` accept the new key automatically.

```ts
// theme.ts
export const Colors = {
  light: { /* ...existing */, success: '#1A9E5C' },
  dark:  { /* ...existing */, success: '#3FD08A' },
} as const;
```

## Spacing & radii

Use the scales, not magic numbers:

```tsx
import { Spacing, Radii } from '@/constants/theme';
const styles = StyleSheet.create({
  card: { padding: Spacing.three, borderRadius: Radii.lg, gap: Spacing.two },
});
```

## Notes

- React Compiler is on — don't add `useMemo`/`useCallback` purely for memoization.
- Web pulls font families from CSS variables in `src/global.css`.
- `useColorScheme` resolves `'unspecified'` to `'light'`; web re-resolves after
  hydration for static rendering.
