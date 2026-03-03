/**
 * Generates a random blob path inscribed in a 2×2cm cell (centered at 0,0, so -1 to 1).
 * Uses 6–8 points around a circle with random radius variation, then smooths with quadratic curves.
 */
export function generateBlobPath(seed: number): string {
  const rng = seededRandom(seed)
  const numPoints = 6 + Math.floor(rng() * 3) // 6–8 points
  const points: { angle: number; radius: number }[] = []

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2 + rng() * 0.3
    const radius = 0.7 + rng() * 0.3 // 0.7–1.0 to keep inscribed in unit circle
    points.push({ angle, radius })
  }

  // Build smooth path with quadratic curves
  const pathParts: string[] = []

  for (let i = 0; i < numPoints; i++) {
    const curr = points[i]
    const next = points[(i + 1) % numPoints]
    const ctrl = points[(i + 2) % numPoints] // control point from next segment

    const x = Math.cos(curr.angle) * curr.radius
    const y = Math.sin(curr.angle) * curr.radius
    const nx = Math.cos(next.angle) * next.radius
    const ny = Math.sin(next.angle) * next.radius
    const cx = Math.cos(ctrl.angle) * ctrl.radius
    const cy = Math.sin(ctrl.angle) * ctrl.radius

    const ctrlX = (x + nx) / 2 + (cx - (x + nx) / 2) * 0.5
    const ctrlY = (y + ny) / 2 + (cy - (y + ny) / 2) * 0.5

    if (i === 0) {
      pathParts.push(`M ${x} ${y}`)
    }
    pathParts.push(`Q ${ctrlX} ${ctrlY} ${nx} ${ny}`)
  }

  pathParts.push('Z')
  return pathParts.join(' ')
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
