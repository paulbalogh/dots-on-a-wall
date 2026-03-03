# Dots on a Wall

A Vite + React app that generates a grid of randomly placed dots on a wall for physical installation planning. Configure wall dimensions, dot count, blackout zones, and clustering—then export coordinates for drilling or marking.

## What it does

- **Grid layout**: Staggered grid (odd rows offset by half the spacing) that fills your wall. Each dot is a random blob shape inscribed in its cell.
- **Two quantities**: *Total grid cells* (potential positions) vs *dots placed* (visible on the wall). The on-ratio (default 0.2) = placed ÷ grid, so a lower ratio gives a tighter grid with more empty slots.
- **Clustering**: Dots tend to cluster around 2–3 random areas, creating visible blobs rather than uniform coverage.
- **Blackout area**: Define a zone where no dots go (e.g. behind a radiator). Draggable and resizable by mouse.
- **Output**: Canvas at scale + table of x, y coordinates in cm.

## Features

- Wall dimensions (width × height in cm)
- Dots on wall (number of visible dots)
- On-ratio (placed ÷ grid; lower = tighter grid)
- Blackout area: position, size; drag to move, resize via corner handles
- Border closeness (min distance from dots to each edge)
- Grid visibility slider (show/hide underlying grid)
- Dot color picker
- URL query params persist the full configuration (shareable links)

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech

- Vite + React + TypeScript
- SVG for canvas rendering
