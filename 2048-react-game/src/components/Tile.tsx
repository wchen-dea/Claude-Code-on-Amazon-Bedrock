const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  0:    { bg: '#cdc1b4', fg: 'transparent' },
  2:    { bg: '#eee4da', fg: '#776e65' },
  4:    { bg: '#ede0c8', fg: '#776e65' },
  8:    { bg: '#f2b179', fg: '#f9f6f2' },
  16:   { bg: '#f59563', fg: '#f9f6f2' },
  32:   { bg: '#f67c5f', fg: '#f9f6f2' },
  64:   { bg: '#f65e3b', fg: '#f9f6f2' },
  128:  { bg: '#edcf72', fg: '#f9f6f2' },
  256:  { bg: '#edcc61', fg: '#f9f6f2' },
  512:  { bg: '#edc850', fg: '#f9f6f2' },
  1024: { bg: '#edc53f', fg: '#f9f6f2' },
  2048: { bg: '#edc22e', fg: '#f9f6f2' },
}

const getColors = (value: number) =>
  TILE_COLORS[value] ?? { bg: '#3c3a32', fg: '#f9f6f2' }

const getFontSize = (value: number): string => {
  if (value >= 1000) return '1.6rem'
  if (value >= 100) return '1.9rem'
  return '2.2rem'
}

interface Props {
  value: number
}

const Tile = ({ value }: Props) => {
  const { bg, fg } = getColors(value)
  return (
    <div
      className="tile"
      style={{ backgroundColor: bg, color: fg, fontSize: getFontSize(value) }}
    >
      {value !== 0 ? value : ''}
    </div>
  )
}

export default Tile
