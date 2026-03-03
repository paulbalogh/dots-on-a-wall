import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { WallConfig, Dot as DotType } from './types'
import { getValidPositions, getTotalGridDots } from './lib/grid'
import { randomizeDots } from './lib/randomize'
import { getConfigFromUrl, pushConfigToUrl } from './lib/urlState'
import { ControlsPanel } from './components/ControlsPanel'
import { WallCanvas } from './components/WallCanvas'
import { CoordinatesTable } from './components/CoordinatesTable'

function App() {
  const [config, setConfig] = useState<WallConfig>(() => getConfigFromUrl())
  const [dots, setDots] = useState<DotType[]>(() => randomizeDots(getConfigFromUrl()))

  const { validCount, totalGridDots } = useMemo(() => ({
    validCount: getValidPositions(config).length,
    totalGridDots: getTotalGridDots(config),
  }), [config])

  const gridConfigKey = JSON.stringify({
    targetVisibleDots: config.targetVisibleDots,
    onRatio: config.onRatio,
    wallWidthCm: config.wallWidthCm,
    wallHeightCm: config.wallHeightCm,
    blackout: config.blackout,
    borderCloseness: config.borderCloseness,
  })
  useEffect(() => {
    setDots(randomizeDots(config))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridConfigKey])

  useEffect(() => {
    pushConfigToUrl(config)
  }, [config])

  const handleRandomize = useCallback(() => {
    setDots(randomizeDots(config))
  }, [config])

  const handleBlackoutChange = useCallback(
    (blackout: NonNullable<WallConfig['blackout']>) => {
      setConfig((c) => ({ ...c, blackout }))
    },
    []
  )

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const maxWidthRef = useRef(1200)
  const [canvasWidth, setCanvasWidth] = useState(600)

  const hasInitializedWidth = useRef(false)
  useEffect(() => {
    const el = canvasContainerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? { width: 1200 }
      const w = Math.max(100, Math.floor(width))
      maxWidthRef.current = w
      if (!hasInitializedWidth.current) {
        hasInitializedWidth.current = true
        setCanvasWidth(w)
      }
    })
    observer.observe(el)
    const w = Math.max(100, Math.floor(el.getBoundingClientRect().width))
    maxWidthRef.current = w
    if (!hasInitializedWidth.current) {
      hasInitializedWidth.current = true
      setCanvasWidth(w)
    }
    return () => observer.disconnect()
  }, [])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = canvasWidth
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const newWidth = Math.max(100, Math.min(maxWidthRef.current, startWidth + delta))
      setCanvasWidth(newWidth)
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'nwse-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [canvasWidth])

  return (
    <div className="app">
      <header>
        <h1>Dots on a Wall</h1>
      </header>
      <main>
        <aside>
          <ControlsPanel
            config={config}
            onChange={setConfig}
            onRandomize={handleRandomize}
            validCount={validCount}
            totalGridDots={totalGridDots}
          />
        </aside>
        <section className="output">
          <div ref={canvasContainerRef} className="canvas-container">
            <div
              className="canvas-wrapper"
              style={{
                width: canvasWidth,
                height: (canvasWidth * config.wallHeightCm) / config.wallWidthCm,
              }}
            >
              <WallCanvas
                config={config}
                dots={dots}
                widthPx={canvasWidth}
                onBlackoutChange={config.blackout ? handleBlackoutChange : undefined}
              />
              <button
                type="button"
                className="canvas-resize-handle"
                aria-label="Resize canvas"
                onMouseDown={handleResizeStart}
              />
            </div>
          </div>
          <div className="table-section">
            <h3>Coordinates (x, y in cm)</h3>
            <CoordinatesTable dots={dots} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
