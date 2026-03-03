const CELL_SIZE_CM = 20

function colIndexToLetter(colIndex: number): string {
  if (colIndex < 0) return `[${colIndex}]`
  if (colIndex < 26) return String.fromCharCode(65 + colIndex)
  return colIndexToLetter(Math.floor(colIndex / 26) - 1) + String.fromCharCode(65 + (colIndex % 26))
}

/**
 * Convert absolute position (cm) to cell (chess notation) and relative position within cell.
 * Columns: A, B, C, ... (letters)
 * Rows: 1, 2, 3, ... (numbers, row 1 at top)
 */
export function positionToCell(xCm: number, yCm: number): {
  cell: string
  colIndex: number
  rowIndex: number
  relXCm: number
  relYCm: number
} {
  const colIndex = Math.floor(xCm / CELL_SIZE_CM)
  const rowIndex = Math.floor(yCm / CELL_SIZE_CM)
  const relXCm = xCm - colIndex * CELL_SIZE_CM
  const relYCm = yCm - rowIndex * CELL_SIZE_CM
  const colLetter = colIndexToLetter(colIndex)
  const rowNum = rowIndex + 1
  const cell = `${colLetter}${rowNum}`
  return { cell, colIndex, rowIndex, relXCm, relYCm }
}

export function getMeasurementGridLines(wallWidthCm: number, wallHeightCm: number): {
  vertical: number[]
  horizontal: number[]
} {
  const vertical: number[] = []
  for (let x = CELL_SIZE_CM; x < wallWidthCm; x += CELL_SIZE_CM) {
    vertical.push(x)
  }
  const horizontal: number[] = []
  for (let y = CELL_SIZE_CM; y < wallHeightCm; y += CELL_SIZE_CM) {
    horizontal.push(y)
  }
  return { vertical, horizontal }
}

export function getMeasurementGridLabels(wallWidthCm: number, wallHeightCm: number): {
  columns: { x: number; label: string }[]
  rows: { y: number; label: string }[]
} {
  const columns: { x: number; label: string }[] = []
  for (let col = 0; col * CELL_SIZE_CM < wallWidthCm; col++) {
    columns.push({
      x: col * CELL_SIZE_CM + CELL_SIZE_CM / 2,
      label: colIndexToLetter(col),
    })
  }
  const rows: { y: number; label: string }[] = []
  for (let row = 0; row * CELL_SIZE_CM < wallHeightCm; row++) {
    rows.push({
      y: row * CELL_SIZE_CM + CELL_SIZE_CM / 2,
      label: String(row + 1),
    })
  }
  return { columns, rows }
}
