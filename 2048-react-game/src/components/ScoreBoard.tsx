interface Props {
  score: number
  bestScore: number
  onRestart: () => void
}

const ScoreBoard = ({ score, bestScore, onRestart }: Props) => (
  <div className="scoreboard">
    <div className="title">2048</div>
    <div className="scores">
      <div className="score-box">
        <span className="label">SCORE</span>
        <span className="value">{score}</span>
      </div>
      <div className="score-box">
        <span className="label">BEST</span>
        <span className="value">{bestScore}</span>
      </div>
    </div>
    <button className="restart-btn" onClick={onRestart}>
      New Game
    </button>
  </div>
)

export default ScoreBoard
