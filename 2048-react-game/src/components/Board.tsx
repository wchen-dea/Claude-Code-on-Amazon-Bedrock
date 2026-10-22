import type { Grid } from '../types'
import Tile from './Tile'

interface Props {
  grid: Grid
}

const Board = ({ grid }: Props) => (
  <div className="board">
    {grid.flat().map((value, i) => (
      <Tile key={i} value={value} />
    ))}
  </div>
)

export default Board
