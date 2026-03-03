import type { Dot as DotType } from '../types'
import { positionToCell } from '../lib/measurementGrid'

interface CoordinatesTableProps {
  dots: DotType[]
}

export function CoordinatesTable({ dots }: CoordinatesTableProps) {
  const visibleDots = dots.filter((d) => d.on)

  return (
    <div className="coordinates-table-wrapper">
      <table className="coordinates-table">
        <caption>Position relative to cell top-left (20×20 cm cells)</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Cell</th>
            <th>x (cm)</th>
            <th>y (cm)</th>
          </tr>
        </thead>
        <tbody>
          {visibleDots.map((dot, i) => {
            const { cell, relXCm, relYCm } = positionToCell(dot.xCm, dot.yCm)
            return (
              <tr key={dot.id}>
                <td>{i + 1}</td>
                <td>{cell}</td>
                <td>{relXCm.toFixed(2)}</td>
                <td>{relYCm.toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
