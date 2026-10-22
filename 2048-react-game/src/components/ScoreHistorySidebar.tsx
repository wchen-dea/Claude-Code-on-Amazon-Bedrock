import type { ScoreHistoryEntry } from '../types'

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

interface Props {
  /** All history entries, newest first. */
  history: ScoreHistoryEntry[]
}

const ScoreHistorySidebar = ({ history }: Props) => (
  <aside className="sh-sidebar" aria-label="Score history">
    <h3 className="sh-title">History</h3>
    {history.length === 0 ? (
      <p className="sh-empty">No games yet — finish one!</p>
    ) : (
      <ol className="sh-list">
        {history.map((entry, i) => (
          <li key={entry.id} className="sh-row">
            <span className="sh-rank">{i + 1}</span>
            <span className="sh-score">{entry.score.toLocaleString()}</span>
            <span className="sh-tile">{entry.maxTile}</span>
            <span className={`sh-badge sh-badge--${entry.result}`}>
              {entry.result === 'won' ? 'W' : 'L'}
            </span>
            <span className="sh-date">{formatDate(entry.date)}</span>
          </li>
        ))}
      </ol>
    )}
  </aside>
)

export default ScoreHistorySidebar
