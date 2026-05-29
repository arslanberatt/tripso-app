# Component catalog

Reusable UI lives in `src/components/ui/` (primitives + feature pieces),
`src/components/onboarding/`, and `src/components/auth/`. Everything is
dark-mode-aware via `useTheme()` and sized with `Spacing`/`Radii`. This is the
"don't reinvent it" reference — check here before building a new component.

Conventions: kebab-case filenames, slot props (`leading`/`trailing`/`children`),
`accessibilityLabel`/`accessibilityRole` on interactive elements, form state stays
**outside** components (plain `useState`, no form library).

## Primitives (`components/ui/`)

| Component | Key props | Notes / where used |
| --- | --- | --- |
| `GlassSurface` | `glassEffectStyle`, `tintColor`, `radius`, `bordered` | iOS 26+ Liquid Glass, else solid `card` fallback. Base of glass everywhere. |
| `CachedImage` | `uri`, `contentFit`, `radius`, `recyclingKey`, `decorative`, `accessibilityLabel` | `expo-image` wrapper: blurhash placeholder, fade, disk cache. All network images. |
| `Icon` | `name` (Ionicons), `size`, `themeColor`, `color` | The single icon system. `IconName` is the Ionicons union. |
| `AppButton` | `label`, `variant` (`primary`/`secondary`/`ghost`), `leadingIcon`, `trailingIcon`, `loading`, `disabled`, `fullWidth`, `glass` | Brand CTA. `primary` = orange and ignores `glass`. |
| `IconButton` | `icon`, `accessibilityLabel` (**required**), `diameter`, `glass`, `solidOverlay`, `color` | Circular. `solidOverlay` for readability over images (back/heart/share). |
| `AppInput` | `leadingIcon`, `clearable`, `secureToggle`, + `TextInput` props | Themed text field. Base of the field presets below. |
| `SearchInput` | `AppInput` minus `leadingIcon`/`clearable` | Search preset ("Search destinations…"). Home. |
| `Chip` | `label`, `selected`, `icon`, `onPress` | Selectable pill (controlled). Category filters. |
| `Tag` | `label`, `icon` | Read-only label. Detail screen tags. |
| `Card` | `radius`, `glass`, `elevated` | Rounded surface; `glass` → Liquid Glass. |
| `Avatar` | `uri`, `name`, `size` | Image or initial fallback. Header/Profile. |
| `RatingBadge` | `rating`, `reviewCount`, `onImage` | Star + score; `onImage` adds dark scrim. |
| `SectionHeader` | `title`, `actionLabel`, `onSeeAll` | Section title + optional "See all". |
| `ComingSoon` | `icon`, `title`, `message` | Stub-screen placeholder. |

## Headers (`components/ui/`)

| Component | Key props | Notes |
| --- | --- | --- |
| `Header` | `leading`, `title`, `trailing`, `glass`, `safeArea` | Generic slot-based bar; pads `insets.top`. |
| `HomeHeader` | `name`, `avatarUri`, `unreadCount`, `onPressAvatar`, `onPressBell` | Avatar + greeting + notification bell (badge). Home. |
| `DetailHeader` | `scrollY` (SharedValue), `title`, `threshold`, `onBack`, `trailing` | Floats over hero; **scroll-driven** transparent → glass/solid via `useAnimatedStyle`. |

## Feature cards (`components/ui/`)

| Component | Key props | Notes |
| --- | --- | --- |
| `DestinationCard` | `destination`, `onPress`, `width` | Horizontal "Top Destinations" card. |
| `ExperienceCard` | `experience`, `onPress`, `width` | Compact "Popular Experiences" card. |
| `CategoryChipRow` | `categories`, `selectedKey`, `onSelect` | Horizontal controlled chip list. |
| `PromoBanner` | `title`, `subtitle`, `ctaLabel`, `imageUrl`, `onPress` | Image/orange promo → Plan a Trip. |
| `HighlightItem` | `icon`, `label` | Icon tile in the detail "Highlights" grid. |

## Onboarding (`components/onboarding/`)

Composed, **not** one file:

- `OnboardingSlide` — full-bleed `CachedImage` + scrim + title/subtitle.
- `OnboardingPagination` — animated dots; active dot interpolates width/opacity
  from the shared `scrollX`.
- `OnboardingFooter` — pagination + primary CTA ("Next"/"Get Started") + sign-in link.

Screen: `src/app/(onboarding)/welcome.tsx` wires a paged `Animated.ScrollView` and
shares `scrollX` into the footer.

## Auth (`components/auth/`)

- `AuthScaffold` — shared layout: title/subtitle, keyboard-avoiding scroll, footer slot.
- `EmailField` / `PasswordField` — `AppInput` presets (correct keyboard, secure toggle).
- `SocialAuth` — **platform-split**: `social-auth.ios.tsx` (Apple + Google),
  `social-auth.android.tsx` (Google only), `social-auth.tsx` (web/base, Google).
  All share `SocialAuthProps` so screens stay platform-agnostic.

Screens: `(auth)/login.tsx`, `(auth)/register.tsx`.

## Animation conventions

Animations are **encapsulated inside the component** (reusability) and driven by a
shared scroll value passed in as a prop:

- `OnboardingPagination` / `DetailHeader` receive `scrollX` / `scrollY`
  (`SharedValue<number>`) and use `useAnimatedStyle` + `interpolate`
  (`Extrapolation.CLAMP`).
- Screens own the `useSharedValue` + `useAnimatedScrollHandler` and pass the value down.

## Data flow

Screens read from placeholder hooks in `src/hooks/data/` that return the
`AsyncState<T>` shape (`{ data, isLoading, error }`) over `src/mocks/`. Swap the
mock for `useQuery`/Zustand later without touching screens — see the `TODO(api)`
comments in each hook.
