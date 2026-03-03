import type { WallConfig, Dot } from '../types'
import { getValidPositions, positionToCm, getGridLayout } from './grid'
import { generateBlobPath } from './blob'

/**
 * Weighted shuffle: positions with higher weight are more likely to appear first.
 * Uses key = rng()^weight — higher weight → smaller key → sorts first.
 */
function weightedShuffle<T>(
  array: T[],
  weights: number[],
  rng: () => number
): T[] {
  return array
    .map((item, i) => ({ item, key: Math.pow(rng(), Math.max(0.001, weights[i])) }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item)
}

export function randomizeDots(config: WallConfig, seed?: number): Dot[] {
  const rngSeed = seed ?? Date.now()
  const rng = seededRandom(rngSeed)

  const layout = getGridLayout(config)
  const validPositions = getValidPositions(config)

  const { wallWidthCm, wallHeightCm, borderCloseness } = config
  const border = borderCloseness ?? { top: 0, right: 0, bottom: 0, left: 0 }
  const maxDist = Math.sqrt(wallWidthCm ** 2 + wallHeightCm ** 2) || 1
  const sigma = maxDist * 0.15

  const numClusters = 2 + Math.floor(rng() * 2)
  const padW = Math.max(10, wallWidthCm - border.left - border.right)
  const padH = Math.max(10, wallHeightCm - border.top - border.bottom)
  const clusters: { x: number; y: number }[] = []
  for (let i = 0; i < numClusters; i++) {
    clusters.push({
      x: border.left + rng() * padW,
      y: border.top + rng() * padH,
    })
  }

  const weights = validPositions.map(({ row, col }) => {
    const { xCm, yCm } = positionToCm(row, col, layout)
    let weight = 0
    for (const cluster of clusters) {
      const dist = Math.sqrt((xCm - cluster.x) ** 2 + (yCm - cluster.y) ** 2)
      weight += Math.exp(-(dist * dist) / (2 * sigma * sigma))
    }
    return Math.max(0.01, Math.pow(weight, 2))
  })

  const shuffled = weightedShuffle(validPositions, weights, rng)

  const visibleCount = config.targetVisibleDots ?? 200
  const count = Math.min(visibleCount, shuffled.length)

  const dots: Dot[] = []

  for (let i = 0; i < count; i++) {
    const { row, col } = shuffled[i]
    const { xCm, yCm } = positionToCm(row, col, layout)

    // Small random jitter (±0.2cm)
    const jitterX = (rng() - 0.5) * 0.4
    const jitterY = (rng() - 0.5) * 0.4

    const blobPath = generateBlobPath(rngSeed + i * 1000 + row * 100 + col)

    dots.push({
      id: `dot-${row}-${col}-${i}`,
      xCm: xCm + jitterX,
      yCm: yCm + jitterY,
      on: true,
      blobPath,
    })
  }

  return dots
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
