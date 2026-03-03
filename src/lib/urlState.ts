import type { WallConfig } from '../types'

const DEFAULTS: WallConfig = {
  targetVisibleDots: 200,
  wallWidthCm: 300,
  wallHeightCm: 200,
  blackout: { xCm: 0, yCm: 170, widthCm: 40, heightCm: 30 },
  borderCloseness: { top: 2, right: 2, bottom: 2, left: 2 },
  onRatio: 0.2,
  gridVisibility: 0.05,
  dotColor: '#c00000',
}

function parseNum(s: string | null, fallback: number): number {
  if (s == null) return fallback
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : fallback
}

function parseHex(s: string | null, fallback: string): string {
  if (!s) return fallback
  const cleaned = s.replace(/^#/, '')
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) return '#' + cleaned
  return fallback
}

export function searchParamsToConfig(search: string): WallConfig {
  const params = new URLSearchParams(search)

  const blackout = {
    xCm: parseNum(params.get('bx'), DEFAULTS.blackout!.xCm),
    yCm: parseNum(params.get('by'), DEFAULTS.blackout!.yCm),
    widthCm: parseNum(params.get('bw'), DEFAULTS.blackout!.widthCm),
    heightCm: parseNum(params.get('bh'), DEFAULTS.blackout!.heightCm),
  }

  const borderCloseness = {
    top: parseNum(params.get('bt'), DEFAULTS.borderCloseness!.top),
    right: parseNum(params.get('br'), DEFAULTS.borderCloseness!.right),
    bottom: parseNum(params.get('bb'), DEFAULTS.borderCloseness!.bottom),
    left: parseNum(params.get('bl'), DEFAULTS.borderCloseness!.left),
  }

  return {
    targetVisibleDots: parseNum(params.get('dots'), DEFAULTS.targetVisibleDots),
    wallWidthCm: parseNum(params.get('w'), DEFAULTS.wallWidthCm),
    wallHeightCm: parseNum(params.get('h'), DEFAULTS.wallHeightCm),
    blackout,
    borderCloseness,
    onRatio: parseNum(params.get('on'), DEFAULTS.onRatio!),
    gridVisibility: parseNum(params.get('grid'), DEFAULTS.gridVisibility!),
    dotColor: parseHex(params.get('color'), DEFAULTS.dotColor!),
  }
}

export function configToSearchParams(config: WallConfig): URLSearchParams {
  const params = new URLSearchParams()

  params.set('dots', String(config.targetVisibleDots))
  params.set('w', String(config.wallWidthCm))
  params.set('h', String(config.wallHeightCm))

  if (config.blackout) {
    params.set('bx', String(config.blackout.xCm))
    params.set('by', String(config.blackout.yCm))
    params.set('bw', String(config.blackout.widthCm))
    params.set('bh', String(config.blackout.heightCm))
  }

  if (config.borderCloseness) {
    params.set('bt', String(config.borderCloseness.top))
    params.set('br', String(config.borderCloseness.right))
    params.set('bb', String(config.borderCloseness.bottom))
    params.set('bl', String(config.borderCloseness.left))
  }

  params.set('on', String(config.onRatio ?? DEFAULTS.onRatio))
  params.set('grid', String(config.gridVisibility ?? DEFAULTS.gridVisibility))
  params.set('color', (config.dotColor ?? DEFAULTS.dotColor ?? '#c00000').replace(/^#/, ''))

  return params
}

export function getConfigFromUrl(): WallConfig {
  return searchParamsToConfig(window.location.search)
}

export function pushConfigToUrl(config: WallConfig): void {
  const params = configToSearchParams(config)
  const search = params.toString()
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname
  window.history.replaceState(null, '', url)
}
