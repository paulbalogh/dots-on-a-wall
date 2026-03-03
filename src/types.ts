export interface WallConfig {
  targetVisibleDots: number // Dots intended to be "on" on the wall
  wallWidthCm: number
  wallHeightCm: number
  blackout?: {
    xCm: number
    yCm: number
    widthCm: number
    heightCm: number
  }
  borderCloseness?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  onRatio?: number // placed dots ÷ total grid cells (default 0.2 = tighter grid)
  gridVisibility?: number // 0–1, opacity of underlying grid dots (default 0.2)
  dotColor?: string // Color of visible dots (default #000)
}

export interface Dot {
  id: string
  xCm: number
  yCm: number
  on: boolean
  blobPath?: string
}

export interface GridPosition {
  row: number
  col: number
}
