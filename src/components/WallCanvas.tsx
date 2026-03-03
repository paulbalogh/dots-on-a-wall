import { useRef, useState, useCallback, useEffect } from 'react'
import type { WallConfig, Dot as DotType } from '../types'
import { getValidPositions, positionToCm, getGridLayout } from '../lib/grid'
import { Dot } from './Dot'

interface WallCanvasProps {
  config: WallConfig
  dots: DotType[]
  widthPx?: number
  onBlackoutChange?: (blackout: NonNullable<WallConfig['blackout']>) => void
}

export function WallCanvas({ config, dots, widthPx = 600, onBlackoutChange }: WallCanvasProps) {
  const { wallWidthCm, wallHeightCm, blackout } = config
  const scalePxPerCm = widthPx / wallWidthCm
  const heightPx = wallHeightCm * scalePxPerCm

  const layout = getGridLayout(config)
  const gridPositions = getValidPositions(config)

  const svgRef = useRef<SVGSVGElement>(null)
  const [dragMode, setDragMode] = useState<'move' | 'resize' | null>(null)
  const resizeHandleRef = useRef<'nw' | 'ne' | 'sw' | 'se' | null>(null)
  const dragStartRef = useRef({ xCm: 0, yCm: 0 })

  const HANDLE_SIZE_PX = 10

  const pxToCm = useCallback(
    (pxX: number, pxY: number) => {
      const svg = svgRef.current
      if (!svg) return { xCm: 0, yCm: 0 }
      const rect = svg.getBoundingClientRect()
      const x = ((pxX - rect.left) / rect.width) * widthPx
      const y = ((pxY - rect.top) / rect.height) * heightPx
      return { xCm: x / scalePxPerCm, yCm: y / scalePxPerCm }
    },
    [widthPx, heightPx, scalePxPerCm]
  )

  const handleBlackoutMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!blackout || !onBlackoutChange) return
      e.preventDefault()
      e.stopPropagation()
      const { xCm, yCm } = pxToCm(e.clientX, e.clientY)
      dragStartRef.current = { xCm, yCm }
      resizeHandleRef.current = null
      setDragMode('move')
    },
    [blackout, onBlackoutChange, pxToCm]
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, handle: 'nw' | 'ne' | 'sw' | 'se') => {
      if (!blackout || !onBlackoutChange) return
      e.preventDefault()
      e.stopPropagation()
      const { xCm, yCm } = pxToCm(e.clientX, e.clientY)
      dragStartRef.current = { xCm, yCm }
      resizeHandleRef.current = handle
      setDragMode('resize')
    },
    [blackout, onBlackoutChange, pxToCm]
  )

  useEffect(() => {
    if (!dragMode || !blackout || !onBlackoutChange) return

    const handleMouseMove = (e: MouseEvent) => {
      const { xCm: currXCm, yCm: currYCm } = pxToCm(e.clientX, e.clientY)
      const handle = resizeHandleRef.current

      if (dragMode === 'move' || !handle) {
        const { xCm: startXCm, yCm: startYCm } = dragStartRef.current
        const deltaXCm = currXCm - startXCm
        const deltaYCm = currYCm - startYCm
        dragStartRef.current = { xCm: currXCm, yCm: currYCm }

        const newXCm = Math.max(0, Math.min(wallWidthCm - blackout.widthCm, blackout.xCm + deltaXCm))
        const newYCm = Math.max(0, Math.min(wallHeightCm - blackout.heightCm, blackout.yCm + deltaYCm))

        onBlackoutChange({ ...blackout, xCm: newXCm, yCm: newYCm })
        return
      }

      const MIN_SIZE_CM = 5
      const { xCm, yCm, widthCm, heightCm } = blackout
      const right = xCm + widthCm
      const bottom = yCm + heightCm

      let newXCm = xCm
      let newYCm = yCm
      let newWidthCm = widthCm
      let newHeightCm = heightCm

      if (handle.includes('e')) {
        const newRight = Math.max(xCm + MIN_SIZE_CM, Math.min(wallWidthCm, currXCm))
        newWidthCm = newRight - xCm
      }
      if (handle.includes('w')) {
        const newLeft = Math.min(right - MIN_SIZE_CM, Math.max(0, currXCm))
        newXCm = newLeft
        newWidthCm = right - newLeft
      }
      if (handle.includes('s')) {
        const newBottom = Math.max(yCm + MIN_SIZE_CM, Math.min(wallHeightCm, currYCm))
        newHeightCm = newBottom - yCm
      }
      if (handle.includes('n')) {
        const newTop = Math.min(bottom - MIN_SIZE_CM, Math.max(0, currYCm))
        newYCm = newTop
        newHeightCm = bottom - newTop
      }

      onBlackoutChange({ xCm: newXCm, yCm: newYCm, widthCm: newWidthCm, heightCm: newHeightCm })
    }

    const handleMouseUp = () => {
      setDragMode(null)
      resizeHandleRef.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    document.body.style.userSelect = 'none'
    document.body.style.cursor = dragMode === 'resize' ? 'nwse-resize' : 'grabbing'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [dragMode, blackout, onBlackoutChange, pxToCm, wallWidthCm, wallHeightCm])

  return (
    <svg
      ref={svgRef}
      width={widthPx}
      height={heightPx}
      viewBox={`0 0 ${widthPx} ${heightPx}`}
      className="wall-canvas"
    >
      {/* Wall background */}
      <rect width={widthPx} height={heightPx} fill="#f5f5f0" stroke="#ddd" strokeWidth={1} />

      {/* Blackout area */}
      {blackout && (
        <g>
          <rect
            x={blackout.xCm * scalePxPerCm}
            y={blackout.yCm * scalePxPerCm}
            width={blackout.widthCm * scalePxPerCm}
            height={blackout.heightCm * scalePxPerCm}
          fill="#2a2a2a"
          fillOpacity={0.1}
          stroke="#1a1a1a"
          strokeOpacity={0.1}
            strokeWidth={1}
            style={{ cursor: dragMode ? 'grabbing' : 'grab' }}
            onMouseDown={handleBlackoutMouseDown}
          />
          {/* Resize handles */}
          <circle
            cx={blackout.xCm * scalePxPerCm}
            cy={blackout.yCm * scalePxPerCm}
            r={HANDLE_SIZE_PX / 2}
            fill="#c0c0c0"
            stroke="#999"
            strokeWidth={1}
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <circle
            cx={(blackout.xCm + blackout.widthCm) * scalePxPerCm}
            cy={blackout.yCm * scalePxPerCm}
            r={HANDLE_SIZE_PX / 2}
            fill="#c0c0c0"
            stroke="#999"
            strokeWidth={1}
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <circle
            cx={blackout.xCm * scalePxPerCm}
            cy={(blackout.yCm + blackout.heightCm) * scalePxPerCm}
            r={HANDLE_SIZE_PX / 2}
            fill="#c0c0c0"
            stroke="#999"
            strokeWidth={1}
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <circle
            cx={(blackout.xCm + blackout.widthCm) * scalePxPerCm}
            cy={(blackout.yCm + blackout.heightCm) * scalePxPerCm}
            r={HANDLE_SIZE_PX / 2}
            fill="#c0c0c0"
            stroke="#999"
            strokeWidth={1}
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
        </g>
      )}

      {/* Grid dots (black, opacity by visibility) */}
      <g opacity={config.gridVisibility ?? 0.2}>
        {gridPositions.map(({ row, col }) => {
          const { xCm, yCm } = positionToCm(row, col, layout)
          const cx = xCm * scalePxPerCm
          const cy = yCm * scalePxPerCm
          const r = Math.max(2, scalePxPerCm * 0.5)
          return (
            <circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="#000"
              stroke="none"
            />
          )
        })}
      </g>

      {/* Blob dots */}
      <g>
        {dots.map((dot) => (
          <Dot key={dot.id} dot={dot} scalePxPerCm={scalePxPerCm} color={config.dotColor ?? '#000'} />
        ))}
      </g>
    </svg>
  )
}
