# Commit: Score History Sidebar (+ Initial Repo)

**SHA**: 6c68263 | **Branch**: main (root commit) | **Status**: Committed

## 1. Summary (39 files, +4575 lines)

Initial commit of the 2048 React game, including the new score history sidebar feature: a persistent, always-visible panel beside the game board that logs every completed game with score, max tile, W/L result, and date.

**Key new files**:
- `src/hooks/useScoreHistory.ts` — localStorage hook, 50-entry cap, newest-first
- `src/components/ScoreHistorySidebar.tsx` — presentational sidebar component
- `src/hooks/useScoreHistory.test.ts` — 8 hook tests
- `src/components/ScoreHistorySidebar.test.tsx` — 11 component tests

**Modified**:
- `src/App.tsx` — wired hook, computes `maxTile`, added sidebar to layout
- `src/index.css` — `.app-layout` flex row + `.sh-*` sidebar styles
- `src/types/index.ts` — added `ScoreHistoryEntry`
- `src/components/index.ts` — barrel export

## 2. Validation (Tests 27/27 | Types clean | Lint clean)

**Tests**: 27/27 passing — 8 hook, 11 component, 8 existing Leaderboard. No regressions.
**Quality**: TypeScript clean (`tsc --noEmit`), oxlint clean.
**Notable**: Node 25 partial Web Storage mock (no `clear`/`removeItem`) — worked around with `vi.stubGlobal` in hook tests.

## 3. Completion

**PR**: Local commit only (no remote configured).
**Next**: Push to remote / create PR when ready, or continue with `/epcc-explore` for the next feature.
