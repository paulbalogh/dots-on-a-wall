import type { WallConfig } from '../types'

interface ControlsPanelProps {
  config: WallConfig
  onChange: (config: WallConfig) => void
  onRandomize: () => void
  validCount: number
  totalGridDots: number
}

export function ControlsPanel({ config, onChange, onRandomize, validCount, totalGridDots }: ControlsPanelProps) {
  const update = (partial: Partial<WallConfig>) => {
    onChange({ ...config, ...partial })
  }

  const updateBlackout = (partial: Partial<NonNullable<WallConfig['blackout']>>) => {
    const current = config.blackout ?? { xCm: 0, yCm: 0, widthCm: 0, heightCm: 0 }
    onChange({ ...config, blackout: { ...current, ...partial } })
  }

  const updateBorder = (partial: Partial<NonNullable<WallConfig['borderCloseness']>>) => {
    onChange({
      ...config,
      borderCloseness: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...config.borderCloseness,
        ...partial,
      },
    })
  }

  return (
    <div className="controls-panel">
      <h2>Configuration</h2>

      <label>
        Dots on wall (visible)
        <input
          type="number"
          min={1}
          value={config.targetVisibleDots}
          onChange={(e) => update({ targetVisibleDots: Math.max(1, parseInt(e.target.value, 10) || 1) })}
        />
      </label>
      <p className="info">
        Grid: ~{totalGridDots} cells, {config.targetVisibleDots} dots placed (on-ratio = placed ÷ grid)
      </p>
      {config.targetVisibleDots > validCount && (
        <p className="warning">Only {validCount} valid positions (blackout/border). Placing {validCount} dots.</p>
      )}

      <label>
        Wall width (cm)
        <input
          type="number"
          min={10}
          value={config.wallWidthCm}
          onChange={(e) => update({ wallWidthCm: Math.max(10, parseInt(e.target.value, 10) || 10) })}
        />
      </label>

      <label>
        Wall height (cm)
        <input
          type="number"
          min={10}
          value={config.wallHeightCm}
          onChange={(e) => update({ wallHeightCm: Math.max(10, parseInt(e.target.value, 10) || 10) })}
        />
      </label>

      <label className="slider-row">
        Dot grid visibility
        <span className="slider-with-value">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={config.gridVisibility ?? 0.05}
            onChange={(e) => update({ gridVisibility: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{Math.round((config.gridVisibility ?? 0.05) * 100)}%</span>
        </span>
      </label>

      <label className="slider-row">
        Measurement grid visibility
        <span className="slider-with-value">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={config.measurementGridVisibility ?? 0.05}
            onChange={(e) => update({ measurementGridVisibility: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{Math.round((config.measurementGridVisibility ?? 0.05) * 100)}%</span>
        </span>
      </label>

      <label>
        Dot color
        <span className="color-picker-row">
          <input
            type="color"
            value={config.dotColor ?? '#c00000'}
            onChange={(e) => update({ dotColor: e.target.value })}
            className="color-input"
          />
          <span className="color-value">{config.dotColor ?? '#c00000'}</span>
        </span>
      </label>

      <label title="Placed dots ÷ total grid cells. Lower = tighter grid with more empty slots.">
        On-ratio (0–1)
        <input
          type="number"
          min={0.01}
          max={1}
          step={0.05}
          value={config.onRatio ?? 0.2}
          onChange={(e) => update({ onRatio: Math.max(0.01, Math.min(1, parseFloat(e.target.value) || 0.2)) })}
        />
      </label>

      <fieldset>
        <legend>Blackout area (e.g. behind radiator)</legend>
        <label>
          X (cm)
          <input
            type="number"
            min={0}
            value={config.blackout?.xCm ?? 0}
            onChange={(e) => updateBlackout({ xCm: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        <label>
          Y (cm)
          <input
            type="number"
            min={0}
            value={config.blackout?.yCm ?? 0}
            onChange={(e) => updateBlackout({ yCm: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        <label>
          Width (cm)
          <input
            type="number"
            min={0}
            value={config.blackout?.widthCm ?? 0}
            onChange={(e) => updateBlackout({ widthCm: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        <label>
          Height (cm)
          <input
            type="number"
            min={0}
            value={config.blackout?.heightCm ?? 0}
            onChange={(e) => updateBlackout({ heightCm: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Border closeness (cm)</legend>
        <label>
          Top
          <input
            type="number"
            min={0}
            value={config.borderCloseness?.top ?? 0}
            onChange={(e) => updateBorder({ top: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        <label>
          Right
          <input
            type="number"
            min={0}
            value={config.borderCloseness?.right ?? 0}
            onChange={(e) => updateBorder({ right: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        <label>
          Bottom
          <input
            type="number"
            min={0}
            value={config.borderCloseness?.bottom ?? 0}
            onChange={(e) => updateBorder({ bottom: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
        <label>
          Left
          <input
            type="number"
            min={0}
            value={config.borderCloseness?.left ?? 0}
            onChange={(e) => updateBorder({ left: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
        </label>
      </fieldset>

      <button type="button" onClick={onRandomize} className="randomize-btn">
        Randomize dots
      </button>
    </div>
  )
}
