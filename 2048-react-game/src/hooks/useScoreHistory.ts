import { useCallback, useState } from 'react'
import type { ScoreHistoryEntry } from '../types'

const STORAGE_KEY = 'score-history-2048'
const MAX_ENTRIES = 50

const load = (): ScoreHistoryEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const save = (entries: ScoreHistoryEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export const useScoreHistory = () => {
  const [history, setHistory] = useState<ScoreHistoryEntry[]>(load)

  const addHistoryEntry = useCallback(
    (score: number, maxTile: number, result: 'won' | 'lost') => {
      if (score <= 0) return
      setHistory((prev) => {
        const entry: ScoreHistoryEntry = {
          id: `${Date.now()}-${prev.length}`,
          score,
          maxTile,
          result,
          date: new Date().toISOString(),
        }
        const next = [entry, ...prev].slice(0, MAX_ENTRIES)
        save(next)
        return next
      })
    },
    [],
  )

  return { history, addHistoryEntry }
}
