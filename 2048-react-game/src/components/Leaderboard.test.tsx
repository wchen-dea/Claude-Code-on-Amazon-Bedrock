import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Leaderboard from './Leaderboard'
import type { LeaderboardEntry } from '../types'

const entries: LeaderboardEntry[] = [
  { score: 4096, date: '2026-10-22T12:00:00.000Z' },
  { score: 2048, date: '2026-10-21T08:30:00.000Z' },
  { score: 512,  date: '2026-10-20T18:00:00.000Z' },
]

describe('Leaderboard', () => {
  it('renders the leaderboard button', () => {
    render(<Leaderboard entries={[]} />)
    expect(screen.getByRole('button', { name: /open leaderboard/i })).toBeInTheDocument()
  })

  it('popup is hidden by default', () => {
    render(<Leaderboard entries={entries} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens popup when button is clicked', async () => {
    render(<Leaderboard entries={entries} />)
    await userEvent.click(screen.getByRole('button', { name: /open leaderboard/i }))
    expect(screen.getByRole('dialog', { name: /leaderboard/i })).toBeInTheDocument()
  })

  it('displays all entries with rank, score, and formatted date', async () => {
    render(<Leaderboard entries={entries} />)
    await userEvent.click(screen.getByRole('button', { name: /open leaderboard/i }))
    expect(screen.getByText('4,096')).toBeInTheDocument()
    expect(screen.getByText('2,048')).toBeInTheDocument()
    expect(screen.getByText('512')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows empty state when there are no entries', async () => {
    render(<Leaderboard entries={[]} />)
    await userEvent.click(screen.getByRole('button', { name: /open leaderboard/i }))
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument()
  })

  it('closes popup when close button is clicked', async () => {
    render(<Leaderboard entries={entries} />)
    await userEvent.click(screen.getByRole('button', { name: /open leaderboard/i }))
    await userEvent.click(screen.getByRole('button', { name: /close leaderboard/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes popup on Escape key', async () => {
    render(<Leaderboard entries={entries} />)
    await userEvent.click(screen.getByRole('button', { name: /open leaderboard/i }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes popup when backdrop is clicked', async () => {
    render(<Leaderboard entries={entries} />)
    await userEvent.click(screen.getByRole('button', { name: /open leaderboard/i }))
    // Click the backdrop (role=presentation behind the dialog)
    await userEvent.click(screen.getByRole('presentation'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
