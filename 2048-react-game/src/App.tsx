import { useEffect, useRef } from 'react'
import Board from './components/Board'
import GameOverlay from './components/GameOverlay'
import Leaderboard from './components/Leaderboard'
import ScoreBoard from './components/ScoreBoard'
import ScoreHistorySidebar from './components/ScoreHistorySidebar'
import { useGame } from './hooks/useGame'
import { useLeaderboard } from './hooks/useLeaderboard'
import { useScoreHistory } from './hooks/useScoreHistory'
import './index.css'

const App = () => {
  const { state, restart } = useGame()
  const { entries, addEntry } = useLeaderboard()
  const { history, addHistoryEntry } = useScoreHistory()

  // Save score once per game-over/win transition (not on re-renders)
  const savedRef = useRef(false)
  useEffect(() => {
    if (state.status !== 'playing') {
      if (!savedRef.current) {
        savedRef.current = true
        const maxTile = Math.max(0, ...state.grid.flat())
        addEntry(state.score)
        addHistoryEntry(state.score, maxTile, state.status)
      }
    } else {
      savedRef.current = false
    }
  }, [state.status, state.score, state.grid, addEntry, addHistoryEntry])

  return (
    <div className="app-layout">
      <div className="app">
        <ScoreBoard score={state.score} bestScore={state.bestScore} onRestart={restart} />
        <p className="subtitle">Join the tiles, get to <strong>2048!</strong></p>
        <div className="board-wrapper">
          <Board grid={state.grid} />
          <GameOverlay status={state.status} onRestart={restart} />
        </div>
        <p className="hint">Use arrow keys or WASD to move tiles</p>
        <Leaderboard entries={entries} />
      </div>
      <ScoreHistorySidebar history={history} />
    </div>
  )
}

export default App
