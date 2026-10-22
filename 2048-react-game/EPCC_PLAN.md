# Plan: Score History Sidebar

**Created**: 2026-10-22 | **Effort**: ~5.5h | **Complexity**: Medium

---

## 1. Objective

**Goal**: Add a persistent score history sidebar that displays a chronological log of every completed game alongside the game board.

**Why**: The existing Leaderboard popup only shows top-10 scores (ranked). Score history gives players a fuller picture of their progression — every game, in order.

**Success criteria**:
- Every game that ends (win or loss) appends an entry with score, max tile, result, and date
- The sidebar is always visible beside the game board, showing newest-first
- History persists across page reloads via localStorage
- All new code is covered by unit tests (CLAUDE.md mandate)

---

## 2. Approach

**Pattern followed** (from EPCC_EXPLORE.md):
- New `useScoreHistory` hook owns all state — same shape as `useLeaderboard` (localStorage try/catch guard, arrow functions, no side-effects outside callback)
- New `ScoreHistorySidebar` is a pure presentational component (receives `history` prop, renders JSX)
- Co-located test files next to each new file
- Export `ScoreHistorySidebar` from `src/components/index.ts` barrel

**Data model** (extends `src/types/index.ts`):
```ts
export interface ScoreHistoryEntry {
  id: string          // Date.now() + index, unique enough for list keys
  score: number
  maxTile: number     // Math.max(...state.grid.flat()) at game-end
  result: 'won' | 'lost'
  date: string        // ISO 8601
}
```

**Storage**: new key `'score-history-2048'`, capped at 50 entries (oldest dropped when full)

**Layout**: `App.tsx` wraps game column + sidebar in a `.app-layout` flex row. Game column stays centred; sidebar anchors to the right at fixed width (~220px), independently scrollable.

**maxTile source**: `state.grid.flat()` is already available in App.tsx — no changes needed to `useGame`.

**Trade-offs**:
| Decision | Choice | Rationale |
|---|---|---|
| Separate from Leaderboard | Keep both | Different semantics — ranked top-10 vs chronological all-games |
| Always visible sidebar | Yes | Simpler; no toggle state; consistent with existing "no animations" pattern |
| History cap | 50 | Prevents unbounded localStorage growth; covers typical session |
| No mobile breakpoint | Deferred | Existing app has no responsive CSS; sidebar overflow is a known limitation |

---

## 3. Tasks

### Phase 1: Data layer (~1.5h)

1. **Add `ScoreHistoryEntry` type** (0.5h)
   - File: `src/types/index.ts`
   - Add interface with `id`, `score`, `maxTile`, `result`, `date` fields
   - Deps: None | Risk: Low

2. **Create `useScoreHistory` hook** (1h)
   - File: `src/hooks/useScoreHistory.ts`
   - localStorage load/save helpers with try/catch, `addHistoryEntry(score, maxTile, result)` callback, 50-entry cap
   - Deps: Task 1 | Risk: Low

### Phase 2: UI layer (~2.25h)

3. **Create `ScoreHistorySidebar` component** (1.5h)
   - File: `src/components/ScoreHistorySidebar.tsx`
   - Props: `{ history: ScoreHistoryEntry[] }`
   - Renders scrollable list; each row: rank, score, max tile chip, result badge (W/L), short date
   - Deps: Task 1 | Risk: Low

4. **Barrel export** (0.1h)
   - File: `src/components/index.ts` — add `ScoreHistorySidebar`
   - Deps: Task 3 | Risk: Low

5. **Wire up in `App.tsx`** (0.75h)
   - Call `useScoreHistory()`, compute `maxTile = Math.max(...state.grid.flat())`, pass to `addHistoryEntry` on game-end
   - Add `<ScoreHistorySidebar history={history} />` to JSX
   - Deps: Tasks 2, 3 | Risk: Low — `savedRef` pattern already present

6. **Sidebar CSS** (0.5h)
   - File: `src/index.css`
   - `.app-layout` flex row, `.score-history-sidebar` fixed width + scroll, entry row styles, result badge (W green / L red), max-tile chip
   - Deps: Task 3 | Risk: Low

### Phase 3: Tests (~2h)

7. **`useScoreHistory` tests** (1h)
   - File: `src/hooks/useScoreHistory.test.ts`
   - Cases: addEntry persists, cap at 50, zero-score skipped, localStorage unavailable (mock), order (newest first)
   - Deps: Task 2 | Risk: Low

8. **`ScoreHistorySidebar` tests** (1h)
   - File: `src/components/ScoreHistorySidebar.test.tsx`
   - Cases: empty state message, renders N entries, W/L badge shows, score/date displayed
   - Deps: Task 3 | Risk: Low

**Total**: ~5.75h

---

## 4. Quality Strategy

**Tests**: Vitest + `@testing-library/react`; co-locate files; target all new paths covered.

**Acceptance checklist**:
- [ ] Game ends → new entry in sidebar with correct score, max tile, result, date
- [ ] Reload page → history persists
- [ ] 51st entry drops oldest; cap enforced
- [ ] Existing Leaderboard popup unaffected
- [ ] `npm run typecheck` passes clean
- [ ] All tests pass (`npm test`)

---

## 5. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Sidebar overflows on narrow viewports | Low | Document as out-of-scope; existing app has no responsive CSS |
| `Math.max(...state.grid.flat())` on empty grid returns `-Infinity` | Low | Guard: `maxTile = state.grid.flat().filter(n => n > 0).reduce(...)` or `Math.max(0, ...)` |
| localStorage quota on older browsers | Low | Existing try/catch pattern handles silently |

**Assumptions**:
- `state.grid` is always a 4×4 array when game ends (guaranteed by `useGame`)
- The Leaderboard state-sync bug noted in EPCC_EXPLORE.md does not reproduce with current code (Leaderboard already receives `entries` as a prop, not by calling the hook independently)

**Out of scope**:
- Clear history button
- Sort/filter controls
- Responsive/mobile layout
- Animations
