import { useCallback, useState } from 'react'
import type { LeaderboardEntry } from '../types'

const STORAGE_KEY = 'leaderboard-2048'
const MAX_ENTRIES = 10

const load = (): LeaderboardEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const save = (entries: LeaderboardEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage unavailable
  }
}

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(load)

  const addEntry = useCallback((score: number) => {
    if (score <= 0) return
    setEntries((prev) => {
      const next = [...prev, { score, date: new Date().toISOString() }]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES)
      save(next)
      return next
    })
  }, [])

  return { entries, addEntry }
}
