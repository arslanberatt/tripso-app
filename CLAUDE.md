# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ⚠️ Expo SDK 56 — verify the API before writing code

This project pins **Expo SDK 56** (`expo ~56.0.6`, `react-native 0.85.3`, `react 19.2.3`). Expo APIs change across SDKs. Before writing or changing any Expo / React Native code, consult the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ — do not rely on memory of older SDK APIs. This overrides general knowledge of Expo. (This is also the rule in [AGENTS.md](AGENTS.md), imported above.)

Notable SDK-56-era choices already in use:
- `expo-router/unstable-native-tabs` (`NativeTabs`) for the tab bar — see [src/components/app-tabs.tsx](src/components/app-tabs.tsx).
- React Compiler is enabled (`experiments.reactCompiler` in [app.json](app.json)) — let it optimize; avoid adding manual `useMemo`/`useCallback` purely for memoization.
- Typed routes are enabled (`experiments.typedRoutes`).

## Commands

```bash
npm install          # install deps
npx expo start       # start dev server (Metro); also `npm start`
npm run ios          # open in iOS simulator
npm run android      # open in Android emulator
npm run web          # run web target
npm run lint         # expo lint (ESLint)
```

No test runner is configured. `npm run reset-project` moves the current `src/app` starter into an example folder and scaffolds a blank app — **destructive**, do not run unless explicitly asked.

## Architecture

Expo Router file-based app. The router root is **`src/app/`** (not a top-level `app/`); path aliases `@/*` → `src/*` and `@/assets/*` → `assets/*` (see [tsconfig.json](tsconfig.json)).

- **[src/app/_layout.tsx](src/app/_layout.tsx)** — root layout. Wraps the app in expo-router's `ThemeProvider` (Dark/Default by system color scheme), renders `AnimatedSplashOverlay`, then `AppTabs`. Routes are the files in `src/app/` (`index`, `explore`).

### Theming
All visual styling flows from **[src/constants/theme.ts](src/constants/theme.ts)**: `Colors` (light/dark maps), `Fonts` (per-platform via `Platform.select`; web pulls CSS vars from [src/global.css](src/global.css)), a `Spacing` scale, and layout constants (`BottomTabInset`, `MaxContentWidth`).

- Read the resolved palette through the **`useTheme()`** hook ([src/hooks/use-theme.ts](src/hooks/use-theme.ts)), which collapses an `'unspecified'` scheme to `'light'`. Prefer this over reading `Colors` directly in components.
- Color-scheme detection differs per platform: native uses RN's `useColorScheme`; web re-resolves after hydration to support static rendering ([src/hooks/use-color-scheme.web.ts](src/hooks/use-color-scheme.web.ts)).
- Build text with the **`ThemedText`** component ([src/components/themed-text.tsx](src/components/themed-text.tsx)) and its `type` variants, choosing color via the `themeColor` prop (a key of `Colors`) instead of hardcoded values. `ThemedView` is the analogous container.

### Platform-specific files
Web overrides live alongside native files via the `.web.tsx`/`.web.ts` extension; the bundler resolves the right one per target (e.g. `app-tabs.tsx` vs `app-tabs.web.tsx`, `animated-icon.*`, `use-color-scheme.*`). When adding cross-platform behavior, prefer this `.web` split over branching on `Platform.OS` inside a single file.

The app targets **iOS, Android, and web** (web output is `static`). Keep all three in mind — guard native-only APIs and provide web fallbacks.

`/ios` and `/android` native folders are gitignored and generated (prebuild/CNG); change native config through [app.json](app.json) and config plugins, not by hand-editing native dirs.
