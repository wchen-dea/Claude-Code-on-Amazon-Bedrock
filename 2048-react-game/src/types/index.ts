export type Grid = number[][]

export type Direction = 'up' | 'down' | 'left' | 'right'

export type GameStatus = 'playing' | 'won' | 'lost'

export interface GameState {
  grid: Grid
  score: number
  bestScore: number
  status: GameStatus
}

export interface LeaderboardEntry {
  /** Final score achieved in that game */
  score: number
  /** ISO 8601 date string of when the game ended */
  date: string
}

export interface ScoreHistoryEntry {
  /** Unique identifier for list keys */
  id: string
  /** Final score achieved in that game */
  score: number
  /** Highest tile value on the board when the game ended */
  maxTile: number
  /** Whether the player won or lost */
  result: 'won' | 'lost'
  /** ISO 8601 date string of when the game ended */
  date: string
}
