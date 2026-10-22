import { useCallback, useEffect, useState } from 'react'
import type { Direction, GameState } from '../types'
import { addRandomTile, hasLost, hasWon, initGrid, move } from '../utils/gameLogic'

const BEST_SCORE_KEY = 'best-score-2048'

const loadBestScore = (): number => {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10) || 0
  } catch {
    return 0
  }
}

const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score))
  } catch {
    // localStorage unavailable
  }
}

const initialState = (): GameState => ({
  grid: initGrid(),
  score: 0,
  bestScore: loadBestScore(),
  status: 'playing',
})

export const useGame = () => {
  const [state, setState] = useState<GameState>(initialState)

  const handleMove = useCallback((direction: Direction) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev

      const { grid, points, moved } = move(prev.grid, direction)
      if (!moved) return prev

      const newGrid = addRandomTile(grid)
      const newScore = prev.score + points
      const newBest = Math.max(prev.bestScore, newScore)

      if (newBest > prev.bestScore) saveBestScore(newBest)

      const status = hasWon(newGrid) ? 'won' : hasLost(newGrid) ? 'lost' : 'playing'

      return { grid: newGrid, score: newScore, bestScore: newBest, status }
    })
  }, [])

  const restart = useCallback(() => {
    setState((prev) => ({
      ...initialState(),
      bestScore: prev.bestScore,
    }))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }
      const dir = map[e.key]
      if (dir) {
        e.preventDefault()
        handleMove(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  return { state, handleMove, restart }
}
