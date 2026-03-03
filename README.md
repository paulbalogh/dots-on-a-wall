# Dots on a Wall

A Vite + React app that generates a grid of randomly placed dots on a wall, with configurable parameters, blackout zones, and border constraints.

## Features

- **Staggered grid**: Each second row is offset by half the dot spacing (1cm), creating a diamond-like tessellation
- **Random blob shapes**: Each dot is a random blob inscribed in a 2×2cm cell
- **Configurable**: Wall dimensions, dot count, blackout area (e.g. behind radiator), border closeness
- **Output**: Canvas representation at scale + table of all x, y coordinates

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
