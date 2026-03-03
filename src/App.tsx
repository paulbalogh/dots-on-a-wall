import { useState, useCallback, useMemo, useEffect } from 'react'
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
          <WallCanvas
            config={config}
            dots={dots}
            widthPx={600}
            onBlackoutChange={config.blackout ? handleBlackoutChange : undefined}
          />
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
