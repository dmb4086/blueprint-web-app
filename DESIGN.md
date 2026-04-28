# Blueprint — Design System

> Playful, approachable land-mapping. Duolingo energy meets Apple Maps calm.

---

## Brand Personality

- **Playful, approachable, confident**
- Voice is encouraging and human — think "friendly guide" rather than "system administrator"
- Emotional goal: make the user feel capable and delighted, not instructed or managed
- The Duolingo-inspired system captures this well: rounded geometry, generous whitespace, bold color blocking, and satisfying micro-interactions

---

## Aesthetic Direction

- **Visual tone:** Vibrant, clean, and energetic. White surfaces with bold green (`#58CC02`) and cyan (`#1CB0F6`) accents.
- **Background:** Pure white (`#FFFFFF`). No dot grids, no gray page backgrounds. The map and the page share the same white canvas.
- **Map aesthetic:** Apple Maps-inspired palette. Warm cream land (`#F2EFE9`), soft blue water (`#A8D0E6`), white space outside the globe. No text labels on the globe view — let the geometry breathe.
- **References:** Duolingo's UI — chunky buttons with 3D shadows, rounded cards, friendly typography (Plus Jakarta Sans as fallback for Din Round). Apple Maps for the map treatment — unified background, minimal chrome, warm earth tones.
- **Anti-references:** Corporate enterprise dashboards, dense data tables, gray-on-gray palettes, sterile layouts, generic Bootstrap/Tailwind default aesthetics.
- **Theme:** Light mode first. Dark mode can be explored later but is not a priority.

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| **Brand Green** | `#58CC02` | Primary actions, active states, markers, CTA buttons |
| **Hover Green** | `#46A302` | Button shadow color, pressed states |
| **Electric Cyan** | `#1CB0F6` | Secondary accents, links, info states |
| **Warm Orange** | `#FF9500` | Warnings, highlights |
| **Link Blue** | `#007AFF` | External links |
| **Error Red** | `#FF3B30` | Errors, destructive actions |
| **Success Green** | `#34C759` | Success confirmations |
| **Dark Charcoal** | `#1C1C1E` | Primary text, headings |
| **Medium Gray** | `#8A8A8E` | Secondary text, labels, icons |
| **Light Gray** | `#C7C7CC` | Placeholders, disabled text |
| **Border Gray** | `#E5E5EA` | Borders, dividers |
| **Surface** | `#FFFFFF` | Page background, cards |
| **Surface Dim** | `#F2F2F7` | Subtle backgrounds for nav pills, avatars, secondary buttons |
| **Map Land** | `#F2EFE9` | Landmasses on the map (set programmatically) |
| **Map Water** | `#A8D0E6` | Oceans, rivers on the map (set programmatically) |

### Background Philosophy
The page background is **white**. The map container has no border, no shadow, and no distinct background color. The map's background layer and fog are set to white so the globe sits directly on the white page canvas. This creates a unified, seamless Apple Maps-style experience.

---

## Typography

- **Font family:** `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif`
- **Hierarchy:** Bold hierarchy through weight and color, never size alone.
- **Headings:** 800–900 weight, tight tracking (`tracking-tight`)
- **Body:** 500–600 weight, readable sizes
- **Labels:** 700 weight, uppercase, wide tracking (`tracking-wider`)
- **Buttons:** 700–800 weight, 15–17px

---

## Spacing & Shape

- **Base unit:** 8px spacing scale
- **Generous whitespace** — breathing room reduces cognitive load
- **Border radius scale:**
  - `12px` (`rounded-xl`) — buttons, inputs, small cards
  - `16px` (`rounded-2xl`) — cards, dropdowns, map container
  - `24px` (`rounded-[1.5rem]`) — large CTA buttons
  - `9999px` (`rounded-full`) — avatars, badges, nav pills only
- **Map container:** `rounded-[2rem]` (32px) — generous rounding for the main map surface

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| **Soft** | `0 4px 20px rgba(0,0,0,0.05)` | Cards, dropdowns, resting surfaces |
| **Glass** | `0 8px 32px rgba(0,0,0,0.08)` | Dropdowns, modals, elevated surfaces |
| **Duo** | `0 4px 0 0 #46A302` | Primary buttons at rest — signature Duolingo 3D shadow |
| **Duo Hover** | `0 6px 0 0 #46A302` | Primary buttons on hover — lifts up |
| **Duo Active** | `0 0 0 0 #46A302` | Primary buttons on press — flattens down |

### Shadow Philosophy
Resting surfaces are flat or Level 1. Interactive elements gain elevation on hover. Buttons use the signature "Duo shadow" for tactile feedback.

---

## Components

### Buttons

**Primary Button (Duo)**
- Background: `brand-green`
- Text: white, bold, 15–17px
- Border radius: `rounded-xl` (12px) or `rounded-2xl` (16px)
- Shadow: `shadow-duo`
- Hover: `-translate-y-0.5` + `shadow-duo-hover`
- Active: `translate-y-1` + `shadow-duo-active`
- Transition: `transition-all`

