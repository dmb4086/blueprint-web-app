# AGENTS.md

This file provides project-level guidance to AI coding agents working in this repository.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — `tsc -b && vite build` (typecheck must pass before bundle is produced)
- `npm run lint` — ESLint flat config (`eslint.config.js`)
- `npm run preview` — preview the built bundle

There is no test runner configured. `tsc -b` is the primary correctness gate.

## Environment

`VITE_MAPBOX_TOKEN` must be set in `.env` (already gitignored). Without it the map silently fails to load tiles and `handleSearchAddress` will hit the Geocoding API unauthenticated.

## Architecture

This is a single-screen React 19 + Vite 8 SPA. Almost all UI logic lives in `src/App.tsx` (~400 lines). Treat it as one component on purpose — splitting it prematurely will fight the layout transitions.

**Two-mode layout, one component.** The page transitions between two states driven entirely by `selectedId`:
- **Hero mode** (`selectedId === null`): centered heading + country dropdown over a full-bleed spinning globe. Map container uses `.map-bleed` (transparent, no rounding) so the page background and Mapbox `space-color` are both white — the rectangle seam disappears.
- **Selected mode**: hero collapses (`max-height: 0`), a 400px left panel slides in (`max-width` transition from 0), and the map switches to `.map-card` (rounded, soft shadow). Both forms of the country dropdown render unconditionally — only one is visible because the other's container has `pointer-events: none` and `opacity: 0`.

The dropdown JSX (`countryList`) is built once and rendered inside both the hero picker and the left-panel picker. Don't try to lift it out — it's positioned absolutely relative to whichever `dropdownButton` is currently visible.

**Mapbox Standard, not Streets.** The map uses `mapbox://styles/mapbox/standard`, which is configured via root-level `setConfigProperty('basemap', ...)` calls — **not** the paint-property overrides (`background`, `water`, `waterway`) that older Mapbox styles use. DESIGN.md still references the old paint-override approach in some places; ignore that and look at `App.tsx` `onLoad` for the source of truth. The label/POI/3D toggles flip on entry into selected mode via the second `useEffect`.

**Globe spin.** `spinGlobe` runs via `requestAnimationFrame`, advancing longitude by 0.3° per frame with a 100ms `easeTo`. It's gated by `isSpinning.current` (a ref, not state, to avoid re-renders) and cancelled the moment a country is picked. The effect that starts it depends on `mapLoaded` because calling `easeTo` before load is a no-op that silently breaks the loop.

**Atmosphere fog.** `setFog` uses `space-color: #FFFFFF` and `horizon-blend: 0.01` to keep the blue glow tight against the planet's edge. Don't widen `horizon-blend` without re-checking the hero — the seam between the rectangular map and the white page reappears fast.

**Geocoding & Google Maps URLs.** `handleSearchAddress` calls Mapbox Geocoding (`api.mapbox.com/geocoding/v5/mapbox.places/...`). `parseGoogleMapsUrl` is a regex pair matching `@lat,lng` and `?q=lat,lng` — it does not resolve short links (`maps.app.goo.gl`) or place IDs.

## Design system

Three documents define the design language and **must stay in sync**:
- `DESIGN.md` — full spec (colors, shadows, components, layout patterns)
- `.impeccable.md` — condensed design context for AI tools

Tokens live in `src/index.css` inside a Tailwind v4 `@theme` block (`--color-brand-green`, `--shadow-duo`, etc.) and are consumed via Tailwind utility classes (`bg-brand-green`, `shadow-duo`). When adding tokens, update `@theme` first; the utility class is generated automatically.

**Non-negotiables when editing UI:**
- Page background is pure white. No dot grids, no gray surfaces, no map borders/shadows in hero mode.
- Buttons use the Duo shadow stack: `shadow-duo` at rest, `-translate-y-0.5 shadow-duo-hover` on hover, `translate-y-1 shadow-duo-active` on press.
- Border radius scale: `rounded-xl` (12) → `rounded-2xl` (16) → `rounded-[2rem]` (32, map only) → `rounded-full` (avatars/pills only).
- 8px spacing scale, minimum 44×44 touch targets.

## Tailwind v4 specifics

This project uses Tailwind v4 via `@tailwindcss/vite` (not PostCSS). Config lives in `src/index.css` `@theme`, not `tailwind.config.js`. There is no `tailwind.config.js` — don't add one.

## TypeScript notes

`tsconfig.app.json` sets `verbatimModuleSyntax: true` and `erasableSyntaxOnly: true`. Use `import type` for type-only imports (see `App.tsx` line 4) or the build will fail.
