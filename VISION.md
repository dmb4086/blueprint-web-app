# Blueprint Vision

## Product Thesis

Blueprint is an AI pre-design assistant for architects.

It does not replace architects, produce sanction-ready drawings, or automate full construction documentation. Its first job is narrower and more useful:

> Turn messy client requirements and site constraints into architect-ready concept packages in minutes.

The core wedge is the painful first step architects repeat on residential projects: taking an unclear client brief, a plot, local constraints, and scattered references, then turning them into clean first-pass layout options that can be reviewed, edited, and exported.

## First User

Blueprint is built first for small architecture studios and independent architects working on residential projects.

The initial geography is Ahmedabad/Gujarat, with residential plots as the first project type. This keeps the product concrete enough to model local constraints, plot assumptions, and architectural workflows without pretending to solve every jurisdiction from day one.

## First Promise

Blueprint should save the first 3-5 hours of early pre-design work:

- Cleaning up vague client requirements.
- Extracting a structured room program.
- Identifying missing information.
- Checking basic site feasibility.
- Producing 2-3 editable concept layout options.
- Surfacing compliance warnings that require architect verification.

The first output is a concept layout package, not a permit drawing.

## Product Positioning

**Blueprint: AI Pre-Design Assistant for Architects**

**Tagline:** Turn messy client requirements and site constraints into editable concept layouts in minutes.

Blueprint should feel like an architect's junior assistant: structured, useful, context-aware, and cautious about what it does not know.

## What Blueprint Is

Blueprint converts messy input into a structured, editable concept package.

Inputs include:

- Country, city, local authority, and site location.
- Google Maps link, coordinates, address, or manually entered plot dimensions.
- Plot geometry, road-facing side, north direction, and irregularity.
- Client notes, WhatsApp screenshots, PDFs, surveys, existing plans, reference images, transcripts, and budget notes.
- Lifestyle needs such as bedrooms, bathrooms, lift, elderly access, parking, balconies, servant room, puja room, storage, kitchen style, entertaining, and future expansion.
- Preferences such as modern/traditional style, Vastu sensitivity, privacy, natural light, and budget tier.

Outputs include:

- Structured client brief.
- Missing-information checklist.
- Site feasibility card.
- Buildable envelope.
- Room program.
- 2-3 concept floor plan options.
- Compliance warnings.
- Editable vector drawing canvas.
- PDF/SVG export.

## What Blueprint Is Not

Blueprint should not initially promise:

- AI replacing architects.
- Sanction-ready drawings.
- Structural drawings.
- MEP drawings.
- Full BIM/IFC workflows.
- Universal building-code support.
- Perfect automated zoning lookup.
- Full CAD-level wall joins.
- Photorealistic AI floor plan images as final output.

These are later-stage capabilities or traps. The MVP must stay focused on brief-to-concept workflow quality.

## Core Product Insight

Blueprint should be built as a layout compiler, not as a freeform AI drawing tool.

```txt
Messy client input
        |
AI extraction
        |
Strict ProjectBrief JSON
        |
Code/rule resolver
        |
Buildable envelope
        |
Room program + adjacency graph
        |
Deterministic layout generator
        |
Editable vector plan
        |
Architect review/export
```

AI handles language, documents, image understanding, ambiguity, extraction, and clarification.

Deterministic systems handle geometry, dimensions, constraints, collisions, setbacks, scoring, drawing data, and exports.

That separation is central to product quality. The model should not be trusted to invent geometry.

## Source Of Truth

The `ProjectBrief` schema is the heart of the product. Every input, extraction, clarification, plan, warning, and export should connect back to structured project data.

Example shape:

```json
{
  "site": {
    "country": "India",
    "state": "Gujarat",
    "city": "Ahmedabad",
    "local_authority": null,
    "plot_width_ft": 50,
    "plot_depth_ft": 70,
    "road_edges": ["south"],
    "north_direction": "top",
    "road_width_m": null,
    "plot_shape": "rectangle"
  },
  "household": {
    "family_size": 5,
    "elderly_resident": true,
    "domestic_help": false
  },
  "requirements": {
    "floors": 2,
    "lift_required": true,
    "parking_cars": 1,
    "ground_floor": [
      { "space": "bedroom", "count": 1, "priority": "must" },
      { "space": "living_room", "priority": "must" },
      { "space": "kitchen", "priority": "must" }
    ],
    "first_floor": [
      { "space": "bedroom", "count": 3, "priority": "must" },
      { "space": "balcony", "priority": "nice_to_have" }
    ]
  },
  "preferences": {
    "entertaining_guests": true,
    "large_kitchen": true,
    "vastu_sensitive": "optional",
    "style": "modern"
  },
  "unknowns": [
    "road_width_m",
    "local_authority",
    "parking_requirement",
    "setback_category"
  ]
}
```

The drawing is only one visualization of this structured project.

## MVP Workflow

### 1. Project Setup

The user enters:

- Country and city/local authority.
- Address, Google Maps link, coordinates, or manual site data.
- Plot dimensions.
- Road-facing side.
- Road width if known.
- North direction.
- Survey plan upload if available.

For Ahmedabad/Gujarat, coordinates are not enough. Road width, plot dimensions, abutting road sides, authority/zone, plot size, building height, setbacks, and special-area status can all affect feasibility. Blueprint must ask users to confirm these rather than pretending a map pin gives complete compliance knowledge.

### 2. Context Dump

The user can drop client notes, screenshots, PDFs, existing plans, reference images, voice-note transcripts, and budget notes into one intake area.

