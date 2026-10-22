import { useEffect, useRef, useState } from 'react'
import type { LeaderboardEntry } from '../types'

/** Formats an ISO date string as a short locale date, e.g. "Oct 22, 2026". */
const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

interface Props {
  /** All leaderboard entries to display, sorted descending by score. */
  entries: LeaderboardEntry[]
}

/**
 * Renders a "Leaderboard" button that opens a modal popup listing the top
 * scores. The modal closes on backdrop click or the Escape key.
 */
const Leaderboard = ({ entries }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // Shift focus into the dialog when it opens for accessibility
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus()
  }, [isOpen])

  return (
    <>
      <button
        className="leaderboard-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open leaderboard"
      >
        Leaderboard
      </button>

      {isOpen && (
        <div
          className="lb-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div
            className="lb-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Leaderboard"
            tabIndex={-1}
            ref={dialogRef}
          >
            <div className="lb-header">
              <h2 className="lb-title">Leaderboard</h2>
              <button
                className="lb-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close leaderboard"
              >
                &times;
              </button>
            </div>

            {entries.length === 0 ? (
              <p className="lb-empty">No scores yet — finish a game to appear here!</p>
            ) : (
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={i} className={i === 0 ? 'lb-gold' : ''}>
                      <td>{i + 1}</td>
                      <td>{entry.score.toLocaleString()}</td>
                      <td>{formatDate(entry.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Leaderboard
