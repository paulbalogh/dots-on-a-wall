# Dots on a Wall — Web App Plan

A Vite + React app that generates a grid of randomly placed dots on a wall, with configurable parameters, blackout zones, and border constraints.

---

## 1. Core Concept

- **Grid structure**: Dots occupy a **staggered grid**. Spacing derived from dotCount and wall size. Odd rows offset by half the horizontal spacing.
- **Dot shape**: Each dot is a **random blob** inscribed within its 2cm × 2cm cell.
- **On/Off state**: Each dot can be on (visible) or off (hidden).
- **Scale**: Canvas renders the wall at scale (e.g., 1cm = N pixels).

---

## 2. Data Model

### 2.1 Configuration (Inputs)

```typescript
interface WallConfig {
  // Grid & dots
  dotCount: number;           // Total number of dots to place
  dotSizeCm: 2;               // Fixed: each dot inscribed in 2×2cm
  
  // Wall dimensions (in cm)
  wallWidthCm: number;
  wallHeightCm: number;
  
  // Blackout area (no dots) — e.g. behind radiator
  blackout?: {
    xCm: number;              // Top-left x
    yCm: number;              // Top-left y
    widthCm: number;
    heightCm: number;
  };
  
  // Border closeness (in cm) — min distance from dots to each edge
  borderCloseness?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
```

### 2.2 Dot Model

```typescript
interface Dot {
  id: string;
  xCm: number;                // Center x in cm
  yCm: number;                // Center y in cm
  on: boolean;                // Visible or not
  blobPath?: string;          // SVG path for blob shape (optional, can be generated)
}
```

### 2.3 Grid Calculation (Staggered Grid)

- **Spacing**: Derived from dotCount and wall dimensions (rows × cols = dotCount).
- **Odd rows**: Offset by half the horizontal spacing.
- **Position formula**: `x = col * spacingX + (row % 2) * spacingX/2`, `y = row * spacingY`
- **Visual pattern**:
  ```
  *   *   *   *   *   *   *   ...
    *   *   *   *   *   *   *   ...  (offset by half)
  *   *   *   *   *   *   *   ...
    *   *   *   *   *   *   *   ...
  ```
- **Grid extent**: Columns and rows cover the wall; filter by blackout and border-closeness.
- **Valid cells**: Exclude positions that:
  - Fall inside the blackout area
  - Are too close to any wall (border-closeness)

---

## 3. Algorithm: Randomize Dots

### 3.1 Valid Cell Selection

1. Build list of all grid cells (each cell = 2×2cm, indexed by row/col).
2. Filter out cells that intersect the blackout rectangle.
3. Filter out cells whose center is too close to any wall (using border-closeness).
4. Result: array of valid `{ row, col }` positions.

### 3.2 Placement

1. Build all valid grid positions using the even-spacing formula.
2. Shuffle the valid positions randomly.
3. Take first `dotCount` positions (or all if fewer than `dotCount`).
4. For each selected position:
   - Center: `x = col * spacingX + (row % 2) * spacingX/2`, `y = row * spacingY`
   - Optionally add small random offset (e.g. ±0.2cm) for slight variation
   - Randomly set `on: true/false` (or use a configurable on-ratio, e.g. 50%)

### 3.3 Blob Shape Generation

- Each dot is a **random blob** inscribed within its 2cm × 2cm cell.
- Use a simple algorithm: random polygon with 5–8 points around a circle, then smooth (e.g. Catmull-Rom or similar).
- Or: use Perlin/simplex noise to distort a circle.
- Store as SVG path or regenerate on render from a seed for reproducibility.

---

## 4. UI Structure

### 4.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: "Dots on a Wall"                                │
├──────────────────────┬──────────────────────────────────┤
│  Controls Panel      │  Canvas / Output                   │
│  (left or top)       │  (main area)                      │
│                      │                                   │
│  - Nr of dots        │  [Canvas: wall at scale]          │
│  - Wall W/H          │                                   │
│  - Blackout config   │  ─────────────────────────────    │
│  - Border closeness  │  [Table: x, y coords]             │
│  - [Randomize]       │                                   │
└──────────────────────┴──────────────────────────────────┘
```

### 4.2 Components

| Component | Responsibility |
|-----------|----------------|
| `App` | State, config, orchestration |
| `ControlsPanel` | Form inputs for all config values |
| `WallCanvas` | Renders wall + dots at scale (SVG or HTML Canvas) |
| `Dot` | Renders single blob dot (SVG path) |
| `CoordinatesTable` | Table of x, y for all dots (filterable: all / on only) |

---

## 5. Canvas Rendering

### 5.1 Scale

- `scalePxPerCm = canvasWidthPx / wallWidthCm` (or user-configurable)
- All positions converted: `px = cm * scalePxPerCm`

### 5.2 Layers

1. **Wall background** (optional: light gray or white)
2. **Blackout area** (darker fill, e.g. hatched or solid)
3. **Grid lines** (optional, for debugging)
4. **Dots** — only render dots where `on === true`

### 5.3 Blob Rendering

- Each dot: SVG `<path d="...">` with blob path
- Blob inscribed in 2×2cm cell, random organic shape
- Fill: dark (e.g. black or charcoal)
- Optional: subtle shadow for depth

---

## 6. Tech Stack

| Layer | Choice |
|-------|--------|
| Build | Vite |
| Framework | React 18+ |
| Language | TypeScript |
| Styling | Tailwind CSS (optional) or plain CSS |
| Canvas | SVG (recommended for scalable blobs) or HTML Canvas |

---

## 7. Project Structure

```
dots-on-a-wall/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ControlsPanel.tsx
│   │   ├── WallCanvas.tsx
│   │   ├── Dot.tsx
│   │   └── CoordinatesTable.tsx
│   ├── lib/
│   │   ├── grid.ts          # Grid math, valid cells
│   │   ├── blob.ts          # Blob path generation
│   │   └── randomize.ts     # Randomize algorithm
│   ├── types.ts
│   └── index.css
└── PLAN.md (this file)
```

---

## 8. Implementation Order

1. **Scaffold** — Vite + React + TypeScript project
2. **Types** — `WallConfig`, `Dot`, interfaces
3. **Grid logic** — valid cells, blackout, border-closeness
4. **Randomize** — placement + on/off
5. **Blob generation** — simple random polygon → SVG path
6. **ControlsPanel** — form with all inputs
7. **WallCanvas** — SVG wall + dots at scale
8. **CoordinatesTable** — x, y table
9. **Polish** — styling, export (PNG/CSV), responsive layout

---

## 9. Edge Cases

- **dotCount > valid cells**: Cap at number of valid cells; show warning
- **Blackout covers most of wall**: Show message if valid cells < dotCount
- **Border closeness too large**: Reduce valid area; handle gracefully
- **Very large walls**: Consider virtualization for table; canvas should still work

---

## 10. Optional Enhancements

- **Export**: PNG of canvas, CSV of coordinates
- **On-ratio**: Slider for % of dots that are "on"
- **Seed**: Reproducible randomization via seed
- **Presets**: Save/load configs (e.g. "living room wall", "behind sofa")
- **Units**: Toggle cm / inches

---

## Summary

The app will:

1. Accept wall dimensions, dot count, blackout zone, and border-closeness.
2. Compute a grid of 2×2cm cells, excluding blackout and border zones.
3. Randomly select cells, place dots with slight jitter, and assign on/off.
4. Render an SVG canvas at scale with blob-shaped dots in an evenly spaced grid.
5. Display a table of all dot coordinates.

Next step: scaffold the Vite + React project and implement the core modules.