AI extracts the structured brief and marks uncertain or missing values instead of inventing them.

### 3. Clarification Form

Blueprint generates follow-up questions from a fixed question catalog, not arbitrary AI-made UI.

Allowed question types should be controlled:

- `dimension_input`
- `single_select`
- `multi_select`
- `yes_no`
- `file_request`
- `priority_slider`
- `room_count`
- `adjacency_preference`

The AI decides which fields are missing; the app renders the questions using safe, predefined components.

### 4. Architect Brief Board

The brief should render like a design board, not a chat transcript.

It should summarize:

- Site.
- Client priorities.
- Room program.
- Missing information.
- Feasibility notes.
- Compliance confidence.

This board alone is valuable because it cleans up early client chaos.

### 5. Layout Options

Blueprint generates three concept directions:

- **Practical:** efficient circulation, compact planning, easier construction.
- **Luxury:** larger rooms, stronger balcony/entertainment moments, lower efficiency.
- **Elderly-first:** best ground-floor accessibility and bedroom/bathroom/lift relationship.

Each option should include scored attributes:

- Compliance confidence.
- Client fit.
- Circulation efficiency.
- Natural light potential.
- Construction simplicity.
- Missing-information risk.

### 6. Editable Plan

The architect can:

- Drag rooms.
- Resize spaces.
- Lock walls or rooms.
- Move openings.
- Add notes.
- Regenerate around locked elements.
- Export PDF/SVG.

This is where Blueprint becomes a professional tool instead of a novelty generator.

## Layout Engine Direction

Start simple and deterministic.

V1 assumptions:

- Rectangular plots first.
- Rectangular rooms first.
- Grid-based generation in 1 ft, 0.5 m, 250 mm, or 500 mm units.
- Manual road width and road-facing side.
- Manual north direction.
- Basic setback/margin model.
- Template-based generation before solver-based optimization.

V1 layout steps:

1. Convert plot into a grid.
2. Apply setbacks/margins.
3. Compute buildable envelope.
4. Place fixed service cores such as stair, lift, ducts, and wet walls.
5. Divide into public, service, private, and circulation zones.
6. Generate room rectangles.
7. Score candidate plans.
8. Keep the top options.

The scoring model matters more than the generation model at the start.

Positive signals:

- Bedroom has an external wall.
- Kitchen is near dining.
- Toilet is near bedroom.
- Wet areas stack across floors.
- Lift aligns across floors.
- Elderly bedroom is on the ground floor.
- Living room is near the entrance.
- Balcony faces road or garden.

Negative signals:

- Long dead corridor.
- Bedroom opens directly into living room.
- Bathroom opens directly into kitchen/dining.
- Room below minimum area.
- Door collision.
- Insufficient circulation width.
- Room has no ventilation edge.

## Technical Direction

The long-term product direction from the source concept is:

- Next.js frontend.
- Supabase database/storage.
- AI extraction into Zod-validated schemas.
- React JSON Schema Form for dynamic questions.
- Konva and/or SVG drawing canvas.
- Python geometry service with Shapely.
- Template-based generator first.
- OR-Tools solver later.
- PDF/SVG export.
- IFC/BIM much later.

Repository note: this repo is currently a React/Vite prototype. The vision above should guide the product and architecture even if the current prototype remains Vite during early exploration.

## Product Moat

The moat is not the AI model.

The defensible parts are:

- Localized rule packs, starting with Ahmedabad/Gujarat.
- Architect feedback loops from accepted/rejected plans.
- Editable vector layout engine.
- Structured brief database.
- Compliance-aware generation.
- Workflow integration through PDF, SVG, CAD/DXF later, and IFC much later.

Most consumer AI floor plan tools are toys. Blueprint should become professional pre-design infrastructure.

## Roadmap Shape

### V1: Prototype

- Project setup for Ahmedabad rectangular plots.
- Context dump to structured brief.
- Missing-information checklist.
- Brief board.
- Basic SVG/Konva plan renderer.
- Template-based layout options.
- Basic compliance checklist with confidence labels.
- PDF/SVG export.

### V2: Better Architecture Workflow

- Irregular plots.
- Parking and courtyards.
- Vastu preference layer.
- Room locking and regeneration.
- Better daylight and ventilation heuristics.
- Local rule packs.
- Architect notes and feedback capture.

### V3: Professional Expansion

- CAD/DXF export.
- 3D massing.
- BIM/IFC export.
- Construction drawing support.
- MEP suggestions.
- Cost estimation.
- Material quantity workflows.

## Killer Demo

Demo project:

```txt
Plot: 50 ft x 70 ft
Road: South side
Location: Ahmedabad
Family: parents, couple, two children, grandmother
Requirements:
- Ground floor: elderly bedroom, living, dining, kitchen, powder, parking
- First floor: 3 bedrooms, family lounge, balcony
- Lift required
- Entertaining kitchen
- Good natural light
```

Blueprint produces:

1. Clean client brief.
2. Missing info: road width, authority, north confirmation.
3. Buildable envelope.
4. Three options: elderly-first, entertainment-first, and maximum-bedroom-efficiency.
5. Editable vector plan.
6. Compliance warnings.

This is enough to get meaningful feedback from real architects.

## Decision Guardrails

When choosing what to build next, prefer work that strengthens the core loop:

```txt
messy context -> structured brief -> clarified unknowns -> feasible envelope -> editable concept plan
```

Avoid work that makes the product look impressive while weakening that loop.

The product should always be honest about missing data, cautious about compliance, and optimized for architect editability.
