import type { Dot as DotType } from '../types'

interface DotProps {
  dot: DotType
  scalePxPerCm: number
  color?: string
}

export function Dot({ dot, scalePxPerCm, color = '#000' }: DotProps) {
  if (!dot.on) return null

  const cx = dot.xCm * scalePxPerCm
  const cy = dot.yCm * scalePxPerCm
  const scale = scalePxPerCm // 1 unit in path = 1cm

  const path = dot.blobPath ?? 'M 0 1 L 0.5 -0.5 L 0 -1 L -0.5 -0.5 Z'

  return (
    <path
      d={path}
      transform={`translate(${cx}, ${cy}) scale(${scale})`}
      fill={color}
      stroke="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
    />
  )
}
