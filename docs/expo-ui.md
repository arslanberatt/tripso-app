# Expo UI & Liquid Glass (SDK 56)

> ⚠️ APIs change between Expo SDKs. This doc reflects **SDK 56** (`expo ~56`,
> `expo-glass-effect ~56.0.4`, `@expo/ui ~56.0.14`). Always re-check
> https://docs.expo.dev/versions/v56.0.0/ before changing native UI code.

## What we use, and why

Tripso aims for a **native, platform-true look** with one shared component layer.
Two libraries do the heavy lifting:

| Library | Purpose | Where |
| --- | --- | --- |
| `expo-glass-effect` | Apple **Liquid Glass** surfaces (iOS 26+) | `GlassSurface`, used by `Card`, `Header`, buttons |
| `expo-router/unstable-native-tabs` | Real native tab bar (`NativeTabs`) | `src/app/(tabs)/_layout.tsx` |
| `expo-image` | Disk+memory cached network images | `CachedImage` |
| `@expo/vector-icons` (Ionicons) | Single cross-platform icon set | `Icon` |

We deliberately **do not** hand-roll blur/vibrancy. On capable devices we use the
real OS effect; everywhere else we fall back to a clean themed surface.

## Liquid Glass strategy

`expo-glass-effect` exposes:

```ts
import { GlassView, isLiquidGlassAvailable, type GlassStyle } from 'expo-glass-effect';

isLiquidGlassAvailable(); // true on iOS 26+, false on older iOS / Android / web
```

The capability is **constant for the app session**, so we compute it once at module
scope and read it through a hook:

```ts
// src/hooks/use-glass-capability.ts
const LIQUID_GLASS = isLiquidGlassAvailable();
export function useGlassCapability() {
  return { isLiquidGlass: LIQUID_GLASS };
}
```

### The fallback rule (the important part)

Every glass surface goes through **`GlassSurface`** (`src/components/ui/glass-surface.tsx`):

```tsx
const { isLiquidGlass } = useGlassCapability();

if (isLiquidGlass) {
  // iOS 26+ : real Liquid Glass
  return <GlassView glassEffectStyle={glassEffectStyle} tintColor={tintColor} ... />;
}
// Older iOS / Android / web : solid `card` color + hairline border
return <View style={{ backgroundColor: theme.card, borderWidth: hairline, ... }} />;
```

So you **never** branch on the platform in feature code — you just render
`<GlassSurface>` (or `<Card glass>`, `<AppButton glass>`, `<IconButton glass>`)
and it degrades gracefully.

`glassEffectStyle` accepts `'regular'` (default) or `'clear'` (more transparent).
`tintColor` optionally tints the glass on iOS.

### When to reach for glass

- Floating controls over imagery: the detail-screen header, hero icon buttons.
- Bars that sit above scrolling content (`Header glass`).
- **Not** for primary brand CTAs — the orange `primary` button keeps its solid
  color so the brand reads consistently (see `AppButton`: glass is ignored for
  the `primary` variant).

## Native tabs

`NativeTabs` renders the platform tab bar (iOS `UITabBar`, Android
`BottomNavigation`) and automatically adopts the Liquid Glass tab bar on iOS 26.
Icons accept three shapes (pick per platform):

```tsx
<NativeTabs.Trigger name="trips">
  <NativeTabs.Trigger.Label>Trips</NativeTabs.Trigger.Label>
  {/* iOS: SF Symbol, Android: drawable resource, or cross-platform image src */}
  <NativeTabs.Trigger.Icon sf="airplane" drawable="ic_menu_send" />
</NativeTabs.Trigger>
```

`trigger.name` must match a route file in the same directory
(`src/app/(tabs)/trips.tsx` → `name="trips"`).

> TODO(icons): Trips/Profile use SF Symbols on iOS; add matching Android drawable
> resources (or switch to `src` PNGs) so Android shows icons, not just labels.

## `@expo/ui`

`@expo/ui` ships native SwiftUI / Jetpack Compose primitives. We have it installed
for future native-feeling controls (e.g. native `Picker`, `DateTimePicker`,
`Slider` in the upcoming **Plan a Trip** flow). Today the visible glass comes from
`expo-glass-effect`; when you add an `@expo/ui` control, verify its exact import
path and props against the v56 docs first — the package is young and surfaces
change between minor versions.
