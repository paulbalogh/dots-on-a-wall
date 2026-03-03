import type { Dot as DotType } from '../types'

interface DotProps {
  dot: DotType
  scalePxPerCm: number
  color?: string
}

const DOT_RADIUS_CM = 1

export function Dot({ dot, scalePxPerCm, color = '#c00' }: DotProps) {
  if (!dot.on) return null

  const cx = dot.xCm * scalePxPerCm
  const cy = dot.yCm * scalePxPerCm
  const r = DOT_RADIUS_CM * scalePxPerCm

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      stroke="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
    />
  )
}
