# Implementation: Score History Sidebar

**Mode**: default | **Date**: 2026-10-22 | **Status**: Complete

## 1. Changes (6 files, +245 lines)

**Created**:
- `src/types/index.ts` — added `ScoreHistoryEntry` interface
- `src/hooks/useScoreHistory.ts` — localStorage-backed hook, 50-entry cap, newest-first
- `src/components/ScoreHistorySidebar.tsx` — presentational sidebar (score, maxTile, W/L badge, date)
- `src/hooks/useScoreHistory.test.ts` — 8 tests for hook
- `src/components/ScoreHistorySidebar.test.tsx` — 11 tests for component

**Modified**:
- `src/App.tsx` — added `useScoreHistory` call, `maxTile` computation, sidebar in layout
- `src/components/index.ts` — barrel export for `ScoreHistorySidebar`
- `src/index.css` — `.app-layout` flex row + full `.sh-*` sidebar styles

## 2. Quality (Tests 27/27 | Types clean | Lint clean)

**Tests**: 8 hook tests + 11 component tests + 8 existing Leaderboard tests — all pass.
Coverage: `useScoreHistory` (add, persist, cap, zero-guard, corrupt JSON, write failure) + `ScoreHistorySidebar` (empty state, entry count, score format, W/L badges, CSS classes, ordering).

**Notable test fix**: Node 25 provides a partial Web Storage implementation (no `clear`/`removeItem`). Used `vi.stubGlobal('localStorage', ...)` with a full in-memory mock instead of relying on the environment.

## 3. Decisions

**Layout**: Wrapped existing `.app` + sidebar in `.app-layout` flex row. Changed `.app` from `max-width: 480px; width: 100%` to `width: 480px` (fixed) so inner `width: 100%` children still size correctly.

**maxTile**: Computed inline as `Math.max(0, ...state.grid.flat())` inside the existing `savedRef` effect in App.tsx — no changes to `useGame` needed.

**W/L badge colors**: Used earthy green `#70aa3a` for won and existing orange-red `#f65e3b` for lost — consistent with the app's warm palette.

## 4. Handoff

**Run**: `/epcc-commit` when ready.
**Blockers**: None.
**Known limitation**: Sidebar overflows on viewports narrower than ~720px — documented out-of-scope (no responsive CSS in project).
