import type { Dot as DotType } from '../types'

interface CoordinatesTableProps {
  dots: DotType[]
}

export function CoordinatesTable({ dots }: CoordinatesTableProps) {
  return (
    <div className="coordinates-table-wrapper">
      <table className="coordinates-table">
        <thead>
          <tr>
            <th>#</th>
            <th>x (cm)</th>
            <th>y (cm)</th>
          </tr>
        </thead>
        <tbody>
          {dots.map((dot, i) => (
            <tr key={dot.id}>
              <td>{i + 1}</td>
              <td>{dot.xCm.toFixed(2)}</td>
              <td>{dot.yCm.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
