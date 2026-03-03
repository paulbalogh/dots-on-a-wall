import type { WallConfig } from '../types'

export interface GridLayout {
  rows: number
  cols: number
  spacingXCm: number
  spacingYCm: number
}

/** Total grid cells = visibleDots / onRatio (onRatio = fraction of grid that gets dots) */
export function getTotalGridDots(config: WallConfig): number {
  const visible = config.targetVisibleDots ?? 200
  const ratio = config.onRatio ?? 0.2
  return Math.max(1, Math.ceil(visible / ratio))
}

/** Compute grid layout. Grid has totalGridDots cells; we place targetVisibleDots of them. */
export function getGridLayout(config: WallConfig): GridLayout {
  const gridCellCount = getTotalGridDots(config)
  const { wallWidthCm, wallHeightCm } = config

  if (gridCellCount <= 0) {
    return { rows: 1, cols: 1, spacingXCm: wallWidthCm, spacingYCm: wallHeightCm }
  }

  const targetRatio = wallWidthCm / wallHeightCm

  // Try exact factorizations first
  let bestRows = 1
  let bestCols = gridCellCount
  let bestScore = Infinity

  for (let rows = 1; rows <= gridCellCount; rows++) {
    if (gridCellCount % rows !== 0) continue
    const cols = gridCellCount / rows
    const ratio = cols / rows
    const score = Math.abs(ratio - targetRatio)
    if (score < bestScore) {
      bestScore = score
      bestRows = rows
      bestCols = cols
    }
  }

  // If best exact factorization is poor (e.g. prime → 1×N or N×1),
  // use approximate dimensions for a proper grid
  const exactRatio = bestCols / bestRows
  if (exactRatio > 20 || exactRatio < 1 / 20) {
    const desiredRows = Math.round(Math.sqrt(gridCellCount * wallHeightCm / wallWidthCm))
    const rows = Math.max(1, Math.min(desiredRows, gridCellCount))
    const cols = Math.max(1, Math.ceil(gridCellCount / rows))
    return {
      rows,
      cols,
      spacingXCm: cols > 1 ? wallWidthCm / (cols - 0.5) : wallWidthCm,
      spacingYCm: rows > 1 ? wallHeightCm / (rows - 1) : wallHeightCm,
    }
  }

  const rows = bestRows
  const cols = bestCols

  // Odd rows offset by half spacing; rightmost odd-row dot at (cols-0.5)*spacing must fit
  const spacingXCm = cols > 1 ? wallWidthCm / (cols - 0.5) : wallWidthCm
  const spacingYCm = rows > 1 ? wallHeightCm / (rows - 1) : wallHeightCm

  return { rows, cols, spacingXCm, spacingYCm }
}

export function getValidPositions(config: WallConfig): { row: number; col: number }[] {
  const { wallWidthCm, wallHeightCm, blackout, borderCloseness } = config
  const border = borderCloseness ?? { top: 0, right: 0, bottom: 0, left: 0 }
  const layout = getGridLayout(config)
  const { rows, cols, spacingXCm, spacingYCm } = layout

  const positions: { row: number; col: number }[] = []

  for (let row = 0; row < rows; row++) {
    const xOffset = row % 2 === 0 ? 0 : spacingXCm / 2
    for (let col = 0; col < cols; col++) {
      const xCm = col * spacingXCm + xOffset
      const yCm = row * spacingYCm

      if (xCm < border.left) continue
      if (yCm < border.top) continue
      if (xCm > wallWidthCm - border.right) continue
      if (yCm > wallHeightCm - border.bottom) continue

      if (blackout) {
        const { xCm: bx, yCm: by, widthCm: bw, heightCm: bh } = blackout
        if (xCm >= bx && xCm < bx + bw && yCm >= by && yCm < by + bh) {
          continue
        }
      }

      positions.push({ row, col })
    }
  }

  return positions
}

export function positionToCm(
  row: number,
  col: number,
  layout: GridLayout
): { xCm: number; yCm: number } {
  const xOffset = row % 2 === 0 ? 0 : layout.spacingXCm / 2
  return {
    xCm: col * layout.spacingXCm + xOffset,
    yCm: row * layout.spacingYCm,
  }
}
