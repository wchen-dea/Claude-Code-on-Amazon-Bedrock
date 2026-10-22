import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useScoreHistory } from './useScoreHistory'

const STORAGE_KEY = 'score-history-2048'

// Node 25 provides a partial Web Storage implementation without clear/removeItem.
// Stub the whole object so tests have full, reliable control.
let store: Record<string, string> = {}

const makeStorageMock = () => ({
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key]
  }),
})

beforeEach(() => {
  store = {}
  vi.stubGlobal('localStorage', makeStorageMock())
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useScoreHistory', () => {
  it('starts with an empty history when localStorage is empty', () => {
    const { result } = renderHook(() => useScoreHistory())
    expect(result.current.history).toEqual([])
  })

  it('loads existing history from localStorage on mount', () => {
    const stored = [
      { id: '1', score: 2048, maxTile: 2048, result: 'won', date: '2026-10-22T10:00:00.000Z' },
    ]
    store[STORAGE_KEY] = JSON.stringify(stored)

    const { result } = renderHook(() => useScoreHistory())
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].score).toBe(2048)
  })

  it('addHistoryEntry prepends the new entry (newest first)', () => {
    const { result } = renderHook(() => useScoreHistory())

    act(() => { result.current.addHistoryEntry(512, 512, 'lost') })
    act(() => { result.current.addHistoryEntry(1024, 1024, 'won') })

    expect(result.current.history[0].score).toBe(1024)
    expect(result.current.history[1].score).toBe(512)
  })

  it('persists entries to localStorage after adding', () => {
    const { result } = renderHook(() => useScoreHistory())

    act(() => { result.current.addHistoryEntry(4096, 2048, 'won') })

    const stored = JSON.parse(store[STORAGE_KEY] ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].score).toBe(4096)
    expect(stored[0].maxTile).toBe(2048)
    expect(stored[0].result).toBe('won')
  })

  it('ignores entries with score <= 0', () => {
    const { result } = renderHook(() => useScoreHistory())

    act(() => { result.current.addHistoryEntry(0, 2, 'lost') })

    expect(result.current.history).toHaveLength(0)
  })

  it('caps history at 50 entries, dropping the oldest', () => {
    const { result } = renderHook(() => useScoreHistory())

    act(() => {
      for (let i = 1; i <= 51; i++) {
        result.current.addHistoryEntry(i * 100, 2, 'lost')
      }
    })

    expect(result.current.history).toHaveLength(50)
    expect(result.current.history[0].score).toBe(5100)
    const scores = result.current.history.map((e) => e.score)
    expect(scores).not.toContain(100)
  })

  it('handles corrupted localStorage gracefully', () => {
    store[STORAGE_KEY] = 'not-valid-json'

    const { result } = renderHook(() => useScoreHistory())
    expect(result.current.history).toEqual([])
  })

  it('silently handles localStorage write failure', () => {
    const mockStorage = makeStorageMock()
    mockStorage.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    vi.stubGlobal('localStorage', mockStorage)

    const { result } = renderHook(() => useScoreHistory())

    expect(() => {
      act(() => { result.current.addHistoryEntry(1024, 512, 'won') })
    }).not.toThrow()

    // In-memory state still updates even when persistence fails
    expect(result.current.history).toHaveLength(1)
  })
})