**Secondary Button**
- Background: `surface-dim` (`#F2F2F7`)
- Text: `dark-charcoal`, bold
- Border: `border-border-gray`
- Border radius: `rounded-xl`
- Hover: `bg-white` + `shadow-soft`

**Icon Button**
- Size: `40px` × `40px`
- Border radius: `rounded-full`
- Hover: `bg-surface-dim`

### Inputs

- Height: `48px`
- Border radius: `rounded-xl` (12px)
- Border: `border-border-gray`
- Background: white
- Text: `dark-charcoal`, bold, 15px
- Placeholder: `light-gray`
- Focus: `ring-2 ring-brand-green/30` + `border-brand-green`
- Transition: `transition-all`

### Cards

- Background: white
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-soft`
- Border: `border-border-gray/30`
- Padding: `20px` (p-5)

### Dropdown

- Background: white
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-glass`
- Border: `border-border-gray/50`
- Items: `h-[52px]`, flex row with flag + name
- Active item: `bg-brand-green/10 text-brand-green`
- Hover: `bg-surface-dim`

### Header (Glass Panel)

- Background: `rgba(255, 255, 255, 0.85)` + `backdrop-filter: blur(20px)`
- Height: `72px`
- Border bottom: `border-border-gray/50`
- Position: sticky top
- Z-index: 50

### Nav Pill

- Background: `bg-surface-dim/60`
- Border radius: `rounded-full`
- Border: `border-border-gray/50`
- Active tab: `bg-white rounded-full shadow-sm text-dark-charcoal font-bold`
- Inactive tab: `text-medium-gray hover:text-dark-charcoal`

---

## Layout Patterns

### Hero Mode (No Country Selected)
- Centered heading + subtitle + country picker
- Map fills the remaining viewport height (`calc(100dvh - 72px - 14rem)`)
- Hero section collapses with smooth animation (`max-height`, `opacity`, `margin-bottom`)

### Selected Mode (Country Picked)
- Hero collapses to `0` height
- Left panel slides in from width `0` → `400px` with opacity fade
- Map resizes to `60vh`
- Left panel contains: re-located heading, country picker, address inputs, Google Maps link input, CTA button

### Map Container
- **No border, no shadow, no distinct background.** The map sits directly on the white page.
- Border radius: `rounded-[2rem]` (32px)
- Overflow: hidden
- Height transitions smoothly between hero and selected modes

---

## Map Design

### Style
- Base style: `mapbox://styles/mapbox/light-v11`
- Projection: `globe`
- Attribution: hidden (`attributionControl={false}`)
- Interactions disabled until a country is selected (`dragPan`, `scrollZoom`, `doubleClickZoom`, `touchZoomRotate`)

### Apple Maps Palette (Programmatic Overrides)
On map load, override these paint properties:
- `background` → `#F2EFE9` (warm cream land)
- `water` → `#A8D0E6` (soft blue)
- `waterway` → `#A8D0E6`
- `water-shadow` → `#92BDD4`
- Fog: `space-color: #ffffff`, `horizon-blend: 0`, `star-intensity: 0`

### Clean Globe
- All `symbol` layers (text labels, icons) are hidden on the globe view
- This creates a pure geometric globe without clutter

### Marker
- Size: `40px` circle
- Background: `brand-green`
- Inner dot: `12px` white circle
- Border: `3px` white
- Shadow: `shadow-lg`
- Bottom shadow ellipse: `bg-black/20 blur-[2px]`

### Navigation Control
- Position: `top-right`
- Compass: hidden
- Styled via CSS overrides to match the design system (rounded, white, subtle border)

---

## Animation Principles

1. **Purposeful motion** — Every animation serves the experience. No novelty.
2. **Smooth easing** — Use `ease-out` for entering elements, `ease-in-out` for transitions.
3. **Durations:**
   - Micro-interactions (hover, press): `150ms`
   - Layout shifts (hero collapse, sidebar slide): `400–500ms`
   - Map fly-to: `2500ms`
4. **Globe spin:** Continuous ease-to with `duration: 100ms`, incrementing longitude by `0.3` per frame. Stops on country selection.

---

## Accessibility

- Minimum `44×44px` touch targets
- Focus rings on all interactives: `0 0 0 3px rgba({color}, 0.15)`
- Never use color alone to convey status
- Keyboard support: `Enter` triggers search inputs

---

## Design Principles

1. **Playful but purposeful** — Every animation, color, and rounded corner should serve the experience, not decorate it.
2. **Generous whitespace** — Follow the 8px spacing scale strictly. Breathing room reduces cognitive load.
3. **Bold hierarchy through weight and color** — Use 700/800 weights and brand green for primary actions. Never rely on size alone.
4. **Rounded = friendly** — Default to `12px` on cards and buttons, `16px` on larger surfaces, `9999px` only for avatars/badges.
5. **Shadows signal life** — Resting surfaces are flat or Level 1. Interactive elements gain elevation on hover. Buttons use the signature "Duo shadow" for tactile feedback.
6. **Unified canvas** — The map and the page share the same white background. No visual separation between them.
7. **Accessibility by default** — Minimum 44×44px touch targets, focus rings on all interactives, and never use color alone to convey status.
