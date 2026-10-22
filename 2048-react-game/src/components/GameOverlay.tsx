import type { GameStatus } from '../types'

interface Props {
  status: GameStatus
  onRestart: () => void
}

const GameOverlay = ({ status, onRestart }: Props) => {
  if (status === 'playing') return null

  return (
    <div className={`overlay ${status}`}>
      <p className="overlay-msg">{status === 'won' ? 'You Win!' : 'Game Over!'}</p>
      <button className="restart-btn" onClick={onRestart}>
        Try Again
      </button>
    </div>
  )
}

export default GameOverlay
