# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Manual canvas resize**: Draggable handle at bottom-right corner to resize the canvas to fit your screen

### Changed

- **Dots**: Standard circles instead of blob shapes (2cm diameter)

## [0.1.0] – 2025-03-03

### Added

- Initial release: Vite + React + TypeScript app for planning dot placement on walls
- **Grid**: Staggered layout (odd rows offset by half spacing), evenly spaced in both dimensions
- **Dots**: Random blob shapes inscribed in 2×2cm cells
- **Config**: Wall dimensions (cm), dots on wall, on-ratio (placed ÷ grid cells)
- **Blackout area**: Configurable zone with no dots (e.g. behind radiator)
  - Draggable by mouse
  - Resizable via corner handles (circles, light gray)
  - Semi-transparent (0.1 opacity)
- **Border closeness**: Min distance from dots to each wall edge
- **Clustering**: 2–3 random cluster centers; dots tend to form visible blobs
- **Grid visibility**: Slider to show/hide underlying grid (0–100%)
- **Dot color**: Color picker for visible dots
- **URL state**: Full config persisted in query params (shareable links)
- **Output**: SVG canvas at scale + coordinates table (x, y in cm)
