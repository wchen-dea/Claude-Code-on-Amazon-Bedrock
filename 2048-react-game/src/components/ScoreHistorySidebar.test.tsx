import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ScoreHistoryEntry } from '../types'
import ScoreHistorySidebar from './ScoreHistorySidebar'

const makeEntry = (overrides: Partial<ScoreHistoryEntry> = {}): ScoreHistoryEntry => ({
  id: '1',
  score: 2048,
  maxTile: 1024,
  result: 'won',
  date: '2026-10-22T12:00:00.000Z',
  ...overrides,
})

describe('ScoreHistorySidebar', () => {
  it('renders the History heading', () => {
    render(<ScoreHistorySidebar history={[]} />)
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('shows empty-state message when history is empty', () => {
    render(<ScoreHistorySidebar history={[]} />)
    expect(screen.getByText(/no games yet/i)).toBeInTheDocument()
  })

  it('renders the correct number of entries', () => {
    const history = [
      makeEntry({ id: '1', score: 4096 }),
      makeEntry({ id: '2', score: 2048 }),
      makeEntry({ id: '3', score: 512 }),
    ]
    render(<ScoreHistorySidebar history={history} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('displays the formatted score for each entry', () => {
    const history = [makeEntry({ score: 4096 })]
    render(<ScoreHistorySidebar history={history} />)
    expect(screen.getByText('4,096')).toBeInTheDocument()
  })

  it('shows W badge for a won game', () => {
    render(<ScoreHistorySidebar history={[makeEntry({ result: 'won' })]} />)
    expect(screen.getByText('W')).toBeInTheDocument()
  })

  it('shows L badge for a lost game', () => {
    render(<ScoreHistorySidebar history={[makeEntry({ result: 'lost' })]} />)
    expect(screen.getByText('L')).toBeInTheDocument()
  })

  it('displays the max tile value', () => {
    render(<ScoreHistorySidebar history={[makeEntry({ maxTile: 2048 })]} />)
    expect(screen.getByText('2048')).toBeInTheDocument()
  })

  it('assigns correct CSS class for won badge', () => {
    render(<ScoreHistorySidebar history={[makeEntry({ result: 'won' })]} />)
    const badge = screen.getByText('W')
    expect(badge.className).toContain('sh-badge--won')
  })

  it('assigns correct CSS class for lost badge', () => {
    render(<ScoreHistorySidebar history={[makeEntry({ result: 'lost' })]} />)
    const badge = screen.getByText('L')
    expect(badge.className).toContain('sh-badge--lost')
  })

  it('renders entries in provided order (newest first)', () => {
    const history = [
      makeEntry({ id: '1', score: 5000 }),
      makeEntry({ id: '2', score: 3000 }),
    ]
    render(<ScoreHistorySidebar history={history} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('5,000')
    expect(items[1]).toHaveTextContent('3,000')
  })

  it('does not render the list when history is empty', () => {
    render(<ScoreHistorySidebar history={[]} />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
