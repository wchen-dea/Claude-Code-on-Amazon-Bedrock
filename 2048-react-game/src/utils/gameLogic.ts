import type { Grid, Direction } from '../types'

export const GRID_SIZE = 4
export const WIN_VALUE = 2048

export const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))

export const addRandomTile = (grid: Grid): Grid => {
  const empty: [number, number][] = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c])
    }
  }
  if (empty.length === 0) return grid

  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const newGrid = grid.map((row) => [...row])
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
  return newGrid
}

// Slide and merge a single row to the left; returns { row, points }
const slideRow = (row: number[]): { row: number[]; points: number } => {
  const tiles = row.filter((v) => v !== 0)
  let points = 0

  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] === tiles[i + 1]) {
      tiles[i] *= 2
      points += tiles[i]
      tiles.splice(i + 1, 1)
    }
  }

  while (tiles.length < GRID_SIZE) tiles.push(0)
  return { row: tiles, points }
}

const transpose = (grid: Grid): Grid =>
  grid[0].map((_, c) => grid.map((row) => row[c]))

const reverseRows = (grid: Grid): Grid => grid.map((row) => [...row].reverse())

export const move = (
  grid: Grid,
  direction: Direction,
): { grid: Grid; points: number; moved: boolean } => {
  let working = grid.map((row) => [...row])
  let totalPoints = 0

  // Normalise all directions to "slide left" via transforms
  if (direction === 'right') working = reverseRows(working)
  if (direction === 'up') working = transpose(working)
  if (direction === 'down') working = reverseRows(transpose(working))

  const newGrid = working.map((row) => {
    const { row: slid, points } = slideRow(row)
    totalPoints += points
    return slid
  })

  // Undo transforms
  let result = newGrid
  if (direction === 'right') result = reverseRows(result)
  if (direction === 'up') result = transpose(result)
  if (direction === 'down') result = transpose(reverseRows(result))

  const moved = result.some((row, r) => row.some((v, c) => v !== grid[r][c]))
  return { grid: result, points: totalPoints, moved }
}

export const hasWon = (grid: Grid): boolean =>
  grid.some((row) => row.some((v) => v >= WIN_VALUE))

export const hasLost = (grid: Grid): boolean => {
  // Any empty cell means not lost
  if (grid.some((row) => row.some((v) => v === 0))) return false
  // Any adjacent equal cells means not lost
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false
    }
  }
  return true
}

export const initGrid = (): Grid => addRandomTile(addRandomTile(createEmptyGrid()))
